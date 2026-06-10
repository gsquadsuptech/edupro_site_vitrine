import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // Créer une copie pour ne pas modifier l'original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Échanger les éléments
  }
  return newArray;
}

export function fixSupabaseImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;

  // Fix incorrect Supabase domain URLs
  const incorrectDomains = [
    'imqcovjqgafepfloargb.supabase.co',
    'endvlxwxhdjjswumpkvk.supabase.co'
  ];

  const correctDomain = 'jvkcfmjkfalwlncpxenh.supabase.co';

  let fixedUrl = url;
  for (const incorrectDomain of incorrectDomains) {
    if (fixedUrl.includes(incorrectDomain)) {
      fixedUrl = fixedUrl.replace(incorrectDomain, correctDomain);
      break;
    }
  }

  return fixedUrl;
}

export function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    // Format français : "15 mars 2024 à 14:30"
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return "Date invalide";
  }
}

export function sanitizeFileName(fileName: string): string {
  // Extraire l'extension du fichier
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

  // Nettoyer le nom de fichier
  const sanitizedName = name
    .toLowerCase()
    // Remplacer les caractères spéciaux et accents par leurs équivalents ASCII
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '') // Supprimer les diacritiques (marques combinantes)
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
    .replace(/^-|-$/g, '') // Supprimer les tirets en début et fin
    .substring(0, 50); // Limiter la longueur

  // Générer un timestamp pour éviter les conflits
  const timestamp = Date.now();

  // Retourner le nom nettoyé avec timestamp et extension
  return `${sanitizedName}-${timestamp}${extension}`;
}


// Builds a URL to the SaaS application (dashboard).
// NEXT_PUBLIC_SAAS_URL is baked into the client bundle at build time (see
// Dockerfile + .github/workflows/deploy.yml), so we trust it directly.
// Sessions are shared via the .edupro.africa cookie domain (see
// lib/supabase/cookie-domain.ts), so no token query param is needed.

/**
 * Normalise une URL externe saisie par un utilisateur (site web institut /
 * formateur) en URL absolue, sûre pour un attribut href.
 *
 * - Un domaine nu comme « www.edupro.africa » est sinon interprété comme un
 *   chemin relatif par le navigateur → 404.
 * - Sécurité : `website_url` est saisi par l'institut/le formateur (contenu non
 *   fiable). On parse via `URL` et on n'autorise QUE http/https/mailto/tel ;
 *   tout autre schéma (javascript:, data:, …) renvoie null → pas de href XSS.
 *
 * Renvoie null si l'entrée est vide, invalide ou à schéma non autorisé.
 */
export function toExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Retire les caractères de contrôle (certains navigateurs tolèrent
  // « \tjavascript: » dans un href) puis les espaces de bord.
  const trimmed = url.replace(/\p{Cc}/gu, '').trim();
  if (!trimmed) return null;
  // Domaine nu (sans schéma) → préfixe https://
  const candidate = /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }
  // Allowlist stricte de schémas : bloque javascript:, data:, etc. (XSS via href).
  const allowed = new Set(['http:', 'https:', 'mailto:', 'tel:']);
  if (!allowed.has(parsed.protocol.toLowerCase())) return null;
  return parsed.toString();
}

export function getAppUrl(path: string = '', _token?: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SAAS_URL
    || process.env.NEXT_PUBLIC_APP_URL
    || 'https://app.edupro.africa';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
