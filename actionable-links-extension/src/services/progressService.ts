import { api } from "../lib/api";

export const progressService = {
  syncProgress: async (
    tutorialId: string,
    currentStep: number,
    completedSteps: number[]
  ) => {
    try {
      const res = await api.post(`/tutorials/${tutorialId}/progress`, {
        currentStep,
        completedSteps,
      });
      return res.data.success;
    } catch (err) {
      console.error("Failed to sync progress", err);
      return false;
    }
  },
};
