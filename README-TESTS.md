# Geeks Shop - E2E Test Suite

Production-grade E2E test suite against a real e-commerce site deployed on GitHub Pages. Covers smoke, content, navigation, visual regression, accessibility, performance, popups, drag & drop with shadow DOM fallback, and API layer validation — all wired into a GitHub Actions pipeline.

## Test Coverage (22 Tests)

### 1. **Smoke Tests** (8 tests)
- Page load validation without errors
- Navbar functionality
- Featured drops section rendering
- Console error detection
- Page load time benchmarking

```bash
npm run test:smoke
```

### 2. **Navigation Tests** (11 tests)
- Home → Products navigation (Shop Now button)
- Home → Products navigation (Gaming Gear button)
- Home → Products navigation (Catalog link)
- Products → Product Detail navigation
- Logo click return to home
- Cart page access
- Browser back button behavior
- Breadcrumb trail updates
- Multi-page navigation flow

```bash
npm run test:navigation
```

### 3. **Content Tests** (11 tests)
- Hero section text rendering
- Product card information (title, price)
- Product images in grid
- Product detail page content
- Featured drops section content
- Empty cart message
- Product image source validation
- Navbar elements visibility
- Price format validation
- Product description rendering

```bash
npm run test:content
```

### 4. **API Layer Tests** (12 tests)
- 200 status codes for all pages
- 404 error handling
- Products API endpoint validation
- Product detail API response structure
- Content-Type headers validation
- Static asset caching
- Multiple API requests without errors
- API response structure validation
- Timeout handling
- Product detail 404 handling

```bash
npm run test:api
```

### 5. **Accessibility Tests** (14 tests)
- Heading hierarchy (h1, h2, h3)
- Alt text on images
- Keyboard accessible buttons
- Link text meaningfulness
- Button roles and labels
- Color contrast validation
- Keyboard navigation (Tab)
- Form label association
- Lang attribute on HTML
- Mobile viewport meta
- Skip to content link
- Focus indicators
- ARIA-live regions for dynamic content
- Form error handling

```bash
npm run test:a11y
```

### 6. **Visual Regression Tests** (16 tests)
- Hero section snapshot
- Products grid layout
- Product card appearance
- Navbar appearance
- Cart page layout
- Product detail layout
- Full home page snapshot
- Button styles
- Price display format
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Featured products section
- Product images consistency
- Product card hover state
- Navbar active link state
- Footer styling

```bash
npm run test:visual
```

### 7. **Shadow DOM & Drag & Drop Tests** (12 tests)
- Shadow DOM presence detection
- Drag operation via mouse events
- Native drag event handling
- Browser fallback support
- Drag & drop DOM fallback
- Mouse simulation for drag
- DOM preservation after drag
- Touch events for mobile drag
- Pointer events (pointerdown/pointerup)
- Drag cancel operation
- Rapid drag operations
- Shadow DOM fallback validation

```bash
npm run test:shadow-dom
```

## Project Structure

```
geeks-shop/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── products/
│   │   │   ├── page.tsx             # Products listing
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Product detail
│   │   │       └── ProductDetailClient.tsx
│   │   ├── cart/
│   │   │   └── page.tsx             # Cart page
│   │   └── login/
│   │       └── page.tsx             # Login page
│   ├── components/
│   │   ├── Navbar.tsx               # Navigation component
│   │   └── ProductCard.tsx          # Product card component
│   └── data/
│       ├── products.ts              # Products data
│       └── users.ts                 # Users data
├── tests/
│   ├── base.page.ts                 # Base Page Object
│   ├── pages/
│   │   ├── home.page.ts             # Home Page Object
│   │   ├── products.page.ts         # Products Page Object
│   │   ├── product-detail.page.ts   # Product Detail Page Object
│   │   └── cart.page.ts             # Cart Page Object
│   ├── smoke/
│   │   └── smoke.spec.ts            # Smoke tests
│   ├── navigation/
│   │   └── navigation.spec.ts       # Navigation tests
│   ├── content/
│   │   └── content.spec.ts          # Content rendering tests
│   ├── api/
│   │   └── api.spec.ts              # API layer tests
│   ├── a11y/
│   │   └── accessibility.spec.ts    # Accessibility tests
│   ├── visual/
│   │   └── visual.spec.ts           # Visual regression tests
│   └── shadow-dom/
│       └── shadow-dom.spec.ts       # Shadow DOM & drag & drop tests
├── .github/
│   └── workflows/
│       └── playwright.yml           # CI/CD pipeline
├── playwright.config.ts             # Playwright configuration
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies

```

## Setup & Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/ViviDickens/geeks-shop.git
cd geeks-shop

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Specific Test Suite
```bash
npm run test:smoke
npm run test:navigation
npm run test:content
npm run test:api
npm run test:a11y
npm run test:visual
npm run test:shadow-dom
```

### Interactive Mode
```bash
# UI mode (interactive dashboard)
npm run test:ui

# Debug mode (with inspector)
npm run test:debug

# Headed mode (see browser)
npm run test:headed
```

### View Reports
```bash
# HTML Report
npm run test:report

# Allure Report
npm run test:report:allure
```

## CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests against `main` or `develop`
- **Scheduled**: Every Monday at 9:00 AM UTC

### Pipeline Configuration (`.github/workflows/playwright.yml`)

- **Matrix Strategy**:
  - Node versions: 18.x, 20.x
  - Browsers: chromium, firefox, webkit
  - Total: 6 job combinations

- **Artifacts**:
  - Playwright HTML reports
  - JUnit XML reports
  - Test results JSON
  - Screenshots on failure
  - Video recordings on failure

- **Reports**:
  - Playwright HTML report
  - Allure report (deployed to GitHub Pages)
  - PR comments with test summary

## Page Object Model (POM)

All tests use the Page Object Model pattern for maintainability:

### Base Page
```typescript
class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly cartIcon: Locator;
  // ... methods
}
```

### Specific Pages
- `HomePage` - Home page interactions
- `ProductsPage` - Products listing interactions
- `ProductDetailPage` - Product detail interactions
- `CartPage` - Cart interactions

## AI Selector Proficiency

The `base.page.ts` includes an AI-assisted selector method:

```typescript
async findOptimalLocator(element: string): Promise<string>
```

This method evaluates multiple locator strategies and returns the most resilient one:
1. Data-testid selectors
2. Aria-label attributes
3. Text matching
4. CSS classes

## Key Features

### 🔄 Browser Support
- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### 📊 Reporting
- HTML reports with videos/screenshots
- JUnit XML for CI integration
- Allure reports with timeline
- GitHub PR comments with results

### ⚡ Performance
- Parallel test execution
- Timeout management
- Network idle waiting
- Retry logic on CI

### 🎯 Accessibility
- WCAG 2.1 compliance checks
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation

### 🎨 Visual Regression
- Screenshot snapshots
- Configurable diff tolerance
- Multi-viewport testing
- Responsive design validation

### 🖱️ Advanced Interactions
- Shadow DOM handling
- Drag & drop testing
- Touch events (mobile)
- Pointer events
- Native APIs fallback

## Test Data

Tests use live data from the application:
- Real product database
- Live user accounts
- Dynamic pricing
- Current inventory

No mocking or fixtures needed.

## Best Practices

1. **Isolation**: Each test is independent
2. **Clarity**: Descriptive test names
3. **Maintainability**: Page Object Model
4. **Reliability**: Explicit waits, error handling
5. **Speed**: Parallel execution where possible
6. **Documentation**: Comments for complex logic

## Troubleshooting

### Tests hanging on CI
- Check `playwright.yml` timeout settings
- Verify baseURL is correct
- Ensure dev server starts before tests

### Screenshot/Video not saving
- Check artifact paths in `playwright.config.ts`
- Verify GitHub Actions permissions

### Flaky tests
- Add explicit waits: `waitForLoadState()`, `waitFor()`
- Use data-testid selectors instead of CSS
- Avoid timeouts under 3 seconds

## Contributing

When adding new tests:

1. Follow Page Object Model pattern
2. Use descriptive test names
3. Add data-testid attributes to app
4. Document new locators
5. Update this README

## License

Private repository - Viviana Pérez (ViviDickens)

## Tech Stack

- **Framework**: Playwright Test
- **Language**: TypeScript
- **App**: Next.js 15
- **Reports**: HTML, JUnit XML, Allure
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

---

**Last Updated**: June 2026
**Maintained by**: Viviana Pérez (Senior SDET)
