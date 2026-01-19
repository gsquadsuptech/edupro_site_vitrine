import { AuthError } from '@supabase/supabase-js';

export const getPublicAuthError = (error: unknown): string => {
    if (!error) return 'Une erreur inconnue est survenue.';

    // Handle Supabase AuthError
    if ((error as AuthError).message) {
        switch ((error as AuthError).message) {
            case 'Invalid login credentials':
                return 'Email ou mot de passe incorrect.';
            case 'User not found':
                return 'Aucun utilisateur trouvé avec cet email.';
            case 'Email not confirmed':
                return 'Veuillez confirmer votre email avant de vous connecter.';
            default:
                return (error as AuthError).message;
        }
    }

    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;

    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
};

export const getSanitizedForLog = (error: unknown): any => {
    // In production, we might want to strip sensitive info
    // For now, return basic info
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }
    return error;
};
