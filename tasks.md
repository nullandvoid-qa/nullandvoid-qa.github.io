# Backlog de Tarefas - Null and Void QA Course

Este arquivo serve como a fonte da verdade para o progresso do projeto, detalhando as melhorias de refatoração, internacionalização, qualidade de conteúdo e infraestrutura.

## 🛠️ Refatoração de Código e Arquitetura

- [ ] **Finalizar separação de módulos de renderização em `js/app.js`**
  - Extrair helpers de renderização restantes em [app.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/app.js) para [view-helpers.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/view-helpers.js) ou [lesson-renderers.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/lesson-renderers.js).
  - Remover trechos duplicados de manipulação direta de DOM do fluxo principal.
- [ ] **Unificar Estado Global do App**
  - Substituir variáveis globais soltas por um objeto de estado centralizado em [app.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/app.js) para melhorar a previsibilidade.
- [ ] **Refatorar e Centralizar Utilitários**
  - Mover funções de DOM genéricas e helpers seguros para `localStorage` / parse de JSON para [utils.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/utils.js).
- [ ] **Organizar Folha de Estilos CSS**
  - Dividir [styles.css](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/css/styles.css) em seções limpas (base, layout, componentes, utilitários).
  - Eliminar seletores obsoletos ou duplicados.

## 🌐 Internacionalização (i18n)

- [ ] **Criar Arquivo de Metadados em Inglês (`translations-en.json`)**
  - Traduzir e estruturar as 120 chaves de metadados de trilhas/cursos/aulas do [translations-pt.json](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/data/translations-pt.json) para o novo arquivo [translations-en.json](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/data/translations-en.json).
- [ ] **Criar Script de Sincronização (`sync-translations.js`)**
  - Implementar script em [scripts/sync-translations.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/scripts/sync-translations.js) para validar chaves faltantes entre os idiomas.
- [ ] **Escrever Testes de Cobertura de Tradução**
  - Adicionar [i18n-coverage.test.js](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/js/__tests__/i18n-coverage.test.js) para assegurar que cada chave em PT-BR possua sua respectiva tradução em EN.
- [ ] **Atualizar Guias de Contribuição**
  - Documentar regras e boas práticas de tradução no [CONTRIBUTING.md](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/CONTRIBUTING.md) e [ARCHITECTURE.md](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/docs/ARCHITECTURE.md).

## 📚 Conteúdo, Aulas e Exercícios

- [ ] **Adicionar Exercícios Práticos com Gabarito**
  - Elaborar pelo menos 1 exercício com respectivo gabarito/resolução para cada uma das 10 lições amostradas identificadas em [reports/lesson-review.md](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/reports/lesson-review.md).
- [ ] **Incluir Metadados de Revisão**
  - Registrar data da última revisão, autor e status no cabeçalho das lições amostradas.
- [ ] **Disponibilizar Templates Reutilizáveis**
  - Criar e anexar templates (ex: Markdown/YAML) para matriz de risco, critérios de aceitação (BDD), checklists de SDLC e sessão de teste exploratório.
- [ ] **Anexar Links e Repositórios Recomendados**
  - Fornecer scripts ou repositórios práticos de exemplo para as aulas que abordam automação e testes de regressão.

## 🧪 Testes e Automação de Qualidade

- [ ] **Configurar Validação Automatizada de i18n no CI/CD**
  - Integrar a validação de chaves de internacionalização no pipeline do GitHub Actions para falhar caso novos textos cruificados ou não traduzidos subam para a master.
- [ ] **Refinar Pipeline Local**
  - Adicionar scripts unificados de qualidade no [package.json](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/package.json) (ex: `validate:all`) e registrar instruções no [README.md](file:///c:/Users/Rampz/Desktop/nullandvoid-qa.github.io/README.md).
