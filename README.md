# FitLocal

Aplicativo de fitness com foco em privacidade e uso local no dispositivo.

## O que o app faz hoje

- Onboarding e perfil com preferencias (idioma, genero, etc.).
- Dashboard com check-in, macros e progresso de meta.
- Treinos por dia com timer de descanso, ilustracoes e feedback de uso.
- Historico de peso e fotos de progresso.
- i18n em `en` e `pt-BR`.
- Pagina publica de privacidade em `/privacy`.

## Arquitetura resumida

- Frontend: React + Vite + React Router.
- Estado e cache: TanStack Query.
- Persistencia local:
  - `localStorage` para perfil e flags leves (`fitlocal_*`).
  - `IndexedDB` para dados pesados (`weight_log`, `photos`).
- Tema/UI: Tailwind + componentes utilitarios.

## Offline e armazenamento

- O app e local-first: os dados principais ficam no navegador/dispositivo.
- O codigo atual usa `localStorage` + `IndexedDB`.
- Para experiencia offline total em primeira abertura sem rede, verifique se o pipeline de publicacao adiciona Service Worker.

## Requisitos

- Node.js 18+ (recomendado).
- npm.

## Configuracao local

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env.local`:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
VITE_SUPPORT_EMAIL=your_support_email
VITE_PRIVACY_POLICY_URL=https://your-domain.com/privacy
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento.
- `npm run build`: build de producao.
- `npm run preview`: preview local da build.
- `npm run lint`: lint.
- `npm run typecheck`: checagem de tipos.

## Fluxo recomendado antes de release

1. `npm run lint`
2. `npm run build`
3. Smoke test em dispositivo fisico (Android e iPhone)
4. Revisar checklist Play e Apple

## Publicacao

- Alteracoes no repositorio podem refletir no Base44 Builder (conforme configuracao do projeto).
- Para publicar em lojas, siga os checklists em `docs/`.

## Documentacao de release

- [Google Play checklist](docs/google-play-console-checklist.md)
- [Apple readiness checklist](docs/apple-readiness-checklist.md)
- [App review notes template](docs/app-review-notes-template.md)
- [Roadmap de lancamento](docs/launch-roadmap.md)

## Limitacoes e notas

- Widgets nativos (Android/iOS) exigem camada nativa e nao sao apenas configuracao web.
- Push remoto e notificacoes avancadas dependem de infraestrutura adequada (service worker + backend, ou plugins nativos no wrapper).

## Suporte

- Base44 docs: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)
- Base44 support: [https://app.base44.com/support](https://app.base44.com/support)
