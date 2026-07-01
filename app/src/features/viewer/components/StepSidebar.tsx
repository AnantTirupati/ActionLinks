import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import type { Step } from "../hooks/useTutorialProgress";

interface StepSidebarProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepSelect: (stepNum: number) => void;
  onToggleStepComplete: (stepNum: number) => void;
}

export function StepSidebar({
  steps,
  currentStep,
  completedSteps,
  onStepSelect,
  onToggleStepComplete,
}: StepSidebarProps) {
  return (
    <aside className="w-80 border-r border-outline-variant bg-surface-container-lowest flex flex-col shrink-0 overflow-hidden h-full">
      <div className="p-4 border-b border-outline-variant shrink-0 bg-surface">
        <ProgressBar completedCount={completedSteps.length} totalCount={steps.length} />
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {steps.map((step) => {
          const isActive = step.step_number === currentStep;
          const isCompleted = completedSteps.includes(step.step_number);

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-transparent border-transparent hover:bg-surface-container-low text-on-surface"
              }`}
              onClick={() => onStepSelect(step.step_number)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStepComplete(step.step_number);
                }}
                className={`mt-0.5 shrink-0 transition-colors cursor-pointer ${
                  isCompleted ? "text-primary" : "text-outline hover:text-on-surface"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 fill-primary text-on-primary" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="min-w-0">
                <div className="text-[11px] font-bold text-outline-variant uppercase tracking-wider mb-0.5">
                  Step {step.step_number}
                </div>
                <h4 className="text-label-md font-semibold line-clamp-2 leading-snug">
                  {step.title}
                </h4>
                <span className="text-[10px] bg-surface-container border border-outline-variant px-1.5 py-0.5 rounded text-on-surface-variant mt-1.5 inline-block font-mono capitalize">
                  {step.action_type}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
