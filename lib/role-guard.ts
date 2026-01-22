export const canAccessRoute = (roles: string[], path: string): boolean => {
    // Basic implementation: if user has any role, they can generally access authenticated routes
    // In a real app, this would check specific permissions
    if (roles.includes('superadmin')) return true;
    if (roles.includes('admin')) return true;

    // Example restrictions
    if (path.startsWith('/admin') && !roles.includes('superadmin') && !roles.includes('admin')) {
        return false;
    }

    return true;
}

export const getDefaultRouteForUser = (roles: string[]): string => {
    if (roles.includes('superadmin')) {
        return '/admin';
    }
    if (roles.includes('admin')) {
        return '/admin';
    }
    if (roles.includes('instructor')) {
        return '/instructor';
    }
    // Default for students or users with no specific role
    return '/dashboard';
}
