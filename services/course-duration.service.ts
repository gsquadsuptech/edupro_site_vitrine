import { SupabaseClient } from '@supabase/supabase-js';

export class CourseDurationService {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    static formatDuration(minutes: number): string {
        if (!minutes) return '0h';

        // Si moins d'une heure
        if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        }

        // Si heures entières
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    }

    static minutesToHours(minutes: number): number {
        if (!minutes) return 0;
        return Number((minutes / 60).toFixed(1));
    }

    /**
     * Calcule la durée totale d'un cours en minutes en analysant le contenu de chaque leçon
     */
    async calculateCourseDurationWithDetailsFromContent(courseId: string): Promise<{ duration: number; lessonsCount: number }> {
        // Récupérer toutes les sections et leçons du cours
        const { data: sections, error } = await this.supabase
            .from('sections')
            .select(`
        id,
        lessons (
          id,
          type,
          duration,
          content
        )
      `)
            .eq('course_id', courseId);

        if (error) {
            console.error('Error fetching course content:', error);
            throw error;
        }

        let totalMinutes = 0;
        let totalLessons = 0;

        if (sections) {
            sections.forEach((section: any) => {
                if (section.lessons) {
                    section.lessons.forEach((lesson: any) => {
                        totalLessons++;

                        // Essayer d'abord la durée explicite de la et si elle est définie sur l'objet leçon lui-même
                        // Note: Priorité au calcul du contenu si possible, ou fallback sur la valeur stockée

                        const contentDuration = this.getLessonDurationFromContent(lesson.type, lesson.content);

                        if (contentDuration > 0) {
                            totalMinutes += contentDuration;
                        } else if (lesson.duration) {
                            totalMinutes += lesson.duration;
                        }
                    });
                }
            });
        }

        return {
            duration: Math.ceil(totalMinutes),
            lessonsCount: totalLessons
        };
    }

    /**
     * Helper pour extraire la durée d'une leçon selon son type et contenu
     */
    private getLessonDurationFromContent(type: string, content: any): number {
        if (!content) return 0;

        // Supabase peut retourner le JSON comme objet ou string
        const data = typeof content === 'string' ? JSON.parse(content) : content;

        switch (type) {
            case 'video':
                // Durée stockée en secondes
                return data.duration ? data.duration / 60 : 0;

            case 'audio':
                // Durée stockée en secondes
                return data.duration ? data.duration / 60 : 0;

            case 'document':
            case 'quiz':
                // Durée stockée en minutes
                return data.duration || 0;

            case 'exercise':
                // Durée estimée en minutes
                return data.estimated_duration || 0;

            default:
                return 0;
        }
    }

    /**
     * Met à jour la durée du cours dans la base de données après recalcul
     */
    async updateCourseDurationFromContent(courseId: string): Promise<number> {
        const { duration } = await this.calculateCourseDurationWithDetailsFromContent(courseId);

        // Mettre à jour le cours
        const { error } = await this.supabase
            .from('courses')
            .update({ duration })
            .eq('id', courseId);

        if (error) {
            console.error('Error updating course duration:', error);
            throw error;
        }

        return duration;
    }

    /**
     * Calcule les durées pour plusieurs cours
     */
    async calculateMultipleCourseDurations(courseIds: string[]): Promise<Map<string, number>> {
        const durations = new Map<string, number>();

        // Traitement séquentiel pour éviter de surcharger si la liste est longue, 
        // ou Promise.all si c'est raisonnable. Ici Promise.all pour la rapidité.
        await Promise.all(
            courseIds.map(async (id) => {
                try {
                    const { duration } = await this.calculateCourseDurationWithDetailsFromContent(id);
                    durations.set(id, duration);
                } catch (err) {
                    console.error(`Failed to calculate duration for course ${id}`, err);
                    durations.set(id, 0);
                }
            })
        );

        return durations;
    }
}

export const createCourseDurationService = (supabase: SupabaseClient) => {
    return new CourseDurationService(supabase);
};
