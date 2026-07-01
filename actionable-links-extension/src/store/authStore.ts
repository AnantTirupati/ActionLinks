import { create } from "zustand";
import { authService } from "../services/authService";
import { UserProfile } from "../types/user";

interface AuthState {
  user: UserProfile | null;
  authenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authenticated: false,
  loading: true,
  checkAuth: async () => {
    set({ loading: true });
    const profile = await authService.getProfile();
    set({
      user: profile.user || null,
      authenticated: !!profile.authenticated,
      loading: false,
    });
  },
  logout: async () => {
    await authService.logout();
    set({ user: null, authenticated: false });
  },
}));
