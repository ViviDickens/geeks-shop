# vivi-test-site 🛒

> A production-grade Next.js e-commerce site built as a controlled test environment for Playwright E2E test suite.

## Why this exists

Testing against third-party sites is fragile — content changes, layouts shift, uptime is unpredictable. This site gives the QA suite a **stable, fully controlled target** where every element, route, and API response is intentional and testable.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **pnpm** (package manager)
- **Mock data** — no real database, all JSON-driven
- **Deployed on Vercel** — stable URL for CI/CD pipelines

## Pages & Testable Flows

| Page | Path | Key test targets |
|------|------|-----------------|
| Home | `/` | Hero, featured products, CTAs, stats |
| Catalog | `/products` | Search, category filters, sort, grid |
| Product Detail | `/products/[id]` | Price, stock, qty controls, add to cart |
| Cart | `/cart` | Add/remove items, qty update, total calc |
| Login | `/login` | Validation, error states, success flow |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products (optional `?category=` `?featured=true`) |
| GET | `/api/products/:id` | Single product, returns 404 if not found |
| POST | `/api/auth/login` | Auth with email + password |

## Test Credentials

```
Email:    vivi@geekstore.com
Password: Test1234!
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts          # GET /api/products
│   │   │   └── [id]/route.ts     # GET /api/products/:id
│   │   └── auth/login/route.ts   # POST /api/auth/login
│   ├── cart/page.tsx
│   ├── login/page.tsx
│   ├── products/
│   │   ├── page.tsx              # Catalog
│   │   └── [id]/page.tsx         # Product detail
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Home
├── components/
│   ├── Navbar.tsx
│   └── ProductCard.tsx
└── data/
    ├── products.ts               # Mock product data
    └── users.ts                  # Mock user data
```

## data-testid Coverage

Every interactive and meaningful element has a `data-testid` attribute for reliable Playwright selectors. No reliance on text content, CSS classes, or brittle XPath.

---

*Built by [@ViviDickens](https://github.com/ViviDickens) — QA Automation Engineer*
