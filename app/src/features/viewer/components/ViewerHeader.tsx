import React from "react";
import Link from "next/link";
import { X, Keyboard, Clock } from "lucide-react";

interface ViewerHeaderProps {
  tutorialTitle: string;
  estimatedTime: number; // in minutes
  completedStepsCount: number;
  totalStepsCount: number;
  exitUrl: string;
  onOpenShortcuts: () => void;
}

export function ViewerHeader({
  tutorialTitle,
  estimatedTime,
  completedStepsCount,
  totalStepsCount,
  exitUrl,
  onOpenShortcuts,
}: ViewerHeaderProps) {
  const remainingSteps = Math.max(0, totalStepsCount - completedStepsCount);
  const timePerStep = totalStepsCount > 0 ? estimatedTime / totalStepsCount : 2;
  const timeLeftMinutes = Math.round(remainingSteps * timePerStep);

  return (
    <header className="w-full h-16 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-6 shrink-0 z-50">
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={exitUrl}
          className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </Link>
        <div className="h-4 w-px bg-outline-variant shrink-0" />
        <div className="min-w-0 flex flex-col justify-center">
          <h1 className="text-label-md font-bold text-on-surface truncate">
            {tutorialTitle}
          </h1>
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5 font-medium">
            <Clock className="w-3 h-3 text-outline shrink-0" />
            {timeLeftMinutes > 0 ? `${timeLeftMinutes} mins remaining` : "Finished"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenShortcuts}
          className="p-2 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-md transition-colors flex items-center gap-1.5 text-label-sm cursor-pointer"
          title="Keyboard Shortcuts Guide"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </button>
        <Link
          href={exitUrl}
          className="px-4 py-2 bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low rounded-md text-label-md font-medium transition-colors"
        >
          Exit Player
        </Link>
      </div>
    </header>
  );
}
