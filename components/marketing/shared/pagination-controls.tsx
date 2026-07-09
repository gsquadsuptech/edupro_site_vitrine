"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from "@/components/ui/pagination"

interface PaginationControlsProps {
    totalCount: number
    pageSize?: number
    siblingCount?: number
    currentPage?: number
    onPageChange?: (page: number) => void
    /**
     * id d'un élément vers lequel remonter après un changement de page (ex. le
     * haut de la liste des résultats). À défaut, on remonte en haut de la page.
     */
    scrollTargetId?: string
}

export function PaginationControls({
    totalCount,
    pageSize = 12,
    siblingCount = 1,
    currentPage: controlledPage,
    onPageChange,
    scrollTargetId
}: PaginationControlsProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Use controlled page if provided, otherwise URL params
    const currentPage = controlledPage !== undefined ? controlledPage : (Number(searchParams.get("page")) || 1)
    const totalPages = Math.ceil(totalCount / pageSize)

    // Don't render if only 1 page
    if (totalPages <= 1) return null

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    // Remonte en douceur vers le haut des résultats : sans cela, la pagination
    // étant en bas de liste, l'utilisateur reste bloqué en bas après changement
    // de page (il ne voit pas les nouveaux items).
    const scrollToResultsTop = () => {
        const el = scrollTargetId ? document.getElementById(scrollTargetId) : null
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const handlePageChange = (page: number, e: React.MouseEvent) => {
        if (onPageChange) {
            e.preventDefault()
            onPageChange(page)
            return
        }

        if (page < 1 || page > totalPages || page === currentPage) return

        // On laisse le navigateur gérer les clics « ouvrir dans un nouvel onglet »
        // (ctrl/cmd/maj + clic, clic du milieu) : le href reste intact.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return

        // Navigation douce (pas de rechargement complet) + remontée en haut.
        e.preventDefault()
        router.push(createPageURL(page), { scroll: false })
        scrollToResultsTop()
    }

    // Generate page numbers array
    const generatePagination = () => {
        const paginationRange = []

        // Always show first page
        paginationRange.push(1)

        // Calculate range around current page
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 2)
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1)

        // Add dots before if needed
        if (leftSiblingIndex > 2) {
            paginationRange.push("...")
        }

        // Add range
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            paginationRange.push(i)
        }

        // Add dots after if needed
        if (rightSiblingIndex < totalPages - 1) {
            paginationRange.push("...")
        }

        // Always show last page if not already added
        if (totalPages > 1 && !paginationRange.includes(totalPages)) {
            paginationRange.push(totalPages)
        }

        return paginationRange
    }

    const pages = generatePagination()

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={onPageChange ? "#" : createPageURL(currentPage - 1)}
                        onClick={(e) => handlePageChange(currentPage - 1, e)}
                        aria-disabled={currentPage <= 1}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {pages.map((page, i) => (
                    <PaginationItem key={i}>
                        {page === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href={onPageChange ? "#" : createPageURL(page as number)}
                                onClick={(e) => typeof page === 'number' && handlePageChange(page, e)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href={onPageChange ? "#" : createPageURL(currentPage + 1)}
                        onClick={(e) => handlePageChange(currentPage + 1, e)}
                        aria-disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
