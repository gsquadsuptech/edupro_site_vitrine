import "server-only"

/**
 * Lecture des catalogues PUBLICS via l'API SaaS (clé `x-api-key`).
 *
 * Les catalogues vivent dans la base SaaS et constituent une entité B2B
 * sensible : on ne lit jamais la base en direct depuis la vitrine (cf. enroll/
 * cadeau). L'API SaaS applique le filtre `is_public` et la projection publique.
 * `server-only` garantit que la clé API n'est jamais embarquée côté navigateur.
 */

// SAAS_URL n'est pas un secret (simple URL de base, déjà publique côté SaaS).
// La clé API, elle, est STRICTEMENT serveur : pas de fallback NEXT_PUBLIC_*
// (qui serait inliné dans le bundle navigateur par Next.js → fuite de secret).
const SAAS_URL = process.env.SAAS_API_URL || process.env.NEXT_PUBLIC_SAAS_URL
const SAAS_API_KEY = process.env.MARKETPLACE_API_KEY

export interface CatalogContentItem {
    id: string
    title: string
    slug?: string
    image_url: string | null
    level: string | null
}

export interface CatalogDetail {
    title: string
    slug: string
    description: string | null
    cover_image_url: string | null
    learning_paths: CatalogContentItem[]
    courses: CatalogContentItem[]
}

export interface CatalogSummary {
    slug: string
    title: string
    cover_image_url: string | null
}

export interface CatalogListItem extends CatalogSummary {
    description: string | null
}

export const CatalogService = {
    async getBySlug(slug: string): Promise<CatalogDetail | null> {
        if (!SAAS_URL || !SAAS_API_KEY) {
            console.error("CatalogService: configuration SAAS incomplète")
            return null
        }
        try {
            const res = await fetch(
                `${SAAS_URL}/api/marketplace/catalogs/${encodeURIComponent(slug)}`,
                { headers: { "x-api-key": SAAS_API_KEY }, next: { revalidate: 300 } },
            )
            if (!res.ok) return null
            const data = await res.json()
            if (!data?.catalog) return null
            return {
                title: data.catalog.title,
                slug: data.catalog.slug,
                description: data.catalog.description ?? null,
                cover_image_url: data.catalog.cover_image_url ?? null,
                learning_paths: Array.isArray(data.learning_paths) ? data.learning_paths : [],
                courses: Array.isArray(data.courses) ? data.courses : [],
            }
        } catch (error) {
            console.error("CatalogService.getBySlug:", error)
            return null
        }
    },

    async getByLearningPath(learningPathId: string): Promise<CatalogSummary[]> {
        return fetchCatalogSummaries(`by-learning-path/${encodeURIComponent(learningPathId)}`, "getByLearningPath")
    },

    async getByCourse(courseId: string): Promise<CatalogSummary[]> {
        return fetchCatalogSummaries(`by-course/${encodeURIComponent(courseId)}`, "getByCourse")
    },

    /** Liste les catalogues co-certifiés publics (pour la home marketplace). */
    async getPublicCatalogs(): Promise<CatalogListItem[]> {
        if (!SAAS_URL || !SAAS_API_KEY) return []
        try {
            const res = await fetch(`${SAAS_URL}/api/marketplace/catalogs`, {
                headers: { "x-api-key": SAAS_API_KEY },
                next: { revalidate: 300 },
            })
            if (!res.ok) return []
            const data = await res.json()
            return Array.isArray(data?.catalogs) ? data.catalogs : []
        } catch (error) {
            console.error("CatalogService.getPublicCatalogs:", error)
            return []
        }
    },
}

async function fetchCatalogSummaries(path: string, label: string): Promise<CatalogSummary[]> {
    if (!SAAS_URL || !SAAS_API_KEY) return []
    try {
        const res = await fetch(`${SAAS_URL}/api/marketplace/catalogs/${path}`, {
            headers: { "x-api-key": SAAS_API_KEY },
            next: { revalidate: 300 },
        })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data?.catalogs) ? data.catalogs : []
    } catch (error) {
        console.error(`CatalogService.${label}:`, error)
        return []
    }
}
