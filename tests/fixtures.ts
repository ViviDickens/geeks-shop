import { test as base, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { ProductsPage } from './pages/products.page';
import { ProductDetailPage } from './pages/product-detail.page';
import { CartPage } from './pages/cart.page';
import { TestUtils } from './utils/test-utils';

type TestFixtures = {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  testUtils: typeof TestUtils;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  testUtils: async ({}, use) => {
    await use(TestUtils);
  },
});

export { expect };

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({
    width: 1280,
    height: 720,
  });

  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Test duration: ${testInfo.duration}ms`);

  if (testInfo.status !== 'passed') {
    const screenshotPath =
      `test-results/screenshots/${testInfo.title}-failure.png`;

    await page.screenshot({
      path: screenshotPath,
    });
  }
});

export function describeTest(
  name: string,
  callback: () => void
) {
  test.describe(name, callback);
}