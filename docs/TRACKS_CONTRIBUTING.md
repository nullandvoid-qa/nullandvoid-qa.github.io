# Guia de contribuição para trilhas, cursos e lições

Este guia resume o fluxo mínimo para adicionar ou ajustar trilhas no projeto sem quebrar a navegação, a tradução e a validação das trilhas.

## Arquivos principais

- `data/tracks.js`: definição central das trilhas, cursos e lições.
- `data/translations-en.js`: textos de interface e labels de trilhas em inglês.
- `data/lesson-enrichment.js`: materiais complementares e notas de apoio.
- `data/quizzes.js`: quizzes e gabaritos.
- `reports/i18n-strings.json`: referência auxiliar para strings de UI.

## Estrutura mínima de uma trilha

Exemplo de estrutura esperada:

```js
{
  id: "mobile",
  slug: "mobile-testing",
  title: "Trilha de Testes Mobile",
  icon: "mobile",
  color: "#22c55e",
  description: "Descrição curta da trilha.",
  level: "Intermediário",
  topics: ["Appium", "WebdriverIO", "Android"],
  courses: [
    {
      id: "c5",
      title: "Fundamentos de Testes Mobile",
      lessons: [
        {
          id: "l13",
          title: "Por que testes mobile são diferentes",
          duration: "45 min",
          content: "<h2>...</h2>",
          resources: [
            { label: "Appium Concepts", url: "https://appium.io/docs/en/latest/" }
          ]
        }
      ]
    }
  ]
}
```

## Fluxo recomendado

### 1. Adicionar uma trilha

1. Edite `data/tracks.js`.
2. Preserve `id`, `slug`, `title`, `description`, `level`, `topics` e `courses`.
3. Verifique se a trilha tem pelo menos 5 aulas e está alinhada com a jornada do usuário.
4. Caso seja uma trilha nova, atualize os textos de interface em `data/translations-en.js`.

### 2. Adicionar um curso

1. Crie um objeto com `id`, `title` e `lessons`.
2. Mantenha a ordem didática das aulas.
3. Use títulos claros e coerentes com o nível da trilha.

### 3. Adicionar lições

1. Cada lição deve ter `id`, `title`, `duration` e `content`.
2. Inclua `resources` quando houver links úteis de apoio.
3. Prefira HTML estruturado, com títulos, listas e exercícios curtos.
4. Se a aula tiver complementos de profundidade, verifique `data/lesson-enrichment.js`.

## Traduções e labels

Toda nova string em UI deve ser revisada em:

- `data/translations-en.js`
- `js/i18n.js`
- `js/app-i18n.js`
- `js/utils.js`

Isso evita que o site exponha chaves cruas do dicionário em produção.

## Validação mínima

Antes de abrir PR, rode:

```bash
npm test
npm run lint
npm run validate:tracks
```

Se houver mudança de navegação, conteúdo de trilha ou UI relevante, também vale verificar:

```bash
npm run test:e2e
```

## Checklist de PR

- [ ] A trilha foi adicionada ou ajustada em `data/tracks.js`
- [ ] A estrutura de cursos e lições segue o formato esperado
- [ ] Traduções e labels foram checados em `data/translations-en.js`
- [ ] Recursos, exercícios e quizzes foram revisados quando aplicável
- [ ] `npm test`, `npm run lint` e `npm run validate:tracks` foram executados
