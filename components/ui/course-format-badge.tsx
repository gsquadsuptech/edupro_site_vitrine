import { BookOpen, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseFormatBadgeProps {
    format?: string;
    loading?: boolean;
    className?: string;
}

export function CourseFormatBadge({ format, loading = false, className }: CourseFormatBadgeProps) {
    const isSessionFormat = format === 'session';

    const formatConfig = {
        label: isSessionFormat ? 'Session/Cohorte' : 'Auto-formation',
        icon: isSessionFormat ? Calendar : BookOpen,
        colors: isSessionFormat
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-green-50 text-green-700 border-green-200'
    };

    const IconComponent = formatConfig.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-200",
            formatConfig.colors,
            className
        )}>
            <IconComponent className="w-3 h-3" />
            <span>{formatConfig.label}</span>
            {loading && (
                <Loader2 className="w-3 h-3 animate-spin" />
            )}
        </div>
    );
}
