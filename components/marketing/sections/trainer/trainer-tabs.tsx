"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainerAboutTab } from "./tabs/about-tab"
import { TrainerCoursesTab } from "./tabs/courses-tab"
import { TrainerReviewsTab } from "./tabs/reviews-tab"

export function TrainerTabs() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="formations">Formations (18)</TabsTrigger>
            <TabsTrigger value="avis">Avis (2,345)</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <TrainerAboutTab />
          </TabsContent>

          <TabsContent value="formations">
            <TrainerCoursesTab />
          </TabsContent>

          <TabsContent value="avis">
            <TrainerReviewsTab />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
