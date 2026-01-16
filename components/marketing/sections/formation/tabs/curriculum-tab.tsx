"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Play, Lock, FileText, CheckCircle } from "lucide-react"

import { Course } from "@/lib/supabase/types"

interface CurriculumTabProps {
  course?: Course
}

export function CurriculumTab({ course }: CurriculumTabProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0])

  // Use dynamic data if available, otherwise fall back to static
  const hasDynamicData = course?.sections && course.sections.length > 0

  const curriculum = hasDynamicData ? course.sections!.map(section => ({
    title: section.title,
    lessons: section.lessons.length,
    duration: "Unknown", // Calc from lessons if needed
    items: section.lessons.map(lesson => ({
      title: lesson.title,
      duration: lesson.duration,
      type: lesson.type,
      preview: lesson.is_preview
    }))
  })) : [
    {
      title: "Introduction à l'IA",
      lessons: 5,
      duration: "1h30",
      items: [
        { title: "Bienvenue dans la formation", duration: "5 min", type: "video", preview: true },
        { title: "Qu'est-ce que l'Intelligence Artificielle ?", duration: "15 min", type: "video", preview: false },
        { title: "Histoire et évolution de l'IA", duration: "20 min", type: "video", preview: false },
        { title: "Applications de l'IA en Afrique", duration: "25 min", type: "video", preview: false },
        { title: "Quiz : Concepts de base", duration: "10 min", type: "quiz", preview: false },
      ],
    },
    {
      title: "Fondamentaux du Machine Learning",
      lessons: 8,
      duration: "2h15",
      items: [
        { title: "Introduction au Machine Learning", duration: "15 min", type: "video", preview: false },
        { title: "Types d'apprentissage", duration: "20 min", type: "video", preview: false },
        { title: "Préparation des données", duration: "25 min", type: "video", preview: false },
        { title: "Exercice pratique : Nettoyage de données", duration: "30 min", type: "exercise", preview: false },
        { title: "Algorithmes de régression", duration: "20 min", type: "video", preview: false },
        { title: "Algorithmes de classification", duration: "20 min", type: "video", preview: false },
        { title: "Évaluation des modèles", duration: "15 min", type: "video", preview: false },
        { title: "Quiz : Machine Learning", duration: "10 min", type: "quiz", preview: false },
      ],
    },
    {
      title: "Pratique avec Python",
      lessons: 10,
      duration: "3h00",
      items: [
        { title: "Configuration de l'environnement", duration: "15 min", type: "video", preview: false },
        { title: "Introduction à NumPy", duration: "20 min", type: "video", preview: false },
        { title: "Manipulation de données avec Pandas", duration: "25 min", type: "video", preview: false },
        { title: "Visualisation avec Matplotlib", duration: "20 min", type: "video", preview: false },
        { title: "Scikit-learn : Premier modèle", duration: "30 min", type: "video", preview: false },
        { title: "Projet : Prédiction de prix", duration: "40 min", type: "project", preview: false },
        { title: "Optimisation des hyperparamètres", duration: "20 min", type: "video", preview: false },
        { title: "Cross-validation", duration: "15 min", type: "video", preview: false },
        { title: "Projet : Classification d'images", duration: "45 min", type: "project", preview: false },
        { title: "Quiz final du module", duration: "10 min", type: "quiz", preview: false },
      ],
    },
  ]

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      case "exercise":
      case "project":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold">Curriculum</h3>
        <p className="text-sm text-muted-foreground">48 leçons • 12h de contenu total</p>
      </div>

      <div className="space-y-2">
        {curriculum.map((section, sectionIndex) => (
          <div key={sectionIndex} className="overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => toggleSection(sectionIndex)}
              className="flex w-full items-center justify-between bg-muted/50 p-4 text-left transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                {expandedSections.includes(sectionIndex) ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <h4 className="font-semibold">
                    Section {sectionIndex + 1}: {section.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {section.lessons} leçons • {section.duration}
                  </p>
                </div>
              </div>
            </button>

            {expandedSections.includes(sectionIndex) && (
              <div className="border-t border-border bg-background">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between border-b border-border p-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {item.preview ? (
                        <div className="text-primary">{getIcon(item.type)}</div>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {itemIndex + 1}. {item.title}
                        </div>
                        {item.preview && <span className="text-xs text-primary">[PREVIEW]</span>}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
