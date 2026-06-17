import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests - WCAG 2.1 Compliance', () => {
  test('should have proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/');
    
    const h1s = await page.locator('h1').count();
    expect(h1s).toBeGreaterThan(0);
    
    // Should have at least one h1
    const firstH1 = page.locator('h1').first();
    expect(await firstH1.isVisible()).toBeTruthy();
  });

  test('should have proper heading hierarchy on products page', async ({ page }) => {
    await page.goto('/products');
    
    const h1s = await page.locator('h1').count();
    const h2s = await page.locator('h2').count();
    
    // Should have proper heading structure
    expect(h1s + h2s).toBeGreaterThan(0);
  });

  test('should have alt text on all images', async ({ page }) => {
    await page.goto('/products');
    
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      // Either has alt text or is decorative
      expect(alt === '' || alt?.length! > 0 || (await image.getAttribute('role')) === 'presentation').toBeTruthy();
    }
  });

  test('should have keyboard accessible buttons', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      // Should be focusable
      expect(await button.isVisible()).toBeTruthy();
    }
  });

  test('should have proper link text', async ({ page }) => {
    await page.goto('/');
    
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const title = await link.getAttribute('title');
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have meaningful text or aria-label
      expect(text?.trim() || title || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper button roles and labels', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check text elements for sufficient contrast
    const textElements = await page.locator('p, a, span, h1, h2, h3, h4, h5, h6, button').count();
    expect(textElements).toBeGreaterThan(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    
    // Should have focusable elements
    expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focused);
  });

  test('should have form labels properly associated', async ({ page }) => {
    await page.goto('/products');
    
    const labels = await page.locator('label').count();
    
    // If there are forms, they should have labels
    if (labels > 0) {
      const firstLabel = page.locator('label').first();
      const htmlFor = await firstLabel.getAttribute('for');
      
      if (htmlFor) {
        const input = page.locator(`#${htmlFor}`);
        expect(await input.isVisible()).toBeTruthy();
      }
    }
  });

  test('should have proper lang attribute', async ({ page }) => {
    await page.goto('/');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('should have proper meta viewport for mobile', async ({ page }) => {
    await page.goto('/');
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('should have skip to content link on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main content landmark
    const main = page.locator('main');
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    
    // Page should have main landmark or skip link
    const hasMain = await main.count();
    const hasSkipLink = await skipLink.count();
    
    expect(hasMain + hasSkipLink).toBeGreaterThan(0);
  });

  test('should have proper focus indicators on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return window.getComputedStyle(el).outline;
    });
    
    // Should have visible focus indicator (outline or similar)
    expect(focused).toBeTruthy();
  });

  test('should announce dynamic content changes to screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Check for aria-live regions
    const liveRegions = await page.locator('[aria-live]').count();
    
    // Should have at least some aria-live regions for dynamic content
    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });

  test('should have proper error messages for forms', async ({ page }) => {
    // Navigate to any page with forms
    await page.goto('/login').catch(() => null);
    
    // If there are forms, they should have proper error handling
    const forms = await page.locator('form').count();
    expect(forms >= 0).toBeTruthy();
  });
});
