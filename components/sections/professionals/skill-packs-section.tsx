import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Code2, Briefcase, Building2, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function SkillPacksSection() {
    const t = useTranslations("professionals.skillPacks")

    // We define the structure and keys, but fetch content from translations
    const packKeys = ["tech", "business", "construction"]

    // Static assets mapping
    const assets = {
        tech: {
            icon: Code2,
            image: "/african-professionals-working-with-data-analytics-.jpg",
        },
        business: {
            icon: Briefcase,
            image: "/african-business-team-meeting-discussing-strategy-.jpg",
        },
        construction: {
            icon: Building2,
            image: "/african-construction-professional-using-bim-softwa.jpg",
        },
    }

    return (
        <section id="skill-packs" className="py-20 md:py-32">
            <Container>
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        {t("title")}
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="space-y-12">
                    {packKeys.map((key, index) => {
                        const packKey = key as keyof typeof assets
                        const Icon = assets[packKey].icon
                        const isEven = index % 2 === 0

                        // Access nested arrays using raw or by specific keys if known. 
                        // Since useTranslations doesn't support returning arrays directly in all versions, 
                        // we'll assume standard next-intl usage. If strict type safety is needed for arrays, 
                        // we might need to cast or use `useMessages`. 
                        // However, assuming `t.raw` works for getting objects/arrays:
                        const courses = t.raw(`packs.${key}.courses`) as any[]
                        const highlights = t.raw(`packs.${key}.highlights`) as string[]
                        const jobs = t.raw(`packs.${key}.jobs`) as string[]
                        const testimonial = t.raw(`packs.${key}.testimonial`) as any

                        return (
                            <div
                                key={index}
                                className={`rounded-2xl border border-border overflow-hidden ${isEven ? "bg-gradient-to-r from-primary/5 to-transparent" : "bg-gradient-to-r from-transparent to-chart-2/5"}`}
                            >
                                <div className={`grid gap-8 lg:grid-cols-2 p-8 md:p-12 ${isEven ? "" : "lg:grid-flow-dense"}`}>
                                    {/* Content */}
                                    <div className="space-y-6 flex flex-col justify-center">
                                        <div className="space-y-3">
                                            <div className="inline-flex rounded-lg bg-primary/10 p-3">
                                                <Icon className="h-8 w-8 text-primary" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold">{t(`packs.${key}.title`)}</h3>
                                            <p className="text-lg text-muted-foreground">{t(`packs.${key}.headline`)}</p>
                                        </div>

                                        {/* Courses */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">Parcours inclus:</h4>
                                            <div className="grid gap-2">
                                                {courses.map((course, idx) => (
                                                    <div key={idx} className="flex justify-between items-start text-sm">
                                                        <span className="font-medium">{course.name}</span>
                                                        <div className="text-xs text-muted-foreground text-right">
                                                            <div>{course.duration}</div>
                                                            <div>{course.level}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold uppercase text-sm tracking-wide text-primary">
                                                Ce que vous obtenez:
                                            </h4>
                                            <div className="grid gap-2">
                                                {highlights.map((highlight, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <span className="text-primary">✓</span>
                                                        <span>{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Jobs & Salary */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-lg bg-muted p-3">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Métiers visés</p>
                                                <p className="text-sm font-medium line-clamp-2">{jobs.slice(0, 2).join(", ")}...</p>
                                            </div>
                                            <div className="rounded-lg bg-muted p-3">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Salaires moyens</p>
                                                <p className="text-sm font-medium">{t(`packs.${key}.salary`)}</p>
                                            </div>
                                        </div>

                                        <Button asChild className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
                                            <a href="#signup">
                                                Découvrir ce Skill Pack
                                                <ArrowRight className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>

                                    {/* Testimonial & Image */}
                                    <div className={`space-y-4 flex flex-col ${isEven ? "" : "lg:order-first"}`}>
                                        <div className="relative aspect-video rounded-xl overflow-hidden">
                                            <Image src={assets[packKey].image || "/placeholder.svg"} alt={t(`packs.${key}.title`)} fill className="object-cover" />
                                        </div>

                                        <div className="rounded-xl border border-border bg-card p-4">
                                            <blockquote className="text-sm font-medium italic mb-4">"{testimonial.text}"</blockquote>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary">{testimonial.author.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{testimonial.author}</p>
                                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
