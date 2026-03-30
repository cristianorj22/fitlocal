# Vercel Deploy Guide (FitLocal)

**URL de producao atual:** [https://fitlocal.vercel.app/](https://fitlocal.vercel.app/)

Este guia deixa a publicacao pronta com:
- app React em `/`
- landing publica em `/landing`
- politica publica em `/privacy`
- termos publicos em `/terms`

## 1) Pre-requisitos

- Repositorio no GitHub/GitLab/Bitbucket
- Projeto contendo:
  - `public/landing.html`
  - `public/privacy-policy.html`
  - `public/terms.html`
  - `vercel.json`
  - `.env.example`

## 2) Subir alteracoes para o git

```bash
git add .
git commit -m "Prepare Vercel deployment routes and static legal pages"
git push
```

## 3) Importar na Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Add New > Project
3. Conecte o provider de git
4. Selecione este repositorio

## 4) Build settings (Vite)

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 5) Environment variables

Copie os valores de `.env.example` para a Vercel:

- `VITE_BASE44_APP_ID`
- `VITE_BASE44_APP_BASE_URL`
- `VITE_SUPPORT_EMAIL`
- `VITE_PRIVACY_POLICY_URL` (producao: `https://fitlocal.vercel.app/privacy`; com dominio proprio, substitua pelo seu host)

## 6) Deploy

- Clique em Deploy
- Aguarde build finalizar

## 7) Validacao pos-deploy

Teste as rotas:

- `/`
- `/landing`
- `/privacy`
- `/terms`
- `/workout` (rota SPA)
- `/profile` (rota SPA)

## 8) Dominio customizado (recomendado)

1. Project Settings > Domains
2. Adicione seu dominio
3. Configure DNS no registrador

Use nas lojas (producao Vercel):

- Privacy Policy URL: `https://fitlocal.vercel.app/privacy`
- Terms URL: `https://fitlocal.vercel.app/terms`
- Landing: `https://fitlocal.vercel.app/landing`

Com dominio customizado, troque o host por `https://seu-dominio.com/...`.

## 9) Troubleshooting rapido

- Se rota SPA abrir 404: confirmar `vercel.json` no root.
- Se legal page nao abrir: confirmar arquivos em `public/`.
- Se variavel nao refletir: redeploy apos salvar env vars.
