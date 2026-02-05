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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User as UserIcon, LogOut, LayoutDashboard, Loader2, Settings } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { FlagImage } from "@/components/ui/flag-image"

// Safely try to import role-guard util, fallback if not available
// This pattern avoids build errors if the file structure is different than expected
// In a real scenario, we would ensure the import path is correct.
// Safely try to import role-guard util, fallback if not available
// This pattern avoids build errors if the file structure is different than expected
// In a real scenario, we would ensure the import path is correct.
import { getDefaultRouteForUser } from "../../../lib/role-guard"
import { getAppUrl } from "@/lib/utils"

export function Header() {
  const { locale, changeLanguage } = useLanguage()
  const router = useRouter()
  const { user, signOut, isLoading, roles } = useAuth()

  const handleLanguageChange = async (newLocale: "fr" | "en") => {
    if (newLocale === locale) {
      return;
    }

    try {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      await new Promise(resolve => setTimeout(resolve, 100));
      const currentPath = window.location.pathname
      const pathWithoutLocale = currentPath.replace(/^\/(fr|en)/, '')
      const newPath = `/${newLocale}${pathWithoutLocale}`
      window.location.href = newPath
    } catch (error) {
      console.error('[Header] Erreur lors du changement de langue:', error);
    }
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = `/${locale}`
  }

  const handleDashboardClick = () => {
    // Use the utility to get the correct dashboard route based on role
    const dashboardRoute = getDefaultRouteForUser(roles || [])
    window.location.href = getAppUrl(dashboardRoute)
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
                            href={`/${locale}/demande-demo`}
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
                            href={`/${locale}/formateurs/candidature`}
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
                            href={`/${locale}/demande-demo?type=institute`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {locale === 'fr' ? 'Instituts de formation' : 'Training Institutes'}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-2 md:flex">
                <FlagImage countryCode={locale === 'fr' ? 'fr' : 'gb'} width={20} height={15} />
                <span className="uppercase">{locale}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange("fr")} className="gap-2 cursor-pointer">
                <FlagImage countryCode="fr" width={20} height={15} />
                <span>Français</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("en")} className="gap-2 cursor-pointer">
                <FlagImage countryCode="gb" width={20} height={15} />
                <span>English</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden items-center gap-4 md:flex">
            {!user && !isLoading && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90 transition-all active:scale-95"
                asChild
              >
                <Link href={`/${locale}/inscription`}>
                  {locale === 'fr' ? 'Commencer' : 'Get started'}
                </Link>
              </Button>
            )}
            {isLoading ? (
              <Button variant="ghost" size="icon" disabled>
                <Loader2 className="h-5 w-5 animate-spin" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border border-transparent hover:border-gray-200">
                    {user?.user_metadata?.avatar_url ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <Image src={user.user_metadata.avatar_url} alt="Profile" width={32} height={32} className="object-cover h-full w-full" />
                      </div>
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'Utilisateur'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardClick} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>{locale === 'fr' ? 'Mon espace' : 'My Space'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{locale === 'fr' ? 'Paramètres' : 'Settings'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{locale === 'fr' ? 'Se déconnecter' : 'Log out'}</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <>
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/connexion`)} className="cursor-pointer">
                          <span>{locale === 'fr' ? 'Se connecter' : 'Login'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/inscription`)} className="cursor-pointer">
                          <span>{locale === 'fr' ? "S'inscrire" : 'Sign up'}</span>
                        </DropdownMenuItem>
                      </>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{locale === 'fr' ? 'Menu' : 'Menu'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              {/* Mobile Menu Content - kept similar but updated with auth state logic if needed, 
                  User requested replacement in header specifically.
                  For mobile, usually specific buttons are better UX than hidden in dropdown,
                  but for consistency I will show conditional buttons.
              */}
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
                  {/* ... (existing links) ... */}
                  <Link href={`/${locale}`} className="text-lg font-medium hover:text-primary">
                    {locale === 'fr' ? 'Accueil' : 'Home'}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium text-muted-foreground">
                      {locale === 'fr' ? 'Pour qui ?' : 'For whom?'}
                    </div>
                    <div className="ml-4 flex flex-col gap-3 border-l pl-4">
                      <Link href={`/${locale}/demande-demo`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Entreprises' : 'Companies'}
                      </Link>
                      <Link href={`/${locale}/professionnels`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Professionnels' : 'Professionals'}
                      </Link>
                      <Link href={`/${locale}/formateurs/candidature`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Formateurs' : 'Trainers'}
                      </Link>
                      <Link href={`/${locale}/demande-demo?type=institute`} className="font-medium hover:text-primary">
                        {locale === 'fr' ? 'Instituts de formation' : 'Training Institutes'}
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
                <div className="flex flex-col gap-3 pt-4 border-t mt-4">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        {user.user_metadata?.avatar_url && (
                          <Image src={user.user_metadata.avatar_url} alt="" width={24} height={24} className="rounded-full" />
                        )}
                        <span className="font-medium">{user.user_metadata?.full_name || user.email}</span>
                      </div>
                      <Button variant="outline" className="w-full justify-start" onClick={handleDashboardClick}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {locale === 'fr' ? 'Mon espace' : 'My Space'}
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {locale === 'fr' ? 'Se déconnecter' : 'Log out'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/${locale}/connexion`)}>
                        {locale === 'fr' ? 'Connexion' : 'Login'}
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:opacity-90"
                        onClick={() => router.push(`/${locale}/inscription`)}
                      >
                        {locale === 'fr' ? 'Commencer' : 'Get started'}
                      </Button>
                    </>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={locale === 'fr' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleLanguageChange("fr")}
                    >
                      <FlagImage countryCode="fr" width={20} height={15} />
                      Français
                    </Button>
                    <Button
                      variant={locale === 'en' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleLanguageChange("en")}
                    >
                      <FlagImage countryCode="gb" width={20} height={15} />
                      English
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
