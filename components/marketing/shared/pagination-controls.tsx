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
}

export function PaginationControls({
    totalCount,
    pageSize = 12,
    siblingCount = 1,
    currentPage: controlledPage,
    onPageChange
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

    const handlePageChange = (page: number, e: React.MouseEvent) => {
        if (onPageChange) {
            e.preventDefault()
            onPageChange(page)
        }
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
