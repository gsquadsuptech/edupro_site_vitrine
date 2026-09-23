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
  // Next ne transpile pas node_modules par defaut : on le lui demande ici
  // pour les paquets livres avec une syntaxe trop recente pour iOS 14-16.
  // - intl-messageformat (via next-intl) : blocs `static { }` (ES2022),
  //   refuses par Safari < 16.4 -> SyntaxError au chargement du layout, donc
  //   « Application error » sur toutes les pages (iPhone 7 Plus, iOS 15).
  // - zod : operateur `??=` (ES2021), refuse par Safari < 14.
  // `npm run check:es` verifie les chunks produits (cible ES2021).
  transpilePackages: ['zod', 'intl-messageformat'],
  outputFileTracingRoot: __dirname,
};

export default withNextIntl(nextConfig);
