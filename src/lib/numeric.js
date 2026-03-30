// Helpers for robust numeric inputs.
// These are intentionally UI-agnostic so the same rules apply across onboarding, dashboard, and profile.

export function sanitizeDecimalInput(raw) {
  const s = raw == null ? '' : String(raw);

  // Accept both comma and dot as decimal separators.
  const normalized = s.replace(',', '.');

  let out = '';
  let dotSeen = false;
  for (const ch of normalized) {
    if (ch >= '0' && ch <= '9') {
      out += ch;
      continue;
    }
    if (ch === '.') {
      if (!dotSeen) {
        dotSeen = true;
        out += ch;
      }
    }
  }
  return out;
}

export function sanitizeIntegerInput(raw) {
  const s = raw == null ? '' : String(raw);
  return s.replace(/\D+/g, '');
}

export function parseFiniteDecimal(raw) {
  const s = sanitizeDecimalInput(raw);
  if (!s || s === '.') return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function parseFiniteInteger(raw) {
  const s = sanitizeIntegerInput(raw);
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

