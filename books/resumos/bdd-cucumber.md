## Ficha Técnica
- Título: BDD in Action
- Autor: John Ferguson Smart
- Ano: 2014
- Categoria: Tecnologia

## A Ideia Central
Behavior-Driven Development (BDD) une QA, devs e negócio através de linguagem comum. Escreva requisitos em Gherkin (Given-When-Then) que *todos* entendem, depois automatize estes requisitos com Cucumber. Teste se torna documentação viva.

## Conceitos-Chave

**1. Gherkin: Linguagem de Requisito Executável**
```
Given um usuário está logado
When ele clica em "Comprar"
Then o carrinho deve ter 1 item
```
Não-técnicos entendem. Automação executa. Requisito é vivo — se comportamento muda, Gherkin muda, teste falha, dev conserta. Documentação impossível de desatualizar.

**2. Cucumber: Executar Requisito**
Cucumber (ou similar: SpecFlow, Behave) conecta linhas Gherkin a código (Step Definitions). "When clica em Comprar" → @When("clica em Comprar") {click(buyButton)}. Falha apontará exatamente qual passo falhou.

**3. Colaboração Três Amigos**
Reunião: QA, Dev, Product. Escrevem cenários Gherkin juntos. Produto descreve intento, Dev questiona implementação, QA questiona casos limite. Resultado: requisito claro, teste automatizado, ninguém surpreso no final.

**4. Pirâmide BDD**
Many: Scenarios de negócio (Gherkin/Cucumber). Several: Testes de contrato/componente. Few: Testes UI end-to-end. Foco em cenários que importam para negócio, não UI details.

**5. Documentação Viva**
Suite Cucumber gera relatório HTML mostrando cada cenário, qual passou/falhou, screenshots. Este relatório é documentação atual do sistema — ninguém precisa perguntar "isto ainda funciona?", relatório mostra.

**6. Evolução de Requisito**
Requisito muda (comum). Com BDD, você alterar Gherkin, Cucumber falha, dev conserta código, teste passa. Rastreabilidade completa do que mudou e por quê.

## Aplicação Prática
1. **Convide 3 Amigos**: Product, Dev, QA — reúnam para escrever cenários.
2. **Escreva em Gherkin**: use Given-When-Then, linguagem clara, evitar técnico.
3. **Implemente Step Definitions**: cada passo Gherkin → código.
4. **Automatize**: rodar suite a cada commit, feedback rápido.
5. **Gere Relatório**: CucumberReport mostra cenários, status, screenshots.
6. **Evolua**: quando requisito muda, cenário muda, teste falha, ciclo repete.

## Frase Marcante
> "BDD não é sobre teste — é sobre entender o que construir, juntos."

## Vale a Pena Ler o Livro Completo Se...
Você quer implementar BDD em time com exemplos em Cucumber/Java, padrões de escrita de cenários que funcionam, como introduzir BDD em organização legacy, e como manter suite sustentável conforme requisitos evoluem.
