import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match home page hero section snapshot', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('section').filter({ has: page.getByText(/level up/i) });
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match products grid layout', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const grid = page.locator('[data-testid="product-grid"]');
    await expect(grid).toHaveScreenshot('products-grid.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match product card appearance', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    await expect(firstCard).toHaveScreenshot('product-card.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match navbar appearance', async ({ page }) => {
    await page.goto('/');
    
    const navbar = page.locator('nav');
    await expect(navbar).toHaveScreenshot('navbar.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match cart page layout', async ({ page }) => {
    await page.goto('/cart');
    
    const cartContainer = page.locator('[data-testid="cart-container"]');
    await expect(cartContainer).toHaveScreenshot('cart-empty.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match product detail page layout', async ({ page }) => {
    await page.goto('/products');
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    await page.waitForLoadState('networkidle');
    
    const detailContainer = page.locator('main');
    await expect(detailContainer).toHaveScreenshot('product-detail.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match home page full page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to see all content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Take screenshot of full page
    await expect(page).toHaveScreenshot('home-full-page.png', {
      maxDiffPixels: 200,
    });
  });

  test('should match button styles', async ({ page }) => {
    await page.goto('/');
    
    const shopNowButton = page.getByRole('button', { name: /shop now/i });
    await expect(shopNowButton).toHaveScreenshot('button-primary.png', {
      maxDiffPixels: 30,
    });
  });

  test('should match product price display format', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const priceElement = page.locator('[data-testid="product-price"]').first();
    await expect(priceElement).toHaveScreenshot('product-price.png', {
      maxDiffPixels: 20,
    });
  });

  test('should match responsive layout on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const navbar = page.locator('nav');
    await expect(navbar).toHaveScreenshot('navbar-mobile.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match products grid on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const grid = page.locator('[data-testid="product-grid"]');
    await expect(grid).toHaveScreenshot('products-grid-tablet.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match featured products section styling', async ({ page }) => {
    await page.goto('/');
    
    const featured = page.locator('section').filter({ has: page.getByText(/featured/i) });
    await expect(featured).toHaveScreenshot('featured-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('should consistently render product images', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstImage = page.locator('[data-testid="product-image"]').first();
    await expect(firstImage).toHaveScreenshot('product-image.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match hover state of product card', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    await firstCard.hover();
    
    await expect(firstCard).toHaveScreenshot('product-card-hover.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match active state of navbar link', async ({ page }) => {
    await page.goto('/products');
    
    const navbar = page.locator('nav');
    await expect(navbar).toHaveScreenshot('navbar-active-link.png', {
      maxDiffPixels: 30,
    });
  });

  test('should match footer styling if present', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    const exists = await footer.count() > 0;
    
    if (exists) {
      await expect(footer).toHaveScreenshot('footer.png', {
        maxDiffPixels: 50,
      });
    }
  });
});
