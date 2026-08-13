"use client"

import { Container } from "@/components/marketing/layout/container"
import { useState } from "react"
import { ChevronDown, Clock, Video, FileText, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LearningPath } from "@/lib/supabase/types"

interface ParcoursCurriculumProps {
  learningPath: LearningPath
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  high: 'Avancé',
  advanced: 'Avancé',
}

const levelLabel = (level?: string | null) => LEVEL_LABELS[level || ''] || level || 'Tous niveaux'

export function ParcoursCurriculum({ learningPath }: ParcoursCurriculumProps) {
  const [openModule, setOpenModule] = useState<number | null>(0)
  const courses = learningPath.courses || []

  if (courses.length === 0) {
    return null
  }

  return (
    <section id="curriculum" className="scroll-mt-24 border-b border-slate-200 bg-white py-20 lg:py-24">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">Programme détaillé</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            {courses.length} cours pour maîtriser ce parcours étape par étape
          </p>
        </div>

        <div className="space-y-4">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenModule(openModule === idx ? null : idx)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 font-bold text-white shadow-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                      {course.is_mandatory === false && (
                        <Badge variant="outline" className="text-xs">Optionnel</Badge>
                      )}
                    </div>
                    {/* Durée masquée : les cours n'ont pas encore de contenu réel,
                        les « 2 min » affichés étaient trompeurs. */}
                    {course.level && (
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {levelLabel(course.level)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`h-6 w-6 text-slate-600 transition-transform ${openModule === idx ? "rotate-180" : ""}`}
                />
              </button>

              {openModule === idx && (
                <div className="border-t border-slate-200 bg-white p-6">
                  {course.description && (
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">{course.description}</p>
                  )}
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                    <p className="text-sm font-semibold text-indigo-700">
                      <Lock className="inline h-4 w-4 mr-1" />
                      Inscrivez-vous au parcours pour accéder à ce cours
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {learningPath.hours > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 text-center shadow-sm">
              <Video className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
              <p className="text-3xl font-bold text-slate-900">{learningPath.hours}h</p>
              <p className="text-sm text-slate-600">Durée totale estimée</p>
            </div>
            <div className="rounded-2xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white p-6 text-center shadow-sm">
              <FileText className="mx-auto mb-3 h-8 w-8 text-fuchsia-600" />
              <p className="text-3xl font-bold text-slate-900">{courses.length}</p>
              <p className="text-sm text-slate-600">Cours dans le parcours</p>
            </div>
            {learningPath.level && (
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 text-center shadow-sm">
                <Clock className="mx-auto mb-3 h-8 w-8 text-purple-600" />
                <p className="text-3xl font-bold text-slate-900">{levelLabel(learningPath.level)}</p>
                <p className="text-sm text-slate-600">Niveau</p>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
