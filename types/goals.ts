// Types pour le système d'objectifs mensuels

export interface UserMonthlyGoal {
  id: string;
  user_id: string;
  month: number;
  year: number;
  goal_type: string;
  title: string;
  description?: string;
  target_value: number;
  current_progress: number;
  unit: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  priority: number; // 1=haute, 2=moyenne, 3=basse
  created_at: string;
  updated_at: string;
  completed_at?: string;
  // Colonnes calculées côté frontend
  completion_percentage?: number;
  due_date?: string;
  remaining_to_target?: number;
  is_completed?: boolean;
}

export interface GoalTemplate {
  id: string;
  goal_type: string;
  title_template: string;
  description_template?: string;
  default_target_value: number;
  min_target_value: number;
  max_target_value: number;
  unit: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  xp_reward_base: number;
  xp_reward_multiplier: number;
  badge_icon: string;
  category: 'learning' | 'time' | 'progress' | 'social' | 'general';
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GoalProgressHistory {
  id: string;
  goal_id: string;
  previous_progress: number;
  new_progress: number;
  increment: number;
  source_type: string;
  source_id?: string;
  source_details?: any;
  recorded_at: string;
}

export interface CreateGoalRequest {
  goalType: string;
  title: string;
  description?: string;
  targetValue: number;
  month: number;
  year: number;
  priority?: number;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetValue?: number;
  status?: 'active' | 'completed' | 'failed' | 'paused';
  priority?: number;
}

export interface GoalResponse extends UserMonthlyGoal {
  template?: {
    icon: string;
    category: string;
    difficulty: string;
    xp_reward: number;
  };
  progress_history?: GoalProgressHistory[];
  estimated_completion_date?: string;
}

export interface GoalsListResponse {
  goals: GoalResponse[];
  summary: {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    completionRate: number;
    totalXpEarned: number;
    averageProgress: number;
  };
  month: number;
  year: number;
}

export interface GoalSuggestion {
  goalType: string;
  suggestedTarget: number;
  reason: string;
  confidence: number; // 0-1
  template: GoalTemplate;
}

export interface GoalReward {
  type: 'xp' | 'achievement' | 'badge';
  amount?: number;
  achievementId?: string;
  description: string;
}

export interface GoalProgressCalculation {
  goalId: string;
  currentProgress: number;
  targetValue: number;
  completionPercentage: number;
  remainingToTarget: number;
  isCompleted: boolean;
  estimatedCompletionDate?: Date;
  progressHistory?: ProgressHistoryEntry[];
}

export interface ProgressHistoryEntry {
  date: string;
  progress: number;
  increment: number;
  sourceType: string;
}

export interface GoalValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Constantes pour les types d'objectifs
export const GOAL_TYPES = {
  COURSES_COMPLETION: 'courses_completion',
  TIME_SPENT: 'time_spent',
  STREAK_DAYS: 'streak_days',
  XP_POINTS: 'xp_points',
  MODULES_COMPLETION: 'modules_completion',
  SKILLS_MASTERY: 'skills_mastery'
} as const;

export type GoalType = typeof GOAL_TYPES[keyof typeof GOAL_TYPES];

// Constantes pour les sources de progression
export const PROGRESS_SOURCES = {
  COURSE_COMPLETION: 'course_completion',
  LESSON_COMPLETE: 'lesson_complete',
  VIDEO_WATCH: 'video_watch',
  QUIZ_COMPLETE: 'quiz_complete',
  MODULE_COMPLETE: 'module_complete',
  MANUAL: 'manual',
  ACHIEVEMENT: 'achievement',
  DAILY_LOGIN: 'daily_login',
  STREAK_MILESTONE: 'streak_milestone'
} as const;

export type ProgressSource = typeof PROGRESS_SOURCES[keyof typeof PROGRESS_SOURCES];

// Constantes pour les unités
export const GOAL_UNITS = {
  COURSES: 'courses',
  HOURS: 'hours',
  MINUTES: 'minutes',
  DAYS: 'days',
  POINTS: 'points',
  MODULES: 'modules',
  SKILLS: 'skills',
  COUNT: 'count'
} as const;

export type GoalUnit = typeof GOAL_UNITS[keyof typeof GOAL_UNITS];

// Utilitaires de validation
export const isValidGoalType = (type: string): type is GoalType => {
  return Object.values(GOAL_TYPES).includes(type as GoalType);
};

export const isValidProgressSource = (source: string): source is ProgressSource => {
  return Object.values(PROGRESS_SOURCES).includes(source as ProgressSource);
};

export const isValidGoalUnit = (unit: string): unit is GoalUnit => {
  return Object.values(GOAL_UNITS).includes(unit as GoalUnit);
};