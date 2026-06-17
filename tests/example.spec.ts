/**
 * EXAMPLE: Using Custom Fixtures
 * 
 * This file demonstrates how to use the custom fixtures
 * defined in fixtures.ts for cleaner, more readable tests.
 */

import { test, expect } from '../fixtures';

test.describe('Example Tests with Custom Fixtures', () => {
  test('should load home page using fixture', async ({ homePage }) => {
    // Page objects are automatically initialized
    await homePage.goto();

    expect(await homePage.isHeroSectionVisible()).toBeTruthy();
  });

  test('should navigate to products using fixture', async ({ homePage, productsPage, page }) => {
    await homePage.goto();
    await homePage.clickShopNow();

    expect(page.url()).toContain('/products');
    expect(await productsPage.isProductGridVisible()).toBeTruthy();
  });

  test('should add product to cart using fixtures', async ({
    productsPage,
    cartPage,
    testUtils,
    page,
  }) => {
    await productsPage.goto();
    const initialCount = await productsPage.getProductCount();

    expect(initialCount).toBeGreaterThan(0);

    // Add first product to cart
    await productsPage.addToCartByIndex(0);

    // Use custom utilities
    await testUtils.waitForNetworkIdle(page);

    // Navigate to cart
    await cartPage.goto();

    // Verify item in cart
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBeGreaterThan(0);
  });

  test('should test accessibility using fixtures', async ({ homePage, testUtils, page }) => {
    await homePage.goto();

    // Use test utilities to check accessibility
    const a11yCheck = await testUtils.checkAccessibility(page);

    expect(a11yCheck.hasSome).toBeTruthy();
  });

  test('should validate page metrics', async ({ homePage, testUtils, page }) => {
    await homePage.goto();

    const metrics = await testUtils.getPageMetrics(page);

    // Page should load within 3 seconds
    expect(metrics.loadTime).toBeLessThan(3000);

    // DOM should be ready within 2 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });

  test('should monitor console errors', async ({ homePage, testUtils, page }) => {
    // Start monitoring
    const logs = testUtils.monitorConsole(page);

    await homePage.goto();

    // Verify no errors in console
    const errors = logs.filter((log) => log.type === 'error');
    expect(errors).toHaveLength(0);
  });

  test('should test keyboard navigation', async ({ homePage, testUtils, page }) => {
    await homePage.goto();

    // Tab to first interactive element
    await testUtils.keyboardShortcut(page, 'Tab');

    // Verify focused element
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
  });

  test('should perform drag and drop', async ({ productsPage, testUtils, page }) => {
    await productsPage.goto();

    const firstCard = page.locator('[data-testid="product-card"]').first();
    const cartIcon = page.locator('[data-testid="cart-icon"]');

    // Use test utility for drag and drop
    await testUtils.dragAndDrop(
      page,
      '[data-testid="product-card"]',
      '[data-testid="cart-icon"]'
    );

    // Verify still on page
    expect(await firstCard.count()).toBeGreaterThan(0);
  });
});
