import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly filterAllButton: Locator;
  readonly sortDropdown: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    // The actual product grid container is "products-grid", not the page heading.
    this.productGrid = page.getByTestId('products-grid');
    this.productCards = page.locator('[data-testid^="product-card-"]');
    this.filterAllButton = page.getByTestId('filter-all');
    this.sortDropdown = page.getByTestId('sort-select');
    this.searchInput = page.getByTestId('search-input');
  }

  async goto() {
    // /products is a real route with its own URL — no need to detour through
    // the home page and click through the nav link to get here.
    await super.goto('/products');
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getProductByIndex(index: number): Promise<Locator> {
    return this.productCards.nth(index);
  }

  async clickProductByIndex(index: number) {
    const product = await this.getProductByIndex(index);
    await product.click();
    // Product cards navigate client-side, so wait for the URL to land on
    // /products/{id} before the caller asserts anything about the new page.
    await this.page.waitForURL(/\/products\/[^/]+\/?$/);
  }

  async getProductTitleByIndex(index: number): Promise<string | null> {
    const product = await this.getProductByIndex(index);
    // ProductCard.tsx uses "product-name-{id}", not a plain "product-title".
    const titleLocator = product.locator('[data-testid^="product-name-"]');
    return await titleLocator.textContent();
  }

  async getProductPriceByIndex(index: number): Promise<string | null> {
    const product = await this.getProductByIndex(index);
    // ProductCard.tsx uses "product-price-{id}", not a plain "product-price".
    const priceLocator = product.locator('[data-testid^="product-price-"]');
    return await priceLocator.textContent();
  }

  async isProductGridVisible(): Promise<boolean> {
    // Same reasoning as CartPage.isCartEmpty(): isVisible() alone checks once,
    // immediately, and doesn't wait for the grid to actually render.
    return await this.productGrid
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
  }

  async waitForProductsToLoad() {
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async filterByCategory(category: string) {
    if (category === 'all') {
      await this.filterAllButton.click();
    } else {
      await this.page.getByTestId(`filter-${category}`).click();
    }
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }
}
