"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useTutorialProgress } from "@/features/viewer/hooks/useTutorialProgress";
import { useKeyboardShortcuts } from "@/features/viewer/hooks/useKeyboardShortcuts";
import { ViewerHeader } from "@/features/viewer/components/ViewerHeader";
import { StepSidebar } from "@/features/viewer/components/StepSidebar";
import { StepCard } from "@/features/viewer/components/StepCard";
import { KeyboardShortcuts } from "@/features/viewer/components/KeyboardShortcuts";
import { Trophy, ArrowLeft, RotateCcw, Home, Menu } from "lucide-react";

export default function TutorialViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const {
    tutorial,
    currentStep,
    completedSteps,
    loading,
    goToStep,
    toggleStepCompletion,
    completeStep,
    restartTutorial,
  } = useTutorialProgress(id);

  const [showFinish, setShowFinish] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeStep = useMemo(() => {
    if (!tutorial || tutorial.steps.length === 0) return null;
    return tutorial.steps.find((s) => s.step_number === currentStep) || tutorial.steps[0];
  }, [tutorial, currentStep]);

  const hasNext = tutorial ? currentStep < tutorial.steps.length : false;
  const hasPrev = currentStep > 1;
  const isLastStep = tutorial ? currentStep === tutorial.steps.length : false;

  const handleNext = () => {
    if (hasNext) {
      goToStep(currentStep + 1);
    } else if (isLastStep) {
      setShowFinish(true);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      goToStep(currentStep - 1);
    }
  };

  const handleToggleComplete = () => {
    if (activeStep) {
      toggleStepCompletion(activeStep.step_number);
    }
  };

  const handleExit = () => {
    router.push(`/tutorials/${id}`);
  };

  // Bind Keyboard Shortcuts
  useKeyboardShortcuts({
    onNext: handleNext,
    onPrev: handlePrev,
    onToggleComplete: handleToggleComplete,
    onExit: handleExit,
    disabled: isShortcutsOpen || showFinish || loading,
  });

  const handleRestart = async () => {
    await restartTutorial();
    setShowFinish(false);
  };

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Library", href: "/tutorials" },
    { label: tutorial?.title || "Tutorial", href: `/tutorials/${id}` },
    { label: "Viewer" },
  ];

  if (loading) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <div className="flex h-[80vh] items-center justify-center bg-background text-on-surface">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-body-md text-on-surface-variant font-medium animate-pulse">
              Loading Player...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!tutorial || tutorial.steps.length === 0) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-headline-md font-bold text-on-surface">
            Tutorial Steps Empty
          </p>
          <Link
            href={`/tutorials/${id}`}
            className="bg-primary text-on-primary text-label-md px-4 py-2 rounded-md"
          >
            Go back to Details
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-on-surface">
      {/* Header Panel */}
      <ViewerHeader
        tutorialTitle={tutorial.title}
        estimatedTime={tutorial.estimatedTime}
        completedStepsCount={completedSteps.length}
        totalStepsCount={tutorial.steps.length}
        exitUrl={`/tutorials/${id}`}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* 2-Pane Player Grid */}
      <div className="flex-grow flex overflow-hidden relative">
        {/* Step checklist Sidebar (Desktop) */}
        <div className="hidden md:block h-full">
          <StepSidebar
            steps={tutorial.steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepSelect={(stepNum) => goToStep(stepNum)}
            onToggleStepComplete={(stepNum) => toggleStepCompletion(stepNum)}
          />
        </div>

        {/* Mobile Toggle Drawer overlay button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden absolute top-4 left-4 z-40 p-2.5 bg-surface border border-outline-variant rounded-full text-on-surface hover:bg-surface-container shadow"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Step checklist Sidebar (Mobile Drawer) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 bg-surface h-full shadow-xl flex flex-col z-10 animate-slide-in">
              <StepSidebar
                steps={tutorial.steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepSelect={(stepNum) => {
                  goToStep(stepNum);
                  setMobileMenuOpen(false);
                }}
                onToggleStepComplete={(stepNum) => toggleStepCompletion(stepNum)}
              />
            </div>
          </div>
        )}

        {/* Center player workspace */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-container-low overflow-y-auto">
          {showFinish ? (
            /* Celebration Completion screen */
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-10 shadow-lg flex flex-col items-center text-center max-w-md w-full gap-6 border-t-4 border-t-primary">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-display-sm font-black text-on-surface">
                  Congratulations!
                </h2>
                <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                  You have successfully completed all steps in the guide.
                </p>
              </div>

              {/* Completion Stats */}
              <div className="bg-surface p-4 border border-outline-variant/60 rounded-xl w-full flex flex-col gap-2.5 text-left">
                <div className="flex justify-between items-center text-body-md border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant">Estimated time taken</span>
                  <span className="font-semibold text-on-surface">{tutorial.estimatedTime} mins</span>
                </div>
                <div className="flex justify-between items-center text-body-md">
                  <span className="text-on-surface-variant">Steps Completed</span>
                  <span className="font-semibold text-on-surface">{tutorial.steps.length} / {tutorial.steps.length}</span>
                </div>
              </div>

              {/* Action row buttons */}
              <div className="flex flex-col gap-3.5 w-full mt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Guide
                </button>
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 border border-outline-variant text-on-surface bg-surface hover:bg-surface-container-low font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Standard step walkthrough cards */
            activeStep && (
              <StepCard
                step={activeStep}
                totalSteps={tutorial.steps.length}
                isCompleted={completedSteps.includes(currentStep)}
                onPrev={handlePrev}
                onNext={handleNext}
                onToggleComplete={handleToggleComplete}
                hasPrev={hasPrev}
                hasNext={hasNext || isLastStep}
              />
            )
          )}
        </main>
      </div>

      {/* Hotkeys helper Guide */}
      <KeyboardShortcuts
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
