"use client";

import { HeroSection } from "@/components/pages/home/sections/hero-section";
import { ProblemSection } from "@/components/pages/home/sections/problem-section";
import { SolutionSection } from "@/components/pages/home/sections/solution-section";
import { AudienceCards } from "@/components/pages/home/sections/audience-cards";
import { ImpactStats } from "@/components/pages/home/sections/impact-stats";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { GeographicCoverage } from "@/components/pages/home/sections/geographic-coverage";
import { FinalCTA } from "@/components/pages/home/sections/final-cta";
import { Newsletter } from "@/components/sections/newsletter";

export function HomeView() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <AudienceCards />
                <ImpactStats />
                <TestimonialsSection />
                <GeographicCoverage />
                <FinalCTA />
                <Newsletter />
            </main>
        </div>
    );
}
