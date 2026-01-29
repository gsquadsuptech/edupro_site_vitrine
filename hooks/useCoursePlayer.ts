import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  CoursePlayerState, 
  ResumeData, 
  ProgressUpdate, 
  Chapter, 
  Module,
  CoursePlayerError,
  CoursePlayerConfig,
  DEFAULT_KEYBOARD_SHORTCUTS,
  AUTO_SAVE_INTERVAL,
  DEBOUNCE_DELAY
} from '../types/coursePlayer.types';
import { useAuth } from './useAuth';

interface UseCoursePlayerOptions {
  courseId: string;
  initialChapterId?: string;
  autoResume?: boolean;
  config?: Partial<CoursePlayerConfig>;
  onProgressUpdate?: (progress: ProgressUpdate) => void;
  onChapterChange?: (chapterId: string) => void;
  onComplete?: () => void;
  onError?: (error: CoursePlayerError) => void;
}

interface UseCoursePlayerReturn {
  // État
  isLoading: boolean;
  error: CoursePlayerError | null;
  resumeData: ResumeData | null;
  currentChapter: Chapter | null;
  modules: Module[];
  overallProgress: number;
  completedChapters: Set<string>;
  
  // Actions
  navigateToChapter: (chapterId: string) => void;
  updateProgress: (time: number, progress: number) => void;
  markAsComplete: () => void;
  resumeFromLastPosition: () => void;
  refreshData: () => void;
  markChapterAsCompleted: (chapterId: string) => void;
  
  // État du lecteur
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
}

const DEFAULT_CONFIG: CoursePlayerConfig = {
  autoSaveInterval: AUTO_SAVE_INTERVAL,
  debounceDelay: DEBOUNCE_DELAY,
  maxRetries: 3,
  offlineSupport: true,
  analytics: true,
  keyboardShortcuts: true,
};

export const useCoursePlayer = (options: UseCoursePlayerOptions): UseCoursePlayerReturn => {
  
  const {
    courseId,
    initialChapterId,
    autoResume = true,
    config = {},
    onProgressUpdate,
    onChapterChange,
    onComplete,
    onError,
  } = options;

  // Récupérer l'authentification
  const { user, supabase } = useAuth();
  const supabaseAuthRef = useRef(supabase.auth);
  supabaseAuthRef.current = supabase.auth;

  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  
  // État principal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<CoursePlayerError | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  
  // État du lecteur
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs pour la gestion des intervalles et timeouts
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  // Refs pour le throttling/anti-spam
  const lastSentProgressRef = useRef<number>(-1);
  const lastSentTimeRef = useRef<number>(-1);
  const lastSentAtMsRef = useRef<number>(0);
  const sessionTokenRef = useRef<string | null>(null);
  
  // Refs pour les callbacks stables
  const onErrorRef = useRef(onError);
  const onChapterChangeRef = useRef(onChapterChange);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  onErrorRef.current = onError;
  onChapterChangeRef.current = onChapterChange;
  onProgressUpdateRef.current = onProgressUpdate;

  // Utilitaire de log
  const debugLog = useCallback((label: string, payload?: unknown) => {
    try {
      // Logs utiles côté navigateur avec un préfixe unique
      if (payload !== undefined) {
        // eslint-disable-next-line no-console
        console.log(`[CoursePlayer] ${label}`, payload);
      } else {
        // eslint-disable-next-line no-console
        console.log(`[CoursePlayer] ${label}`);
      }
    } catch {}
  }, []);

  // Fonction pour gérer les erreurs
  const handleError = useCallback((error: CoursePlayerError) => {
    setError(error);
    onErrorRef.current?.(error);
    console.error('CoursePlayer Error:', error);
  }, []);

  // Protection contre les doubles appels
  const loadingRef = useRef<{[key: string]: Promise<any>}>({});

  // Fonction pour charger les données de reprise
  const loadResumeData = useCallback(async (): Promise<ResumeData | null> => {
    const cacheKey = `resume-${courseId}`;
    
    // Si un appel est déjà en cours, attendre le résultat
    if (await loadingRef.current[cacheKey]) {
      return loadingRef.current[cacheKey];
    }
    
    // Créer et mettre en cache la promesse
    const promise = (async () => {
      try {
        // Récupérer le token d'authentification
        const { data: { session } } = await supabaseAuthRef.current.getSession();
        if (!session?.access_token) {
          throw new Error('Token d\'authentification manquant');
        }

        const response = await fetch(`/api/v1/student/courses/${courseId}/resume`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        // Mémoriser le token pour un éventuel flush via sendBeacon
        sessionTokenRef.current = session.access_token;
        debugLog('Resume request status', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Pas de données de reprise, c'est normal pour un nouvel utilisateur
            console.log('Aucune donnée de reprise trouvée, démarrage depuis le début');
            return null;
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Erreur lors du chargement des données de reprise:', err);
        // Ne pas traiter comme une erreur critique, juste retourner null
        return null;
      } finally {
        // Nettoyer le cache après l'appel
        delete loadingRef.current[cacheKey];
      }
    })();
    
    // Mettre en cache la promesse
    loadingRef.current[cacheKey] = promise;
    return promise;
  }, [courseId]);

  // Fonction pour charger les modules et chapitres
  const loadCourseData = useCallback(async (currentResumeData?: ResumeData | null) => {
    try {
      // Récupérer le token d'authentification
      const { data: { session } } = await supabaseAuthRef.current.getSession();
      if (!session?.access_token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/v1/student/courses/${courseId}/chapters`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setModules(data.modules);
      
      // Extraire les chapitres complétés depuis les modules
      const completed = new Set<string>();
      data.modules.forEach((module: any) => {
        module.chapters.forEach((chapter: any) => {
          if (chapter.isCompleted) {
            completed.add(chapter.id);
          }
        });
      });
      setCompletedChapters(completed);
      console.log('📊 Loaded completed chapters:', Array.from(completed));
      console.log('📊 All chapters data:', data.modules.flatMap((m: any) => m.chapters.map((c: any) => ({ id: c.id, title: c.title, isCompleted: c.isCompleted, status: c.status }))));
      
      // Déterminer le chapitre initial
      let targetChapterId: string | undefined = undefined;

      // Construire une liste ordonnée de tous les chapitres (module.order puis chapter.order)
      const sortedAllChapters: Chapter[] = [...(data.modules || [])]
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        .flatMap((module: any) =>
          [...(module.chapters || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
        );

      {
        if (autoResume) {
          // S'il y a une dernière leçon regardée, ouvrir la suivante si elle existe et si la dernière est complétée (ou >= 90%)
          const lastId = currentResumeData?.lastChapterId;
          if (lastId) {
            const lastIndex = sortedAllChapters.findIndex(c => c.id === lastId);
            const lastIsCompleted = completed.has(lastId) || (currentResumeData?.chapterProgress ?? 0) >= 90;
            const hasNext = lastIndex >= 0 && lastIndex + 1 < sortedAllChapters.length;
            if (lastIsCompleted && hasNext) {
              targetChapterId = sortedAllChapters[lastIndex + 1].id;
              console.log('🎯 Auto-resume: opening next chapter after last completed:', { lastId, targetChapterId });
            } else {
              // Sinon, chercher la première leçon non complétée
              const firstUncompleted = sortedAllChapters.find(c => !completed.has(c.id));
              if (firstUncompleted) {
                targetChapterId = firstUncompleted.id;
                console.log('🎯 Auto-resume: opening first uncompleted chapter:', { targetChapterId });
              } else if (sortedAllChapters.length > 0) {
                // Tout est complété: ouvrir la dernière
                targetChapterId = sortedAllChapters[sortedAllChapters.length - 1].id;
                console.log('🎯 Auto-resume: all completed, opening last chapter:', { targetChapterId });
              }
            }
          } else {
            // Pas de dernière leçon: ouvrir la première non complétée si possible
            const firstUncompleted = sortedAllChapters.find(c => !completed.has(c.id));
            if (firstUncompleted) {
              targetChapterId = firstUncompleted.id;
              console.log('🎯 Auto-resume: no last chapter, opening first uncompleted:', { targetChapterId });
            } else if (sortedAllChapters.length > 0) {
              targetChapterId = sortedAllChapters[0].id;
              console.log('🎯 Auto-resume: defaulting to very first chapter:', { targetChapterId });
            }
          }
        }
      }

      // Si toujours aucun chapitre déterminé, fallback au tout premier
      if (!targetChapterId && sortedAllChapters.length > 0) {
        targetChapterId = sortedAllChapters[0].id;
      }

      // Si on n'a toujours rien et qu'un chapterId initial est fourni, l'utiliser en dernier recours
      if (!targetChapterId && initialChapterId) {
        targetChapterId = initialChapterId;
      }
      
      if (targetChapterId) {
        const allChapters = sortedAllChapters;
        const chapter = allChapters.find((chapter: Chapter) => chapter.id === targetChapterId);
        
        if (chapter) {
          setCurrentChapter(chapter);
          onChapterChangeRef.current?.(chapter.id);
        } else {
          // Si le chapitre de reprise n'existe pas, prendre le premier disponible
          if (allChapters.length > 0) {
            const firstChapter = allChapters[0];
            setCurrentChapter(firstChapter);
            onChapterChangeRef.current?.(firstChapter.id);
          }
        }
      }
      
      setOverallProgress(data.overallProgress || 0);
    } catch (err) {
      handleError({
        code: 'COURSE_LOAD_ERROR',
        message: 'Erreur lors du chargement des données du cours',
        details: err,
      });
    }
  }, [courseId, initialChapterId, autoResume, handleError]);

  // Fonction pour sauvegarder la progression
  const saveProgress = useCallback(async (progress: ProgressUpdate) => {
    if (!currentChapter) return;
    
    try {
      // Récupérer le token d'authentification
      const { data: { session } } = await supabaseAuthRef.current.getSession();
      if (!session?.access_token) {
        throw new Error('Token d\'authentification manquant');
      }
      // Mémoriser le token (utile pour sendBeacon)
      sessionTokenRef.current = session.access_token;

      const response = await fetch(
        `/api/v1/student/courses/${courseId}/chapters/${currentChapter.id}/progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progress),
        }
      );
      debugLog('Progress POST response status', response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      // Si la leçon vient d'être complétée, mettre à jour l'état local directement
      if (progress.completionStatus === 'completed' && currentChapter) {
        debugLog('Lesson completed, marking as completed locally', { chapterId: currentChapter.id, title: currentChapter.title });
        setCompletedChapters(prev => {
          const newSet = new Set(prev);
          newSet.add(currentChapter.id);
          return newSet;
        });
      }
      
      onProgressUpdateRef.current?.(progress);
    } catch (err) {
      handleError({
        code: 'PROGRESS_SAVE_ERROR',
        message: 'Erreur lors de la sauvegarde de la progression',
        details: err,
      });
      debugLog('Progress POST error', err);
    }
  }, [courseId, currentChapter, handleError]);

  // Fonction pour marquer un chapitre comme terminé
  const markAsComplete = useCallback(async () => {
    if (!currentChapter) return;
    
    const progress: ProgressUpdate = {
      videoTimePosition: currentTime,
      chapterProgress: 100,
      completionStatus: 'completed',
      timestamp: new Date().toISOString(),
    };
    
    await saveProgress(progress);
    
    // Mettre à jour l'état local
    setOverallProgress(prev => Math.min(prev + 10, 100));
    
    onComplete?.();
  }, [currentChapter, currentTime, saveProgress, onComplete]);

  // Fonction pour naviguer vers un chapitre
  const navigateToChapter = useCallback((chapterId: string) => {
    const chapter = modules
      .flatMap(module => module.chapters)
      .find(ch => ch.id === chapterId);
    
    if (chapter) {
      setCurrentChapter(chapter);
      setCurrentTime(0);
      setIsPlaying(false);
      onChapterChangeRef.current?.(chapter.id);
      
      // Pas besoin de sauvegarder immédiatement - cela sera fait automatiquement
      // quand la vidéo commence à être regardée
      console.log('📍 Navigated to chapter:', chapter.title);
    }
  }, [modules]);

  // Fonction pour reprendre depuis la dernière position
  const resumeFromLastPosition = useCallback(() => {
    if (resumeData && resumeData.videoTimePosition > 0) {
      setCurrentTime(resumeData.videoTimePosition);
      setIsPlaying(true);
    }
  }, [resumeData]);

  // Fonction pour marquer un chapitre comme terminé
  const markChapterAsCompleted = useCallback((chapterId: string) => {
    console.log('🔄 markChapterAsCompleted called for:', chapterId);
    setCompletedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapterId);
      console.log('✅ Marked chapter as completed:', chapterId);
      console.log('📋 Updated completedChapters Set:', Array.from(newSet));
      return newSet;
    });
  }, []);

  // Fonction pour mettre à jour la progression avec debounce
  const updateProgress = useCallback((time: number, progress: number) => {
    debugLog('updateProgress called', { time, progress, hidden: typeof document !== 'undefined' ? document.hidden : undefined });
    setCurrentTime(time);
    
    // Ne rien envoyer si l'onglet est masqué pour éviter le bruit
    if (typeof document !== 'undefined' && document.hidden) {
      debugLog('updateProgress skipped: document hidden');
      return;
    }

    // Debounce pour éviter trop de sauvegardes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (currentChapter) {
        const now = Date.now();
        const minIntervalMs = 15000; // cap: ~4 requêtes/min max
        const minProgressDelta = 2; // en pourcentage
        const minTimeDeltaSec = 5; // secondes regardées

        const lastSentAt = lastSentAtMsRef.current || 0;
        const lastProgress = lastSentProgressRef.current < 0 ? progress : lastSentProgressRef.current;
        const lastTime = lastSentTimeRef.current < 0 ? time : lastSentTimeRef.current;

        const progressChangedEnough = Math.abs(progress - lastProgress) >= minProgressDelta;
        const timeChangedEnough = Math.abs(time - lastTime) >= minTimeDeltaSec;
        const intervalOk = now - lastSentAt >= minIntervalMs;

        const isCompleted = progress >= 90;
        const shouldSend = isCompleted || (intervalOk && (progressChangedEnough || timeChangedEnough));

        debugLog('updateProgress decision', {
          chapterId: currentChapter.id,
          now,
          lastSentAt,
          minIntervalMs,
          lastProgress,
          lastTime,
          progressChangedEnough,
          timeChangedEnough,
          intervalOk,
          isCompleted,
          shouldSend,
        });

        if (!shouldSend) {
          debugLog('updateProgress skipped: thresholds not met');
          return;
        }

        const progressUpdate: ProgressUpdate = {
          videoTimePosition: time,
          chapterProgress: progress,
          completionStatus: isCompleted ? 'completed' : 'in_progress',
          timestamp: new Date().toISOString(),
        };

        if (isCompleted && !completedChapters.has(currentChapter.id)) {
          markChapterAsCompleted(currentChapter.id);
        }

        // Mémoriser le dernier snapshot envoyé
        lastSentProgressRef.current = progress;
        lastSentTimeRef.current = time;
        lastSentAtMsRef.current = now;

        debugLog('updateProgress sending', { chapterId: currentChapter.id, time, progress });
        saveProgress(progressUpdate);
      }
    }, finalConfig.debounceDelay);
  }, [currentChapter, saveProgress, finalConfig.debounceDelay, completedChapters, markChapterAsCompleted]);


  // Fonction pour rafraîchir les données
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    retryCountRef.current = 0;
    
    try {
      // Charger d'abord les données de reprise
      const resumeDataResult = await loadResumeData();
      setResumeData(resumeDataResult);
      
      // Puis charger les données du cours
      await loadCourseData(resumeDataResult);
    } catch (err) {
      if (retryCountRef.current < finalConfig.maxRetries) {
        retryCountRef.current++;
        setTimeout(refreshData, 1000 * retryCountRef.current);
      } else {
        handleError({
          code: 'REFRESH_ERROR',
          message: 'Erreur lors du rafraîchissement des données',
          details: err,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadResumeData, loadCourseData, finalConfig.maxRetries, handleError]);

  // Sauvegarde automatique périodique
  useEffect(() => {
    if (currentChapter && finalConfig.autoSaveInterval > 0) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (currentTime > 0) {
          const progress = (currentTime / (currentChapter.duration * 60)) * 100;
          debugLog('autosave tick', { time: currentTime, progress });
          updateProgress(currentTime, progress);
        }
      }, finalConfig.autoSaveInterval);
    }
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [currentChapter, currentTime, updateProgress, finalConfig.autoSaveInterval]);

  // Flush final via sendBeacon quand l'onglet est masqué ou la page se ferme
  useEffect(() => {
    const flushProgress = () => {
      if (!currentChapter) return;
      const token = sessionTokenRef.current;
      if (!token) return;
      const time = currentTime;
      const progress = currentChapter.duration > 0
        ? Math.min(100, Math.max(0, (time / (currentChapter.duration * 60)) * 100))
        : 0;
      const isCompleted = progress >= 90;
      const payload = {
        videoTimePosition: time,
        chapterProgress: progress,
        completionStatus: isCompleted ? 'completed' : 'in_progress',
        timestamp: new Date().toISOString(),
        token,
        // Marqueur facultatif pour le serveur
        _beacon: true,
      };
      try {
        const url = `/api/v1/student/courses/${courseId}/chapters/${currentChapter.id}/progress`;
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        // sendBeacon ne permet pas de headers personnalisés; le serveur lira token dans le body
        debugLog('sendBeacon flush', { chapterId: currentChapter.id, time, progress, isCompleted, size: blob.size });
        navigator.sendBeacon?.(url, blob);
      } catch {
        // no-op
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        flushProgress();
      }
    };
    const onPageHide = () => flushProgress();

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('pagehide', onPageHide);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', onPageHide);
      }
    };
  }, [courseId, currentChapter, currentTime]);

  // Réinitialiser les compteurs quand le chapitre change
  useEffect(() => {
    lastSentProgressRef.current = -1;
    lastSentTimeRef.current = -1;
    lastSentAtMsRef.current = 0;
    if (currentChapter?.id) {
      debugLog('Chapter changed, reset local throttle counters', { chapterId: currentChapter.id });
    }
  }, [currentChapter?.id]);

  // Raccourcis clavier
  useEffect(() => {
    if (!finalConfig.keyboardShortcuts) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est dans un champ de saisie
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const shortcut = DEFAULT_KEYBOARD_SHORTCUTS.find(s => s.key === e.key);
      if (!shortcut) return;
      
      e.preventDefault();
      
      switch (shortcut.action) {
        case 'toggle_play':
          setIsPlaying(!isPlaying);
          break;
        case 'previous_chapter':
          // Logique pour chapitre précédent
          break;
        case 'next_chapter':
          // Logique pour chapitre suivant
          break;
        case 'toggle_fullscreen':
          setIsFullscreen(!isFullscreen);
          break;
        case 'toggle_mute':
          setIsMuted(!isMuted);
          break;
        case 'mark_complete':
          markAsComplete();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [finalConfig.keyboardShortcuts, isPlaying, isFullscreen, isMuted, markAsComplete]);

  // Chargement initial - éviter les doubles appels
  const initializedRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (initializedRef.current !== courseId) {
      initializedRef.current = courseId;
      refreshData();
    }
  }, [courseId]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // État
    isLoading,
    error,
    resumeData,
    currentChapter,
    modules,
    overallProgress,
    completedChapters,
    
    // Actions
    navigateToChapter,
    updateProgress,
    markAsComplete,
    resumeFromLastPosition,
    refreshData,
    markChapterAsCompleted,
    
    // État du lecteur
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isFullscreen,
    setIsFullscreen,
  };
}; 