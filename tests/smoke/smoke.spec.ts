import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test.describe('Smoke Tests - Basic Application Load', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
  });

  test('should load home page without errors', async ({ page }) => {
    await homePage.goto();
    
    // Verify page loaded
    expect(page).toHaveTitle(/geek|store/i);
    expect(await homePage.isHeroSectionVisible()).toBeTruthy();
  });

  test('should load products page without errors', async ({ page }) => {
    await productsPage.goto();
    
    // Verify page loaded
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    expect(await productsPage.isProductGridVisible()).toBeTruthy();
  });

  test('should load cart page without errors', async ({ page }) => {
    await cartPage.goto();
    
    // Verify page loaded
    expect(await cartPage.cartContainer.isVisible()).toBeTruthy();
  });

  test('should have functioning navbar on home page', async ({ page }) => {
    await homePage.goto();
    
    // Verify navbar is visible
    await homePage.waitForNavBar();
    expect(await homePage.navBar.isVisible()).toBeTruthy();
  });

  test('should have logo visible on all pages', async ({ page }) => {
    await homePage.goto();
    expect(await homePage.logo.isVisible()).toBeTruthy();
    
    await productsPage.goto();
    expect(await homePage.logo.isVisible()).toBeTruthy();
    
    await cartPage.goto();
    expect(await homePage.logo.isVisible()).toBeTruthy();
  });

  test('should have featured drops section on home page', async ({ page }) => {
    await homePage.goto();
    
    expect(await homePage.isFeaturedDropsSectionVisible()).toBeTruthy();
  });

  test('should have proper page titles', async ({ page }) => {
    await homePage.goto();
    expect(await homePage.getPageTitle()).toMatch(/geek/i);
  });

  test('should load without console errors', async ({ page }) => {
    const messages: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        messages.push(msg.text());
      }
    });
    
    await homePage.goto();
    await productsPage.goto();
    await cartPage.goto();
    
    // Expect no console errors
    expect(messages.length).toBe(0);
  });

  test('should respond within acceptable load time', async ({ page }) => {
    const startTime = Date.now();
    await homePage.goto();
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
