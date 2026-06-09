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
  videoUrl: string | null
}

export function LessonPreviewDialog({ open, onOpenChange, title, videoUrl }: LessonPreviewDialogProps) {
  const youtubeId = videoUrl ? getYoutubeId(videoUrl) : null
  const vimeoId = videoUrl ? getVimeoId(videoUrl) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-base">Aperçu gratuit — {title}</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}
