"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Gift, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface GiftDialogProps {
  courseId: string
  courseTitle: string
  courseSlug: string
}

export function GiftDialog({ courseId, courseTitle, courseSlug }: GiftDialogProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipientEmail) {
      toast.error("Renseignez l'email du destinataire")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, courseSlug, recipientName, recipientEmail, message, locale }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // Cadeau payant → URL de paiement ; cadeau gratuit → page de retour.
        if (data.redirectUrl) {
          toast.success("Redirection en cours...")
          window.location.href = data.redirectUrl
          return
        }
        toast.success("Cadeau créé !")
        setOpen(false)
        setRecipientName("")
        setRecipientEmail("")
        setMessage("")
      } else {
        toast.error(data.message || "Une erreur est survenue.")
      }
    } catch {
      toast.error("Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 text-primary transition-all">
          <Gift className="mr-2 h-4 w-4" />
          Offrir en cadeau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Offrir cette formation</DialogTitle>
          <DialogDescription>
            « {courseTitle} » — le destinataire recevra un lien pour activer son accès.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift-name">Nom du destinataire</Label>
            <Input
              id="gift-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Prénom Nom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gift-email">Email du destinataire *</Label>
            <Input
              id="gift-email"
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="destinataire@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gift-message">Message (optionnel)</Label>
            <Textarea
              id="gift-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message personnel..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gift className="mr-2 h-4 w-4" />}
              Continuer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
