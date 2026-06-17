import Link from "next/link"
import { Container } from "@/components/marketing/layout/container"
import { Library, ArrowRight } from "lucide-react"
import type { CatalogSummary } from "@/services/catalog-service"

interface CatalogBelongsSectionProps {
    catalogs: CatalogSummary[]
    locale: string
    /** Adapte le libellé : « Ce parcours… » vs « Ce cours… ». */
    kind?: "parcours" | "cours"
}

/**
 * Liste les catalogues publics auxquels un parcours ou un cours appartient
 * (relation N–N). Masquée si l'élément n'appartient à aucun catalogue public.
 */
export function CatalogBelongsSection({ catalogs, locale, kind = "parcours" }: CatalogBelongsSectionProps) {
    if (!catalogs || catalogs.length === 0) return null

    const noun = kind === "cours" ? "Ce cours" : "Ce parcours"
    const title = catalogs.length > 1
        ? `${noun} fait partie de ces catalogues`
        : `${noun} fait partie d'un catalogue`

    return (
        <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
            <Container>
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-2xl font-bold text-slate-900 lg:text-3xl">{title}</h2>
                    <p className="mx-auto max-w-2xl text-slate-600">
                        Découvrez l'ensemble des formations regroupées avec {kind === "cours" ? "ce cours" : "ce parcours"}.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {catalogs.map((catalog) => (
                        <Link
                            key={catalog.slug}
                            href={`/${locale}/catalogues/${catalog.slug}`}
                            className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-lg"
                        >
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50">
                                {catalog.cover_image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={catalog.cover_image_url}
                                        alt={catalog.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Library className="h-7 w-7 text-indigo-500" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-600">
                                    {catalog.title}
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm text-indigo-600">
                                    Découvrir le catalogue
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    )
}

/** @deprecated Utiliser `CatalogBelongsSection`. Conservé pour compat d'import. */
export const ParcoursCatalogs = CatalogBelongsSection
