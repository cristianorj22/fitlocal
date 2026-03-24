# Google Play Console checklist (FitLocal)

Use this list with the [Google Play Developer Policy Center](https://play.google/developer-content-policy/) and your Play Console release.

## App content and store listing

- [ ] Short and full descriptions match what the app actually does (no misleading health or privacy claims).
- [ ] Screenshots and icon reflect the current UI.
- [ ] **Privacy policy URL** — use the same public URL as in the app (for example `https://your-domain.com/privacy` or the path deployed with this repo).

## Data safety

- [ ] Complete the **Data safety** form to match the live app:
  - Types of data: profile fields, weight/log, check-ins, photos (and optional notes).
  - **Collection / sharing**: if the web build is **only local** (localStorage + IndexedDB), state that data stays on device until the user deletes it. If Base44 or another SDK syncs data in your shipped build, declare that accurately.
  - **Deletion**: describe **Delete All Data** in Profile (clears app-scoped local storage and app IndexedDB).
- [ ] Align wording with [PrivacyPolicy page](../src/pages/PrivacyPolicy.jsx).

## Health and fitness

- [ ] In-app disclaimer is present (onboarding + profile + policy) — estimates only, not a medical device, consult a professional.
- [ ] Avoid claiming diagnosis, treatment, or clinical accuracy beyond educational estimates.

## Permissions

- [ ] Declare only what the shipped WebView/binary uses (for example camera or storage for progress photos via file picker). Request permissions in context of user action (“Add Photo”), not at launch without reason.
- [ ] Justify each permission in Play Console if prompted.

## Technical (binary / Target API)

- [ ] Confirm **target API level** and other Play requirements with the tool that produces your AAB/APK (for example Base44 build pipeline). This repo alone does not define `targetSdkVersion`.

## SDKs and third parties

- [ ] List third-party SDKs from `package.json` and any native SDKs in the wrapper; ensure Data safety and policy pages reflect what each SDK collects or transmits.

## After upload

- [ ] Run internal testing on a physical Android device: onboarding, activity picker, weight log, photo add/delete, delete all data.
- [ ] Re-run Base44 **Google Play** scan if applicable.
