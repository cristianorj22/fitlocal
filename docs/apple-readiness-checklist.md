# Apple Readiness Checklist (FitLocal)

Checklist pratico para App Store Connect e App Review.

## 1) App Information

- [ ] Bundle ID final definido.
- [ ] Nome da app e subtitle finalizados.
- [ ] Categoria correta (Health & Fitness).
- [ ] URL de suporte e URL de politica de privacidade preenchidas.

## 2) App Privacy (nutrition labels)

- [ ] Declarar tipos de dados coerentes com o build final.
- [ ] Se dados permanecerem locais, refletir isso nas respostas.
- [ ] Se houver qualquer sincronizacao/analytics no build real, declarar com precisao.
- [ ] Alinhar com [`src/pages/PrivacyPolicy.jsx`](../src/pages/PrivacyPolicy.jsx).

## 3) Conteudo de saude

- [ ] Disclaimer de saude visivel no app.
- [ ] Sem claims medicos de diagnostico/tratamento.
- [ ] Sem promessas clinicas sem base.

## 4) Assets de App Store (obrigatorio)

- [ ] Icone app 1024x1024 (sem alpha).
- [ ] Screenshots iPhone 6.7" (obrigatorio para a maioria dos casos).
- [ ] Screenshots iPhone 6.1" (fortemente recomendado).
- [ ] Texto promocional e descricao alinhados ao app atual.

## 5) Testes e qualidade

- [ ] Build de release validada.
- [ ] Smoke test em iPhone fisico:
  - [ ] onboarding,
  - [ ] navegacao tabs,
  - [ ] trocar idioma,
  - [ ] treino + timer,
  - [ ] fotos e peso,
  - [ ] delete all data.
- [ ] Sem crash nos fluxos criticos.

## 6) App Review Notes

- [ ] Notas preenchidas com fluxo de validacao.
- [ ] Explicar que nao exige conta para usar.
- [ ] Incluir caminho da funcionalidade de exclusao de dados.
- [ ] Referenciar links de suporte/politica.

## 7) Lancamento seguro

- [ ] Publicar primeiro em release controlada (quando possivel).
- [ ] Monitorar crash e reviews nas primeiras 72h.
- [ ] Ter plano de hotfix rapido.

## Validacao tecnica local

- [x] `npm run lint`
- [x] `npm run build`
- [ ] Teste manual completo em dispositivo iOS real
