import { Page, expect } from '@playwright/test';

/**
 * Test utilities and helpers for common operations
 */

export class TestUtils {
  /**
   * Wait for element with custom timeout
   */
  static async waitForElement(
    page: Page,
    selector: string,
    timeout: number = 5000
  ) {
    return page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for multiple elements to load
   */
  static async waitForElements(
    page: Page,
    selector: string,
    minCount: number = 1,
    timeout: number = 5000
  ) {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout });
    const locator = page.locator(selector);
    await expect(locator).toHaveCount(minCount, { timeout });
  }

  /**
   * Verify text content exists on page
   */
  static async verifyTextExists(page: Page, text: string) {
    const locator = page.getByText(text);
    await expect(locator).toBeVisible();
  }

  /**
   * Get all text content from page
   */
  static async getAllText(page: Page): Promise<string> {
    return page.evaluate(() => document.body.innerText);
  }

  /**
   * Check if element is in viewport
   */
  static async isInViewport(page: Page, selector: string): Promise<boolean> {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }, selector);
  }

  /**
   * Scroll element into viewport
   */
  static async scrollIntoView(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get computed style of element
   */
  static async getComputedStyle(
    page: Page,
    selector: string,
    property: string
  ): Promise<string> {
    return page.evaluate(
      ({ sel, prop }) => {
        const element = document.querySelector(sel);
        if (!element) return '';
        return window.getComputedStyle(element).getPropertyValue(prop);
      },
      { sel: selector, prop: property }
    );
  }

  /**
   * Check if element has specific class
   */
  static async hasClass(page: Page, selector: string, className: string): Promise<boolean> {
    return page.evaluate(
      ({ sel, cls }) => {
        const element = document.querySelector(sel);
        return element?.classList.contains(cls) ?? false;
      },
      { sel: selector, cls: className }
    );
  }

  /**
   * Click element at specific coordinates
   */
  static async clickAtCoordinates(page: Page, x: number, y: number) {
    await page.mouse.click(x, y);
  }

  /**
   * Drag and drop simulation
   */
  static async dragAndDrop(
    page: Page,
    sourceSelector: string,
    targetSelector: string
  ) {
    const source = page.locator(sourceSelector);
    const target = page.locator(targetSelector);

    try {
      await source.dragTo(target, { force: true });
    } catch {
      // Fallback: manual drag simulation
      await source.hover();
      await page.mouse.down();
      await target.hover();
      await page.mouse.up();
    }
  }

  /**
   * Perform keyboard shortcut
   */
  static async keyboardShortcut(page: Page, keys: string) {
    await page.keyboard.press(keys);
  }

  /**
   * Type with delay between characters
   */
  static async typeWithDelay(page: Page, selector: string, text: string, delay: number = 50) {
    await page.locator(selector).fill(text);
  }

  /**
   * Get all attribute values for elements
   */
  static async getAllAttributes(
    page: Page,
    selector: string,
    attribute: string
  ): Promise<string[]> {
    return page.locator(selector).evaluateAll((elements, attr) => {
      return elements.map((el) => el.getAttribute(attr) || '');
    }, attribute);
  }

  /**
   * Check network idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Clear local storage
   */
  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => localStorage.clear());
  }

  /**
   * Clear session storage
   */
  static async clearSessionStorage(page: Page) {
    await page.evaluate(() => sessionStorage.clear());
  }

  /**
   * Set localStorage value
   */
  static async setLocalStorage(page: Page, key: string, value: string) {
    await page.evaluate(
      ({ k, v }) => {
        localStorage.setItem(k, v);
      },
      { k: key, v: value }
    );
  }

  /**
   * Get localStorage value
   */
  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Verify page accessibility
   */
  static async checkAccessibility(page: Page, selector: string = 'main') {
    // Check for basic a11y attributes
    const ariaLabels = await page.locator('[aria-label]').count();
    const roles = await page.locator('[role]').count();
    const altText = await page.locator('img[alt]').count();

    return {
      ariaLabels,
      roles,
      altText,
      hasSome: ariaLabels > 0 || roles > 0 || altText > 0,
    };
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshotWithTimestamp(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Wait for table to load with specific row count
   */
  static async waitForTableRows(page: Page, selector: string, rowCount: number) {
    const rows = page.locator(`${selector} tbody tr`);
    await expect(rows).toHaveCount(rowCount);
  }

  /**
   * Get table data as 2D array
   */
  static async getTableData(page: Page, tableSelector: string): Promise<string[][]> {
    return page.evaluate((sel) => {
      const table = document.querySelector(sel);
      if (!table) return [];

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      return rows.map((row) => {
        return Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent || '');
      });
    }, tableSelector);
  }

  /**
   * Inject JS script into page
   */
  static async injectScript(page: Page, scriptPath: string) {
    await page.addInitScript({
      path: scriptPath,
    });
  }

  /**
   * Monitor console messages
   */
  static async monitorConsole(page: Page) {
    const logs: any[] = [];

    page.on('console', (msg) => {
      logs.push({
        type: msg.type(),
        text: msg.text(),
        args: msg.args().length,
      });
    });

    return logs;
  }

  /**
   * Get page metrics
   */
  static async getPageMetrics(page: Page) {
    return page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      return {
        loadTime: navigation?.loadEventEnd - navigation?.fetchStart,
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.fetchStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      };
    });
  }
}

/**
 * Custom assertions
 */
export const customAssertions = {
  async assertResponseStatus(page: Page, url: string, expectedStatus: number) {
    const response = await page.waitForResponse(
      (resp) => resp.url().includes(url) && resp.status() === expectedStatus
    );
    expect(response.status()).toBe(expectedStatus);
  },

  async assertTextNotVisible(page: Page, text: string) {
    const locator = page.getByText(text);
    await expect(locator).not.toBeVisible();
  },

  async assertURLContains(page: Page, text: string) {
    expect(page.url()).toContain(text);
  },

  async assertURLMatches(page: Page, pattern: RegExp) {
    expect(page.url()).toMatch(pattern);
  },
};
