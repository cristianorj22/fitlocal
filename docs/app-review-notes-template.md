# App Review Notes Template (App Store Connect)

Copie e ajuste este modelo no campo App Review Notes.

## Access

- Este app nao exige login.
- Todas as funcoes principais ficam disponiveis apos o onboarding inicial.

## Core user flows for review

1. Completar onboarding.
2. Navegar pelas abas: Home, Workout, Progress, Profile.
3. Registrar peso na Home.
4. Adicionar e remover foto de progresso em Progress.
5. Abrir Workout e usar o timer de descanso.
6. Alterar idioma em Profile > Preferences.
7. Executar "Delete All Data" em Profile.

## Data storage behavior

- Dados de perfil e flags leves: `localStorage` com prefixo `fitlocal_*`.
- Dados volumosos:
  - `weight_log` em IndexedDB
  - `photos` em IndexedDB
- Ha migracao unica de dados legados no primeiro acesso apos update.

## Privacy and deletion

- O app funciona de forma local-first.
- O usuario pode apagar os dados no proprio app:
  - Profile > Delete All Data.
- URL publica da politica de privacidade:
  - `/privacy` ou valor configurado em `VITE_PRIVACY_POLICY_URL`.

## Health disclaimer

- O app fornece estimativas educacionais de fitness.
- Nao e dispositivo medico e nao fornece diagnostico/tratamento.

## Notes for reviewer

- Se o ambiente de review restringir storage/browser APIs, o app tenta degradar de forma segura.
- Caso precisem de walkthrough guiado, contactar: `VITE_SUPPORT_EMAIL`.
