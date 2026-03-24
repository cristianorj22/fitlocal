/**
 * Exports exercise list for illustration batch work / QA.
 * Run: node scripts/exercise-manifest.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EXERCISE_DB } from '../src/lib/exercises.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const rows = EXERCISE_DB.map((ex) => ({
  id: ex.id,
  name: ex.name,
  slug: slugify(ex.name),
  instructions: ex.instructions,
}));

const out = join(__dirname, 'exercise-manifest.json');
writeFileSync(out, JSON.stringify(rows, null, 2), 'utf8');
console.log('Wrote', out, `(${rows.length} exercises)`);
