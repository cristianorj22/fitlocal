# FitLocal - Visao Operacional (PM Board)

Fonte: [`docs/launch-one-page.md`](./launch-one-page.md)

Objetivo: acompanhar execucao com responsavel, prazo, status e criterio de pronto.

## Legenda de status

- `todo`
- `in_progress`
- `blocked`
- `done`

## Board operacional

| ID | Item | Responsavel | Prazo sugerido | Status | Criterio de pronto |
|---|---|---|---|---|---|
| OPS-01 | Validar build e lint (`npm run lint`, `npm run build`) | Eng. | D+1 | todo | Build e lint verdes no CI/local |
| OPS-02 | Smoke test Android (fluxos criticos) | QA/Founder | D+2 | todo | Checklist completo sem bug bloqueante |
| OPS-03 | Smoke test iPhone (fluxos criticos) | QA/Founder | D+2 | todo | Checklist completo sem crash |
| OPS-04 | Revisar politica de privacidade final | Founder/Legal | D+2 | todo | Texto final aprovado e URL publica definida |
| OPS-05 | Criar Termos de Uso (versao MVP) | Founder/Legal | D+3 | todo | Documento publicado e acessivel |
| OPS-06 | Preparar assets Play (icone, feature graphic, screenshots) | Design/Founder | D+4 | todo | Todos os assets em formatos exigidos |
| OPS-07 | Preparar assets Apple (icone 1024, screenshots 6.7 e 6.1) | Design/Founder | D+4 | todo | Todos os assets validados |
| OPS-08 | Finalizar copy PT-BR e EN para lojas | Growth/Founder | D+5 | todo | Textos finais sem claims medicos |
| OPS-09 | Preencher App Review Notes | Founder | D+5 | todo | Campo pronto para submissao |
| OPS-10 | Internal testing Play + TestFlight | Founder | D+6 | todo | Build instalada e testada em dispositivos reais |
| OPS-11 | Correcoes de bugs criticos | Eng. | D+7 | todo | Nenhum bug P0/P1 aberto |
| OPS-12 | Submissao Play + Apple | Founder | D+8 | todo | Apps enviados para review |
| OPS-13 | Landing page de pre-lancamento com CTA | Growth/Eng. | D+8 | done | `https://fitlocal.vercel.app/landing` no ar com CTA para lojas/lista |
| OPS-14 | Criar perfil X/Twitter e calendario de 2 semanas | Growth | D+9 | todo | Conta criada + 6 posts agendados |
| OPS-15 | Soft launch e monitoramento 72h | Founder | D+12 | todo | Sem regressao critica apos rollout |
| OPS-16 | Fechar plano de hotfix | Eng./Founder | D+12 | todo | Processo de resposta documentado |

## Checklist de fluxo critico (usar em OPS-02/OPS-03)

- [ ] onboarding completo
- [ ] troca de idioma
- [ ] treino + timer + descanso
- [ ] adicionar/remover foto
- [ ] registrar peso
- [ ] delete all data
- [ ] reabrir app e validar persistencia esperada

## Riscos e mitigacao

| Risco | Impacto | Mitigacao |
|---|---|---|
| Rejeicao por metadata incompleta | Alto | Completar OPS-06/07/08/09 antes de submissao |
| Claim de saude inadequado | Alto | Revisar copy com foco educacional (sem claims medicos) |
| Bugs em device real | Medio/Alto | Executar OPS-02/03 antes de OPS-12 |
| Baixa conversao inicial | Medio | Landing clara + ASO basico + posts de prova social |

## KPI de acompanhamento semanal

- Conversao store view -> install
- Install -> onboarding concluido
- Retencao D1 / D7
- % usuarios com 1 treino concluido
- Nota media e numero de reviews

## Regras de decisao rapida

- Se D7 abaixo da meta: pausar aquisicao e ajustar onboarding/valor percebido.
- Se nota media < 4.3: priorizar correcoes de UX antes de escalar distribuicao.
- Se crash em fluxo principal: hotfix antes de nova campanha/publicidade.
