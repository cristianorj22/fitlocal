const DB_NAME = 'fitlocal_db';
const DB_VERSION = 1;
const STORE_NAME = 'kv';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore(mode, operation) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);

    let opResult;
    try {
      opResult = operation(store);
    } catch (error) {
      reject(error);
      return;
    }

    tx.oncomplete = () => resolve(opResult);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export async function idbGet(key, fallback) {
  if (typeof indexedDB === 'undefined') return fallback;
  try {
    return await withStore('readonly', (store) => new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? fallback);
      req.onerror = () => reject(req.error);
    }));
  } catch (error) {
    console.error('IndexedDB get failed:', error);
    return fallback;
  }
}

export async function idbSet(key, value) {
  if (typeof indexedDB === 'undefined') return false;
  try {
    await withStore('readwrite', (store) => {
      store.put(value, key);
      return true;
    });
    return true;
  } catch (error) {
    console.error('IndexedDB set failed:', error);
    return false;
  }
}

export async function idbDelete(key) {
  if (typeof indexedDB === 'undefined') return false;
  try {
    await withStore('readwrite', (store) => {
      store.delete(key);
      return true;
    });
    return true;
  } catch (error) {
    console.error('IndexedDB delete failed:', error);
    return false;
  }
}

export async function idbClear() {
  if (typeof indexedDB === 'undefined') return false;
  try {
    await withStore('readwrite', (store) => {
      store.clear();
      return true;
    });
    return true;
  } catch (error) {
    console.error('IndexedDB clear failed:', error);
    return false;
  }
}
