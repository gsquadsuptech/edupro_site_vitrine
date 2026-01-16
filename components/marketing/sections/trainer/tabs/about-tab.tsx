import { Briefcase, GraduationCap, Award, Linkedin, Twitter, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function TrainerAboutTab() {
  const experience = [
    {
      title: "Directrice de Recherche",
      company: "AI Lab Dakar",
      period: "2020 - Présent",
    },
    {
      title: "Professeure Associée",
      company: "Université Cheikh Anta Diop",
      period: "2015 - 2020",
    },
    {
      title: "Consultante IA",
      company: "Union Africaine",
      period: "2018 - Présent",
    },
  ]

  const education = [
    {
      degree: "Doctorat en Intelligence Artificielle",
      institution: "Université Cheikh Anta Diop, Dakar",
      year: "2015",
    },
    {
      degree: "Master en Informatique",
      institution: "École Polytechnique de Thiès",
      year: "2010",
    },
    {
      degree: "Certification TensorFlow Developer",
      institution: "Google",
      year: "2019",
    },
  ]

  const expertise = [
    "Intelligence Artificielle",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "Data Science",
    "Python",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
  ]

  return (
    <div className="space-y-8">
      {/* Biographie */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Biographie</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="mb-4">
            Dr. Aminata Diallo est une experte reconnue en Intelligence Artificielle avec plus de 15 ans d'expérience
            dans la recherche et l'enseignement. Titulaire d'un doctorat de l'Université Cheikh Anta Diop de Dakar, elle
            a consacré sa carrière à rendre l'IA accessible et applicable au contexte africain.
          </p>
          <p className="mb-4">
            Ses travaux de recherche portent principalement sur l'application de l'IA dans les domaines de
            l'agriculture, de la santé et de l'éducation en Afrique de l'Ouest. Elle a publié plus de 20 articles
            scientifiques dans des revues internationales et a présenté ses recherches dans de nombreuses conférences à
            travers le monde.
          </p>
          <p>
            Passionnée par la transmission du savoir, elle a formé plus de 12 000 professionnels africains aux
            technologies de l'IA et continue de contribuer activement au développement de l'écosystème tech africain.
          </p>
        </div>
      </div>

      {/* Expérience Professionnelle */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Briefcase className="h-5 w-5" />
          Expérience Professionnelle
        </h3>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h4 className="font-semibold">{exp.title}</h4>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
              <p className="text-xs text-muted-foreground">{exp.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formation & Certifications */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="h-5 w-5" />
          Formation & Certifications
        </h3>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="border-l-2 border-chart-2 pl-4">
              <h4 className="font-semibold">{edu.degree}</h4>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domaines d'Expertise */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Award className="h-5 w-5" />
          Domaines d'Expertise
        </h3>
        <div className="flex flex-wrap gap-2">
          {expertise.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Réseaux & Contact */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-xl font-bold">Réseaux & Contact</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>
          <Button variant="outline">
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Website
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>
      </div>
    </div>
  )
}
