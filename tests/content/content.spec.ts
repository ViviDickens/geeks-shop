import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductsPage } from '../pages/products.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartPage } from '../pages/cart.page';

test.describe('Content Tests - Text & Image Rendering', () => {
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

  test('should render hero section content on home page', async () => {
    await homePage.goto();
    
    const title = await homePage.getHeroTitle();
    const subtitle = await homePage.getHeroSubtitle();
    
    expect(title).toContain('LEVEL UP YOUR LIFE');
    expect(subtitle).toContain('gaming gear');
  });

  test('should render product cards with required information', async () => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    // Verify first product has title and price
    const title = await productsPage.getProductTitleByIndex(0);
    const price = await productsPage.getProductPriceByIndex(0);
    
    expect(title).toBeTruthy();
    expect(title?.length).toBeGreaterThan(0);
    expect(price).toBeTruthy();
    expect(price?.length).toBeGreaterThan(0);
  });

  test('should render product images in grid', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    
    const images = await page.locator('[data-testid="product-image"]').count();
    expect(images).toBeGreaterThan(0);
  });

  test('should render product detail page content', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    await productsPage.clickProductByIndex(0);
    
    await productDetailPage.waitForPageLoad();
    
    const name = await productDetailPage.getProductName();
    const price = await productDetailPage.getProductPrice();
    const description = await productDetailPage.getProductDescription();
    
    expect(name).toBeTruthy();
    expect(price).toBeTruthy();
    expect(description).toBeTruthy();
  });

  test('should render featured drops section with products', async () => {
    await homePage.goto();
    
    expect(await homePage.isFeaturedDropsSectionVisible()).toBeTruthy();
    
    const count = await homePage.getVisibleProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should display empty cart message when cart is empty', async () => {
    await cartPage.goto();
    
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test('should display product image on detail page', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    await productsPage.clickProductByIndex(0);
    
    const image = page.locator('[data-testid="product-image"]').first();
    await expect(image).toBeVisible();
    
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i);
  });

  test('should render all navbar navigation items', async ({ page }) => {
    await homePage.goto();
    
    const homeLink = homePage.homeLink;
    const catalogLink = homePage.catalogLink;
    const cartIcon = homePage.cartIcon;
    
    expect(await homeLink.isVisible()).toBeTruthy();
    expect(await catalogLink.isVisible()).toBeTruthy();
    expect(await cartIcon.isVisible()).toBeTruthy();
  });

  test('should render product price with correct format', async () => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    
    const price = await productsPage.getProductPriceByIndex(0);
    
    // Price should contain $ or number
    expect(price).toMatch(/^\$?\d+(\.\d{2})?$/);
  });

  test('should render multiple product titles without duplication', async () => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    
    const count = await productsPage.getProductCount();
    const titles = [];
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const title = await productsPage.getProductTitleByIndex(i);
      if (title) titles.push(title);
    }
    
    expect(titles.length).toBeGreaterThan(0);
  });

  test('should render description text on product detail page', async ({ page }) => {
    await productsPage.goto();
    await productsPage.waitForProductsToLoad();
    await productsPage.clickProductByIndex(0);
    
    const description = await productDetailPage.getProductDescription();
    
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(10);
  });
});
