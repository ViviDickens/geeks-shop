# Geeks Shop - E2E Test Automation Suite

End-to-end test automation project for a demo e-commerce application built with Next.js and tested with Playwright.

The goal of this project is to showcase a maintainable QA automation framework using Page Object Model, reusable test structure, CI execution, and coverage for the main user flows of an e-commerce site.

## Test Coverage

The suite includes tests for:

* Smoke validation
* Navigation flows
* Content rendering
* Product listing and product detail pages
* Cart page validation
* Accessibility checks
* Basic API/status validation
* Visual regression checks

## Tech Stack

* Playwright Test
* TypeScript
* Next.js
* GitHub Actions
* HTML reports

## Project Structure

```bash
geeks-shop/
├── src/
│   ├── app/
│   ├── components/
│   └── data/
├── tests/
│   ├── pages/
│   ├── smoke/
│   ├── navigation/
│   ├── content/
│   ├── api/
│   ├── a11y/
│   └── visual/
├── .github/workflows/
├── playwright.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Running the Project

```bash
npm ci
npx playwright install
npm run test:e2e
```

## Running Specific Suites

```bash
npm run test:smoke
npm run test:navigation
npm run test:content
npm run test:api
npm run test:a11y
npm run test:visual
```

## Page Object Model

The test framework follows the Page Object Model pattern to keep tests readable and maintainable.

Main page objects:

* HomePage
* ProductsPage
* ProductDetailPage
* CartPage

## CI/CD

The project includes a GitHub Actions workflow to run Playwright tests automatically and publish test artifacts such as reports and failure evidence.

## Purpose

This repository is part of my QA Automation / SDET portfolio and demonstrates:

* E2E automation with Playwright
* Test organization by feature area
* Reusable page objects
* Basic accessibility and visual checks
* CI integration
* Maintainable test design for a web application

## Author

Viviana Pérez
SDET | QA Automation Engineer | AI Quality & Security Engineering