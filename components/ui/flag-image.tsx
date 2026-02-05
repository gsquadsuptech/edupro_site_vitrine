import Image from "next/image"
import { cn } from "@/lib/utils"

interface FlagImageProps {
    countryCode: string
    alt?: string
    className?: string
    width?: number
    height?: number
}

/**
 * A component to display country flags using SVG images from flagcdn.com.
 * This ensures consistent display across all browsers and operating systems, 
 * especially on Windows which lacks native support for flag emojis.
 */
export function FlagImage({
    countryCode,
    alt,
    className,
    width = 24,
    height = 18
}: FlagImageProps) {
    if (!countryCode) return null

    // Special case for emojis (mapping common ones used in the project)
    const emojiMap: Record<string, string> = {
        "🇸🇳": "sn",
        "🇨🇮": "ci",
        "🇷🇼": "rw",
        "🇲🇱": "ml",
        "🇧🇯": "bj",
        "🇧🇫": "bf",
        "🇨🇲": "cm",
        "🇬🇦": "ga"
    }

    const code = emojiMap[countryCode] || countryCode.toLowerCase()

    // Special case for "autre" or invalid codes
    if (code === "autre" || code === "all") {
        return (
            <span className={cn("inline-flex items-center justify-center", className)}>
                🌍
            </span>
        )
    }

    // flagcdn.com uses lowercase 2-letter ISO codes
    const src = `https://flagcdn.com/w80/${code}.png`

    return (
        <div className={cn("relative inline-flex items-center overflow-hidden rounded-sm border border-border/50", className)}>
            <img
                src={src}
                alt={alt || `Drapeau ${countryCode}`}
                width={width}
                height={height}
                className="object-cover"
                loading="lazy"
            />
        </div>
    )
}
