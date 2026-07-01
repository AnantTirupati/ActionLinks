import { api } from "../lib/api";
import { storage } from "../lib/storage";

export const authService = {
  getProfile: async () => {
    try {
      const res = await api.get("/me");
      const session = res.data;
      if (session.success) {
        await storage.saveSession({
          authenticated: session.data.authenticated,
          user: session.data.user,
        });
        return session.data;
      }
      return { authenticated: false };
    } catch (err) {
      console.error("Failed to load profile", err);
      return { authenticated: false };
    }
  },
  logout: async () => {
    await storage.clearStorage();
  },
};
