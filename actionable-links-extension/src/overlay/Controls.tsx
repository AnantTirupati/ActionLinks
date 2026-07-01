import React from "react";
import { ChevronLeft, ChevronRight, Check, Play, Pause } from "lucide-react";

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
  onTogglePause: () => void;
  onExit: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isCompleted: boolean;
  paused: boolean;
}

export function Controls({
  onPrev,
  onNext,
  onToggleComplete,
  onTogglePause,
  onExit,
  hasPrev,
  hasNext,
  isCompleted,
  paused,
}: ControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-zinc-800">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
          title="Previous Step"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePause}
          className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
          title={paused ? "Resume Walkthrough" : "Pause Walkthrough"}
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
      </div>

      <button
        onClick={onToggleComplete}
        className={`flex-grow py-1.5 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isCompleted
            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
            : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Completed
          </>
        ) : (
          "Complete Step"
        )}
      </button>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
        title="Next Step"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
