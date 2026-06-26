import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly shopNowButton: Locator;
  readonly gamingGearButton: Locator;
  readonly featuredDropsSection: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.getByTestId('hero');
    this.heroTitle = page.getByTestId('hero-title');
    this.heroSubtitle = page.getByTestId('hero-subtitle');
    this.shopNowButton = page.getByTestId('hero-cta-primary');
    this.gamingGearButton = page.getByTestId('hero-cta-secondary');
    this.featuredDropsSection = page.getByTestId('featured-section');
    this.productCards = page.getByTestId('product-card');
  }

  async goto() {
    await super.goto('/');
  }

  async clickShopNow() {
    await this.shopNowButton.click();
  }

  async clickGamingGear() {
    await this.gamingGearButton.click();
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
