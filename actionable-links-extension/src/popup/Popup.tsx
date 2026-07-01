import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

export function Popup() {
  const { authenticated, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="w-[360px] h-[480px] flex flex-col items-center justify-center bg-zinc-950 text-white gap-3 select-none">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs text-zinc-400 font-medium animate-pulse">
          Authenticating Session...
        </span>
      </div>
    );
  }

  return authenticated
    ? React.createElement(Dashboard)
    : React.createElement(Login);
}
