/**
 * Types pour le workflow de validation des cours marketplace
 */

export interface CourseValidationComment {
    id: string;
    course_id: string;
    user_id: string;
    comment_text: string;
    created_at: string;
    updated_at?: string;
    user?: {
        id: string;
        full_name?: string;
        avatar_url?: string;
    };
}

export type CourseValidationAction = 'approve' | 'reject' | 'request_revision';

export interface CourseValidationRequest {
    action: CourseValidationAction;
    comment?: string;
    publication_mode?: 'prepublication' | 'official';
}

export interface CourseValidationResponse {
    success: boolean;
    message: string;
    course?: {
        id: string;
        status: string;
    };
}

export interface CourseSubmission {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: {
        id: string;
        name: string;
        avatar_url?: string;
        organization?: {
            name: string;
        };
    };
    category: {
        id: string;
        name: string;
    };
    level: string;
    duration: number;
    lessons_count: number;
    price: number;
    submitted_at: string;
    status: 'pending_review' | 'published' | 'needs_revision' | 'archived';
}

export interface CourseValidationError {
    field: string;
    message: string;
}

export interface CourseValidationResult {
    valid: boolean;
    errors: CourseValidationError[];
}

