import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Step {
  id: string;
  step_number: number;
  title: string;
  instruction: string;
  action_type: string;
  selector: string;
  metadata: any;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  steps: Step[];
}

export function useTutorialProgress(id: string) {
  const supabase = createClient();

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const loggedIn = !!user;
        setIsAuthenticated(loggedIn);

        const res = await fetch(`/api/v1/tutorials/${id}`);
        if (!res.ok) throw new Error("Failed to fetch tutorial details.");
        const json = await res.json();
        if (!json.success) throw new Error(json.error?.message || "Failed to fetch");
        const data = json.data;
        setTutorial(data);

        if (loggedIn) {
          setCurrentStep(data.progress?.currentStep || 1);
          setCompletedSteps(data.progress?.completed || []);
        } else {
          // Load from localStorage
          const stored = localStorage.getItem(`actionlinks_progress_${id}`);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setCurrentStep(parsed.currentStep || 1);
              setCompletedSteps(parsed.completedSteps || []);
            } catch (e) {
              console.error("Failed to parse local progress:", e);
              setCurrentStep(1);
              setCompletedSteps([]);
            }
          } else {
            setCurrentStep(1);
            setCompletedSteps([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const syncProgress = useCallback(async (stepNum: number, completedList: number[]) => {
    if (isAuthenticated) {
      setSyncing(true);
      try {
        const res = await fetch(`/api/v1/tutorials/${id}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentStep: stepNum,
            completedSteps: completedList,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          console.error("Failed to sync progress:", json.error?.message);
        }
      } catch (err) {
        console.error("Failed to sync progress:", err);
      } finally {
        setSyncing(false);
      }
    } else {
      // Save to localStorage for anonymous users
      localStorage.setItem(
        `actionlinks_progress_${id}`,
        JSON.stringify({
          currentStep: stepNum,
          completedSteps: completedList,
        })
      );
    }
  }, [id, isAuthenticated]);

  const goToStep = useCallback((stepNum: number) => {
    if (!tutorial) return;
    if (stepNum < 1 || stepNum > tutorial.steps.length) return;
    setCurrentStep(stepNum);
    syncProgress(stepNum, completedSteps);
  }, [tutorial, completedSteps, syncProgress]);

  const toggleStepCompletion = useCallback((stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(stepNum)
        ? prev.filter((s) => s !== stepNum)
        : [...prev, stepNum];
      syncProgress(currentStep, next);
      return next;
    });
  }, [currentStep, syncProgress]);

  const completeStep = useCallback((stepNum: number) => {
    setCompletedSteps((prev) => {
      if (prev.includes(stepNum)) return prev;
      const next = [...prev, stepNum];
      syncProgress(currentStep, next);
      return next;
    });
  }, [currentStep, syncProgress]);

  const restartTutorial = useCallback(async () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    await syncProgress(1, []);
  }, [syncProgress]);

  return {
    tutorial,
    currentStep,
    completedSteps,
    loading,
    syncing,
    goToStep,
    toggleStepCompletion,
    completeStep,
    restartTutorial,
  };
}
