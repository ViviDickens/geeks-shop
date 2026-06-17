import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Navbar elements
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly catalogLink: Locator;
  readonly loginButton: Locator;
  readonly cartIcon: Locator;
  readonly navBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('[data-testid="logo"]');
    this.homeLink = page.getByRole('link', { name: /home/i });
    this.catalogLink = page.getByRole('link', { name: /catalog/i });
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.navBar = page.locator('nav');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
    // Wait for hydration
    await this.page.waitForLoadState('networkidle');
  }

  async clickLogo() {
    await this.logo.click();
  }

  async clickHome() {
    await this.homeLink.click();
  }

  async clickCatalog() {
    await this.catalogLink.click();
  }

  async openLogin() {
    await this.loginButton.click();
  }

  async viewCart() {
    await this.cartIcon.click();
  }

  async waitForNavBar() {
    await this.navBar.waitFor({ state: 'visible' });
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async getPageUrl() {
    return this.page.url();
  }

  /**
   * AI-assisted selector proficiency
   * Suggests resilient locator strategies for DOM elements
   */
  async findOptimalLocator(element: string): Promise<string> {
    const strategies = [
      `[data-testid="${element}"]`,
      `[aria-label*="${element}"]`,
      `text="${element}"`,
      `.${element}`,
    ];

    for (const strategy of strategies) {
      try {
        const locator = this.page.locator(strategy);
        if (await locator.isVisible()) {
          return strategy;
        }
      } catch {
        continue;
      }
    }
    return '';
  }
}
