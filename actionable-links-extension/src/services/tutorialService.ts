import { api } from "../lib/api";
import { TutorialSchema } from "@actionlinks/shared";

export const tutorialService = {
  getTutorials: async (domain?: string) => {
    try {
      const res = await api.get("/tutorials", {
        params: domain ? { domain } : {},
      });
      if (res.data.success) {
        return res.data.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch tutorials", err);
      return [];
    }
  },

  getTutorial: async (id: string) => {
    try {
      const res = await api.get(`/tutorials/${id}`);
      if (res.data.success) {
        // Runtime schema validation
        const parsed = TutorialSchema.safeParse(res.data.data);
        if (!parsed.success) {
          console.error("Tutorial schema validation failed", parsed.error);
          throw new Error("Invalid tutorial format returned from server");
        }
        return parsed.data;
      }
      throw new Error(res.data.error?.message || "Failed to load tutorial");
    } catch (err) {
      console.error("Error in getTutorial service:", err);
      throw err;
    }
  },
};
