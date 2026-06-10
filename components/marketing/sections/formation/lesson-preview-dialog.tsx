"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function getYoutubeId(url: string): string | null {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

function getVimeoId(url: string): string | null {
  if (!url) return null
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

interface LessonPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  type?: string
  videoUrl: string | null
  articleHtml?: string | null
}

/**
 * Construit le document d'une iframe sandboxée pour afficher l'article.
 * Le HTML est saisi par l'instructeur (non fiable) : la sandbox SANS
 * `allow-scripts` neutralise tout JS (scripts, handlers inline type onerror) →
 * pas de XSS, sans dépendance de sanitisation.
 */
function buildArticleSrcDoc(html: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<style>` +
    `*{box-sizing:border-box}` +
    `body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#18181b;` +
    `line-height:1.65;font-size:15px;margin:0;padding:20px 22px}` +
    `h1,h2,h3,h4{line-height:1.3;margin:1.2em 0 .5em}` +
    `p,ul,ol{margin:.6em 0}ul,ol{padding-left:1.4em}` +
    `img{max-width:100%;height:auto;border-radius:8px}` +
    `a{color:#2563eb}` +
    `code{background:#f4f4f5;border-radius:4px;padding:2px 5px;font-size:.9em}` +
    `pre{background:#f4f4f5;border-radius:8px;padding:14px;overflow:auto}` +
    `pre code{background:none;padding:0}` +
    `table{border-collapse:collapse;width:100%}td,th{border:1px solid #e4e4e7;padding:6px 10px}` +
    `blockquote{border-left:3px solid #e4e4e7;margin:.6em 0;padding-left:14px;color:#52525b}` +
    `</style></head><body>${html}</body></html>`
}

export function LessonPreviewDialog({ open, onOpenChange, title, type, videoUrl, articleHtml }: LessonPreviewDialogProps) {
  const isArticle = type === 'article'
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null
  const vimeoId = videoUrl ? getVimeoId(videoUrl) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-base">Aperçu gratuit — {title}</DialogTitle>
        </DialogHeader>
        {isArticle ? (
          articleHtml ? (
            <iframe
              // sandbox vide = JS désactivé → rendu HTML sûr (cf. buildArticleSrcDoc)
              sandbox=""
              className="h-[60vh] w-full border-0 bg-white"
              srcDoc={buildArticleSrcDoc(articleHtml)}
              title={title}
            />
          ) : (
            <div className="flex h-40 items-center justify-center px-6 text-center text-sm text-muted-foreground">
              L'aperçu de cette leçon n'est pas disponible.
            </div>
          )
        ) : (
          <div className="aspect-video w-full bg-black">
            {youtubeId ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : vimeoId ? (
              <iframe
                className="h-full w-full"
                src={`https://player.vimeo.com/video/${vimeoId}`}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl ? (
              <video className="h-full w-full" src={videoUrl} controls autoPlay playsInline />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/70">
                L'aperçu vidéo de cette leçon n'est pas disponible.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
