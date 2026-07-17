## Ficha Técnica
- Título: API Testing 101
- Autor: Arnaldo Sandoval
- Ano: 2017
- Categoria: Tecnologia

## A Ideia Central
APIs são interface entre sistemas. Teste API é tão importante quanto UI — talvez mais, pois bugs afetam múltiplos clients. Este guia cobre desde REST basics até testes automatizados e performance.

## Conceitos-Chave

**1. REST Fundamentals**
HTTP verbs: GET (ler), POST (criar), PUT (atualizar), DELETE (apagar). Status codes: 200 (sucesso), 201 (criado), 400 (erro client), 500 (erro server). Testes validam verb correto, status correto, payload correto.

**2. Teste de Contrato API**
Definir contrato: "POST /users com {name, email} retorna {id, name, email, created_at}". Teste valida: tipo correto, campos presentes, formatos esperados. Contrato é vinculante — mudança quebra clientes.

**3. Teste Positivo e Negativo**
Positivo: validar dados corretos → resposta correta. Negativo: dados inválidos → erro esperado. Exemplo: POST /users com email vazio → 400 Bad Request (não 200 OK com email vazio).

**4. Teste de Performance API**
Latência importa. API que demora 10s é inútil. Ferramentas: Apache JMeter, k6, Gatling para simular carga. Teste: 100 requisições simultâneas → tempo medio <200ms, 95th percentile <500ms.

**5. Teste de Segurança API**
SQL injection: POST /users com email = "' OR '1'='1" → falsificado? Authentication: requisição sem token → 401? Authorization: usuário A acessa dados de usuário B → 403? Rate limiting: 1000 requests/segundo → bloqueado?

**6. Automação com Postman/REST-Assured**
Postman: ferramenta visual para teste manual + automação. REST-Assured: código Java para teste programático. CI/CD: rodar testes de API a cada build, feedback imediato.

## Aplicação Prática
1. **Documente API**: endpoints, verbs, payloads, responses.
2. **Defina contrato**: tipos, formatos, campos obrigatórios.
3. **Teste positivo**: dados válidos → resposta correta.
4. **Teste negativo**: dados inválidos → erro apropriado.
5. **Teste performance**: latência, throughput sob carga.
6. **Automatize em CI/CD**: rodar a cada commit, falha = não merge.

## Frase Marcante
> "API é contrato entre sistemas. Quebrar contrato quebra clientes invisíveis."

## Vale a Pena Ler o Livro Completo Se...
Você trabalha com APIs REST e quer cobertura completa — desde conceitos básicos até automação em larga escala, teste de performance, segurança, e como manter testes mantíveis conforme API evolui.
