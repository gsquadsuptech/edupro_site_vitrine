import Link from "next/link"
import { Container } from "@/components/marketing/layout/container"
import { Library, ArrowRight } from "lucide-react"
import type { CatalogListItem } from "@/services/catalog-service"

interface CoCertifiedCatalogsProps {
    catalogs: CatalogListItem[]
    locale: string
}

/**
 * Catalogues CO-CERTIFIÉS publics sur la home marketplace — distincts du
 * « catalogue de formation » (le browse de cours/parcours). Chaque carte mène
 * à la page détail `/catalogues/[slug]`. Masquée s'il n'y a aucun catalogue.
 */
export function CoCertifiedCatalogs({ catalogs, locale }: CoCertifiedCatalogsProps) {
    if (!catalogs || catalogs.length === 0) return null

    return (
        <section className="border-t border-slate-200 bg-white py-16 lg:py-20">
            <Container>
                <div className="mb-10 max-w-2xl">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                        <Library className="h-4 w-4" />
                        Catalogues co-certifiés
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">
                        Des programmes certifiants en partenariat
                    </h2>
                    <p className="mt-3 text-lg text-slate-600">
                        Des collections de formations co-certifiées avec nos instituts partenaires,
                        distinctes de notre catalogue de formations à l'unité.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {catalogs.map((catalog) => (
                        <Link
                            key={catalog.slug}
                            href={`/${locale}/catalogues/${catalog.slug}`}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-100 to-fuchsia-100">
                                {catalog.cover_image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={catalog.cover_image_url}
                                        alt={catalog.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-indigo-400">
                                        <Library className="h-12 w-12" />
                                    </div>
                                )}
                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
                                    Co-certifié
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {catalog.title}
                                </h3>
                                {catalog.description && (
                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                        {catalog.description}
                                    </p>
                                )}
                                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                                    Découvrir le catalogue
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    )
}
