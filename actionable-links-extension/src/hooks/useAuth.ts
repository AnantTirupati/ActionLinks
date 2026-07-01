import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const { user, authenticated, loading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    authenticated,
    loading,
    logout,
    refresh: checkAuth,
  };
}
