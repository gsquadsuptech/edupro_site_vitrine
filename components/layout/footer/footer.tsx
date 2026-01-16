"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"
import logo from "@/assets/images/logo.png"
import { useLanguage } from "@/hooks/useLanguage"

export function Footer() {
  const { locale } = useLanguage()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Image
              src={logo}
              alt="EduPro Logo"
              width={140}
              height={40}
              className="mb-4 h-10 w-auto"
            />
            <p className="mb-4 text-sm text-muted-foreground">
              {locale === 'fr'
                ? "La première plateforme de formation professionnelle pensée pour l'Afrique."
                : "The first professional training platform designed for Africa."}
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/edupro-africa/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/edupro.africa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61577379684411" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/eduproafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@edupro.africa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="TikTok">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@eduproafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {locale === 'fr' ? 'Solutions' : 'Solutions'}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/entreprises`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Pour Entreprises' : 'For Companies'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/professionnels`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Pour Professionnels' : 'For Professionals'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/formateurs`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Pour Formateurs' : 'For Trainers'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/investisseurs`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Pour Investisseurs' : 'For Investors'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {locale === 'fr' ? 'Ressources' : 'Resources'}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/blog`} className="transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">
              {locale === 'fr' ? 'Entreprise' : 'Company'}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href={`/${locale}/a-propos`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'À propos' : 'About'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/carrieres`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Carrières' : 'Careers'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/mentions-legales`} className="transition-colors hover:text-foreground">
                  {locale === 'fr' ? 'Mentions légales' : 'Legal notice'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 EduPro. {locale === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}. {locale === 'fr' ? 'Présent au' : 'Present in'} 🇸🇳 Sénégal · 🇨🇮 Côte d'Ivoire · 🇷🇼 Rwanda</p>
          <p className="mt-2 text-xs">
            {locale === 'fr' ? (
              <>
                Ce site est protégé par reCAPTCHA et la{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  Politique de confidentialité
                </a>
                {' '}et les{' '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  Conditions d'utilisation
                </a>
                {' '}de Google s'appliquent.
              </>
            ) : (
              <>
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
                {' '}and{' '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  Terms of Service
                </a>
                {' '}apply.
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
