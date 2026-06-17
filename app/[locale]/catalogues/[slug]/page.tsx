import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/marketing/layout/container"
import { Badge } from "@/components/ui/badge"
import { Route, BookOpen, GraduationCap, ArrowRight, Library } from "lucide-react"
import { CatalogService, type CatalogContentItem } from "@/services/catalog-service"

const LEVEL_LABELS: Record<string, string> = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    high: "Avancé",
}

function ContentCard({
    item,
    href,
    accent,
}: {
    item: CatalogContentItem
    href: string
    accent: "indigo" | "fuchsia"
}) {
    const ring = accent === "indigo" ? "hover:ring-indigo-400/60" : "hover:ring-fuchsia-400/60"
    return (
        <Link
            href={href}
            className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-2 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${ring}`}
        >
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                        <BookOpen className="h-10 w-10" />
                    </div>
                )}
                {item.level && (
                    <span className="absolute left-3 top-3">
                        <Badge className="border-none bg-white/90 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                            {LEVEL_LABELS[item.level] || item.level}
                        </Badge>
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                    {item.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                    Voir le détail
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </Link>
    )
}

function SectionHeader({ icon: Icon, title, count }: { icon: typeof Route; title: string; count: number }) {
    return (
        <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                <Icon className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">{title}</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{count}</span>
        </div>
    )
}

export default async function CataloguePage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params
    const catalog = await CatalogService.getBySlug(slug)

    if (!catalog) {
        notFound()
    }

    const { title, description, cover_image_url, learning_paths, courses } = catalog
    const isEmpty = learning_paths.length === 0 && courses.length === 0

    return (
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Hero immersif */}
            <section className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-20 text-white lg:py-28">
                <div className="absolute inset-0 z-0">
                    {cover_image_url ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={cover_image_url}
                                alt=""
                                className="h-full w-full object-cover opacity-40"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
                        </>
                    ) : (
                        <>
                            <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-600/30 blur-3xl" />
                            <div
                                className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-fuchsia-600/30 blur-3xl"
                                style={{ animationDelay: "1s" }}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                        </>
                    )}
                </div>

                <Container className="relative z-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge className="mb-5 inline-flex items-center gap-1.5 border-cyan-400/40 bg-cyan-950/40 text-cyan-200">
                            <Library className="h-3.5 w-3.5" />
                            Catalogue co-certifié
                        </Badge>
                        <h1 className="text-balance text-4xl font-black leading-[1.1] lg:text-6xl">{title}</h1>
                        {description && (
                            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
                                {description}
                            </p>
                        )}
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {learning_paths.length > 0 && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                                    <Route className="h-4 w-4 text-indigo-300" />
                                    {learning_paths.length} parcours
                                </span>
                            )}
                            {courses.length > 0 && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
                                    <BookOpen className="h-4 w-4 text-fuchsia-300" />
                                    {courses.length} cours
                                </span>
                            )}
                        </div>
                    </div>
                </Container>
            </section>

            {isEmpty && (
                <section className="py-20">
                    <Container>
                        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                            <p className="font-medium text-slate-900">Contenu bientôt disponible</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Les formations de ce catalogue seront publiées prochainement.
                            </p>
                        </div>
                    </Container>
                </section>
            )}

            {/* Parcours */}
            {learning_paths.length > 0 && (
                <section className="py-16 lg:py-20">
                    <Container>
                        <SectionHeader icon={Route} title="Parcours" count={learning_paths.length} />
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {learning_paths.map((lp) => (
                                <ContentCard
                                    key={lp.id}
                                    item={lp}
                                    href={`/${locale}/parcours/${lp.slug ?? lp.id}`}
                                    accent="indigo"
                                />
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Cours */}
            {courses.length > 0 && (
                <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
                    <Container>
                        <SectionHeader icon={BookOpen} title="Cours" count={courses.length} />
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((c) => (
                                <ContentCard
                                    key={c.id}
                                    item={c}
                                    href={`/${locale}/formation/${c.slug ?? c.id}`}
                                    accent="fuchsia"
                                />
                            ))}
                        </div>
                    </Container>
                </section>
            )}
        </div>
    )
}
