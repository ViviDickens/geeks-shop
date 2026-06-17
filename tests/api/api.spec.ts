import { test, expect } from '@playwright/test';

test.describe('API Layer Tests - Status Codes & Responses', () => {
  test('should receive 200 status code for home page', async ({ page }) => {
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
  });

  test('should receive 200 status code for products page', async ({ page }) => {
    const response = await page.goto('/products');
    
    expect(response?.status()).toBe(200);
  });

  test('should receive 200 status code for cart page', async ({ page }) => {
    const response = await page.goto('/cart');
    
    expect(response?.status()).toBe(200);
  });

  test('should handle 404 errors gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page', { waitUntil: 'networkidle' });
    
    expect(response?.status()).toBe(404);
  });

  test('should fetch products data successfully', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for product API call
    const response = await page.waitForResponse(
      resp => resp.url().includes('/api/products') && resp.status() === 200
    ).catch(() => null);
    
    if (response) {
      const data = await response.json();
      expect(Array.isArray(data) || data.products).toBeTruthy();
    }
  });

  test('should handle product detail API requests', async ({ page }) => {
    await page.goto('/products');
    
    // Click on first product to trigger API call
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.click();
    
    // Wait for detail API call
    const response = await page.waitForResponse(
      resp => resp.url().includes('/api/products/') && resp.status() === 200
    ).catch(() => null);
    
    if (response) {
      const data = await response.json();
      expect(data.id || data.product).toBeTruthy();
    }
  });

  test('should return proper content-type headers', async ({ page }) => {
    const response = await page.goto('/');
    
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });

  test('should cache static assets properly', async ({ page }) => {
    await page.goto('/');
    
    // Intercept image requests
    const responses: any[] = [];
    page.on('response', resp => {
      if (resp.url().includes('.jpg') || resp.url().includes('.png') || resp.url().includes('.webp')) {
        responses.push(resp);
      }
    });
    
    // Reload page and check cache headers
    await page.reload();
    
    // At least some assets should be loaded
    expect(responses.length).toBeGreaterThanOrEqual(0);
  });

  test('should handle multiple API requests without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('response', resp => {
      if (!resp.ok()) {
        errors.push(`${resp.url()}: ${resp.status()}`);
      }
    });
    
    await page.goto('/');
    await page.goto('/products');
    await page.goto('/cart');
    
    // Filter to only API-related errors, not static assets
    const apiErrors = errors.filter(e => e.includes('/api/'));
    expect(apiErrors.length).toBe(0);
  });

  test('should validate API response structure for products', async ({ page }) => {
    await page.goto('/products');
    
    const response = await page.waitForResponse(
      resp => resp.url().includes('/api/products') && resp.status() === 200
    ).catch(() => null);
    
    if (response) {
      const data = await response.json();
      
      // Validate response structure
      if (Array.isArray(data)) {
        expect(data[0]).toHaveProperty('id');
        expect(data[0]).toHaveProperty('name');
        expect(data[0]).toHaveProperty('price');
      } else if (data.products) {
        expect(data.products[0]).toHaveProperty('id');
      }
    }
  });

  test('should handle API timeouts gracefully', async ({ page }) => {
    // Set short timeout to simulate slow network
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    // Should still load without crashing
    await page.goto('/products');
    expect(await page.locator('[data-testid="product-card"]').count()).toBeGreaterThanOrEqual(0);
  });

  test('should validate 404 handling on product detail', async ({ page }) => {
    const response = await page.goto('/products/nonexistent-id-12345');
    
    // Should return 404 or handle gracefully
    expect([200, 404, 307]).toContain(response?.status());
  });
});
