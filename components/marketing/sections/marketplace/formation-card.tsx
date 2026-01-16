import Link from "next/link"
import { Star, Users, Clock, Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Course } from "@/lib/supabase/types"

interface FormationCardProps {
    course: Course | any // Allow both strict Course and legacy any for now to ease transition
}

export function FormationCard({ course }: FormationCardProps) {
    // Normalize fields between Course type and legacy mock data type
    const thumbnail = course.image_url || course.thumbnail || "/placeholder.svg"
    const enrolledCount = course.enrolledCount || 0
    const monthlyPrice = course.monthlyPrice || 0
    const rating = course.rating || 0
    const reviewCount = course.reviewCount || 0
    const instructorName = typeof course.instructor === 'string' ? course.instructor : course.instructor?.name || 'Instructeur'
    const categoryName = typeof course.category === 'string' ? course.category : course.category?.name || 'Catégorie'
    const duration = course.duration || "N/A"

    return (
        <Link href={`/fr/formation/${course.slug}`}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                        src={thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {course.badge && (
                        <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{course.badge}</Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                    {/* Category & Level */}
                    <div className="mb-2 flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="font-medium">
                            {categoryName}
                        </Badge>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{course.level || 'Tous niveaux'}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:underline">
                        {course.title}
                    </h3>

                    {/* Instructor */}
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{instructorName}</span>
                    </div>

                    {/* Rating */}
                    <div className="mb-3 flex items-center gap-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium">{rating}</span>
                        <span className="text-sm text-muted-foreground">({reviewCount} avis)</span>
                    </div>

                    <div className="mt-auto">
                        {/* Price & Actions */}
                        <div className="flex items-center justify-between border-t border-border pt-3">
                            <div>
                                <div className="text-lg font-bold">{(course.price || 0).toLocaleString()} FCFA</div>
                                {monthlyPrice > 0 && (
                                    <div className="text-xs text-muted-foreground">ou {monthlyPrice.toLocaleString()} FCFA/mois</div>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                    <Bookmark className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            {enrolledCount > 0 && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{enrolledCount.toLocaleString()} inscrits</span>
                                    </div>
                                    <span>•</span>
                                </>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
