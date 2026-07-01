import { browser } from "../platform/browser";

export interface SessionData {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ProgressData {
  currentStep: number;
  completedSteps: number[];
  updatedAt: string;
}

const KEYS = {
  SESSION: "actionlinks_session",
  PROGRESS_PREFIX: "actionlinks_progress_",
};

export const storage = {
  saveSession: async (session: SessionData): Promise<void> => {
    await browser.storage.local.set({ [KEYS.SESSION]: session });
  },

  loadSession: async (): Promise<SessionData | null> => {
    const data = await browser.storage.local.get(KEYS.SESSION);
    return (data[KEYS.SESSION] as SessionData) || null;
  },

  clearStorage: async (): Promise<void> => {
    await browser.storage.local.clear();
  },

  saveTutorialProgress: async (
    tutorialId: string,
    progress: Omit<ProgressData, "updatedAt">
  ): Promise<void> => {
    const key = `${KEYS.PROGRESS_PREFIX}${tutorialId}`;
    const data: ProgressData = {
      ...progress,
      updatedAt: new Date().toISOString(),
    };
    await browser.storage.local.set({ [key]: data });
  },

  loadTutorialProgress: async (tutorialId: string): Promise<ProgressData | null> => {
    const key = `${KEYS.PROGRESS_PREFIX}${tutorialId}`;
    const data = await browser.storage.local.get(key);
    return (data[key] as ProgressData) || null;
  },
};
