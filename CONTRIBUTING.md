# Contributing to Testers Guild QA Course

Thank you for your interest in contributing! This project is a free, open-source QA learning platform.

## How to Contribute

### Reporting Issues
- Use the [issue tracker](https://github.com/testersguild/testersguild.github.io/issues)
- Check for existing issues before creating a new one
- Provide clear steps to reproduce, expected vs actual behavior
- Include browser/OS info for UI issues

### Suggesting Content Improvements
- Fix typos, clarify explanations, add examples
- Propose new lessons or tracks via issues first
- Follow the existing lesson structure (primer, content, Guild Master notes)

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run linting and tests: `npm run lint && npm test`
5. Commit with conventional commits: `git commit -m "feat: add new lesson on X"`
6. Push and open a Pull Request

## Development Setup

```bash
npm install
npm run test:watch  # Run tests in watch mode
npm run lint        # Check code style
```

## Style Guide

- JavaScript: ESLint config (`.eslintrc.json`)
- CSS: Stylelint config (`.stylelintrc.json`)
- HTML: html-validate
- Commit messages: Conventional Commits (feat, fix, docs, chore, etc.)

## Lesson Content Guidelines

Each lesson should include:
1. Clear learning objectives
2. Practical examples with code snippets
3. "Guild Master" notes for senior context
4. Beginner primer (collapsible)
5. Review questions
6. Free resources/links

## Questions?

Open a discussion or join our [Discord community](https://discord.gg/evVQqq4rf).