// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Login', () => {
  test('Login com credenciais válidas', async ({ page }) => {
    // Dado: Estou na página de login
    await page.goto('/');
    
    // Quando: Digito credenciais válidas e faço login
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    
    // Então: Sou redirecionado para inventário
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.title')).toContainText('Products');
  });

  test('Login com senha incorreta', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'wrong_password');
    await page.click('[data-test="login-button"]');
    
    // Deve mostrar erro
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
  });

  test('Adicionar produto ao carrinho', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    
    // Adicionar produto ao carrinho
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Verificar que carrinho foi atualizado
    const cartCount = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartCount).toContainText('1');
  });
});
