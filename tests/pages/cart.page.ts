import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

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
    this.cartContainer = page.locator('[data-testid="cart-empty"], [data-testid="cart-items"]').first();
    this.cartItems = page.locator('[data-testid^="cart-item-name-"]');
    this.emptyMessage = page.getByTestId('cart-empty');
    this.cartTotal = page.locator('[data-testid="cart-total"], [data-testid="cart-summary-total"]');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.continueShoppingButton = page.getByRole('link', { name: /browse catalog|continue shopping/i });
    this.removeButton = page.locator('[data-testid^="cart-remove-"]');
    this.quantityInput = page.locator('[data-testid^="cart-qty-"]');
    this.itemPrice = page.locator('[data-testid^="cart-item-price-"]');
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
    // isVisible() checks the DOM once, right now — it does not wait or retry,
    // even when a timeout is passed. Right after navigation the page can still
    // be showing "Loading cart..." (pre-hydration), so an instant check catches
    // it mid-load and wrongly reports "not empty". waitFor() actually polls
    // until the element shows up (or genuinely times out), which is what we want.
    return await this.emptyMessage
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);
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
    const qtyDisplays = await this.quantityInput.all();
    if (qtyDisplays.length <= index) return;

    const currentText = await qtyDisplays[index].textContent();
    let current = Number(currentText?.trim() ?? '0');

    const increaseButtons = await this.page.locator('[data-testid^="cart-increase-"]').all();
    const decreaseButtons = await this.page.locator('[data-testid^="cart-decrease-"]').all();

    while (current < quantity) {
      await increaseButtons[index].click();
      current++;
    }
    while (current > quantity) {
      await decreaseButtons[index].click();
      current--;
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
