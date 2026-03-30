export async function resetAppState(page) {
  // Clear only FitLocal-scoped storage to keep the browser session deterministic.
  await page.evaluate(async () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const k = localStorage.key(i);
        if (k && k.startsWith('fitlocal_')) localStorage.removeItem(k);
      }
    } catch {
      // ignore
    }

    try {
      await new Promise((resolve) => {
        // IndexedDB database name is fixed in src/lib/persistence/indexedDb.js
        const req = indexedDB.deleteDatabase('fitlocal_db');
        req.onsuccess = () => resolve();
        req.onblocked = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // ignore
    }
  });

  await page.reload();
}

