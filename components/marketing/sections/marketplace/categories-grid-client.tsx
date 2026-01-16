"use client"

import * as React from "react"
import Link from "next/link"
import { Code, Briefcase, Building2, Users, Heart, TrendingUp, Palette, Languages, Globe, Monitor, GraduationCap, Lightbulb } from "lucide-react"
import { SearchInput } from "@/components/marketing/shared/search-input"
import { PaginationControls } from "@/components/marketing/shared/pagination-controls"

interface Category {
    id: string
    name: string
    slug: string
    icon: any
    count: number
    color: string
}

interface CategoriesGridClientProps {
    initialCategories: Category[]
    locale?: string
}

export function CategoriesGridClient({ initialCategories, locale = 'fr' }: CategoriesGridClientProps) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const pageSize = 12

    // Reset page when search changes
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Filter Categories
    const filteredCategories = React.useMemo(() => {
        if (!searchTerm) return initialCategories

        const lowerTerm = searchTerm.toLowerCase()
        return initialCategories.filter(cat =>
            cat.name.toLowerCase().includes(lowerTerm)
        )
    }, [initialCategories, searchTerm])

    // Paginate
    const paginatedCategories = React.useMemo(() => {
        const from = (currentPage - 1) * pageSize
        const to = from + pageSize
        return filteredCategories.slice(from, to)
    }, [filteredCategories, currentPage, pageSize])

    const totalCount = filteredCategories.length

    return (
        <section className="py-16 md:py-20" id="categories-grid">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="mb-3 text-3xl font-bold md:text-4xl">Explorez par Catégorie</h2>
                    <p className="text-lg text-muted-foreground">Trouvez la formation qui correspond à vos objectifs</p>
                </div>

                <div className="mb-8 flex justify-center">
                    <SearchInput
                        className="w-full max-w-md"
                        placeholder="Rechercher une catégorie..."
                        onSearch={(value) => setSearchTerm(value)}
                    />
                </div>

                {paginatedCategories.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {paginatedCategories.map((category, index) => (
                            <Link key={`${category.slug}-${index}`} href={`/${locale}/catalogue/${category.slug}`}>
                                <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                                    <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${category.color} p-3`}>
                                        <category.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{category.name}</h3>
                                    <p className="text-sm text-muted-foreground">{category.count} cours</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-muted-foreground">
                        Aucune catégorie trouvée pour "{searchTerm}".
                    </div>
                )}

                <div className="mt-8">
                    <PaginationControls
                        totalCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </section>
    )
}
