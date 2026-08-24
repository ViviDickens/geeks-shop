import type { NextConfig } from 'next';

// The site is deployed to GitHub Pages as a project page
// (https://vividickens.github.io/geeks-shop/), not at the domain root, so every
// internal link and asset needs the "/geeks-shop" prefix in that build. Locally
// (npm run dev, which Playwright's webServer uses) NODE_ENV is "development",
// so basePath stays empty and http://127.0.0.1:3000 keeps working as-is.
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath: isProd ? '/geeks-shop' : '',
  assetPrefix: isProd ? '/geeks-shop/' : '',
};

export default nextConfig;
