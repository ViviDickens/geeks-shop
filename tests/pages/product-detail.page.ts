import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly decreaseButton: Locator;
  readonly increaseButton: Locator;
  readonly backButton: Locator;
  readonly relatedProducts: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-testid="product-name"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImage = page.locator('[data-testid="product-image"]');
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.decreaseButton = page.getByRole('button', { name: /decrease/i });
    this.increaseButton = page.getByRole('button', { name: /increase/i });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.relatedProducts = page.locator('[data-testid="related-products"]');
  }

  async goto(productId: string) {
    await super.goto(`/products/${productId}`);
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  async getProductDescription(): Promise<string | null> {
    return await this.productDescription.textContent();
  }

  async increaseQuantity() {
    await this.increaseButton.click();
  }

  async decreaseQuantity() {
    await this.decreaseButton.click();
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(qty.toString());
  }

  async getQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async isRelatedProductsVisible(): Promise<boolean> {
    return await this.relatedProducts.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async waitForPageLoad() {
    await this.productName.waitFor({ state: 'visible' });
    await this.productImage.waitFor({ state: 'visible' });
  }
}
