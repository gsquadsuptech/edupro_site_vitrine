import { OrganizationInfo } from "@/services/organization-service"

interface PartnerInstitutesProps {
  institutes?: OrganizationInfo[]
}

const GENERIC_PREFIXES = new Set([
  "institut",
  "instituto",
  "institute",
  "cabinet",
  "centre",
  "center",
  "academie",
  "académie",
  "academy",
  "ecole",
  "école",
  "school",
  "groupe",
  "group",
  "company",
  "société",
  "societe",
  "sarl",
  "sa",
  "sas",
  "ltd",
  "llc",
])

function getInitials(name: string): string {
  const cleaned = (name || "").trim()
  if (!cleaned) return "?"

  const words = cleaned
    .split(/[\s\-_.]+/)
    .filter(Boolean)
    .filter((word, index, arr) => {
      if (arr.length === 1) return true
      return !GENERIC_PREFIXES.has(word.toLowerCase())
    })

  const source = words.length > 0 ? words : cleaned.split(/\s+/)
  const initials = source
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()

  return initials || cleaned.substring(0, 2).toUpperCase()
}

function InstituteItem({ institute }: { institute: OrganizationInfo }) {
  return (
    <div className="group flex w-[120px] shrink-0 flex-col items-center gap-2 grayscale transition-all hover:grayscale-0">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-white p-2 transition-colors group-hover:border-primary">
        {institute.logo_url ? (
          <img
            src={institute.logo_url}
            alt={institute.name}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm font-semibold text-muted-foreground">
            {getInitials(institute.name)}
          </span>
        )}
      </div>
      <span
        title={institute.name}
        className="line-clamp-2 min-h-[2rem] text-center text-xs font-medium leading-tight text-muted-foreground transition-colors group-hover:text-primary"
      >
        {institute.name}
      </span>
    </div>
  )
}

export function PartnerInstitutes({ institutes = [] }: PartnerInstitutesProps) {
  const visibleInstitutes = institutes.filter((institute) => Boolean(institute.logo_url))
  if (visibleInstitutes.length === 0) return null

  // Slow down the loop slightly when there are few items so motion stays calm.
  const durationSeconds = Math.max(25, visibleInstitutes.length * 4)

  return (
    <section className="border-y border-border bg-background py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">
            Nos instituts et formateurs partenaires
          </h2>
          <p className="text-muted-foreground text-sm">
            Ils nous font confiance pour diffuser leurs formations d'excellence
          </p>
        </div>

        <div
          className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
          aria-label="Liste des instituts partenaires"
        >
          <div
            className="flex w-max animate-marquee-x gap-10 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
            style={{ ["--marquee-duration" as any]: `${durationSeconds}s` }}
          >
            {visibleInstitutes.map((institute) => (
              <InstituteItem key={`a-${institute.id}`} institute={institute} />
            ))}
            {visibleInstitutes.map((institute) => (
              <InstituteItem
                key={`b-${institute.id}`}
                institute={institute}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
