import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

import Image, { StaticImageData } from "next/image"

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  company: string
  flag: string
  results: {
    title: string
    items: string[]
  }
  image: string | StaticImageData
}

export function TestimonialCard({ quote, name, role, company, flag, results, image }: TestimonialCardProps) {
  return (
    <Card className="group relative overflow-hidden p-8 transition-all hover:scale-[1.02] hover:shadow-2xl">
      <Quote className="absolute right-4 top-4 h-12 w-12 text-primary/10" />

      <div className="mb-6 flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary/20">
          <Image src={image || "/placeholder.svg"} alt={name} width={80} height={80} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
          <div className="text-sm text-muted-foreground">
            {company} {flag}
          </div>
        </div>
      </div>

      <p className="mb-6 leading-relaxed text-muted-foreground">"{quote}"</p>

      <div className="rounded-lg bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{results.title}</p>
        <ul className="space-y-1">
          {results.items.map((item, idx) => (
            <li key={idx} className="text-sm font-medium">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
