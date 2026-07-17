## Ficha Técnica
- Título: Exploratory Software Testing
- Autor: James Whittaker
- Ano: 2009
- Categoria: Tecnologia

## A Ideia Central
Nem tudo pode ser automatizado. Testes exploratórios — improviso criativo guiado por inteligência — encontram bugs que scripts rígidos nunca encontram. Este livro ensina como "brincar" com software como adversário, descobrindo comportamentos inesperados.

## Conceitos-Chave

**1. Exploratory vs Scripted**
Teste scripted: "execute passo 1, 2, 3, valide resultado". Préditável, repetível, fácil de automatizar. Teste exploratório: "crie situações estranhas, observe reações". Criativo, encontra surpresas, impossível de automatar completamente.

**2. Teste Como Jogo**
Abordagem mental: você é adversário. Sistema está defendendo, você atacando. Se devs assumiram que usuário faria X, você faz Y. E se carrinho vazio + checkout? Máximo quantidade? Input malformado? Ataque criativo.

**3. Tours de Teste (Testing Tours)**
Abordagem estruturada para exploração aleatória. Exemplo tours: "Valse Abierta" (toque tudo uma vez), "Um Verdadeiro Turista" (imitar usuário real), "Teste de Caos" (alternar aleatoriamente). Cada tour estrutura exploração sem perder criatividade.

**4. Heurísticas de Teste**
Guias para onde procurar bugs: funcionalidades novas, integração entre componentes, limites (0, -1, máximo), sequência inusual. Experiência forma heurísticas — "bugs frequentemente aqui" — que guiam exploração.

**5. Reprodução e Documentação**
Achado um bug, documento exatamente como reproduzir: passos em ordem, dados exatos, resultado esperado vs observado. Relatório deve permitir dev reproduzir de primeira vez. Sem reprodução clara = inútil.

**6. Teste Manual Inteligente**
Não é random-click; é pensado. Usar heurísticas, experiência, inteligência para guiar onde procurar. Resultado é mais bugs encontrados por hora que teste automatizado em muitos cenários.

## Aplicação Prática
1. **Aloque tempo para exploração**: 20% do esforço QA para teste exploratório.
2. **Use tours estruturados**: não apenas "teste aleatoriamente", use framework (tours).
3. **Documente caminho da exploração**: qual funcionou, qual não, por quê.
4. **Combine insights**: descobertas exploratórias → scripts automatizados para regressão.
5. **Treine criatividade**: mostrar a testers padrões de bugs, heurísticas, situações estranhas.
6. **Priorize por risco**: explore partes críticas (pagamento, dados) mais intensamente.

## Frase Marcante
> "O melhor teste exploratório parece aleatório, mas é guiado por inteligência e experiência."

## Vale a Pena Ler o Livro Completo Se...
Você quer equilibrar automação com exploração manual inteligente, entender técnicas comprovadas para descobrir bugs que scripts perdem, e como escalar testes exploratórios em time profissional — com exemplos reais e métricas.
