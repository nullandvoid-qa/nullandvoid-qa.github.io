## Ficha Técnica
- Título: Código Limpo
- Autor: Robert C. Martin (Uncle Bob)
- Ano: 2008
- Categoria: Tecnologia

## A Ideia Central
Código é lido 10x mais que escrito. Código legível economiza tempo (leitura, debugging, manutenção). Este livro ensina como escrever código que outras pessoas (e você no futuro) entendem rapidamente.

## Conceitos-Chave

**1. Nomes Significativos**
Variável "d" não diz nada. "elapsedTimeInDays" é claro. Nomes revelam intenção. Leia o nome, entenda o propósito. Evite nomes genéricos (data, valor, temp) — estes não dizem o que a variável é.

**2. Funções Pequenas e Focadas**
Função deve fazer UM bem. Se tem "e", está fazendo demais. Comprimento ideal: <20 linhas. Função pequena é fácil de entender, testar, reusar. Nome revelador + corpo pequeno = auto-documentação.

**3. Tratamento de Erros**
Usar exceções > códigos de erro (que podem ser ignorados). Try-catch limpo: responsabilidade única. Use exceções customizadas, não genéricas. Falha informativa é melhor que falha silenciosa.

**4. Comentários Enganosos**
Comentário ruim "incrementar contador" — código já diz isto. Bom comentário explica *por quê*, não *o quê*. Código muda, comentário fica desatualizado. Código limpo precisa de menos comentários.

**5. Formatação Consistente**
Indentação uniforme, espaçamento consistente, convenções de naming. Código deve parecer escrito pela mesma pessoa. Esforço mínimo: usar linter + formatador automático (Prettier, Black).

**6. DRY: Don't Repeat Yourself**
Duplicação é mal. Cada trecho duplicado é potencial para bug desconexo. Extrair para função reutilizável. Se o mesmo padrão aparece 3 vezes, consolidar.

## Aplicação Prática
1. **Use nomes claros**: leia nome, entenda. Refatore nomes sempre.
2. **Funções pequenas**: <20 linhas, nome descritivo.
3. **Um nível de abstração**: função misturando alto-nível (business logic) e baixo-nível (manipulação string) é confusa.
4. **Teste enquanto escreve**: código testável é mais limpo.
5. **Refatore constantemente**: "deixa pronto" → pequenas limpezas.
6. **Use linter**: enforce automaticamente (indentação, naming).

## Frase Marcante
> "Código limpo sempre parece escrito por alguém que se importa."

## Vale a Pena Ler o Livro Completo Se...
Você quer padrões concretos e exemplos em Java para elevar qualidade do seu código — desde nomes até estrutura, refatoração, tratamento de erros, com antes/depois mostrando transformação de código ruim para limpo.
