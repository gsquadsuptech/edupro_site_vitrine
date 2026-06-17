"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { getYoutubeEmbedUrl } from "@/lib/youtube"

interface ParcoursHeroMediaProps {
    imageUrl: string
    title: string
    previewVideo?: string | null
}

/**
 * Média du hero parcours : image de couverture par défaut, et si une vidéo de
 * présentation existe, l'image sert de poster avec un bouton Play. La vidéo
 * YouTube (iframe) n'est insérée qu'au clic — on évite ainsi de charger YouTube
 * (et ses cookies tiers) à chaque affichage de la page.
 */
export function ParcoursHeroMedia({ imageUrl, title, previewVideo }: ParcoursHeroMediaProps) {
    const embedUrl = getYoutubeEmbedUrl(previewVideo)
    const [playing, setPlaying] = React.useState(false)

    if (embedUrl && playing) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                    src={`${embedUrl}?autoplay=1`}
                    title={title}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                />
            </div>
        )
    }

    return (
        <div className="relative">
            <Image src={imageUrl} alt={title} width={800} height={600} className="rounded-xl" />
            {embedUrl && (
                <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label="Lire la vidéo de présentation"
                    className="group absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 transition-colors hover:bg-black/30"
                >
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-2xl transition-transform group-hover:scale-110">
                        <Play className="ml-1 h-9 w-9 text-indigo-600" fill="currentColor" />
                    </span>
                </button>
            )}
        </div>
    )
}
