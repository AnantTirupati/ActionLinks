import React from "react";
import { LogIn, Compass } from "lucide-react";

export function Login() {
  const handleOpenAuth = () => {
    window.open("http://localhost:3000/login", "_blank");
  };

  return (
    <div className="w-[360px] h-[480px] bg-zinc-950 text-white flex flex-col justify-between p-6 select-none font-sans">
      <div className="flex flex-col items-center gap-2 mt-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-2">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-black tracking-tight">
          Actionable Links
        </h2>
        <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
          Sign in on the web portal to access your interactive step-by-step guides.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 mb-6">
        <button
          onClick={handleOpenAuth}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <LogIn className="w-4 h-4" />
          Log In via Web App
        </button>
        <span className="text-[10px] text-zinc-500 text-center font-medium">
          Extension inherits active web credentials automatically.
        </span>
      </div>
    </div>
  );
}
