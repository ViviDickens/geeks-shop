import { test, expect } from '@playwright/test';
import { products } from '../../src/data/products';

test.describe('HTTP responses and static catalog contract', () => {
  for (const path of ['/', '/products', '/cart', '/login', '/products/1']) {
    test(`GET ${path} returns HTML with status 200`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/html');
    });
  }

  test('unknown route returns 404', async ({ request }) => {
    const response = await request.get('/nonexistent-page');
    expect(response.status()).toBe(404);
  });

  test('unsupported REST endpoint returns 404', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(404);
  });

  test('catalog data satisfies the product contract', () => {
    expect(products.length).toBeGreaterThan(0);
    expect(new Set(products.map(p => p.id)).size).toBe(products.length);
    for (const product of products) {
      expect(product.id).toMatch(/\S/);
      expect(product.name).toMatch(/\S/);
      expect(Number.isFinite(product.price)).toBe(true);
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isInteger(product.stock)).toBe(true);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(['gaming', 'anime', 'tech', 'collectibles']).toContain(product.category);
    }
  });

  test('catalog renders the static product data', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByTestId('products-grid').getByTestId(/^product-card-/)).toHaveCount(products.length);
    for (const product of products) {
      const card = page.getByTestId(`product-card-${product.id}`);
      await expect(card.getByTestId(`product-name-${product.id}`)).toHaveText(product.name);
      await expect(card.getByTestId(`product-price-${product.id}`)).toHaveText(`$${product.price.toFixed(2)}`);
    }
  });

  test('known product details resolve from the static catalog', async ({ request }) => {
    for (const product of products) {
      const response = await request.get(`/products/${product.id}`);
      expect(response.status(), product.id).toBe(200);
    }
  });
});
