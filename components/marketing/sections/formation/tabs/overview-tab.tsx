import { CheckCircle2 } from "lucide-react"

export function OverviewTab() {
  const learningPoints = [
    "Comprendre les concepts fondamentaux de l'IA et du Machine Learning",
    "Maîtriser les algorithmes de base (régression, classification, clustering)",
    "Utiliser Python et ses bibliothèques (NumPy, Pandas, Scikit-learn)",
    "Créer et entraîner vos premiers modèles d'IA",
    "Évaluer et optimiser les performances de vos modèles",
    "Appliquer l'IA à des cas d'usage réels africains",
  ]

  const targetAudience = [
    "Professionnels souhaitant se reconvertir dans l'IA",
    "Étudiants en informatique ou mathématiques",
    "Entrepreneurs voulant intégrer l'IA dans leurs projets",
    "Développeurs cherchant à élargir leurs compétences",
  ]

  const prerequisites = [
    "Connaissances de base en programmation (Python recommandé)",
    "Notions de mathématiques (algèbre, statistiques)",
    "Ordinateur avec connexion internet",
    "Motivation et curiosité pour l'IA",
  ]

  return (
    <div className="space-y-8">
      {/* Ce que vous allez apprendre */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Ce que vous allez apprendre</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {learningPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <span className="text-sm">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description détaillée */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Description détaillée</h3>
        <div className="prose prose-sm max-w-none">
          <p className="mb-4 text-muted-foreground">
            Cette formation complète vous permettra de maîtriser les fondamentaux de l'Intelligence Artificielle et du
            Machine Learning, avec une approche pratique et adaptée au contexte africain.
          </p>
          <p className="mb-4 text-muted-foreground">
            Vous découvrirez comment l'IA peut résoudre des problèmes concrets dans différents secteurs : agriculture,
            santé, finance, éducation. Chaque concept théorique sera illustré par des exemples pratiques et des
            exercices hands-on.
          </p>
          <p className="text-muted-foreground">
            À la fin de cette formation, vous serez capable de concevoir, développer et déployer vos propres solutions
            d'IA, et vous aurez un portfolio de projets à présenter aux employeurs.
          </p>
        </div>
      </div>

      {/* Pour qui est cette formation */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Pour qui est cette formation ?</h3>
        <ul className="space-y-2">
          {targetAudience.map((audience, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>{audience}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prérequis */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Prérequis</h3>
        <ul className="space-y-2">
          {prerequisites.map((prerequisite, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>{prerequisite}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
