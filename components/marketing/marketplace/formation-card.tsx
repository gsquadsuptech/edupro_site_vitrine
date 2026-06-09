"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, Users, Clock, Heart, BookOpen, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Course, LearningPath, MarketplaceItem } from "@/lib/supabase/types"
import { useWishlist } from "@/hooks/use-wishlist"

type FormationCardProps =
  | { item: MarketplaceItem; course?: never; badge?: string }
  | {
      item?: never
      course: Pick<Course,
        'id' | 'slug' | 'title' | 'image_url' | 'category' | 'instructor' | 'level' | 'price' |
        'duration' | 'format' | 'one_time_price' | 'monthly_price' | 'pricing_modes' |
        'registration_fee' | 'monthly_fee' | 'installments'
      > & {
        rating?: number
        reviewCount?: number
        enrolled_count?: number
        badge?: string
        has_varying_prices?: boolean
      }
      badge?: string
    }

interface CardViewModel {
  id: string
  href: string
  title: string
  imageUrl: string
  categoryLabel: string
  level: string | null
  rating: number
  reviewCount: number
  enrolledCount: number
  duration: string | null
  /** Affiché au-dessus du titre (catégorie ou métadonnée principale). */
  topBadgeLabel: string
  /** Sous-titre : nom d'instructeur pour les cours, "N cours" pour les parcours. */
  subtitle: string
  /** Icône à gauche du sous-titre. */
  subtitleIcon: typeof Users
  /** Indique s'il faut afficher le toggle wishlist (pas de wishlist LP en V1). */
  supportsWishlist: boolean
  pricing: {
    pricing_modes: any
    price: number
    monthly_price: number | null
    registration_fee: number | null
    monthly_fee: number | null
    installments: any[] | null
    has_varying_prices: boolean
  }
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  high: 'Avancé',
  advanced: 'Avancé',
}

function buildCourseViewModel(course: Course, locale: string): CardViewModel {
  return {
    id: course.id,
    href: `/${locale}/formation/${course.slug}`,
    title: course.title,
    imageUrl: course.image_url || "/placeholder.svg",
    categoryLabel: course.category?.name || "Général",
    level: course.level,
    rating: course.rating ?? 0,
    reviewCount: course.reviewCount || 0,
    enrolledCount: course.enrolled_count || 0,
    duration: course.duration,
    topBadgeLabel: course.category?.name || "Général",
    // Si aucun formateur n'est assigné, on affiche l'institut propriétaire.
    subtitle: course.instructor
      ? (course.instructor.is_institute
          ? (course.instructor.institute || course.instructor.name)
          : course.instructor.name)
      : "Institut",
    subtitleIcon: course.instructor?.is_institute ? Building2 : Users,
    supportsWishlist: true,
    pricing: {
      pricing_modes: course.pricing_modes,
      price: course.price || 0,
      monthly_price: course.monthly_price,
      registration_fee: course.registration_fee,
      monthly_fee: course.monthly_fee,
      installments: course.installments,
      has_varying_prices: !!course.has_varying_prices,
    },
  }
}

function buildLearningPathViewModel(lp: LearningPath, locale: string): CardViewModel {
  const coursesCount = lp.courses_count || lp.courses?.length || 0
  return {
    id: lp.id,
    href: `/${locale}/parcours/${lp.slug}`,
    title: lp.title,
    imageUrl: lp.image_url || "/placeholder.svg",
    categoryLabel: 'Parcours',
    level: lp.level ?? null,
    rating: lp.rating ?? 0,
    reviewCount: lp.reviewCount || 0,
    enrolledCount: lp.enrolled_count || 0,
    duration: lp.duration ?? null,
    topBadgeLabel: 'Parcours',
    subtitle: coursesCount > 0 ? `${coursesCount} cours` : 'Programme complet',
    subtitleIcon: BookOpen,
    supportsWishlist: false,
    pricing: {
      pricing_modes: lp.pricing_modes ?? null,
      price: lp.price || 0,
      monthly_price: lp.monthly_price ?? null,
      registration_fee: lp.registration_fee ?? null,
      monthly_fee: null,
      installments: lp.installments ?? null,
      has_varying_prices: false,
    },
  }
}

function renderPriceBlock(pricing: CardViewModel['pricing']) {
  const modes = pricing.pricing_modes || {}
  const hasOneTime = modes.one_time || modes.oneTime
  const hasSubscription = modes.subscription
  const hasRegistrationMonthly = modes.registration_monthly || modes.registrationMonthly
  const hasInstallments = modes.installments
  const price = pricing.price

  let label = pricing.has_varying_prices ? 'À partir de' : 'Prix'
  if (!pricing.has_varying_prices) {
    if (modes.subscription && !modes.one_time && !modes.oneTime) label = 'Abonnement'
    else if (hasRegistrationMonthly) label = 'Inscription + Mensualités'
  }

  let priceDisplay: string
  if (hasOneTime && price > 0) {
    priceDisplay = `${Math.round(Number(price)).toLocaleString()} FCFA`
  } else if (hasSubscription && pricing.monthly_price) {
    priceDisplay = `${pricing.monthly_price.toLocaleString()} FCFA/mois`
  } else if (hasRegistrationMonthly && pricing.registration_fee) {
    priceDisplay = `${pricing.registration_fee.toLocaleString()} FCFA`
  } else if (hasInstallments && pricing.installments && pricing.installments.length > 0) {
    const total = pricing.installments.reduce((acc: number, inst: any) => acc + (Number(inst.amount) || 0), 0)
    priceDisplay = `${Math.round(total).toLocaleString()} FCFA`
  } else {
    priceDisplay = Number(price) >= 1 ? `${Math.round(Number(price)).toLocaleString()} FCFA` : 'Gratuit'
  }

  let secondary: string | null = null
  if ((modes.one_time || modes.oneTime) && modes.subscription && pricing.monthly_price) {
    secondary = `ou ${pricing.monthly_price.toLocaleString()} FCFA/mois`
  } else if (hasRegistrationMonthly && pricing.monthly_fee) {
    secondary = `+ ${pricing.monthly_fee.toLocaleString()} FCFA/mois`
  } else if (hasInstallments && pricing.installments && pricing.installments.length > 0 && !(modes.one_time || modes.oneTime)) {
    secondary = `en ${pricing.installments.length} versements`
  }

  return { label, priceDisplay, secondary }
}

export function FormationCard(props: FormationCardProps) {
  const { badge } = props
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'

  const normalizedItem: MarketplaceItem = props.item
    ? props.item
    : { kind: 'course', data: props.course as Course }

  const effectiveBadge = badge ?? (normalizedItem.kind === 'course'
    ? (props as any).course?.badge
    : undefined)

  const vm = normalizedItem.kind === 'course'
    ? buildCourseViewModel(normalizedItem.data, locale)
    : buildLearningPathViewModel(normalizedItem.data, locale)

  const { label: priceLabel, priceDisplay, secondary } = renderPriceBlock(vm.pricing)
  const SubtitleIcon = vm.subtitleIcon

  const { isWishlisted, toggle } = useWishlist(vm.supportsWishlist ? vm.id : undefined)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  return (
    <Link href={vm.href}>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={vm.imageUrl}
            alt={vm.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {normalizedItem.kind === 'learning_path' && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground shadow">Parcours</Badge>
          )}
          {effectiveBadge && (
            <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground">{effectiveBadge}</Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="font-medium">
              {vm.topBadgeLabel}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {LEVEL_LABELS[vm.level || ''] || vm.level || 'Tous niveaux'}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight group-hover:underline">
            {vm.title}
          </h3>

          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <SubtitleIcon className="h-3.5 w-3.5" />
            <span>{vm.subtitle}</span>
          </div>

          <div className="mb-3 flex items-center gap-1 min-h-[20px]">
            {vm.reviewCount > 0 && (
              <>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(vm.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{vm.rating}</span>
                <span className="text-sm text-muted-foreground">({vm.reviewCount} avis)</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <div>
              <div className="text-xs text-muted-foreground font-medium">{priceLabel}</div>
              <div className="text-lg font-bold">{priceDisplay}</div>
              {secondary && <div className="text-xs text-muted-foreground">{secondary}</div>}
            </div>
            <div className="flex gap-1">
              {vm.supportsWishlist && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 ${isWishlisted ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
                  onClick={toggleWishlist}
                  aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{vm.enrolledCount.toLocaleString()} inscrits</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{vm.duration || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
