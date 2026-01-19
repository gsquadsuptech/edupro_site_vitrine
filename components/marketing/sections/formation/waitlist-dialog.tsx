"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"

interface WaitlistDialogProps {
    courseId: string
    courseTitle: string
    cohortId?: string
}

export function WaitlistDialog({ courseId, courseTitle, cohortId }: WaitlistDialogProps) {
    const [email, setEmail] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call or Server Action
        // In a real app, call registerForWaitlist(courseId, email, cohortId)
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Reset and success
        setLoading(false)
        setSuccess(true)
        setTimeout(() => {
            setOpen(false)
            setSuccess(false)
            setEmail("")
        }, 2000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-4 w-full bg-orange-600 hover:bg-orange-700 text-lg text-white">
                    <Bell className="mr-2 h-5 w-5" />
                    M'avertir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Être informé des prochaines sessions</DialogTitle>
                    <DialogDescription>
                        Ce cours est actuellement complet ou indisponible. Laissez votre email pour être notifié en priorité de la prochaine ouverture.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-green-600">
                        <Bell className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-medium">C'est noté !</h3>
                        <p className="text-sm text-gray-500">Vous recevrez un email dès que les inscriptions ouvriront.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Enregistrement..." : "M'avertir"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
