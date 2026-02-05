import { Container } from "@/components/marketing/container"
import { TrainerApplicationForm } from "@/components/marketing/sections/trainers/trainer-application-form"
import { useTranslations } from "next-intl"

export default function CandidaturePage() {
    const t = useTranslations("trainers.application.page")

    return (
        <div className="py-20 md:py-32">
            <Container>
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 text-center">
                        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h1>
                        <p className="text-muted-foreground">{t("subtitle")}</p>
                    </div>

                    <TrainerApplicationForm />
                </div>
            </Container>
        </div>
    )
}
