# Google Play Console Checklist (FitLocal)

Use esta lista junto com o [Google Play Developer Policy Center](https://play.google/developer-content-policy/).

## 1) Conta, app e configuracao basica

- [ ] App criada no Play Console com package ID final.
- [ ] Categoria correta (Health & Fitness).
- [ ] Email de suporte e website configurados.
- [ ] Politica de privacidade publicada e acessivel.

## 2) Store listing (obrigatorio)

- [ ] App name final.
- [ ] Short description e full description sem claims medicos.
- [ ] Icone 512x512.
- [ ] Feature graphic 1024x500.
- [ ] Pelo menos 2-4 screenshots reais da versao atual.
- [ ] Capturas em idioma principal (pt-BR) e opcionalmente en-US.

## 3) Data safety (obrigatorio)

- [ ] Declarar dados processados conforme comportamento real:
  - perfil (nome, peso, idade, altura, objetivo),
  - check-ins,
  - historico de peso,
  - fotos de progresso e notas.
- [ ] Se o build distribuido ficar estritamente local (localStorage + IndexedDB), marcar corretamente que os dados ficam no dispositivo.
- [ ] Se houver sincronizacao/telemetria no build final, declarar coleta e compartilhamento com precisao.
- [ ] Explicar exclusao de dados via acao "Delete All Data" no Perfil.
- [ ] Alinhar texto com [`src/pages/PrivacyPolicy.jsx`](../src/pages/PrivacyPolicy.jsx).

## 4) Saude e compliance de conteudo

- [ ] Manter disclaimer de saude visivel (onboarding, perfil e politica).
- [ ] Nao prometer diagnostico, tratamento ou resultado clinico.
- [ ] Evitar linguagem de "cura", "medical grade", "comprovado clinicamente" sem base regulatoria.

## 5) Permissoes e comportamento

- [ ] Solicitar permissao de camera/galeria apenas em contexto de uso (ex.: adicionar foto).
- [ ] Validar se nao ha permissao desnecessaria no binario.
- [ ] Justificar permissoes no Console, quando solicitado.

## 6) Build e requisitos tecnicos

- [ ] AAB gerado no pipeline final (Base44/wrapper).
- [ ] Target API level em conformidade com o requisito vigente do Google Play.
- [ ] Sem crashes em fluxo principal (onboarding, treino, progresso, perfil, exclusao de dados).

## 7) Testes pre-release (minimo)

- [ ] Internal testing com 3-5 dispositivos Android reais.
- [ ] Smoke test rapido:
  - [ ] onboarding completo,
  - [ ] trocar idioma,
  - [ ] logar peso,
  - [ ] adicionar/remover foto,
  - [ ] executar treino e timer,
  - [ ] delete all data.
- [ ] Revalidar lint/build (`npm run lint`, `npm run build`).

## 8) Lancamento

- [ ] Publicar primeiro em staged rollout (ex.: 10%).
- [ ] Monitorar ANR/crash e reviews por 72h.
- [ ] Subir para 100% apenas sem regressao critica.
