## Ficha Técnica
- Título: Performance Testing Guidance
- Autor: Microsoft Patterns & Practices
- Ano: 2011
- Categoria: Tecnologia

## A Ideia Central
Performance importa. Um app bonito mas lento frustra usuários. Performance testing mede latência, throughput, escalabilidade — e descobre gargalos antes de produção. Framework Microsoft fornece guia prático.

## Conceitos-Chave

**1. Tipos de Teste de Performance**
Load test: comportamento sob carga normal (100 usuários). Stress test: até quebrar (10.000 usuários). Spike test: pico súbito. Endurance: rodar por horas. Cada tipo responde perguntas diferentes.

**2. Métrica de Performance**
Response time: quanto demora requisição. Throughput: requisições/segundo. CPU/Memory: uso de recursos. Percentis importam: média 100ms é bom, mas 95th percentile 5s é problema (alguns usuários sofrem).

**3. Teste de Escalabilidade**
Aplicação se comporta bem com 10 usuários, mas 1000? Descubra breaking point. Adicione usuários incrementalmente, observe resposta — onde degrada? Gargalo é BD, CPU, memória, rede?

**4. Profile & Bottleneck Analysis**
Ferramentas como Java Flight Recorder, Chrome DevTools, SQL Profiler mostram onde tempo é gasto. "A página demora 5s" é vago. "BD query demora 4s, JS parsing 0.8s" é acionável — otimize BD query.

**5. Teste em Ambiente Realista**
Testes em máquina poderosa revelam pouco. Use ambiente similiar à produção, ou simulações de rede lentas (throttling). 4G, 3G, WiFi fraco — comportamento difere.

**6. Teste Contínuo de Performance**
Regressão de performance é invisível — código muda, performance degrada, ninguém percebe até produção explodir. CI/CD: rodar testes de performance, alertar se degradação.

## Aplicação Prática
1. **Defina baseline**: performance aceitável é qual? <200ms, >1000 req/s?
2. **Escolha ferramenta**: JMeter, Gatling, k6 dependendo tecnologia.
3. **Simule carga realista**: perfil de usuário típico (mix de operações).
4. **Profile gargalos**: identifique o que demora.
5. **Otimize**: BD query, cache, async, parallelização.
6. **Teste contínuo**: após otimização, validar melhoria, integrar em CI/CD.

## Frase Marcante
> "Performance bug é tão crítico quanto funcional — usuários não usam aplicações lentas."

## Vale a Pena Ler o Livro Completo Se...
Você trabalha em sistemas que precisam performar sob carga, quer entender teste de performance em profundidade — desde conceitos até ferramentas, script de carga realista, análise de bottlenecks, e como integrar em CI/CD.
