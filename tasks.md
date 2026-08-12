# Backlog de Tarefas - Null and Void QA Course (LIMPE)

Este arquivo reúne as próximas ações prioritárias para revisão de qualidade das lições após validação estrutural concluída.

## Status atual

Validações passam: 42 lições validadas, catálogo 0 issues, 177 testes passando, i18n 100%.

## Pendências — Revisão de Qualidade das Lições

Seguem lições identificadas como podendo ser melhoradas no sentido de ensinar melhor o assunto ou terem conteúdo insuficiente para o objetivo proposto. Estes itens serão trabalhados conforme prioridade (ordem de maior impacto no aprendizado).

### Media Prioridade — Lições que precisam de ajuste/refinamento:

- [ ] **L27 — Pact**: confirmar se o exemplo consumer/provider está correspondendo ao catálogo e se o exemplo executável ainda funciona.
- [ ] **L19 — Testes de API**: revisar se o foco em Postman/REST Assured/Playwright API está alinhado ao projeto atual e se os exemplos práticos são executáveis.
- [ ] **L1 — O que é QA e por que importa**: revisar se o conteúdo reflete as práticas atuais de 2026 ou precisa de exemplos atualizados.
- [ ] **L3 — SDLC e onde o QA se encaixa**: revisar se a colocação do QA ainda está correta com práticas modernas de shift-left.
- [ ] **L33 e L35 — Mercado/Checklist/Acessibilidade**: confirmar se a progressão entre intro e aplicação prática está clara e se há risco de sobreposição.

### Baixa Prioridade — Ajustes finais:

- [ ] **L7 — Cerimônias Agile**: although reviewed 2023-08-03, verificar se checklists práticos estão atualizados com workflow atual.
- [ ] **L13 e L14 — iOS/Android Emulator**: verificar se links de recursos (Appium, Mobile testing checklist) ainda estão ativos e estratégias de locator são consistentes.
- [ ] **L33 e L35 — Mercado/Checklist/Acessibility**: revisão final de consolidação de progressão.

## Critérios para marcar como "revisado"

Cada lição deve satisfizer todos os itens abaixo para ser removida desta lista:

- [ ] A lição possui objetivos observáveis e não apenas uma lista de conceitos
- [ ] Existe pelo menos um cenário de negócio preenchido, com risco e decisão de teste
- [ ] O exemplo principal pode ser executado ou tem instruções explícitas para reproduzi-lo
- [ ] O exercício exige uma entrega verificável e o gabarito apresenta critérios ou resultado esperado
- [ ] Os comandos, arquivos e links foram conferidos no repositório atual
- [ ] O ID, título, duração, idioma, quiz e enrichment correspondem ao catálogo publicado
- [ ] A lição passou por `npm run validate:lessons`, `npm run validate:links` e uma verificação de renderização no site
- [ ] O conteúdo efetivamente ensina o assunto proposto (não é apenas teoria sem aplicação prática)

## Próximos Passos

1. Revisar cada lição restante (L7, L19, L27, L33/L35, L1, L13/L14, L3) contra os critérios acima
2. Mover itens já verificados para a seção "Consolidados" após confirmação
3. Validar novamente após revisão final
4. Após todas revisadas, remover esta seção do backlog
5. O projeto está pronto com validação `npm run validate:all` passando 100%