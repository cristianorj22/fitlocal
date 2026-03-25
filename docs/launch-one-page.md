# FitLocal - Plano de Lancamento em 1 Pagina

Objetivo: publicar em Google Play + App Store com minimo esforco, baixo risco e foco em receita.

## Meta de 30 dias

- Publicar nas duas lojas.
- Garantir fluxo principal sem crash.
- Validar tracao inicial com usuarios reais.

## Posicionamento (simples e forte)

- "Seu app de fitness privado, local-first, sem complicacao."
- Monetizacao inicial: pagamento unico, sem anuncios.

## North Star metric (primeiro mes)

- `% de usuarios que completam onboarding e fazem o 1o treino em ate 24h`.

## Metricas minimas para decidir proximo passo

- Store view -> install.
- Install -> onboarding concluido.
- D1 e D7 retention.
- % usuarios que registram peso.
- Nota media e reviews.

---

## Checklist de go-live (obrigatorio)

## Produto
- [ ] `npm run lint` sem erros.
- [ ] `npm run build` sem erros.
- [ ] Smoke test Android + iPhone:
  - [ ] onboarding
  - [ ] trocar idioma
  - [ ] treino + timer
  - [ ] fotos e peso
  - [ ] delete all data

## Lojas
- [ ] Politica de privacidade publica final.
- [ ] Assets completos:
  - [ ] Play: icone 512 + feature graphic + screenshots
  - [ ] Apple: icone 1024 + screenshots 6.7 e 6.1
- [ ] Descricao curta/longa PT-BR (e EN se possivel).
- [ ] App Review Notes preenchidas.

## Lancamento
- [ ] Play com rollout gradual (ex.: 10%).
- [ ] Apple via TestFlight + submissao final.
- [ ] Plano de hotfix pronto.

---

## Plano diario (14 dias)

## Dias 1-2
- Fechar copy de loja e politica.
- Capturar screenshots finais com UI atual.

## Dias 3-4
- Build interna.
- Rodar smoke test completo.
- Corrigir bugs criticos.

## Dias 5-6
- Internal testing (Play) e TestFlight.
- Coletar feedback rapido e ajustar.

## Dias 7-8
- Finalizar metadata nas duas lojas.
- Preencher Data Safety e App Privacy.

## Dias 9-10
- Submeter em ambas lojas.
- Preparar posts de lancamento e landing simples.

## Dias 11-14
- Publicar gradual.
- Monitorar crashes/reviews diariamente.
- Entregar 1 sprint de melhorias rapidas.

---

## Growth de minimo custo (primeiro mes)

- Criar perfil no X/Twitter: sim.
- Publicar 3-5 posts por semana (progresso, bastidores, feedback de usuarios).
- Publicar 2-3 videos curtos por semana (Reels/TikTok/Shorts).
- Criar pagina simples com CTA para stores.
- Pedir review no app apos 3 usos positivos.

## O que evitar agora

- Nao rodar Google Ads antes de validar D7.
- Nao adicionar ads no produto.
- Nao abrir muitos canais ao mesmo tempo.

---

## Regras de decisao (objetivas)

- Se D7 < meta interna: melhorar onboarding/valor percebido antes de marketing pago.
- Se nota media < 4.3: pausar aquisicao e corrigir UX.
- Se onboarding -> 1o treino estiver baixo: simplificar primeiro treino e CTA.

---

## Proxima decisao de negocio (apos 30 dias)

Escolher 1 caminho:
- A) manter pagamento unico e otimizar conversao de loja.
- B) migrar para freemium (sem ads) apenas se houver demanda clara.
- C) testar assinatura somente com sinais fortes de uso recorrente.
