import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    serverActions: { bodySizeLimit: '105mb' },
  },
};

export default nextConfig;
