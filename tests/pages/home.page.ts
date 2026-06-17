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
    this.heroSection = page.locator('section').filter({ has: page.getByText(/level up/i) });
    this.heroTitle = page.getByText(/level up your life/i);
    this.heroSubtitle = page.getByText(/gaming gear, anime collectibles/i);
    this.shopNowButton = page.getByRole('button', { name: /shop now/i });
    this.gamingGearButton = page.getByRole('button', { name: /gaming gear/i });
    this.featuredDropsSection = page.locator('section').filter({ has: page.getByText(/featured drops/i) });
    this.productCards = page.locator('[data-testid="product-card"]');
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
