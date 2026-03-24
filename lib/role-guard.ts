export const canAccessRoute = (roles: string[], path: string): boolean => {
    // Basic implementation: if user has any role, they can generally access authenticated routes
    if (roles.includes('superadmin')) return true;
    if (roles.includes('admin')) return true;

    // Example restrictions
    if (path.startsWith('/admin') && !roles.includes('superadmin') && !roles.includes('admin')) {
        return false;
    }

    return true;
}

export interface DashboardSpace {
    id: string;
    labelFr: string;
    labelEn: string;
    route: string;
    icon: string;
}

export const getAvailableDashboards = (roles: string[]): DashboardSpace[] => {
    const spaces: DashboardSpace[] = [];

    if (roles.includes('superadmin') || roles.includes('admin')) {
        spaces.push({
            id: 'admin',
            labelFr: 'Tableau de bord Admin',
            labelEn: 'Admin Dashboard',
            route: process.env.NEXT_PUBLIC_DASHBOARD_ADMIN_URL || '/admin',
            icon: 'Settings'
        });
    }

    if (roles.includes('instructor')) {
        spaces.push({
            id: 'instructor',
            labelFr: 'Espace Formateur',
            labelEn: 'Instructor Dashboard',
            route: process.env.NEXT_PUBLIC_DASHBOARD_INSTRUCTOR_URL || '/instructor',
            icon: 'GraduationCap'
        });
    }

    if (roles.includes('student')) {
        spaces.push({
            id: 'student',
            labelFr: 'Mon Espace Formation',
            labelEn: 'My Learning Space',
            route: process.env.NEXT_PUBLIC_DASHBOARD_STUDENT_URL || '/dashboard',
            icon: 'LayoutDashboard'
        });
    }

    return spaces;
}

export const getDefaultRouteForUser = (roles: string[]): string => {
    const dashboards = getAvailableDashboards(roles);
    // Prioritize Admin > Instructor > Student
    if (roles.includes('superadmin') || roles.includes('admin')) {
        return dashboards.find(d => d.id === 'admin')?.route || '/admin';
    }
    if (roles.includes('instructor')) {
        return dashboards.find(d => d.id === 'instructor')?.route || '/instructor';
    }
    return dashboards.find(d => d.id === 'student')?.route || '/dashboard';
}
