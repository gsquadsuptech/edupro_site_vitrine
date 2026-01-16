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
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
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

