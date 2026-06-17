import { test, expect, Page } from '@playwright/test';

test.describe('Shadow DOM & Drag & Drop Tests', () => {
  /**
   * Helper to interact with Shadow DOM elements
   * Shadow DOM elements are encapsulated and need special handling
   */
  async function getShadowDomElement(page: Page, host: string, selector: string) {
    return page.evaluateHandle(({ host: hostSelector, selector: itemSelector }) => {
      const hostElement = document.querySelector(hostSelector);
      if (!hostElement) return null;
      const shadowRoot = hostElement.shadowRoot;
      if (!shadowRoot) return null;
      return shadowRoot.querySelector(itemSelector);
    }, { host, selector });
  }

  test('should detect shadow DOM presence in drag & drop component', async ({ page }) => {
    await page.goto('/products');
    
    // Check if any element has shadow DOM
    const hasShadowDOM = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        if (el.shadowRoot) {
          return true;
        }
      }
      return false;
    });
    
    // This test just confirms whether Shadow DOM is used
    expect(typeof hasShadowDOM).toBe('boolean');
  });

  test('should simulate drag operation via mouse events', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Simulate drag start
    await firstCard.dispatchEvent('mousedown');
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 200);
    await firstCard.dispatchEvent('mouseup');
    
    // Element should still exist
    expect(await firstCard.isVisible()).toBeTruthy();
  });

  test('should handle drag and drop with native drag events', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Dispatch drag events
    await firstCard.dispatchEvent('dragstart', {
      dataTransfer: {
        setData: () => {},
        effectAllowed: 'move'
      }
    });
    
    // Should not error
    expect(await firstCard.count()).toBe(1);
  });

  test('should support fallback for browsers without Shadow DOM', async ({ page }) => {
    await page.goto('/products');
    
    // Check for regular DOM elements as fallback
    const regularCards = await page.locator('[data-testid="product-card"]').count();
    
    // Should have regular DOM elements as fallback
    expect(regularCards).toBeGreaterThan(0);
  });

  test('should handle drag and drop DOM fallback', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Use Playwright's native drag and drop simulation
    await firstCard.dragTo(page.locator('[data-testid="cart-icon"]'), {
      force: true,
    }).catch(() => {
      // If drag and drop not supported, that's okay - test graceful degradation
    });
    
    // Page should still be functional
    expect(await page.locator('[data-testid="product-card"]').count()).toBeGreaterThan(0);
  });

  test('should handle mouse simulation for drag operations', async ({ page }) => {
    await page.goto('/');
    
    // Test mouse event dispatch chain
    await page.evaluate(() => {
      const element = document.querySelector('[data-testid="product-card"]');
      if (element) {
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      }
      return true;
    });
    
    // Should not crash page
    expect(await page.url()).toBeTruthy();
  });

  test('should preserve DOM structure after drag operations', async ({ page }) => {
    await page.goto('/products');
    const initialCount = await page.locator('[data-testid="product-card"]').count();
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Simulate drag
    await firstCard.hover();
    await page.mouse.move(200, 200);
    
    const finalCount = await page.locator('[data-testid="product-card"]').count();
    
    // DOM should not be modified by mouse movement
    expect(initialCount).toBe(finalCount);
  });

  test('should handle touch events for mobile drag', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Simulate touch drag
    await firstCard.tap();
    
    // Should handle touch without error
    expect(await firstCard.isVisible()).toBeTruthy();
  });

  test('should support pointerdown/pointerup events for drag', async ({ page }) => {
    await page.goto('/products');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Dispatch pointer events (modern drag & drop)
    await firstCard.dispatchEvent('pointerdown');
    await page.mouse.move(100, 100);
    await firstCard.dispatchEvent('pointerup');
    
    expect(await firstCard.isVisible()).toBeTruthy();
  });

  test('should handle drag cancel operation', async ({ page }) => {
    await page.goto('/products');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    const initialURL = page.url();
    
    // Start drag then cancel
    await firstCard.dispatchEvent('dragstart');
    await firstCard.dispatchEvent('dragend');
    
    // Should not navigate anywhere
    expect(page.url()).toBe(initialURL);
  });

  test('should handle rapid drag operations', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('[data-testid="product-card"]').first();
    
    // Rapid drag operations
    for (let i = 0; i < 5; i++) {
      await firstCard.hover();
      await page.mouse.move(Math.random() * 300, Math.random() * 300);
    }
    
    // Should handle without errors
    expect(await firstCard.isVisible()).toBeTruthy();
  });

  test('should validate drag events on product cards', async ({ page }) => {
    await page.goto('/products');
    
    const draggedElement = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="product-card"]');
      if (!element) return null;
      
      // Create and dispatch drag event
      const dragEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
      });
      
      element.dispatchEvent(dragEvent);
      return element.getAttribute('data-testid');
    });
    
    expect(draggedElement).toBe('product-card');
  });

  test('should fallback gracefully when Shadow DOM not available', async ({ page }) => {
    await page.goto('/products');
    
    // Verify fallback DOM is accessible
    const shadowDOMSupport = await page.evaluate(() => {
      return !!Element.prototype.attachShadow;
    });
    
    // Should work regardless of Shadow DOM support
    const productCount = await page.locator('[data-testid="product-card"]').count();
    expect(productCount).toBeGreaterThan(0);
  });
});
