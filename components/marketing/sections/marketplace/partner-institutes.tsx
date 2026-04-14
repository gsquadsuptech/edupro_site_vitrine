import { OrganizationInfo } from "@/services/organization-service"

interface PartnerInstitutesProps {
  institutes?: OrganizationInfo[]
}

export function PartnerInstitutes({ institutes = [] }: PartnerInstitutesProps) {
  // If no institutes provided, we could hide the section or show nothing
  if (institutes.length === 0) return null;

  return (
    <section className="border-y border-border bg-background py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">Nos Instituts Partenaires</h2>
          <p className="text-muted-foreground text-sm">Ils nous font confiance pour diffuser leurs formations d'excellence</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {institutes.map((institute) => (
            <div key={institute.id} className="flex flex-col items-center justify-center gap-2 grayscale transition-all hover:grayscale-0 group max-w-[120px]">
              <div className="relative h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-full border border-border group-hover:border-primary transition-colors bg-white p-1">
                {institute.logo_url ? (
                  <img
                    src={institute.logo_url}
                    alt={institute.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-[10px] font-bold text-center">
                    {institute.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-center text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
                {institute.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
