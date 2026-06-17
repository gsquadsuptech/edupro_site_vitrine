/**
 * Normalise une URL YouTube en URL d'embed (`https://www.youtube.com/embed/ID`).
 *
 * Côté SaaS, `preview_video` est déjà normalisé en embed à la saisie, mais on
 * reste défensif côté vitrine au cas où un ancien enregistrement contiendrait
 * une URL brute (`watch?v=`, `youtu.be/`) ou déjà un embed.
 *
 * Retourne `null` si l'URL est vide ou non reconnue comme une vidéo YouTube.
 */
export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
    if (!url) return null

    // Déjà une URL d'embed
    const embed = url.match(/youtube\.com\/embed\/([\w-]+)/)
    if (embed) return `https://www.youtube.com/embed/${embed[1]}`

    // youtu.be/ID
    const short = url.match(/youtu\.be\/([\w-]+)/)
    if (short) return `https://www.youtube.com/embed/${short[1]}`

    // ...watch?v=ID (ou tout paramètre v=)
    const watch = url.match(/[?&]v=([\w-]+)/)
    if (watch) return `https://www.youtube.com/embed/${watch[1]}`

    return null
}
