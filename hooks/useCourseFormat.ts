import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UseCourseFormatProps {
  courseId: string;
}

export const useCourseFormat = ({ courseId }: UseCourseFormatProps) => {
  const { supabase } = useAuth();
  const [courseFormat, setCourseFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseFormat = async () => {
      if (!courseId || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('format')
          .eq('id', courseId)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du format du cours:', error);
          setError(error.message);
        } else {
          setCourseFormat(data?.format || 'auto-formation');
        }
      } catch (err) {
        console.error('Exception lors de la récupération du format:', err);
        setError('Une erreur s\'est produite lors de la récupération du format du cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseFormat();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel(`course-format-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'courses',
          filter: `id=eq.${courseId}`,
        },
        (payload) => {
          console.log('Format du cours mis à jour:', payload.new);
          setCourseFormat(payload.new?.format || 'auto-formation');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId, supabase]);

  return {
    courseFormat,
    loading,
    error,
  };
};
