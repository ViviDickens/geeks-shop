import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly quantityValue: Locator;
  readonly addToCartButton: Locator;
  readonly decreaseButton: Locator;
  readonly increaseButton: Locator;
  readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    // ProductDetailClient.tsx uses the "product-detail-*" prefix for every testid here
    this.productName = page.getByTestId('product-detail-name');
    this.productPrice = page.getByTestId('product-detail-price');
    this.productDescription = page.getByTestId('product-detail-description');
    this.productImage = page.getByTestId('product-detail-image');
    // No fillable input exists — quantity is a read-only span plus +/- buttons
    this.quantityValue = page.getByTestId('qty-value');
    this.addToCartButton = page.getByTestId('add-to-cart-btn');
    this.decreaseButton = page.getByTestId('qty-decrease');
    this.increaseButton = page.getByTestId('qty-increase');
    // The "back" control is a plain <Link>, not a <button>
    this.backLink = page.getByRole('link', { name: /back to catalog/i });
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

  async getQuantity(): Promise<number> {
    const text = await this.quantityValue.textContent();
    return Number(text?.trim() ?? '0');
  }

  async setQuantity(qty: number) {
    let current = await this.getQuantity();
    while (current < qty) {
      await this.increaseQuantity();
      current++;
    }
    while (current > qty) {
      await this.decreaseQuantity();
      current--;
    }
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async clickBack() {
    await this.backLink.click();
  }

  async waitForPageLoad() {
    await this.productName.waitFor({ state: 'visible' });
    await this.productImage.waitFor({ state: 'visible' });
  }
}
