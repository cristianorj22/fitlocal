/**
 * Converts assets/ex-*.png to public/exercises/{id}-{slug}-{gender}.webp
 * Pattern: ex-{id}-{slug}-female.png | ex-{id}-{slug}-male.png
 *
 * Run: node scripts/convert-exercise-png-to-webp.mjs
 * Optional: set EXERCISE_ASSETS_DIR to folder containing the PNGs
 */
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const CANDIDATE_ASSET_DIRS = [
  process.env.EXERCISE_ASSETS_DIR,
  join(projectRoot, 'assets'),
  'C:/Users/User/.cursor/projects/c-Users-User-projetos-fitlocal/assets',
].filter(Boolean);

const OUT_DIR = join(projectRoot, 'public', 'exercises');
const RE = /^ex-(\d+)-(.+)-(female|male)\.png$/i;

async function findAssetsDir() {
  for (const dir of CANDIDATE_ASSET_DIRS) {
    try {
      const files = await readdir(dir);
      if (files.some((f) => f.startsWith('ex-') && f.endsWith('.png'))) return dir;
    } catch {
      /* continue */
    }
  }
  throw new Error(
    `No assets dir with ex-*.png found. Set EXERCISE_ASSETS_DIR. Tried: ${CANDIDATE_ASSET_DIRS.join(', ')}`,
  );
}

async function main() {
  const assetsDirResolved = await findAssetsDir();
  const files = (await readdir(assetsDirResolved)).filter((f) => RE.test(f));
  if (files.length === 0) {
    console.warn('No matching ex-*.png files in', assetsDirResolved);
    return;
  }

  for (const file of files.sort()) {
    const m = file.match(RE);
    if (!m) continue;
    const [, id, slug, gender] = m;
    const dest = join(OUT_DIR, `${id}-${slug}-${gender}.webp`);
    const src = join(assetsDirResolved, file);
    await sharp(src).resize({ width: 1376 }).webp({ quality: 82 }).toFile(dest);
    console.log('Wrote', dest);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
