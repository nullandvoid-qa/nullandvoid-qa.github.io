## Ficha Técnica
- Título: A Arte de Testar Software
- Autor: Glenford Myers
- Ano: 2004
- Categoria: Tecnologia

## A Ideia Central
Testes bem desenhados têm objetivo: encontrar bugs. Isto requer mentalidade diferente de desenvolvimento — você precisa *tentar quebrar* o software. Myers ensina técnicas de design de teste que consistentemente revelam falhas antes dos usuários descobrirem.

## Conceitos-Chave

**1. Teste é Arte e Ciência**
Testes bem-sucedidos requerem criatividade (imaginar cenários estranhos) e rigor (estrutura e metodologia). Um teste que encontra bug é mais bem-sucedido que um teste que não encontra — objetivo é revelar problemas, não apenas verificar sucesso.

**2. Testes Positivos vs Negativos**
Teste positivo: "isto funciona como esperado?". Teste negativo: "isto quebra se eu fizer algo inesperado?". Testes negativos revelam mais bugs. Exemplos: entrada vazia, números extremos, caracteres especiais, ordem inválida de operações.

**3. Particionamento de Equivalência**
Não teste cada valor possível — é infinito. Divida entrada em partições lógicas (ex: números negativos, zero, positivos) e teste um valor de cada. Uma classe que funciona para um negativo provavelmente funciona para todos.

**4. Análise de Valor Limite**
Bugs frequentemente ocorrem em limites (ex: array[10] quando máximo é 9). Teste valores no limite e imediatamente fora dele. Se função valida 1-100, teste: 0, 1, 99, 100, 101.

**5. Grafo de Fluxo de Controle**
Mapeie todos os caminhos executáveis através do código. Teste cada caminho, não apenas linha. Um bloco if-else pode ter 2 caminhos; dois aninhados = 4; etc. Cobertura de caminho > cobertura de linha.

**6. Teste de Interface**
Interfaces conectam componentes — são pontos frágeis. Teste erros passados entre componentes, formatos inesperados, sequência fora de ordem. Integração falha onde componentes individuais passam.

## Aplicação Prática
1. **Defina casos de teste negativos**: para cada funcionalidade, liste formas de quebrar (entrada inválida, fora de ordem, extrema).
2. **Use particionamento**: categorize entrada em classes lógicas, teste uma de cada.
3. **Teste limites**: identificar limites de cada parâmetro, testar dentro e fora.
4. **Mapeie fluxo**: identificar branchs e loops, testar cada caminho.
5. **Teste interfaces**: interações entre módulos, erros de integração.
6. **Documente casos**: cada teste deve explicar o que testa e por que.

## Frase Marcante
> "O propósito de teste é encontrar erros, não demonstrar a ausência deles."

## Vale a Pena Ler o Livro Completo Se...
Você quer metodologia rigorosa para design de casos de teste com exemplos passo-a-passo, técnicas comprovadas para encontrar bugs consistentemente, e entendimento profundo de diferentes estratégias de teste (black-box, white-box, gray-box) com exercícios práticos.
