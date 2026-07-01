import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { label: string }[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-surface-variant -z-10" />
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isPending = stepNum > currentStep;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 bg-background px-2"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-label-md shadow-[0_0_0_4px_#f9f9f9]",
                  isCompleted && "bg-primary text-on-primary",
                  isActive &&
                    "bg-primary-container text-on-primary ring-4 ring-primary-container/20 animate-pulse-subtle",
                  isPending &&
                    "border border-surface-variant bg-surface-container-lowest text-on-surface-variant"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  "text-label-sm",
                  isCompleted && "text-primary",
                  isActive && "text-primary font-bold",
                  isPending && "text-on-surface-variant"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
