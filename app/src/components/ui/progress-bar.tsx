import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-2 bg-surface-container-highest rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full bg-primary rounded-full transition-all duration-500", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
