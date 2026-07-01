import React from "react";

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-label-sm text-on-surface-variant mb-1.5">
        <span>
          {completedCount} of {totalCount} steps completed
        </span>
        <span className="font-bold text-primary">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant/60">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
