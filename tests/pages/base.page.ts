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
    this.logo = page.getByTestId('navbar').getByText(/geekstore/i);
    this.homeLink = page.getByRole('link', { name: /home/i });
    // Scoped to the actual testid: a plain /catalog/i role match also catches the
    // cart page's "Browse Catalog" link when the cart is empty, causing a strict
    // mode violation (2 matches) on that page.
    this.catalogLink = page.getByTestId('nav-catalog');
    // "Login" renders as a <Link>, not a <button> — role should be "link".
    this.loginButton = page.getByRole('link', { name: /login/i });
    // Needs getByTestId (or the [data-testid="..."] attribute selector) — a bare
    // string in page.locator() matches an HTML tag name, not a data-testid value.
    this.cartIcon = page.getByTestId('nav-cart');
    this.navBar = page.locator('nav');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async clickLogo() {
    await this.logo.click();
    // Navbar links use Next.js <Link>, which navigates client-side (history.pushState)
    // instead of a full page load. Playwright's click() doesn't wait for that URL
    // change on its own, so without this the very next assertion can still see the
    // old URL. waitForURL blocks until the address bar actually reflects the move.
    await this.page.waitForURL('/');
  }

  async clickHome() {
    await this.homeLink.click();
    await this.page.waitForURL('/');
  }

  async clickCatalog() {
    await this.catalogLink.click();
    await this.page.waitForURL('/products');
  }

  async openLogin() {
    await this.loginButton.click();
    await this.page.waitForURL('/login');
  }

  async viewCart() {
    await this.cartIcon.click();
    await this.page.waitForURL('/cart');
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
}
