## Test Driven Development

**Autor:** Kent Beck  
**Ano:** 2002  
**Categoria:** Tecnologia

### A Ideia Central
Escrever testes ANTES do código força design melhor, menos bugs e documentação viva. Red-Green-Refactor: teste falha (red) → código passa (green) → limpa código (refactor).

### Conceitos-Chave
1. **Red-Green-Refactor** - ciclo: escrever teste que falha → código mínimo pra passar → refatorar
2. **Design Emergente** - testes guiam o design; você descobre a arquitetura enquanto testa
3. **Confiança** - cobertura de testes = liberdade pra refatorar sem medo
4. **Baby Steps** - testes pequenos, incrementais, sempre no verde
5. **Mock & Stub** - isolar dependências pra testar comportamento real

### Aplicação Prática
- Escreva teste que falha (vermelho)
- Código mínimo pra passar (verde)
- Refatore sem quebrar testes
- Repita para cada feature
- Mantenha testes rápidos (<0.1s cada)

### Frase Marcante
> "The code isn't done until the tests pass."

### Por Que Ler Completo
Exemplos práticos com Java, discussão profunda sobre design orientado a testes, e como TDD impacta toda a arquitetura.
