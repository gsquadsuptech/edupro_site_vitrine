import { Container } from "@/components/marketing/layout/container"
import { PricingGrid } from "@/components/marketing/pricing/pricing-grid"
import {
    PlansService,
    type PlanCategoryCode,
    type PlanFamily,
} from "@/services/plans-service"

/**
 * Grille de plans alimentee par le SaaS.
 *
 * Deux consequences directes du branchement sur l'API :
 *
 *  - un plan modifie par un superadmin se reflete ici sans redeploiement ;
 *  - les fonctionnalites heritees sont enumerees nominativement. On n'affiche
 *    plus « Tout BUSINESS Essentials + », qui obligeait le prospect a aller
 *    lire une autre carte pour savoir ce qu'il achete.
 *
 * Le filtrage par `family` existe parce qu'un abonnement, un programme de
 * certification et un partenariat sont trois actes d'achat differents : les
 * afficher dans une meme grille laisse croire a sept plans concurrents d'un
 * meme abonnement.
 *
 * Si l'API est indisponible, le composant ne rend rien et laisse la place au
 * contenu statique fourni en `fallback` : une panne ne doit pas vider la page.
 */

interface LivePricingPlansProps {
    category: PlanCategoryCode
    locale: string
    title?: string
    subtitle?: string
    /** Ne garder que les offres de cette famille. Toutes par defaut. */
    family?: PlanFamily
    /** Rendu de secours si le catalogue n'est pas joignable. */
    fallback?: React.ReactNode
    /** Masque l'entete quand le composant est integre dans une section existante. */
    bare?: boolean
    /** Masque les extensions : elles n'ont de sens que sous les abonnements. */
    hideAddons?: boolean
}

export async function LivePricingPlans({
    category,
    locale,
    title,
    subtitle,
    family,
    fallback = null,
    bare = false,
    hideAddons = false,
}: LivePricingPlansProps) {
    const catalog = await PlansService.getCatalog(category)

    if (!catalog || catalog.plans.length === 0) {
        return <>{fallback}</>
    }

    const plans = family
        ? catalog.plans.filter((p) => p.family === family)
        : catalog.plans

    if (plans.length === 0) return <>{fallback}</>

    const content = (
        <>
            {!bare && (
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                        {title ?? catalog.category.name}
                    </h2>
                    {(subtitle ?? catalog.category.subtitle) && (
                        <p className="text-lg text-muted-foreground">
                            {subtitle ?? catalog.category.subtitle}
                        </p>
                    )}
                </div>
            )}

            <PricingGrid
                plans={plans}
                addons={hideAddons ? [] : catalog.addons}
                locale={locale}
                // Une certification ou un partenariat n'a pas de tarif recurrent :
                // proposer une bascule mensuel/annuel n'aurait aucun sens.
                showBillingToggle={family !== "certification" && family !== "partnership"}
            />
        </>
    )

    if (bare) return content

    return (
        <section id="pricing" className="bg-muted/30 py-12 md:py-16">
            <Container>{content}</Container>
        </section>
    )
}
