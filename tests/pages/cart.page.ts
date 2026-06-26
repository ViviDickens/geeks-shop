import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class CartPage extends BasePage {
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly emptyMessage: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButton: Locator;
  readonly quantityInput: Locator;
  readonly itemPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContainer = page.getByTestId('cart-title');
    this.cartItems = page.locator('[data-testid^="cart-item-name-"]');
    this.emptyMessage = page.getByText(/empty|cart is empty|browse catalog/i);
    this.cartTotal = page.locator('[data-testid="cart-total"], [data-testid="cart-summary-total"]');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.continueShoppingButton = page.getByRole('link', { name: /browse catalog|continue shopping/i });
    this.removeButton = page.getByRole('button', { name: /remove/i });
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.itemPrice = page.locator('[data-testid="item-price"]');
  }

  async goto() {
    await super.goto('/cart');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartTotal(): Promise<string | null> {
    return await this.cartTotal.textContent();
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async removeItemByIndex(index: number) {
    const buttons = await this.removeButton.all();
    if (buttons.length > index) {
      await buttons[index].click();
    }
  }

  async removeAllItems() {
    const count = await this.getCartItemCount();
    for (let i = 0; i < count; i++) {
      await this.removeItemByIndex(0);
    }
  }

  async updateQuantityByIndex(index: number, quantity: number) {
    const inputs = await this.quantityInput.all();
    if (inputs.length > index) {
      await inputs[index].fill(quantity.toString());
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async waitForCartToLoad() {
    await this.cartContainer.waitFor({ state: 'visible' });
  }

  async getItemTotalPrice(index: number): Promise<string | null> {
    const items = await this.cartItems.all();
    if (items.length > index) {
      const priceLocator = items[index].locator('[data-testid="item-price"]');
      return await priceLocator.textContent();
    }
    return null;
  }
}
