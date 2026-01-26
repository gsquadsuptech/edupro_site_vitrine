export interface UserCourse {
    id: string;
    course_id: string;
    title: string;
    description: string;
    thumbnail?: string;
    status: 'pending' | 'active' | 'completed' | 'inactive';
    progress: number;
    instructor: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    category: string;
    enrolled_at: string;
    last_accessed_at?: string;
}

export interface UserCoursesStats {
    total: number;
    completed: number;
    ongoing: number;
    to_start: number;
}

export const UserCoursesService = {
    // These would typically call the Supabase API or your backend
    // Since this is a service definition to fix missing imports, 
    // we define the interfaces used by the hooks.
};
