import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroDescription: Locator;
  readonly shopNowButton: Locator;
  readonly gamingGearButton: Locator;
  readonly featuredDropsSection: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.getByTestId('hero');
    this.heroTitle = page.getByTestId('hero-title');
    this.heroSubtitle = page.getByTestId('hero-subtitle');
    this.heroDescription = page.getByTestId('hero-description');
    this.shopNowButton = page.getByTestId('hero-cta-primary');
    this.gamingGearButton = page.getByTestId('hero-cta-secondary');
    this.featuredDropsSection = page.getByTestId('featured-section');
    // Product cards on the home page all share the "product-card-{id}" testid pattern,
    // scoped to the featured section so we don't accidentally match anything else.
    this.productCards = this.featuredDropsSection.locator('[data-testid^="product-card-"]');
  }

  async goto() {
    await super.goto('/');
  }

  async clickShopNow() {
    await this.shopNowButton.click();
    // Client-side <Link> navigation — wait for the URL to actually update
    // before any assertion runs, same reasoning as BasePage's click methods.
    await this.page.waitForURL('/products');
  }

  async clickGamingGear() {
    await this.gamingGearButton.click();
    await this.page.waitForURL('**/products?category=gaming');
  }

  async getVisibleProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getHeroTitle(): Promise<string | null> {
    return await this.heroTitle.textContent();
  }

  async getHeroSubtitle(): Promise<string | null> {
    return await this.heroSubtitle.textContent();
  }

  async getHeroDescription(): Promise<string | null> {
    return await this.heroDescription.textContent();
  }

  async isHeroSectionVisible(): Promise<boolean> {
    return await this.heroSection.isVisible();
  }

  async isFeaturedDropsSectionVisible(): Promise<boolean> {
    return await this.featuredDropsSection.isVisible();
  }

  async scrollToFeaturedDrops() {
    await this.featuredDropsSection.scrollIntoViewIfNeeded();
  }
}
