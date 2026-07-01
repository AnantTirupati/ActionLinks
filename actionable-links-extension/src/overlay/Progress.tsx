import React from "react";

interface ProgressProps {
  completedCount: number;
  totalCount: number;
}

export function Progress({ completedCount, totalCount }: ProgressProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-1 select-none">
      <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold tracking-wide">
        <span>{completedCount} OF {totalCount} STEPS</span>
        <span className="text-blue-400">{percentage}%</span>
      </div>
      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
