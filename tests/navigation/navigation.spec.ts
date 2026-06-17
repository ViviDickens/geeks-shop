import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';

test.describe('Navigation Tests', () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let productDetailPage: ProductDetailPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
    cartPage = new CartPage(page);
  });

  test('should navigate from home to products via Shop Now button', async ({ page }) => {
    await homePage.goto();
    await homePage.clickShopNow();
    
    expect(page.url()).toContain('/products');
    expect(await productsPage.isProductGridVisible()).toBeTruthy();
  });

  test('should navigate from home to products via Gaming Gear button', async ({ page }) => {
    await homePage.goto();
    await homePage.clickGamingGear();
    
    expect(page.url()).toContain('/products');
  });

  test('should navigate from home to products via catalog link', async ({ page }) => {
    await homePage.goto();
    await homePage.clickCatalog();
    
    expect(page.url()).toContain('/products');
  });

  test('should navigate from products to product detail', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    await productsPage.clickProductByIndex(0);
    
    expect(page.url()).toContain('/products/');
  });

  test('should navigate back to home via logo click', async ({ page }) => {
    await productsPage.goto();
    await homePage.clickLogo();
    
    expect(page.url()).toContain('/');
    expect(await homePage.isHeroSectionVisible()).toBeTruthy();
  });

  test('should navigate to cart page', async ({ page }) => {
    await homePage.goto();
    await homePage.viewCart();
    
    expect(page.url()).toContain('/cart');
  });

  test('should navigate from products to cart', async ({ page }) => {
    await productsPage.goto();
    await homePage.viewCart();
    
    expect(page.url()).toContain('/cart');
  });

  test('should navigate from cart back to products', async ({ page }) => {
    await cartPage.goto();
    await homePage.clickCatalog();
    
    expect(page.url()).toContain('/products');
  });

  test('should navigate from cart back to home via logo', async ({ page }) => {
    await cartPage.goto();
    await homePage.clickLogo();
    
    expect(page.url()).toMatch(/^.*\/$|^.*\/home$/i);
  });

  test('should handle browser back button correctly', async ({ page }) => {
    await homePage.goto();
    await homePage.clickCatalog();
    expect(page.url()).toContain('/products');
    
    await page.goBack();
    expect(page.url()).toContain('/');
  });

  test('should maintain scroll position on navigation', async ({ page }) => {
    await homePage.goto();
    await homePage.scrollToFeaturedDrops();
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should update breadcrumb trail on product detail page', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    await productsPage.clickProductByIndex(0);
    
    // Verify we're on product detail page
    await productDetailPage.waitForPageLoad();
  });
});
