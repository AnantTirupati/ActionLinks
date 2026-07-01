import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { Step } from "../hooks/useTutorialProgress";

interface StepCardProps {
  step: Step;
  totalSteps: number;
  isCompleted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleComplete: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StepCard({
  step,
  totalSteps,
  isCompleted,
  onPrev,
  onNext,
  onToggleComplete,
  hasPrev,
  hasNext,
}: StepCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col gap-8 w-full max-w-2xl">
      {/* Step Info Badge */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant/60">
        <div>
          <span className="text-label-sm text-primary uppercase font-bold tracking-wider">
            Active Step
          </span>
          <h2 className="text-headline-lg font-black text-on-surface mt-1">
            {step.step_number}. {step.title}
          </h2>
        </div>
        <span className="text-body-md text-outline font-medium shrink-0">
          Step {step.step_number} of {totalSteps}
        </span>
      </div>

      {/* Instructions Body */}
      <div className="text-body-md text-on-surface-variant leading-relaxed min-h-[120px]">
        <p className="whitespace-pre-line">{step.instruction}</p>
      </div>

      {/* Target Action Badge & CSS Selector Info */}
      <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-label-sm text-on-surface-variant font-bold">
            Interactive Selector Reference
          </span>
          <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-mono font-bold capitalize">
            {step.action_type}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-outline font-semibold">Target Element:</span>
          <code className="text-body-md bg-surface border border-outline-variant rounded px-3 py-1.5 font-mono text-primary font-bold overflow-x-auto block">
            {step.selector || "None (General Guide)"}
          </code>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant/60">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 rounded-lg text-label-md font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={onToggleComplete}
          className={`w-full sm:flex-1 py-2.5 rounded-lg text-label-md font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
            isCompleted
              ? "bg-secondary-container text-primary border border-primary-container"
              : "bg-primary text-on-primary hover:bg-primary-container"
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4" />
              Step Completed
            </>
          ) : (
            "Complete Step"
          )}
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="w-full sm:w-auto px-4 py-2.5 border border-outline-variant text-on-surface hover:bg-surface-container-low disabled:opacity-50 rounded-lg text-label-md font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
