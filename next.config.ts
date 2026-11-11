import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts' // Specify path if not default './i18n.ts'
);

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  images: {
    // Les URLs Supabase sont horodatées (un nouveau dépôt = une nouvelle URL) :
    // une variante optimisée peut donc être gardée longtemps. Par défaut (60 s)
    // le serveur (2 vCPU) re-redimensionnerait sans cesse des originaux de
    // plusieurs Mo.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG || 'algorix-solutions',
  project: process.env.SENTRY_PROJECT || 'edupro-vitrine',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Source maps envoyées seulement si un jeton est fourni au build (secret
  // BuildKit, cf. Dockerfile) ; sinon le build reste identique.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  silent: !process.env.CI,
  telemetry: false,
  // Envoi via le site lui-même : les bloqueurs de pub coupent sinon *.sentry.io.
  // Exclu du middleware next-intl (middleware.ts).
  tunnelRoute: '/monitoring',
  // Le site est d'abord consulté sur mobile : on retire du bundle client tout
  // ce qui sert au suivi de performance (traces désactivées) et aux logs du SDK.
  webpack: {
    treeshake: { removeDebugLogging: true, removeTracing: true },
  },
});
