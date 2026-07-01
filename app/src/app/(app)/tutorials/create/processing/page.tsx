"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import { ProcessingChecklist } from "@/components/ui/processing-checklist";
import { X, Timer, AlertCircle } from "lucide-react";
import type { ProcessingStep } from "@/types";
import { generateAITutorial } from "@/features/tutorials/actions";
import { logger } from "@/lib/logger";

const processingSteps: ProcessingStep[] = [
  {
    id: "proc-1",
    title: "Source fetched successfully",
    description: "Video downloaded and validated.",
    status: "done",
  },
  {
    id: "proc-2",
    title: "Extracting audio and frames",
    description: "Keyframes and transcript generated.",
    status: "done",
  },
  {
    id: "proc-3",
    title: "Understanding UI elements and actions",
    description: "Mapping clicks and text inputs to semantic actions.",
    status: "active",
  },
  {
    id: "proc-4",
    title: "Generating step-by-step workflow",
    description: "Synthesizing final tutorial steps.",
    status: "pending",
  },
];

function AIProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorialId = searchParams.get("id");

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("Initializing AI pipeline...");
  const [steps, setSteps] = useState<ProcessingStep[]>(processingSteps);

  const stepperSteps = [
    { label: "Source" },
    { label: "Processing" },
    { label: "Edit" },
  ];

  const startGeneration = async () => {
    if (!tutorialId) return;
    setError(null);
    setProgress(0);
    setLoadingText("Connecting to Gemini 2.5 Flash...");
    
    // Reset steps status to loading/pending
    setSteps(currentSteps => currentSteps.map((s, idx) => ({
      ...s,
      status: idx === 0 ? "active" : "pending"
    })));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 25) {
          return prev + 5;
        } else if (prev < 65) {
          setLoadingText("Analyzing source context...");
          // Mark step 1 done, step 2 active
          setSteps(currentSteps => currentSteps.map(s => {
            if (s.id === "proc-1") return { ...s, status: "done" };
            if (s.id === "proc-2") return { ...s, status: "active" };
            return s;
          }));
          return prev + 3;
        } else if (prev < 85) {
          setLoadingText("Generating tutorial curriculum steps...");
          // Mark step 2 done, step 3 active
          setSteps(currentSteps => currentSteps.map(s => {
            if (s.id === "proc-2") return { ...s, status: "done" };
            if (s.id === "proc-3") return { ...s, status: "active" };
            return s;
          }));
          return prev + 1;
        } else if (prev < 95) {
          setLoadingText("Verifying steps schema & writing to database...");
          // Mark step 3 done, step 4 active
          setSteps(currentSteps => currentSteps.map(s => {
            if (s.id === "proc-3") return { ...s, status: "done" };
            if (s.id === "proc-4") return { ...s, status: "active" };
            return s;
          }));
          return prev + 0.5;
        }
        return prev;
      });
    }, 450);

    try {
      await generateAITutorial(tutorialId);
      
      clearInterval(interval);
      setProgress(100);
      setLoadingText("Ready! Redirecting...");
      
      setSteps(currentSteps => currentSteps.map(s => ({ ...s, status: "done" })));

      setTimeout(() => {
        router.push(`/tutorials/${tutorialId}/edit`);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Failed to generate AI tutorial steps.");
      logger.error("AI Generation execution failed on page client", err);
    }
  };

  useEffect(() => {
    startGeneration();
  }, [tutorialId]);

  return (
    <div className="bg-background min-h-screen text-on-background flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="w-full h-16 flex items-center justify-between px-6 bg-surface-container-lowest border-b border-outline-variant shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/tutorials/create"
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1.5 rounded-full hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </Link>
          <span className="text-headline-md font-bold text-primary">
            Action Links
          </span>
        </div>
        <div className="text-label-md text-on-surface-variant font-medium">
          Create Tutorial
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-10 pb-16 px-6 max-w-4xl w-full mx-auto">
        {/* Stepper */}
        <div className="w-full max-w-2xl mb-12">
          {/* Custom Step 1 Completed, Step 2 Active, Step 3 Pending */}
          <Stepper steps={stepperSteps} currentStep={2} />
        </div>

        {/* Content Box */}
        <div className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col items-center relative overflow-hidden">
          {/* Top border indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-surface-container">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-center mb-8 mt-4">
            <h1 className={`text-display mb-2 font-black ${error ? "text-error" : "text-on-surface"}`}>
              {error ? "Generation Failed" : "AI is analyzing your source..."}
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              {error ? "An error occurred while compiling your tutorial." : "We're extracting key elements to build your interactive tutorial."}
            </p>
          </div>

          {error ? (
            <div className="flex flex-col items-center gap-6 py-6 w-full max-w-md">
              <div className="w-16 h-16 rounded-full bg-error-container/20 border border-error-container flex items-center justify-center text-error">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg w-full text-center shadow-inner">
                <p className="text-body-md text-error font-medium break-words leading-relaxed">
                  {error}
                </p>
              </div>
              <button
                onClick={startGeneration}
                className="px-6 py-3 bg-primary text-on-primary rounded-md text-label-md hover:bg-primary-container transition-colors font-semibold shadow-sm cursor-pointer"
              >
                Retry Generation
              </button>
            </div>
          ) : (
            <>
              {/* Loader circle with SVG progress */}
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-variant"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="6"
                  />
                  <circle
                    className="text-primary transition-all duration-500"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="45"
                    stroke="currentColor"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * progress) / 100}
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[32px] font-black text-primary leading-none">
                    {progress}%
                  </span>
                  <span className="text-label-sm text-on-surface-variant mt-1.5">
                    Completed
                  </span>
                </div>

                {/* Orbiting element */}
                <div
                  className="absolute w-full h-full animate-spin"
                  style={{ animationDuration: "8s", animationTimingFunction: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-primary-container rounded-full border-2 border-surface-container-lowest shadow" />
                </div>
              </div>

              {/* Timeline Checklist */}
              <ProcessingChecklist steps={steps} />

              {/* Time Remaining */}
              <div className="flex items-center gap-2 text-on-surface-variant text-label-sm mt-8">
                <Timer className="w-4 h-4 text-outline" />
                <span>
                  {progress >= 100 ? "Redirecting now..." : loadingText}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <Link
          href="/tutorials/create"
          className="mt-8 px-6 py-2 rounded-md border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container-low text-label-md transition-colors"
        >
          Cancel Processing
        </Link>
      </main>
    </div>
  );
}

export default function AIProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background min-h-screen flex flex-col items-center justify-center text-on-surface">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-body-md text-on-surface-variant font-medium animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <AIProcessingContent />
    </Suspense>
  );
}
