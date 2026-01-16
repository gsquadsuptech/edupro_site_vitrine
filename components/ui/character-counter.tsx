import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = current > max;

  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      <span 
        className={cn(
          "transition-colors",
          isOverLimit && "text-destructive font-medium",
          isNearLimit && !isOverLimit && "text-amber-600 font-medium"
        )}
      >
        {current}
      </span>
      <span className="text-muted-foreground/70">/{max} caractères</span>
    </div>
  );
}