import { cn } from "@/lib/utils";
import { CheckCircle2, Loader, Circle } from "lucide-react";
import type { ProcessingStep } from "@/types";

interface ProcessingChecklistProps {
  steps: ProcessingStep[];
}

export function ProcessingChecklist({ steps }: ProcessingChecklistProps) {
  return (
    <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col gap-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className={cn(
            "flex items-start gap-4",
            step.status === "active" &&
              "p-2 -mx-2 rounded-md bg-secondary-container/30 border border-secondary-container/50 shimmer",
            step.status === "pending" && "opacity-50"
          )}
        >
          <div
            className={cn(
              "mt-1 flex-shrink-0",
              step.status === "done" && "text-primary",
              step.status === "active" && "text-primary",
              step.status === "pending" && "text-outline"
            )}
          >
            {step.status === "done" && (
              <CheckCircle2 className="w-6 h-6 fill-primary text-on-primary" />
            )}
            {step.status === "active" && (
              <Loader className="w-6 h-6 animate-spin" />
            )}
            {step.status === "pending" && <Circle className="w-6 h-6" />}
          </div>
          <div>
            <div
              className={cn(
                "text-label-md text-on-surface",
                step.status === "active" && "text-primary font-bold"
              )}
            >
              {step.title}
            </div>
            <div className="text-body-md text-on-surface-variant">
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
