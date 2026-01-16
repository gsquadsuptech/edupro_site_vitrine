import { Container } from "@/components/marketing/layout/container"
import { Badge, Award, CheckCircle2, Share2, TrendingUp } from "lucide-react"

export function ParcoursCertification() {
  const features = [
    {
      icon: Award,
      title: "Certificat professionnel",
      description: "EDUPRO × SO'FATOO – Business of Fashion Essentials",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: CheckCircle2,
      title: "Reconnaissance internationale",
      description: "Reconnu par GIZ/BMZ, AFD, ONU Femmes et partenaires du secteur créatif",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      icon: Share2,
      title: "Vérifiable en ligne",
      description: "QR code et lien de vérification pour partager sur LinkedIn et CV",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Impact carrière",
      description: "65% d'augmentation moyenne du CA dans les 6 mois post-formation",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 py-20 lg:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-fuchsia-500/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mb-16 text-center">
          <Badge className="mb-4 border-emerald-500/50 bg-emerald-50 text-emerald-700">Certification</Badge>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
            Un certificat qui valorise votre expertise
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Obtenez une certification professionnelle reconnue et valorisez votre profil auprès des investisseurs et
            partenaires
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Certificate preview */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-100 to-fuchsia-100 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600" />
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-600 to-pink-600" />
                  </div>
                  <Award className="h-16 w-16 text-yellow-500" />
                </div>

                <div>
                  <p className="text-sm uppercase tracking-wider text-slate-500">Certificat Professionnel</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Business of Fashion Essentials</h3>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Ce certificat atteste que</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">[Nom de l'apprenante]</p>
                  <p className="mt-3 text-sm text-slate-600">a complété avec succès le parcours de formation</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Co-certifié par</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">EDUPRO × SO'FATOO</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 p-3">
                    <div className="h-12 w-12 bg-slate-200" />
                    <p className="mt-1 text-center text-xs text-slate-500">QR Code</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative badges */}
            <div className="absolute -right-4 top-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 backdrop-blur-sm shadow-md">
              <p className="text-sm font-semibold text-emerald-700">✓ Vérifiable</p>
            </div>
            <div className="absolute -left-4 bottom-8 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 backdrop-blur-sm shadow-md">
              <p className="text-sm font-semibold text-indigo-700">Reconnu</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-xl bg-gradient-to-r ${feature.color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
