// Types pour la configuration branding étendue avec site public
// Epic: Site Web Institut - Refonte Branding Centralisée

export interface BrandingColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  headerBackground: string;
  headerForeground: string;
  footerBackground: string;
  footerForeground: string;
}

export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  headingSize: {
    h1: string;
    h2: string;
    h3: string;
  };
  bodySize: string;
  lineHeight: string;
  letterSpacing: string;
}

export type SiteTemplate = 'classique' | 'marketplace' | 'minimaliste' | 'storytelling';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface CustomImages {
  heroImageUrl?: string;
  aboutImageUrl?: string;
  coursePlaceholderUrl?: string;
}

export interface SitePublicSettings {
  published: boolean;
  template: SiteTemplate;
  heroTitle: string;
  heroDescription: string;
  aboutMission: string;
  bannerUrl: string;
  stats: {
    students: string;
    courses: string;
    instructors: string;
    satisfaction: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  footerText?: string;
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
  customImages: CustomImages;
  sectionsConfig: Record<string, any>;
}

export interface BrandingSettings {
  colors: BrandingColors;
  logo: string;
  favicon: string;
  enableCustomCss: boolean;
  customCss: string;
  fontFamily: string;
  borderRadius: string;
  typography: TypographySettings;
  sitePublic: SitePublicSettings;
  logoFile?: File;
  faviconFile?: File;
  bannerFile?: File;
}

export interface OrganizationBrandingSettings {
  id: string;
  organization_id: string;
  colors: BrandingColors;
  logo_url: string | null;
  favicon_url: string | null;
  enable_custom_css: boolean;
  custom_css: string | null;
  font_family: string;
  border_radius: string;
  site_published: boolean;
  site_template: SiteTemplate;
  site_hero_title: string | null;
  site_hero_description: string | null;
  site_about_mission: string | null;
  banner_url: string | null;
  site_stats_students: string;
  site_stats_courses: string;
  site_stats_instructors: string;
  site_stats_satisfaction: string;
  site_footer_text: string | null;
  site_social_links: SocialLink[];
  site_testimonials: Testimonial[];
  site_hero_image_url: string | null;
  site_about_image_url: string | null;
  site_course_placeholder_url: string | null;
  site_sections_config: Record<string, any>;
  site_faqs?: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface PublicInstituteData {
  organization: {
    id: string;
    name: string;
    subdomain: string;
    logo_url: string | null;
  };
  branding: OrganizationBrandingSettings;
  courses: PublicCourse[];
}

export interface PublicCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail_url: string | null;
  instructor: {
    name: string;
    avatar_url: string | null;
  };
  rating: number;
  students_count: number;
}

// Valeurs par défaut
export const defaultTypographySettings: TypographySettings = {
  headingFont: 'Inter',
  bodyFont: 'Inter',
  headingSize: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.5rem'
  },
  bodySize: '1rem',
  lineHeight: '1.6',
  letterSpacing: '0em'
};

export const defaultSitePublicSettings: SitePublicSettings = {
  published: false,
  template: 'classique',
  heroTitle: '',
  heroDescription: '',
  aboutMission: '',
  bannerUrl: '',
  stats: {
    students: '100+',
    courses: '10+',
    instructors: '5+',
    satisfaction: '95%'
  },
  faqs: [],
  footerText: '',
  socialLinks: [],
  testimonials: [],
  customImages: {},
  sectionsConfig: {}
};

export const defaultBrandingColors: BrandingColors = {
  primary: "#4f46e5",
  primaryForeground: "#ffffff",
  secondary: "#f97316",
  secondaryForeground: "#ffffff",
  accent: "#22c55e",
  accentForeground: "#ffffff",
  background: "#ffffff",
  foreground: "#18181b",
  headerBackground: "#f8fafc",
  headerForeground: "#18181b",
  footerBackground: "#f1f5f9",
  footerForeground: "#64748b"
};