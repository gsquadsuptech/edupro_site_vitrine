"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string
    className?: string
    onSearch?: (value: string) => void
}

export function SearchInput({ placeholder = "Rechercher...", className, onSearch, ...props }: SearchInputProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [value, setValue] = React.useState(searchParams.get("q") || "")
    const debouncedValue = useDebounce(value, 500)

    // Sync with URL params on mount
    React.useEffect(() => {
        setValue(searchParams.get("q") || "")
    }, [searchParams])

    // Update URL on debounce or call onSearch callback
    React.useEffect(() => {
        if (onSearch) {
            onSearch(debouncedValue)
            return
        }

        const params = new URLSearchParams(searchParams)

        if (debouncedValue) {
            params.set("q", debouncedValue)
        } else {
            params.delete("q")
        }

        // Reset page when searching
        const currentQuery = searchParams.get("q") || ""
        if (debouncedValue.trim() !== currentQuery.trim()) {
            params.set("page", "1")
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [debouncedValue, router, pathname, searchParams, onSearch])

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-10 h-12 text-base"
                placeholder={placeholder}
                {...props}
            />
        </div>
    )
}
