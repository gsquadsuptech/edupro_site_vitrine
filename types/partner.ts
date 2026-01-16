export interface OverviewStats {
  totalLearners: number;
  womenPercentage: number; // % femmes
  youthPercentage: number; // % jeunes 15–35
  completionRate: number; // %
  employmentRate: number; // %
  satisfactionScore: number; // /5
  activePrograms: number;
}

export interface Program {
  name: string;
  country: string; // Sénégal, Côte d’Ivoire, Mali...
  theme: string; // thématique (énergie, numérique...)
  learners: number;
  women: number; // % femmes
  youth: number; // % jeunes 15–35
  completion: number; // %
  employment: number; // % insertion à 6 mois
  satisfaction: number; // /5
}

export interface GenderAgeRow {
  ageRange: string; // "< 18", "18–24", "25–35", "> 35"
  womenPercent: number;
  menPercent: number;
  completionRate: number;
  employmentRate: number;
  notes?: string;
}

export interface EmploymentBySector {
  sector: string; // Énergies renouvelables, Agriculture, Numérique, Commerce, Autres
  insertedPercent: number; // % des diplômés insérés
  jobsExamples: string[]; // Exemples de métiers
}

export interface CountryBreakdownRow {
  country: string; // Sénégal, Côte d’Ivoire, Mali, Guinée, Mauritanie
  activeProjects: number;
  learners: number;
  womenPercent: number;
  youthPercent: number;
  employmentRate: number;
}

export interface ThematicSatisfactionRow {
  theme: string; // Énergies renouvelables, Numérique & IA, Agriculture durable, Entrepreneuriat féminin
  satisfaction: number; // /5
  positiveKeywords: string[]; // mots-clés
}

export interface InsightItem {
  message: string;
}

export interface TimelinePoint {
  period: string; // T1 2025, T2 2025, T3 2025
  completionRate?: number;
  employmentRate?: number;
  youthPercent?: number;
  womenPercent?: number;
}

export interface PartnerDemoData {
  overview: OverviewStats;
  programs: Program[];
  genderAgeDistribution: GenderAgeRow[];
  employmentBySector: EmploymentBySector[];
  countryBreakdown: CountryBreakdownRow[];
  thematicSatisfaction: ThematicSatisfactionRow[];
  feedbacks: { author: string; content: string }[];
  kpiSummary: { label: string; value: string; target: string; status: 'ok' | 'warning' | 'bad' }[];
  timeline: TimelinePoint[];
  insights: InsightItem[];
}

export interface GizTheme {
  primary: string; // Rouge GIZ
  primaryDark: string;
  secondary: string; // Noir
  accent: string; // Vert succès
  background: string;
  muted: string;
}


