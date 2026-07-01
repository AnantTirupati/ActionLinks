import { cn } from "@/lib/utils";
import { GripVertical, Video } from "lucide-react";
import Image from "next/image";

interface StepListItemProps {
  number: number;
  title: string;
  timestamp: string;
  thumbnail?: string;
  active?: boolean;
  onClick?: () => void;
}

export function StepListItem({
  number,
  title,
  timestamp,
  thumbnail,
  active,
  onClick,
}: StepListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-outline-variant hover:border-outline cursor-pointer transition-all active:scale-[0.98]",
        active
          ? "bg-secondary-container border-primary-container shadow-sm"
          : "bg-surface-container-lowest"
      )}
    >
      <GripVertical className="w-4 h-4 text-outline shrink-0 cursor-grab" />
      
      <div className="w-12 h-8 rounded bg-surface-container relative overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <Video className="w-4 h-4 text-outline" />
        )}
        <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[9px] px-0.5 rounded font-mono">
          {timestamp}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-label-sm text-outline-variant uppercase tracking-wider">
          Step {number}
        </div>
        <div className="text-label-md text-on-surface truncate font-semibold">
          {title}
        </div>
      </div>
    </div>
  );
}
