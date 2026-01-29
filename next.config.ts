import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts' // Specify path if not default './i18n.ts'
);

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@formatjs/intl-localematcher'],
  output: 'standalone',
};

export default withNextIntl(nextConfig);
