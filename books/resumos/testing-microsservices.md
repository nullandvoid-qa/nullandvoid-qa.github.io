## Ficha Técnica
- Título: Testing Microservices Architected System
- Autor: Melissa Evers & Carlos Sanchez
- Ano: 2017
- Categoria: Tecnologia

## A Ideia Central
Microsserviços criam novos desafios de teste: integração complexa, dependências externas, falhas parciais. Uma única falha pode cascatear. Esta obra ensina estratégias específicas para testar arquiteturas distribuídas — desde testes de contrato até resiliência caótica.

## Conceitos-Chave

**1. Pirâmide de Testes em Microsserviços**
Base: muitos testes unitários (rápido, isolado). Meio: testes de integração e contrato (verificar APIs). Topo: alguns testes end-to-end (custoso, lento). Em microsserviços, testes de contrato ganham importância — dois serviços precisam concordar na API.

**2. Testes de Contrato**
Quando Serviço A chama Serviço B, ambos precisam concordar: quais dados A envia? Qual formato? Qual resposta B retorna? Teste de contrato verifica esta concordância sem rodar toda a arquitetura. Exemplo: Consumer-Driven Contract Testing (CDCT).

**3. Testes de Integração Isolados**
Não teste contra microsserviço real (lento, frágil). Use mocks/stubs de dependências externas. Container Docker pode rodar versão "fake" de um serviço para teste rápido. Trade-off: mais realista que unittest, mais rápido que e2e.

**4. Testes de Resiliência (Chaos Engineering)**
Microsserviços falham parcialmente: um serviço cai, outro demora, rede falha. Teste *deliberadamente* injetar falhas: derrubar uma instância, adicionar latência, desconectar rede. Seu sistema se recupera? Onde quebra?

**5. Teste Distribuído Observabilidade**
Com múltiplos serviços, rastrear uma requisição é complexo. Use distributed tracing, logs correlacionados, métricas. Testes precisam verificar não apenas "funcionou", mas também "Performance está dentro de limite? Cascata de chamadas é esperada?"

**6. Isolamento vs Realismo**
Trade-off clássico em teste. Testes isolados = rápido + determinístico, mas perdem realismo. Testes realistas = descobrem problemas reais, mas são lentos/flácidos. Estratégia: validar comportamento crítico com realismo, otimizar resto com isolamento.

## Aplicação Prática
1. **Categorize testes por velocidade**: unitário (<100ms), integração (<5s), e2e (<30s cada).
2. **Defina contratos entre serviços**: API schemas, exemplos de payloads, respostas esperadas.
3. **Use containers para mocks**: Docker Compose pode rodar serviços fake para testes integrados.
4. **Implemente chaos testing**: ferramentas como Gremlin, Chaos Monkey para injetar falhas.
5. **Trace requisições**: adicione correlation IDs, implemente observabilidade.
6. **Automatize pipeline**: rodar suites por velocidade, feedback rápido para devs.

## Frase Marcante
> "Em microsserviços, testar apenas componentes individuais deixa descobrir problemas apenas em produção."

## Vale a Pena Ler o Livro Completo Se...
Você trabalha com arquitetura de microsserviços (ou planejando migrar) e quer entender estratégias específicas de teste para ambientes distribuídos — desde contract testing até chaos engineering, com padrões e anti-padrões comprovados em organizações reais.
