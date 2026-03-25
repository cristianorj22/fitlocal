import { getProfile, getCheckIns, getWeightLog } from './storage';

/**
 * Generates a CSV string from all local fitness data and triggers download.
 * 100% local — no server involved.
 */
export async function exportAllDataCsv() {
  const profile = getProfile();
  const weightLog = await getWeightLog();
  const checkIns = getCheckIns();

  const sections = [];

  // Section 1: Profile
  if (profile) {
    sections.push('## Profile');
    sections.push('Field,Value');
    const fields = [
      ['Name', profile.name],
      ['Age', profile.age],
      ['Gender', profile.gender],
      ['Weight (kg)', profile.weight],
      ['Height (cm)', profile.height],
      ['Target Weight (kg)', profile.targetWeight || ''],
      ['Goal', profile.goal],
      ['BMI', profile.bmi?.toFixed(1)],
      ['BMR', Math.round(profile.bmr || 0)],
      ['TDEE', Math.round(profile.tdee || 0)],
      ['Calories', profile.macros?.calories],
      ['Protein (g)', profile.macros?.protein],
      ['Carbs (g)', profile.macros?.carbs],
      ['Fat (g)', profile.macros?.fat],
      ['Activity Level', profile.activityLevel],
      ['Training Days', (profile.days || []).join('; ')],
      ['Session Length', profile.sessionLength],
    ];
    fields.forEach(([k, v]) => sections.push(`${esc(k)},${esc(v)}`));
  }

  // Section 2: Weight Log
  if (weightLog.length > 0) {
    sections.push('');
    sections.push('## Weight Log');
    sections.push('Date,Weight (kg)');
    weightLog.forEach((e) => sections.push(`${esc(e.date)},${esc(e.kg)}`));
  }

  // Section 3: Check-ins
  if (checkIns.length > 0) {
    sections.push('');
    sections.push('## Check-ins');
    sections.push('Date');
    checkIns.forEach((d) => sections.push(esc(d)));
  }

  const csv = sections.join('\n');
  downloadFile(csv, `fitlocal-export-${today()}.csv`, 'text/csv;charset=utf-8;');
  return true;
}

function esc(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}