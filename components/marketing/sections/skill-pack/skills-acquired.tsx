import { Badge } from "@/components/ui/badge"

export function SkillsAcquired() {
  const skills = [
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "SQL",
    "Git & GitHub",
    "Data Science",
    "Machine Learning",
    "API REST",
    "Cloud Computing",
    "DevOps",
    "Cybersécurité",
    "UI/UX Design",
    "Agile & Scrum",
    "Docker",
    "Kubernetes",
  ]

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Compétences Acquises</h2>
          <p className="text-lg text-muted-foreground">À la fin de ce parcours, vous maîtriserez ces technologies</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-4 py-2 text-base">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
