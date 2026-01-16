// Types pour l'interface de lecture de cours (US-B5)
import { z } from 'zod';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutes
  videoUrl: string;
  thumbnailUrl?: string;
  resources: Resource[];
  order: number;
  moduleId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learnersCount: number;
  type: 'video' | 'article' | 'document' | 'quiz';
  content: any; // Contenu flexible selon le type
}

export interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  order: number;
  totalDuration: number; // en minutes
  chaptersCount: number;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'zip' | 'video' | 'link';
  url: string;
  size?: number; // en bytes
  description?: string;
}

export interface ChapterProgress {
  chapterId: string;
  videoTimePosition: number; // en secondes
  chapterProgress: number; // 0-100
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  lastWatchedAt: string;
  timeSpent: number; // en secondes
}

export interface CourseProgress {
  courseId: string;
  overallProgress: number; // 0-100
  chaptersCompleted: number;
  totalChapters: number;
  timeSpent: number; // en secondes
  lastActivityDate: string;
  currentChapterId?: string;
}

export interface ResumeData {
  courseId: string;
  lastChapterId: string;
  lastLessonId: string;
  videoTimePosition: number; // en secondes
  chapterProgress: number; // 0-100
  lastWatchedAt: string;
  autoResume: boolean;
}

export interface ProgressUpdate {
  videoTimePosition: number;
  videoDuration?: number;
  chapterProgress: number;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  timestamp: string;
}

// État du lecteur vidéo
export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  buffered: TimeRanges | null;
}

// Actions du lecteur
export interface PlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
  previousChapter: () => void;
  nextChapter: () => void;
  markAsComplete: () => void;
}

// Props des composants
export interface CoursePlayerProps {
  courseId: string;
  initialChapterId?: string;
  autoResume?: boolean;
  onProgressUpdate?: (progress: ProgressUpdate) => void;
  onChapterChange?: (chapterId: string) => void;
  onComplete?: () => void;
}

export interface VideoPlayerProps {
  videoUrl: string;
  initialTime?: number;
  poster?: string;
  onProgressUpdate?: (time: number, progress: number) => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData?: ResumeData | null;
  modules: Module[];
  currentChapterId?: string;
  onChapterSelect: (chapterId: string) => void;
  overallProgress: number;
}

export interface ChapterItemProps {
  chapter: Chapter;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  onClick: () => void;
}

export interface ChapterNavigationProps {
  previousChapter?: Chapter;
  nextChapter?: Chapter;
  currentChapter: Chapter;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

// État global Zustand
export interface CoursePlayerState {
  // État du cours
  courseId: string | null;
  currentChapterId: string | null;
  currentLessonId: string | null;
  
  // Progression
  videoTimePosition: number;
  chapterProgress: number;
  overallProgress: number;
  
  // Navigation
  chapters: Chapter[];
  modules: Module[];
  currentChapterIndex: number;
  
  // État du lecteur
  isPlaying: boolean;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Actions
  setCurrentChapter: (chapterId: string) => void;
  updateProgress: (time: number, progress: number) => void;
  markAsComplete: () => void;
  resumeFromLastPosition: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

// Erreurs
export interface CoursePlayerError {
  code: string;
  message: string;
  details?: any;
}

// Événements
export interface CoursePlayerEvent {
  type: 'progress_update' | 'chapter_change' | 'completion' | 'error';
  data: any;
  timestamp: string;
}

// Configuration
export interface CoursePlayerConfig {
  autoSaveInterval: number; // en millisecondes
  debounceDelay: number; // en millisecondes
  maxRetries: number;
  offlineSupport: boolean;
  analytics: boolean;
  keyboardShortcuts: boolean;
}

// Métriques
export interface PlayerMetrics {
  sessionDuration: number; // en secondes
  chaptersWatched: number;
  totalProgress: number;
  engagementScore: number; // 0-100
  completionRate: number; // 0-100
}

// Cache
export interface ChapterCache {
  [chapterId: string]: {
    chapter: Chapter;
    timestamp: number;
    ttl: number; // time to live en millisecondes
  };
}

// Support hors ligne
export interface OfflineData {
  pendingSaves: ProgressUpdate[];
  cachedChapters: ChapterCache;
  lastSync: string;
}

// Raccourcis clavier
export interface KeyboardShortcut {
  key: string;
  action: string;
  description: string;
  global?: boolean; // si true, fonctionne partout sur la page
}

export const DEFAULT_KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: ' ', action: 'toggle_play', description: 'Play/Pause', global: true },
  { key: 'ArrowLeft', action: 'previous_chapter', description: 'Chapitre précédent', global: true },
  { key: 'ArrowRight', action: 'next_chapter', description: 'Chapitre suivant', global: true },
  { key: 'f', action: 'toggle_fullscreen', description: 'Plein écran', global: true },
  { key: 'm', action: 'toggle_mute', description: 'Muet/Unmute', global: true },
  { key: 'c', action: 'mark_complete', description: 'Marquer comme terminé', global: true },
];

// Validation Zod
export const ProgressUpdateSchema = z.object({
  videoTimePosition: z.number().min(0),
  chapterProgress: z.number().min(0).max(100),
  completionStatus: z.enum(['not_started', 'in_progress', 'completed']),
  timestamp: z.string().datetime(),
});

export const ResumeDataSchema = z.object({
  courseId: z.string().uuid(),
  lastChapterId: z.string().uuid(),
  lastLessonId: z.string().uuid(),
  videoTimePosition: z.number().min(0),
  chapterProgress: z.number().min(0).max(100),
  lastWatchedAt: z.string().datetime(),
  autoResume: z.boolean(),
});

// Utilitaires
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

// Constantes
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
export const DEFAULT_VOLUME = 1;
export const DEFAULT_PLAYBACK_RATE = 1;
export const AUTO_SAVE_INTERVAL = 5000; // 5 secondes
export const DEBOUNCE_DELAY = 1000; // 1 seconde
export const CACHE_TTL = 30 * 60 * 1000; // 30 minutes 