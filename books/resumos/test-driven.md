## Test Driven Development: By Example

**Autor:** Kent Beck  
**Ano:** 2002  
**Categoria:** Tecnologia

## A Ideia Central
Não escreva código sem teste. Escreva teste primeiro (que falha), depois código mínimo pra passar (Red-Green-Refactor). Isto inverte ordem tradicional e força design melhor, código mais confiável, menos bugs, e medo eliminado de refatorar.

## O Ciclo Red-Green-Refactor

**Red (Vermelho):**
Escreva teste que FALHA. Teste deve verificar comportamento que código ainda não tem. Falha inicial é essencial — prova que teste realmente funciona (se passasse, seria inútil).

**Green (Verde):**
Escreva código MÍNIMO para fazer teste passar. Não pense em perfeiçãodisorder, otimização, elegância. Apenas o mínimo. Objetivo: ter teste verde o mais rápido.

**Refactor:**
Agora que teste passa, LIMPE código. Remova duplicação, melhore nomes, simplifique lógica. Teste sempre passa (se quebrar, voltou). Refactoring é seguro porque teste garante que comportamento não muda.

Repetir para cada feature pequena. Centenas de ciclos por dia em projeto real.

## Os 5 Passos do TDD

1. **Red**: Escreva teste que falha
2. **Green**: Código mínimo pra passar
3. **Refactor**: Limpe código
4. **Red**: Próximo teste falha
5. **Repeat**: Centenas de vezes = produto completo, testado

## Benefícios Reais

**Design Emergente:**
Teste guia design. Você descobre o que código precisa fazer por testar primeiro. Funções resultam simples, focadas. Classes resultam com responsabilidade única. Acoplamento é baixo (difícil acoplado = difícil testar).

**Confiança:**
Refatorar sem medo. Banco de testes verde = seguro mudar. Sem testes, medo paralisa. Com testes, liberdade. Coragem de melhorar arquitetura.

**Documentação Viva:**
Testes são exemplos de como código funciona. Começar novo? Leia testes. Eles mostram como usar, que valores esperados. Documentação nunca fica desatualizada (código quebra teste, você conserta).

**Menos Bugs:**
Bugs não passam em teste verde. Se bug existe, havia teste faltando. TDD força cobertura alta, encontra problemas cedo (caro quando em produção).

**Feedback Imediato:**
Teste falha = feedback em segundos. Faz code loop super rápido. Sem testes, feedback vem em horas/dias (teste manual, bug report cliente).

## Padrões TDD

**Given-When-Then:**
- Given: setup, estado inicial
- When: ação, comportamento que testa
- Then: asserção, resultado esperado
```
Given: usuário criado
When: login com senha errada
Then: erro "senha inválida"
```

**Arrange-Act-Assert (AAA):**
- Arrange: setup dados, mocks
- Act: call função
- Assert: verificar resultado
Mesmo conceito, nomenclatura diferente.

**Fake, Stub, Mock:**
- Fake: objeto que funciona, fake (ex: banco dados em memória)
- Stub: retorna dados pré-configurados
- Mock: verifica interação, ex "foi chamado com parâmetro X"
Usar conforme necessidade.

## Desafios e Como Resolver

**"Testes ficam lentos":**
Testes devem correr em milissegundos. Lentos = desincentiva rodar frequente.
- Use testes unitários (rápidos, isolados)
- Use testes de integração esparsos (mais lentos, menos frequentes)
- Fake banco dados, mock APIs externas

**"Difícil testar legado (sem testes)":**
Comece com testes novos (tudo forward). Para refatorar legado:
- Adicione testes onde toca código
- Aos poucos, cobertura cresce

**"Testes frágeis, quebram a toda mudança":**
Testes testam comportamento, não implementação.
- Evite testar detalhes internos
- Teste interface pública
- Se quebra, é oportunidade simplificar

## Aplicação Prática

1. **Começa pequeno**: Escolha 1 feature simples
2. **Red**: "Quando usuário logado, nome aparece" → teste falha
3. **Green**: `if (logado) mostrar_nome();` → teste passa
4. **Refactor**: Extrair para função, melhorar nomes
5. **Red**: "Quando logout, nome desaparece" → teste falha
6. **Repeat**: Centenas de ciclos constrói sistema

## Frase Marcante
> "The code is done when the tests pass and the code is clean."

## Vale a Pena Ler o Livro Completo Se...
Você quer dominar TDD com exemplos passo-a-passo em Java, padrões de teste, como estruturar projeto, como refatorar com confiança, e mudança de mentalidade de "testes como afterthought" para "testes como design". Casos reais de como TDD previne bugs custosos.

