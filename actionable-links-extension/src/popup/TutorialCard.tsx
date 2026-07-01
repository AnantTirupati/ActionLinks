import React from "react";
import { Tutorial } from "@actionlinks/shared";
import { Play, BookOpen, Clock } from "lucide-react";

interface TutorialCardProps {
  tutorial: Tutorial;
  onPlay: () => void;
}

export function TutorialCard({ tutorial, onPlay }: TutorialCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col gap-2.5 hover:border-zinc-700 transition-all select-none">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-zinc-100 truncate">
            {tutorial.title}
          </h4>
          <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
            {tutorial.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-0.5 border-t border-zinc-800/60 pt-2 shrink-0">
        <div className="flex items-center gap-2.5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-600" />
            {tutorial.estimatedTime} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-zinc-600" />
            {tutorial.steps.length} steps
          </span>
        </div>

        <button
          onClick={onPlay}
          className="py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
        >
          <Play className="w-3 h-3 fill-white" />
          Play Guide
        </button>
      </div>
    </div>
  );
}
