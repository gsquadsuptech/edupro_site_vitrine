import { Container } from "@/components/marketing/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Clock, Award, TrendingUp } from "lucide-react"
import { LearningPath } from "@/lib/supabase/types"

interface SkillPackHeroNewProps {
  skillPack: LearningPath
}

export function SkillPackHeroNew({ skillPack }: SkillPackHeroNewProps) {
  return (
    <section className="relative min-h-screen overflow-hidden border-b border-slate-800 py-20 lg:py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-600/20 blur-3xl" />
        <div
          className="absolute right-1/4 top-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-fuchsia-600/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-cyan-500/20 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <Badge className="w-fit border-cyan-500/50 bg-cyan-950/50 text-cyan-300 text-sm px-4 py-1">
                Co-certifié EDUPRO × GALSENAI
              </Badge>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">Next Skills Africa</p>
                <h1 className="text-balance text-5xl font-black leading-[1.1] text-white lg:text-6xl xl:text-7xl">
                  {skillPack.title}
                </h1>
              </div>

              <p className="text-pretty text-xl leading-relaxed text-slate-300 lg:text-2xl">
                {skillPack.description || "Maîtrisez les compétences de demain pour transformer votre carrière."}
              </p>
            </div>

            {/* Duration & commitment */}
            <div className="inline-flex w-fit items-center gap-8 rounded-2xl border border-fuchsia-700 bg-fuchsia-950/30 px-6 py-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Durée estimée</p>
                <p className="text-2xl font-bold text-white">{skillPack.hours} heures</p>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div>
                <p className="text-sm font-medium text-slate-400">Projets</p>
                <p className="text-2xl font-bold text-white">{skillPack.projects_count}</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <Users className="mb-2 h-6 w-6 text-indigo-400" />
                <p className="text-2xl font-bold text-white">2400+</p>
                <p className="text-sm text-slate-400">Apprenants actifs</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <Award className="mb-2 h-6 w-6 text-fuchsia-400" />
                <p className="text-2xl font-bold text-white">4.8/5</p>
                <p className="text-sm text-slate-400">Note moyenne</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <Clock className="mb-2 h-6 w-6 text-cyan-400" />
                <p className="text-2xl font-bold text-white">{skillPack.courses_count} modules</p>
                <p className="text-sm text-slate-400">Formations incluses</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <TrendingUp className="mb-2 h-6 w-6 text-emerald-400" />
                <p className="text-2xl font-bold text-white">+40%</p>
                <p className="text-sm text-slate-400">Gain productivité</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-cyan-600 via-indigo-600 to-fuchsia-600 text-lg font-bold shadow-2xl shadow-cyan-500/50 transition-all hover:scale-105 hover:shadow-cyan-500/70"
              >
                Démarrer maintenant
                <div className="ml-2 transition-transform group-hover:translate-x-1">→</div>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 bg-slate-900/50 text-lg font-bold text-white backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-2 border-slate-700 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-2xl">
                {/* Gradient background with pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-fuchsia-600/20 to-cyan-600/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-slate-950" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />

                {/* Floating feature cards */}
                <div className="absolute left-4 top-8 max-w-[200px] rounded-2xl border border-cyan-800 bg-cyan-950/90 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-semibold text-cyan-400">Intelligence Artificielle</p>
                  <p className="mt-1 text-lg font-bold text-white">ChatGPT & Copilotes IA</p>
                </div>

                <div className="absolute right-4 top-1/3 max-w-[200px] rounded-2xl border border-fuchsia-800 bg-fuchsia-950/90 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-semibold text-fuchsia-400">Automatisation</p>
                  <p className="mt-1 text-lg font-bold text-white">N8N, Make, Zapier</p>
                </div>

                <div className="absolute bottom-8 left-4 max-w-[200px] rounded-2xl border border-indigo-800 bg-indigo-950/90 p-4 shadow-xl backdrop-blur-md">
                  <p className="text-xs font-semibold text-indigo-400">Résultat garanti</p>
                  <p className="mt-1 text-lg font-bold text-white">+40% Productivité</p>
                </div>

                {/* Center icon/visual */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-32 w-32 rounded-full border-4 border-indigo-500/30 bg-indigo-600/20 backdrop-blur-xl">
                    <div className="absolute inset-4 rounded-full border-4 border-fuchsia-500/30 bg-fuchsia-600/20">
                      <div className="absolute inset-4 rounded-full border-4 border-cyan-500/30 bg-cyan-600/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-4 border-indigo-500/20 bg-indigo-500/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full border-4 border-fuchsia-500/20 bg-fuchsia-500/10 blur-2xl" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
