## Ficha Técnica
- Título: Fundamentals of Software Testing
- Autor: Marnie Hutcheson
- Ano: 2003
- Categoria: Tecnologia

## A Ideia Central
Guia inaugural para quem começa em QA. Cobre fundações: por que testes importam, tipos de teste, como escrever bom caso de teste, como reportar bugs. Sem jargão desnecessário — prático e acessível.

## Conceitos-Chave

**1. Teste é Verificação e Validação**
Verificação: "Construímos certo?" (funcionalidade está implementada conforme spec). Validação: "Construímos o certo?" (produto soluciona problema do usuário). Ambas importam.

**2. Tipos de Teste**
Funcional: funcionalidades funcionam? Usabilidade: interface é fácil? Performance: rápido o bastante? Segurança: dados seguros? Compatibilidade: funciona em múltiplos browsers? Todos têm lugar.

**3. Caso de Teste Bem Escrito**
Tem: precondições (estado inicial), passos em ordem, dados específicos (não "algum email"), resultado esperado, pós-condições (estado final). Claro o bastante que alguém diferente pode executar sem confusão.

**4. Bug Report Efetivo**
Descrever: título conciso, passos exatos para reproduzir, resultado esperado, resultado observado, screenshots. Dev consegue reproduzir de primeira? Excelente. Não consegue? Bug report é fraco.

**5. Teste Deve Ser Repetível**
Mesmo teste, mesma entrada → mesmo resultado. Se resultado varia aleatoriamente, teste é fraco — há dependência oculta (estado, timing, externa). Teste determinístico é confiável.

**6. Importância de Não Falhar**
Teste que falha por motivo não-técnico (ambiente instável, timing, estado compartilhado) causa desconfiança. "Teste às vezes falha" leva a "ignorar falhas". Ruim. Teste deve ser confiável.

## Aplicação Prática
1. **Escreva caso de teste**: precondições, passos, esperado, observado.
2. **Teste pessoalmente**: antes de automatizar, executar manual.
3. **Reporte bug claro**: passos reproduzir, screenshots, contexto.
4. **Crie dados de teste**: específicos, realistas, testáveis.
5. **Documente achados**: cada execução, resultado.
6. **Comunique**: dev, product, stakeholders — qual impacto?

## Frase Marcante
> "Teste bem feito é simples, claro, confiável — qualquer um pode executar e confiar no resultado."

## Vale a Pena Ler o Livro Completo Se...
Você está iniciando em QA ou gerenciando testers juniors, quer fundamentação sólida — conceitos de teste, escrita de bons casos, relatório, sem tecnologia específica, focado em princípios atemporais.
