import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ProductsPage extends BasePage {
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly filterButton: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productImage = page.locator('[data-testid="product-image"]');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.filterButton = page.getByRole('button', { name: /filter/i });
    this.sortDropdown = page.locator('[data-testid="sort-select"]');
  }

  async goto() {
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
  }

  async addToCartByIndex(index: number) {
    const buttons = await this.addToCartButton.all();
    if (buttons.length > index) {
      await buttons[index].click();
    }
  }

  async getProductTitleByIndex(index: number): Promise<string | null> {
    const product = await this.getProductByIndex(index);
    const titleLocator = product.locator('[data-testid="product-title"]');
    return await titleLocator.textContent();
  }

  async getProductPriceByIndex(index: number): Promise<string | null> {
    const product = await this.getProductByIndex(index);
    const priceLocator = product.locator('[data-testid="product-price"]');
    return await priceLocator.textContent();
  }

  async isProductGridVisible(): Promise<boolean> {
    return await this.productGrid.isVisible();
  }

  async waitForProductsToLoad() {
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }
}
