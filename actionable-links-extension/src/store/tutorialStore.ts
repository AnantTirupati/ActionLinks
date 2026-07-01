import { create } from "zustand";
import { Tutorial, Step } from "@actionlinks/shared";
import { tutorialService } from "../services/tutorialService";
import { progressService } from "../services/progressService";
import { storage } from "../lib/storage";

interface TutorialState {
  tutorials: Tutorial[];
  activeTutorial: Tutorial | null;
  currentStepIndex: number;
  completedSteps: number[];
  loading: boolean;
  syncing: boolean;

  fetchTutorials: (domain?: string) => Promise<void>;
  selectTutorial: (tutorial: Tutorial | null) => void;
  loadProgress: (tutorialId: string) => Promise<void>;
  updateStepProgress: (stepIndex: number, completed: number[]) => Promise<void>;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  tutorials: [],
  activeTutorial: null,
  currentStepIndex: 0,
  completedSteps: [],
  loading: false,
  syncing: false,

  fetchTutorials: async (domain) => {
    set({ loading: true });
    const list = await tutorialService.getTutorials(domain);
    set({ tutorials: list, loading: false });
  },

  selectTutorial: (tutorial) => {
    set({
      activeTutorial: tutorial,
      currentStepIndex: 0,
      completedSteps: [],
    });
  },

  loadProgress: async (tutorialId) => {
    const local = await storage.loadTutorialProgress(tutorialId);
    if (local) {
      set({
        currentStepIndex: local.currentStep - 1,
        completedSteps: local.completedSteps,
      });
    }
  },

  updateStepProgress: async (stepIndex, completed) => {
    const active = get().activeTutorial;
    if (!active) return;

    set({ currentStepIndex: stepIndex, completedSteps: completed });
    
    // Save locally
    await storage.saveTutorialProgress(active.id, {
      currentStep: stepIndex + 1,
      completedSteps: completed,
    });

    // Try to sync to DB in background
    set({ syncing: true });
    await progressService.syncProgress(active.id, stepIndex + 1, completed);
    set({ syncing: false });
  },
}));
