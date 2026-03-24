const PREFIX = 'fitlocal_';

export const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
};

export function getProfile() {
  return storage.get('profile', null);
}

export function saveProfile(data) {
  storage.set('profile', data);
}

export function getWeightLog() {
  return storage.get('weight_log', []);
}

export function addWeightEntry(kg) {
  const log = getWeightLog();
  log.push({ date: new Date().toISOString().split('T')[0], kg });
  storage.set('weight_log', log);
}

export function getCheckIns() {
  return storage.get('checkins', []);
}

export function addCheckIn() {
  const today = new Date().toISOString().split('T')[0];
  const checkins = getCheckIns();
  if (!checkins.includes(today)) {
    checkins.push(today);
    storage.set('checkins', checkins);
  }
}

export function getTodayCheckedIn() {
  const today = new Date().toISOString().split('T')[0];
  return getCheckIns().includes(today);
}

const MAX_PHOTOS = 30;

export function getPhotos() {
  return storage.get('photos', []);
}

export function savePhoto(dataUrl, note = '') {
  const photos = getPhotos();
  // Evict oldest if at cap to prevent unbounded localStorage growth
  if (photos.length >= MAX_PHOTOS) photos.shift();
  photos.push({ date: new Date().toISOString(), dataUrl, note });
  try {
    storage.set('photos', photos);
  } catch {
    // QuotaExceededError — remove oldest entry and retry once
    photos.shift();
    try { storage.set('photos', photos); } catch {}
  }
}

export function deletePhoto(index) {
  const photos = getPhotos();
  photos.splice(index, 1);
  storage.set('photos', photos);
}