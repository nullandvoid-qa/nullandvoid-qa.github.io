# Testing Guide - Null and Void QA Course

## Overview

This project uses Jest for unit testing with Allure Reports for detailed test visualization and history tracking.

---

## Local Setup

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Install Allure CLI (optional, for viewing reports locally)
npm install -g allure-commandline
```

---

## Running Tests Locally

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with Allure Report generation
```bash
npm run test:allure
```

### View Allure Report
```bash
npm run allure:serve
```

This opens the Allure Report in your browser at `http://localhost:4040`

---

## Test Structure

```
js/
├── __tests__/
│   ├── setup.js           # Jest setup file
│   ├── auth.test.js       # Auth module tests
│   ├── module1.test.js    # Other tests
│   └── ...
```

### Writing Tests

Tests follow the pattern:
```javascript
describe('Module Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

---

## CI/CD Pipeline

### Automated Testing on GitHub Actions

Tests run automatically on:
- Push to `main` branch
- Pull requests to `main` branch

### Available Reports

After tests run in CI:
1. **Test Results** - Check if tests passed/failed
2. **Code Coverage** - Coverage report
3. **Allure Report** - Detailed test report with history

### Accessing CI Results

1. Go to repository → **Actions** tab
2. Click on the workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `allure-results` - Raw test data
   - `allure-report` - HTML report
   - `coverage` - Code coverage report

---

## Test Coverage

Check coverage locally:
```bash
npm test -- --coverage
```

Coverage report is generated in `coverage/` directory.

---

## Allure Reports

### What is Allure?

Allure Report is a flexible, lightweight multi-language test report tool that provides:
- Test execution timeline
- Failed test details
- Test history
- Flakiness tracking
- Environment information

### Report Artifacts

- **allure-results/** - Raw test data (automatically generated)
- **allure-report/** - HTML report (generated from results)

Both are uploaded to GitHub Actions artifacts for 30 days.

---

## Troubleshooting

### Tests fail locally but pass in CI
- Check Node.js version: `node --version` (should be 20+)
- Ensure dependencies are installed: `npm ci`
- Check for environment variables: See `.env.example`

### Allure Report doesn't generate
- Verify Jest is configured with Allure reporter
- Check `jest.config.js` has Allure configuration
- Ensure `allure-jest` package is installed

### Artifacts not uploading in CI
- Check workflow permissions
- Verify artifact names in workflow match expected paths
- Check GitHub Actions usage limits

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Allure Jest Reporter](https://github.com/allure-framework/allure-js/tree/master/packages/allure-jest)

---

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Commit changes
4. Push to create PR
5. Tests run automatically in CI
6. Review Allure Report before merging

---

## Status Badges

[![Tests](https://github.com/qakaio/nullandvoid-qa/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/qakaio/nullandvoid-qa/actions/workflows/ci.yml)

---

**Last Updated:** July 18, 2026  
**Maintained by:** QA Team
