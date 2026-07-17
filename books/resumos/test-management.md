## Ficha Técnica
- Título: Test Management
- Autor: Brian Hambling
- Ano: 2011
- Categoria: Tecnologia

## A Ideia Central
Teste em escala requer gestão: planejamento, estimativa, rastreamento. Este livro cobre como organizar, executar e reportar testes em times grandes — desde ferramentas (test management systems) até métricas.

## Conceitos-Chave

**1. Plano de Teste Estruturado**
Documento vivo: scope (o que testar), estratégia (como), resources (quem/quanta), timeline (quando), riscos (o que pode errar). Plano previne surpresas e ajuda negociar prazos realistas.

**2. Estimativa de Teste**
Errar estimativa leva a crunch. Técnicas: analogia (similar projeto levou X), parametrização (por funcionalidade, complexidade), especialista (alguém experiente estima). Buffer: sempre adicione 20% para imprevistos.

**3. Rastreamento de Testes**
Ferramentas (TestRail, HP ALM, qTest): organizar testes, rodar, capturar resultados, gerar relatórios. Métricas importantes: % testes rodados, bugs encontrados, taxa de escape (bugs encontrados em produção).

**4. Testes por Tipo**
Cada tipo (unitário, integração, e2e, performance) tem estimativa/estratégia diferente. Plannig separa por tipo, aloca recursos, foca na pirâmide: muitos pequenos, poucos grandes.

**5. Comunicação de Risco**
Testes descobrem risco. "Encontramos 50 bugs — release é arriscado" importa menos que "bug X afeta pagamento, risco alto". Comu

nicar risco de forma que negócio entenda.

**6. Teste em Ciclos**
Smoke test (rápido, crítico), regressão (funcionalidades existentes), novo (funcionalidades novas). Ciclo iterativo: cada ciclo reduz risco. Release só quando risco aceitável.

## Aplicação Prática
1. **Escreva plano de teste**: scope, estratégia, recursos, timeline.
2. **Estime por tipo**: testes diferentes levam tempo diferente.
3. **Use ferramenta de teste**: rastrear testes, resultados, métricas.
4. **Defina métricas**: cobertura, bugs encontrados, taxa de escape.
5. **Comunique em sprints**: daily: o que foi testado, bugs, bloqueadores.
6. **Documente learnings**: ao fim, quais estimativas foram precisas? Como melhorar?

## Frase Marcante
> "Teste bem planejado e rastreado descobre risco cedo. Teste ad-hoc descobre risco tarde."

## Vale a Pena Ler o Livro Completo Se...
Você gerencia time de QA ou projeto com testes significativos, e quer estrutura comprovada para planejar, estimar, rastrear e reportar — com exemplos de documentos, métricas, e como lidar com prazos apertados mantendo qualidade.
