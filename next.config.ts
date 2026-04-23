import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-b22ac42d7fff403bacb467589b0285f0.r2.dev',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
