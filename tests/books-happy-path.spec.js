// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Books library happy path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/books/index.html');
    await page.waitForLoadState('networkidle');
  });

  test('renders the book catalog and hero stats', async ({ page }) => {
    await expect(page.locator('#books-section')).toBeVisible();
    await expect(page.locator('.books-grid .book-item').first()).toBeVisible();
    await expect(page.locator('#stat-books')).not.toHaveText('-');
    await expect(page.locator('#stat-categories')).not.toHaveText('-');
  });

  test('opens a book detail page and shows expected actions', async ({ page }) => {
    const firstBook = page.locator('.books-grid .book-item').first();
    await expect(firstBook).toBeVisible();
    await firstBook.click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#lesson-title')).toBeVisible();
    await expect(page.locator('#bookmark-btn')).toBeVisible();
    await expect(page.locator('.book-toc')).toBeVisible();
    await expect(page.locator('#lesson-meta')).toContainText(/min de leitura|min read/);
  });

  test('supports search, category filtering, and empty-state feedback', async ({ page }) => {
    await page.locator('#global-search').fill('psicologia');
    await expect(page.locator('.book-item')).toHaveCount(14);
    await expect(page.locator('.results-summary')).toContainText(/busca/i);

    await page.locator('#global-search').blur();
    await page.locator('.filter-chip[data-filter="Psicologia"]').click();
    await expect(page.locator('.results-summary')).toContainText(/Psicologia|psicologia/i);

    await page.locator('#global-search').fill('termo-que-nao-existe');
    await expect(page.locator('#empty-state')).toBeVisible();
    await expect(page.locator('#empty-state')).toContainText(/Nenhum livro/i);
  });
});
