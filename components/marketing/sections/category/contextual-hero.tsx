"use client"

import { SearchInput } from "@/components/marketing/shared/search-input"
import { Globe, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRef } from "react"
import { Category } from "@/lib/supabase/types"

// Image de fond par défaut (catégorie sans image définie en superadmin).
const DEFAULT_IMAGE = "/african-corporate-team-training-session.jpg"

interface ContextualHeroProps {
    categorySlug?: string
    locale?: string
    categories?: Category[]
}

export function ContextualHero({ categorySlug, locale = 'fr', categories = [] }: ContextualHeroProps) {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    // Défilement horizontal de la liste des catégories via les flèches latérales.
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollBy = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        // On défile d'environ 80% de la largeur visible pour garder un repère.
        const amount = el.clientWidth * 0.8;
        el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    // Le fond varie selon la catégorie active, piloté par marketplace_categories.image_url.
    const activeCategory = categories.find(c => c.slug === currentCategory);
    const backgroundImage = activeCategory?.image_url || DEFAULT_IMAGE;

    return (
        <section className="relative overflow-hidden bg-slate-900 text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="h-full w-full object-cover opacity-40 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-4 py-16 md:px-6 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        {activeCategory ? `Formations en ${activeCategory.name}` : "Développez vos compétences"}
                    </h1>

                    <div className="mx-auto mb-12 max-w-2xl">
                        <SearchInput
                            className="h-12 w-full bg-slate-900/50 text-white placeholder:text-white/70 backdrop-blur-sm border-white/20 focus-visible:bg-slate-900/60"
                            placeholder="Que souhaitez-vous apprendre aujourd'hui ?"
                        />
                    </div>

                    {/* Horizontal Categories Scroll */}
                    <div className="relative">
                        {/* Flèche gauche — indique que la liste est défilable.
                            Centrée sur la hauteur des cartes (h-24 = 96px → top-12). */}
                        <button
                            type="button"
                            aria-label="Catégories précédentes"
                            onClick={() => scrollBy('left')}
                            className="absolute left-0 top-12 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-700 md:flex"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div ref={scrollRef} className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-2 pb-4 text-left">
                        <Link
                            href={`/${locale}/catalogue/all`}
                            className={`snap-start shrink-0 cursor-pointer rounded-xl border transition-all hover:bg-white/20 overflow-hidden relative ${currentCategory === 'all' ? 'bg-white/20 border-primary' : 'bg-white/5 border-transparent'}`}
                        >
                            <div className="flex h-24 w-32 flex-col items-center justify-center gap-2">
                                <Globe className="h-8 w-8 text-blue-400" />
                                <span className="text-sm font-medium">Tout voir</span>
                            </div>
                        </Link>

                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/${locale}/catalogue/all?category=${category.slug}`}
                                className={`snap-start shrink-0 cursor-pointer rounded-xl border overflow-hidden relative transition-all hover:scale-105 ${currentCategory === category.slug ? 'border-primary ring-2 ring-primary' : 'border-transparent'}`}
                            >
                                <div className="relative h-24 w-32">
                                    <img src={category.image_url || DEFAULT_IMAGE} alt={category.name} loading="lazy" className="h-full w-full object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                                        <span className="text-sm font-bold text-center leading-tight">{category.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        </div>

                        {/* Flèche droite — indique que la liste est défilable. */}
                        <button
                            type="button"
                            aria-label="Catégories suivantes"
                            onClick={() => scrollBy('right')}
                            className="absolute right-0 top-12 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/90 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-700 md:flex"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
