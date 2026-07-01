import { cn } from "@/lib/utils";
import { Video, SearchX, Clock } from "lucide-react";

const iconMap = {
  "no-tutorials": Video,
  "no-results": SearchX,
  "no-activity": Clock,
};

interface EmptyStateProps {
  type: "no-tutorials" | "no-results" | "no-activity";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[type];

  return (
    <div
      className={cn(
        "bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center ambient-shadow",
        className
      )}
    >
      <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full mb-4">
        <Icon className="w-8 h-8 text-on-surface-variant" />
      </div>
      <h2 className="text-headline-md text-on-surface mb-2">{title}</h2>
      <p className="text-body-md text-on-surface-variant mb-6 max-w-[250px]">
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-primary-container text-on-primary text-label-md px-6 py-2 rounded hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
