# Código Limpo
**Robert C. Martin | 2008 | Desenvolvimento de Software**

A biblia da qualidade de código. Martin ("Uncle Bob") explica que o código é comunicação — você escreve para humanos, não máquinas. Código limpo é legível, testável, manutenível e expressivo. Não é sobre ser inteligente; é sobre ser claro. Este livro transformou gerações de programadores de "escritores de código" em "artesãos de software".

## Ideia Central
Código ruim é como dívida técnica que juros crescentes. Inicialmente rápido de escrever, mas depois cada mudança fica 10x mais lenta. Martin conheceu projetos onde a velocidade de desenvolvimento caiu a 1 linha de código por semana porque o código estava tão bagunçado que tocar em qualquer parte quebrava tudo. O antídoto? Disciplina. Código limpo é mais rápido de escrever (a longo prazo), porque você gasta menos tempo debugando, entendendo código antigo ou refatorando. A verdade incômoda: "código limpo" leva mais tempo inicialmente, mas economiza meses depois. É um investimento em produtividade futura.

## Conceitos Principais

### 1. Nomes Significativos: O Código Fala por Si
Ruim: `int d; // tempo decorrido em dias`
Bom: `int elapsedTimeInDays;`

Nomes devem revelar intenção. Se você precisa de um comentário explicando uma variável, o nome é ruim. Exemplos de refatoração real:
- `users` → `activeUsers` (mais específico)
- `getData()` → `fetchUserProfileFromCache()` (revela contexto)
- `tmp` → `temporaryFileHandle` (revela propósito)

A regra: um nome bom elimina comentários. Um nome ruim exige 3 comentários. Você está escrevendo para o próximo programador que lerá seu código (frequentemente, você mesmo em 6 meses).

### 2. Funções Pequenas: Uma Coisa, Uma Razão para Mudar
Ruim: Uma função de 500 linhas que faz login, valida dados, salva em DB, envia email, loga eventos.
Bom: Pequenas funções especializadas: `validateUser()`, `createSession()`, `sendWelcomeEmail()`, cada uma fazendo UMA coisa bem.

Martin aplica o princípio de responsabilidade única. Uma função deve ter apenas uma razão para mudar. Exemplo prático: se você muda validação E muda envio de email, sua função grande precisa ser refatorada. Se você tem `validateUser()` e `sendEmail()` separadas, mudar uma não afeta a outra.

Benefício real: testes. Uma função de 500 linhas tem centenas de caminhos para testar. Uma função de 10 linhas? 2-3 caminhos. Código pequeno é testável. Código testável é confiável.

### 3. Tratamento de Erros Deve Ser Simples
Ruim:
```javascript
try { process() }
catch(e) { console.log("Erro"); }
```

Bom:
```javascript
try { process() }
catch(InvalidUserException e) { 
  logger.error("User validation failed", e);
  throw new ApplicationException("Cannot process invalid user");
}
```

Diferencie entre erros que você pode recuperar (validação) e erros que quebram seu sistema (out of memory). Crie exceções específicas. Um genérico `Exception` força o chamador a tratar todos igualmente. Martin mostra que em sua carreira, viu mais bugs causados por tratamento de erro ruim do que por lógica ruim.

Técnica prática: Null Objects Pattern. Em vez de checar `if (user == null)` repetidamente, crie um `NullUser` que implementa a interface `User` com comportamento padrão seguro. Resultado? Menos verificações nulas, menos crashes por null pointer.

### 4. Dry (Don't Repeat Yourself): Elimine Duplicação
Ruim: Mesmo código em 3 lugares.
Bom: Uma função, chamada de 3 lugares.

Duplicação é sinônimo de bugs. Se você corrige um bug em uma cópia mas não na outra, problemas. Martin mostra código real onde a mesma lógica de formatação de data existia em 17 arquivos. Uma mudança de requisito exigiu mudança manual em 17 lugares. 2 foram esquecidas. Bug em produção. Solução? Uma função `formatDate()` importada.

### 5. Comments são Mentiras Esperando Acontecer
Ruim:
```java
// Incrementar i
i++;
```

Comentário? O código já diz isso. Inútil. Pior, comentários desatualizam. Código é a verdade. Você refatora a função mas esquece de atualizar o comentário. Agora o comentário mente.

Bom: Escrever código tão claro que comentários são desnecessários.

Martin faz distinção: comentários úteis (por quê? não o quê):
- "Otimização crítica aqui — sem stream, reduz tempo de 50 para 5 segundos"
- "Padrão bizarro necessário por bug em framework X versão Y"
- "TODO: Refatorar isso quando performance não for bottleneck"

Comentários ruins:
- Explicar o quê o código faz (renomeie variáveis em vez disso)
- Lógica antiga comentada (use git, delete isso)
- Código autogenerado (não edite manualmente)

### 6. Formatting: Código é Visualmente Escaneável
Ruim:
```java
public void complicated() { if (a == b) { c = d; } }
```

Bom:
```java
public void complicated() {
  if (a == b) {
    c = d;
  }
}
```

Indentação, espaçamento, quebras de linha — tudo comunica. Código bem formatado "respira". Você consegue scannear um arquivo em segundos. Martin mostra que formato consistente reduz tempo de compreensão em 30%.

Use formatadores automáticos (Prettier para JS, Black para Python). Não debata tabs vs. espaços — deixe a ferramenta decidir e siga.

### 7. Testing: Código Confiável é Testado
Ruim: "Vou testar manualmente depois"
Bom: Testes automatizados enquanto você escreve.

Martin é radical: sem testes, você não pode refatorar com confiança. Sem refatoração, código degrada. O ciclo: escrever teste (falha) → escrever código (passa) → refatorar (teste garante não quebrei nada). Chamado "Red-Green-Refactor".

Exemplo concreto: função que valida email. Teste automatizado:
```
✓ Email válido passa
✓ Email sem @ falha
✓ Email sem domínio falha
✓ Email com espaço falha
```

Agora você pode refatorar regex sem medo. Testes garantem que você não quebrou nada.

### 8. Objects e Data Structures
Objects encapsulam dados com métodos (comportamento). Data structures expõem dados. Misturar? Caos.

Ruim: `user.dateOfBirth = date; age = calculateAge(user.dateOfBirth);`
Bom: `user.setDateOfBirth(date); age = user.getAge();`

Nos objetos, você oculta estrutura interna. Nos data structures, você expõe. Cada um tem um lugar. O problema é misturar.

## Passos Práticos Imediatos

1. **Code Review com foco em legibilidade**: Próxima revisão de código, ignore funcionalidade (assumindo funcionando). Foque apenas: os nomes fazem sentido? A função é pequena? Há comentários que deveriam ser código? Este exercício treina seu olho.

2. **Refatore uma função grande**: Encontre uma função com 100+ linhas. Extraia a lógica em funções menores. Cada nova função deve ter nome que explique sua missão. Seu código quase dobrou em linhas, mas é 10x mais legível. Não se asuste com "mais linhas" — clareza > concisão.

3. **Adicione testes a código existente**: Escolha uma função antigo sem testes. Escreva testes para seus comportamentos. Frequentemente você descobre bugs ou edge cases. Quando testes passam, você tem confiança.

4. **Configure formatação automática**: Se seu projeto não usa formatador (Prettier, Black, gofmt), configure. Padroniza código em segundos. Elimina debates sobre espaçamento. Foca reviews em lógica, não formatação.

5. **Rename para claridade**: Use "rename everywhere" em seu IDE. Encontre uma variável com nome ruim (`d`, `tmp`, `x`), renomei para significativo. Isso melhora legibilidade e custa 1 minuto.

6. **Extraia lógica duplicada**: Encontre código repetido em 2+ lugares. Crie uma função. Refatore ambos os lugares para usá-la. Mais manutenível, menos bugs.

7. **Delete comentários desnecessários**: Revise comentários em sua base de código. Quantos apenas dizem o que o código já diz? Delete-os. O restante deve explicar "por quê", não "o quê".

## Desafios Reais e Soluções

**Desafio 1: "Código limpo leva mais tempo. Tenho deadline amanhã"**
Solução: Corto — a princípio. Martin admite: deadline apertado significa código temporariamente mais sujo. MAS a chave é "temporário". Após deadline, você DEVE refatorar. Caso contrário, próximo deadline será 2x pior. A maioria dos projetos opera em "divida técnica" indefinida porque ninguém nunca se recupera. Defina um "dia de refatoração" após release. Pague a dívida agora, não depois.

**Desafio 2: "Meu projeto tem código legado horrible. Por onde começar?"**
Solução: Estratégia de "boyscout": toda vez que você toca neste arquivo, deixa melhor que o que encontrou. Não refatore tudo. Refatore incrementalmente. Em 6 meses, mudanças pequenas acumulam em grande melhoria.

**Desafio 3: "Escrever testes dobra meu tempo de desenvolvimento"**
Solução: Inicialmente sim. Você não está acostumado. Após 20-30 funções testadas, você é rápido. Além disso, bugs em produção custam 10x mais tempo que testes. Você não economiza tempo evitando testes; você investe mal.

## Citação Memorável
"Código limpo sempre parece que foi escrito por alguém que se importa."

## Quando Ler o Livro Completo
Leia se: você programa profissionalmente e quer elevar sua qualidade de código, trabalha em projeto legado e quer estratégia de melhoria, ou quer entender princípios que separam programadores bons de excelentes. O livro tem exemplos de refatoração antes/depois que valem muito a pena estudar detalhadamente.
