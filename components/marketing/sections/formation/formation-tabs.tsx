"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./tabs/overview-tab"
import { CurriculumTab } from "./tabs/curriculum-tab"
import { InstructorTab } from "./tabs/instructor-tab"
import { ReviewsTab } from "./tabs/reviews-tab"
import { Course } from "@/lib/supabase/types"

interface FormationTabsProps {
  course: Course & { rating?: number; reviewCount?: number }
}

export function FormationTabs({ course }: FormationTabsProps) {
  return (
    <section className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <Tabs defaultValue="apercu" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="apercu">Aperçu</TabsTrigger>
            <TabsTrigger value="programme">Programme</TabsTrigger>
            <TabsTrigger value="formateur">Formateur</TabsTrigger>
            <TabsTrigger value="avis">Avis</TabsTrigger>
          </TabsList>

          <TabsContent value="apercu">
            <OverviewTab course={course} />
          </TabsContent>

          <TabsContent value="programme">
            <CurriculumTab course={course} />
          </TabsContent>

          <TabsContent value="formateur">
            <InstructorTab course={course} />
          </TabsContent>

          <TabsContent value="avis">
            <ReviewsTab />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
