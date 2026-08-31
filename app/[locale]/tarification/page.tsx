import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { LivePricingPlans } from "@/components/marketing/pricing/live-pricing-plans"

export const metadata: Metadata = {
    title: "Tarification - EduPro",
    description:
        "Toutes les offres EduPro : solutions de formation pour entreprises et outils de monetisation pour formateurs. Tarifs transparents, sans engagement cache.",
}

/**
 * Repli quand le catalogue n'est pas joignable.
 *
 * Une section vide ne dit rien au visiteur et ne dit rien non plus a
 * l'exploitant : on affiche une porte de sortie utilisable plutot qu'un blanc.
 */
function CatalogUnavailable({ locale, gamme }: { locale: string; gamme: string }) {
    return (
        <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
                Nos offres {gamme} sont momentanement indisponibles.
            </p>
            <Button asChild className="mt-4" variant="outline">
                <Link href={`/${locale}/contact`}>Nous contacter pour un tarif</Link>
            </Button>
        </div>
    )
}

/**
 * Page tarifs publique.
 *
 * Les plans proviennent de l'API SaaS (`/api/public/pricing`) : c'est la meme
 * source que le superadmin et que l'ecran de changement de plan. Un tarif
 * modifie en back-office apparait ici sans redeploiement.
 *
 * La page distingue quatre univers, parce qu'ils correspondent a quatre
 * decisions d'achat differentes. Les presenter dans une grille unique
 * laisserait croire a sept plans concurrents d'un meme abonnement.
 */
export default async function TarificationPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    return (
        <>
            <section className="py-16 md:py-24">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-4 text-balance text-4xl font-bold md:text-5xl">
                            Des offres claires, pour chaque etape
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Que vous formiez vos equipes ou que vous vendiez votre expertise,
                            choisissez l&apos;offre qui correspond a votre situation. Vous
                            changez de plan quand vous voulez.
                        </p>
                    </div>
                </Container>
            </section>

            {/* 1. Abonnements entreprises */}
            <LivePricingPlans
                category="business"
                locale={locale}
                family="subscription"
                title="EduPro Business"
                subtitle="Formez vos equipes et mesurez l'impact"
                fallback={<CatalogUnavailable locale={locale} gamme="entreprises" />}
            />

            {/* 2. Abonnements formateurs */}
            <section className="py-12 md:py-16">
                <Container>
                    <LivePricingPlans
                        category="teach"
                        locale={locale}
                        family="subscription"
                        bare
                        title="EduPro Teach"
                        subtitle="Transformez votre expertise en revenus"
                        fallback={<CatalogUnavailable locale={locale} gamme="formateurs" />}
                    />
                </Container>
            </section>

            {/* 3. Programme de certification : achat unique, pas un abonnement */}
            <section className="bg-muted/30 py-12 md:py-16">
                <Container>
                    <div className="mb-10 text-center">
                        <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                            EduPro Certified
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Devenez formateur certifie EduPro et faites reconnaitre votre
                            expertise pedagogique.
                        </p>
                    </div>
                    <LivePricingPlans
                        category="teach"
                        locale={locale}
                        family="certification"
                        bare
                        hideAddons
                    />
                </Container>
            </section>

            {/* 4. Partenariats : offre negociee, sans grille tarifaire */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="mb-10 text-center">
                        <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                            EduPro Partners
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Construisons ensemble les formations de demain, en co-certification
                            avec votre institution.
                        </p>
                    </div>
                    <LivePricingPlans
                        category="teach"
                        locale={locale}
                        family="partnership"
                        bare
                        hideAddons
                    />
                </Container>
            </section>

            {/* Aide au choix */}
            <section className="bg-muted/30 py-12 md:py-16">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                            Vous hesitez entre deux offres ?
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            Nos equipes vous aident a dimensionner votre besoin, sans
                            engagement. Une demonstration dure une trentaine de minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button asChild size="lg">
                                <Link href={`/${locale}/demande-demo`}>Demander une demo</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={`/${locale}/contact`}>Nous contacter</Link>
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}
