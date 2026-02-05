"use client"

import { DemoRequestForm } from "@/components/marketing/sections/enterprises/demo-request-form"
import { Container } from "@/components/marketing/container"
import Image from "next/image"
import { useParams, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export const dynamic = 'force-dynamic'

export default function DemandeDemoPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const locale = (params?.locale as string) || 'fr'
    const type = searchParams?.get('type')
    const requestType = type === 'institute' ? 'institute' : 'enterprise'
    const t = useTranslations("enterprises.demoRequest")

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    {/* Logo is typically in header, but keeping it if design requires, 
              though simpler is usually better for form pages. 
              Checking previous file, it was there. 
              Assuming logo asset path needs to be correct. 
              I'll omit explicit logo image here if not strictly needed or use import.
              The previous file had Image src="/logo.png". I'll keep it but ensure path is safe.
          */}
                    <h1 className="mb-3 text-4xl font-bold text-slate-900 md:text-5xl">{t(`title.${requestType}`)}</h1>
                    <p className="text-xl text-slate-600">
                        {t(`subtitle.${requestType}`)}
                    </p>
                </div>
            </section>

            {/* Content Area */}
            <section className="py-12 md:py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <DemoRequestForm requestType={requestType} />
                    </div>
                </Container>
            </section>
        </main>
    )
}
