"use client"

import Image from "next/image"
import Link from "next/link"
import logo from "@/assets/images/logo.png"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useRouter } from "next/navigation"

export function Header() {
  const { locale, changeLanguage } = useLanguage()
  const router = useRouter()

  const handleLanguageChange = async (newLocale: "fr" | "en") => {
    if (newLocale === locale) {
      return;
    }

    try {
      // Mettre à jour le cookie immédiatement
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // Attendre un peu pour s'assurer que le cookie est bien enregistré
      await new Promise(resolve => setTimeout(resolve, 100));

      // Naviguer vers la nouvelle URL avec la nouvelle locale
      const currentPath = window.location.pathname
      const pathWithoutLocale = currentPath.replace(/^\/(fr|en)/, '')
      const newPath = `/${newLocale}${pathWithoutLocale}`

      // Utiliser window.location.href pour forcer une navigation complète
      // Cela garantit que le cookie est bien lu par le middleware
      window.location.href = newPath
    } catch (error) {
      console.error('[Header] Erreur lors du changement de langue:', error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`}>
            <Image
              src={logo}
              alt="EduPro Logo"
              width={180}
              height={50}
              className="h-12 w-auto md:h-14"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={`/${locale}`} className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              {locale === 'fr' ? 'Accueil' : 'Home'}
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    {locale === 'fr' ? 'Pour qui ?' : 'For whom?'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${locale}/entreprises`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {locale === 'fr' ? 'Entreprises' : 'Companies'}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${locale}/professionnels`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {locale === 'fr' ? 'Professionnels' : 'Professionals'}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${locale}/formateurs`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {locale === 'fr' ? 'Formateurs' : 'Trainers'}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/${locale}/investisseurs`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {locale === 'fr' ? 'Investisseurs' : 'Investors'}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href={`/${locale}/catalogue`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === 'fr' ? 'Découvrir le catalogue' : 'Discover the catalog'}
            </Link>

            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === 'fr' ? 'Blog' : 'Blog'}
            </Link>

            <Link
              href={`/${locale}/carrieres`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === 'fr' ? 'Carrières' : 'Careers'}
            </Link>

            <Link
              href={`/${locale}/a-propos`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === 'fr' ? 'À propos' : 'About'}
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {locale === 'fr' ? 'Contact' : 'Contact'}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <select
            className="hidden rounded-lg border border-border bg-background px-3 py-2 text-sm md:block"
            value={locale}
            onChange={(e) => handleLanguageChange(e.target.value as "fr" | "en")}
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
          </select>
          <Button variant="ghost" className="hidden md:inline-flex" onClick={() => router.push(`/${locale}/connexion`)}>
            {locale === 'fr' ? 'Connexion' : 'Login'}
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
            onClick={() => router.push(`/${locale}/inscription`)}
          >
            {locale === 'fr' ? 'Commencer' : 'Get started'}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{locale === 'fr' ? 'Menu' : 'Menu'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    alt="EduPro Logo"
                    width={140}
                    height={40}
                    className="h-10 w-auto"
                  />
                </div>
                <nav className="flex flex-col gap-4">
                  <Link href={`/${locale}`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Accueil' : 'Home'}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium text-muted-foreground">
                      {locale === 'fr' ? 'Pour qui ?' : 'For whom?'}
                    </div>
                    <div className="ml-4 flex flex-col gap-3 border-l pl-4">
                      <Link href={`/${locale}/entreprises`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Entreprises' : 'Companies'}
                      </Link>
                      <Link href={`/${locale}/professionnels`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Professionnels' : 'Professionals'}
                      </Link>
                      <Link href={`/${locale}/formateurs`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Formateurs' : 'Trainers'}
                      </Link>
                      <Link href={`/${locale}/investisseurs`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Investisseurs' : 'Investors'}
                      </Link>
                    </div>
                  </div>
                  <Link href={`/${locale}/catalogue`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Découvrir le catalogue' : 'Discover the catalog'}
                  </Link>
                  <Link href={`/${locale}/blog`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Blog' : 'Blog'}
                  </Link>
                  <Link href={`/${locale}/carrieres`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Carrières' : 'Careers'}
                  </Link>
                  <Link href={`/${locale}/a-propos`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'À propos' : 'About'}
                  </Link>
                  <Link href={`/${locale}/contact`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Contact' : 'Contact'}
                  </Link>
                </nav>
                <div className="flex flex-col gap-3 pt-4">
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    value={locale}
                    onChange={(e) => handleLanguageChange(e.target.value as "fr" | "en")}
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/${locale}/connexion`)}>
                    {locale === 'fr' ? 'Connexion' : 'Login'}
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                    onClick={() => router.push(`/${locale}/inscription`)}
                  >
                    {locale === 'fr' ? 'Commencer' : 'Get started'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
