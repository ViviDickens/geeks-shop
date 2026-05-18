import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/geeks-shop',
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
