import React from "react";
import { Step } from "@actionlinks/shared";

interface TooltipProps {
  step: Step;
}

export function Tooltip({ step }: TooltipProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
          {step.action_type}
        </span>
        <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
          {step.title}
        </h4>
      </div>
      
      <p className="text-xs text-zinc-300 leading-relaxed font-medium">
        {step.instruction}
      </p>

      {step.selector && (
        <div className="bg-zinc-950 p-2 rounded border border-zinc-800 flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 font-bold">Target Element:</span>
          <code className="text-[10px] font-mono text-emerald-400 break-all select-all">
            {step.selector}
          </code>
        </div>
      )}
    </div>
  );
}
