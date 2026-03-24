# App Review Notes Template (App Store Connect)

## Test Account / Access

- App does not require account login.
- Full functionality is available after onboarding.

## Core Flows to Validate

1. Complete onboarding and start app.
2. Navigate through tabs: Home, Workout, Progress, Profile.
3. Add weight entry in Home.
4. Add and view progress photos in Progress.
5. Open Profile and use "Delete All Data" to clear app data.

## Data Persistence Behavior

- App stores profile/basic flags in localStorage under `fitlocal_*`.
- Heavy entities (`weight_log`, `photos`) are stored in IndexedDB for reliability and capacity.
- Legacy data migration from localStorage to IndexedDB runs once after update.

## Performance / UX Notes

- Route-level lazy loading is enabled to reduce initial bundle cost.
- Suspense fallback is shown during route chunk loading.

## Privacy Notes

- Data is stored locally on device/browser for app functionality.
- "Delete All Data" clears app-scoped persisted data.
- Public privacy URL is served by the app at `/privacy` (or custom `VITE_PRIVACY_POLICY_URL`).

## Additional Notes

- If review environment blocks storage, app degrades gracefully with guarded storage operations.
