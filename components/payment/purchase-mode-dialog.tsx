"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { User as UserIcon, Users } from "lucide-react"

type PurchaseTarget =
  | { kind: "course"; id: string; slug?: string }
  | { kind: "learning_path"; id: string; slug?: string }

interface PurchaseModeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: PurchaseTarget
  locale: string
  extraQuery?: Record<string, string | undefined>
}

export function PurchaseModeDialog({ open, onOpenChange, target, locale, extraQuery }: PurchaseModeDialogProps) {
  const router = useRouter()
  const [mode, setMode] = useState<"individual" | "team">("individual")

  const handleContinue = () => {
    const basePath =
      target.kind === "learning_path"
        ? `/${locale}/checkout/learning-path/${target.id}`
        : `/${locale}/checkout/${target.id}`
    const params = new URLSearchParams()
    if (extraQuery) {
      Object.entries(extraQuery).forEach(([k, v]) => { if (v) params.set(k, v) })
    }
    if (mode === "team") params.set("purchaseMode", "team")
    const qs = params.toString()
    const url = qs ? `${basePath}?${qs}` : basePath
    onOpenChange(false)
    router.push(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Pour qui voulez-vous acheter ?</DialogTitle>
          <DialogDescription>
            Vous êtes admin d'une organisation : choisissez si vous achetez pour vous-même ou pour
            votre équipe.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as "individual" | "team")}
          className="gap-3 py-2"
        >
          <Label
            htmlFor="purchase-individual"
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              mode === "individual" ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <RadioGroupItem value="individual" id="purchase-individual" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-slate-700" />
                <span className="font-semibold text-slate-900">Pour moi</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Vous suivrez personnellement ce contenu. Inscription individuelle classique.
              </p>
            </div>
          </Label>

          <Label
            htmlFor="purchase-team"
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              mode === "team" ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <RadioGroupItem value="team" id="purchase-team" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-700" />
                <span className="font-semibold text-slate-900">Pour mon équipe</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Achetez plusieurs sièges et invitez vos collaborateurs. Vous ne serez pas inscrit
                automatiquement vous-même.
              </p>
            </div>
          </Label>
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleContinue}>Continuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
