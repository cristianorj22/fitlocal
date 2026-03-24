import { idbGet, idbSet, idbDelete, idbClear } from './persistence/indexedDb';

const PREFIX = 'fitlocal_';
const MAX_PHOTOS = 30;

/** Stable codes for i18n mapping in queries (avoid leaking English to users). */
export const StorageError = {
  PROFILE: 'fitlocal:storage:profile',
  WEIGHT_LOG: 'fitlocal:storage:weight_log',
  PHOTO_SAVE: 'fitlocal:storage:photo_save',
  PHOTO_DELETE: 'fitlocal:storage:photo_delete',
};

let migrationPromise = null;

export const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(PREFIX + key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch (error) {
      console.error(`Storage get failed for ${key}:`, error);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set failed for ${key}:`, error);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (error) {
      console.error(`Storage remove failed for ${key}:`, error);
      return false;
    }
  },
};

async function ensureMigration() {
  if (migrationPromise) return migrationPromise;
  migrationPromise = (async () => {
    if (storage.get('storage_migrated_v1', false)) return;

    const legacyWeightLog = storage.get('weight_log', []);
    const legacyPhotos = storage.get('photos', []);

    if (legacyWeightLog.length > 0) {
      await idbSet('weight_log', legacyWeightLog);
      storage.remove('weight_log');
    }
    if (legacyPhotos.length > 0) {
      await idbSet('photos', legacyPhotos.slice(-MAX_PHOTOS));
      storage.remove('photos');
    }

    storage.set('storage_migrated_v1', true);
  })();
  return migrationPromise;
}

export function getProfile() {
  return storage.get('profile', null);
}

export function saveProfile(data) {
  const ok = storage.set('profile', data);
  if (!ok) throw new Error(StorageError.PROFILE);
  return true;
}

export async function getWeightLog() {
  await ensureMigration();
  return idbGet('weight_log', []);
}

export async function addWeightEntry(kg) {
  const log = await getWeightLog();
  log.push({ date: new Date().toISOString().split('T')[0], kg });
  const ok = await idbSet('weight_log', log);
  if (!ok) throw new Error(StorageError.WEIGHT_LOG);
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

export async function getPhotos() {
  await ensureMigration();
  return idbGet('photos', []);
}

export async function savePhoto(dataUrl, note = '') {
  const photos = await getPhotos();
  if (photos.length >= MAX_PHOTOS) photos.shift();
  photos.push({ date: new Date().toISOString(), dataUrl, note });

  let ok = await idbSet('photos', photos);
  if (!ok) {
    photos.shift();
    ok = await idbSet('photos', photos);
  }

  if (!ok) {
    throw new Error(StorageError.PHOTO_SAVE);
  }
}

export async function deletePhoto(index) {
  const photos = await getPhotos();
  photos.splice(index, 1);
  const ok = await idbSet('photos', photos);
  if (!ok) throw new Error(StorageError.PHOTO_DELETE);
}

export async function clearAppData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) keysToRemove.push(key);
  }

  for (const key of keysToRemove) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove key ${key}:`, error);
    }
  }

  await idbClear();
  migrationPromise = null;
}

export async function clearAppPhotos() {
  return idbDelete('photos');
}