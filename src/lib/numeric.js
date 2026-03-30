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

export function digitsOnly(raw) {
  const s = raw == null ? '' : String(raw);
  return s.replace(/\D+/g, '');
}

export function clampDigits(raw, maxLen) {
  const d = digitsOnly(raw);
  if (!maxLen || maxLen <= 0) return '';
  return d.length > maxLen ? d.slice(0, maxLen) : d;
}

/**
 * Interprets a digit string as a kg value with 1 decimal place (100g precision).
 * Examples:
 * - "7"   -> "0.7"   (0.7 kg)
 * - "70"  -> "7.0"   (7.0 kg)
 * - "704" -> "70.4"  (70.4 kg)
 */
export function formatKg1dpFromDigits(digits, { decimalSeparator = '.' } = {}) {
  // 3 digits left + 1 digit right => max 4 digits total (e.g. 9999 => 999.9kg).
  const d = clampDigits(digits, 4);
  if (!d) return '';
  if (d.length === 1) return `0${decimalSeparator}${d}`;
  const intPart = d.slice(0, -1);
  const decPart = d.slice(-1);
  return `${intPart}${decimalSeparator}${decPart}`;
}

/** Parses digit string into a finite number of kg with 1 decimal place. */
export function parseKg1dpFromDigits(digits) {
  const d = clampDigits(digits, 4);
  if (!d) return null;
  const n = parseInt(d, 10);
  if (!Number.isFinite(n)) return null;
  return n / 10;
}

