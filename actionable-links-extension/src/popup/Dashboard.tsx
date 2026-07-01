import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useTutorialStore } from "../store/tutorialStore";
import { useActiveTab } from "../hooks/useActiveTab";
import { TutorialCard } from "./TutorialCard";
import { browser } from "../platform/browser";
import { MESSAGES } from "../constants";
import { Search, LogOut, Compass, ExternalLink } from "lucide-react";

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const { tutorials, fetchTutorials, loading } = useTutorialStore();
  const { domain, activeTab } = useActiveTab();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (domain) {
      fetchTutorials(domain);
    } else {
      fetchTutorials();
    }
  }, [domain, fetchTutorials]);

  const handlePlayTutorial = async (tutorialId: string) => {
    if (!activeTab || !activeTab.id) return;
    
    await browser.tabs.sendMessage(activeTab.id, {
      type: MESSAGES.START_TUTORIAL,
      payload: { tutorialId },
    });
    
    window.close();
  };

  const handleOpenConsole = () => {
    window.open("http://localhost:3000/dashboard", "_blank");
  };

  const filtered = tutorials.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "AL";

  return (
    <div className="w-[360px] h-[480px] bg-zinc-950 text-white flex flex-col font-sans select-none overflow-hidden">
      <header className="flex justify-between items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate max-w-[120px]">
              {user?.full_name || user?.email}
            </h4>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">
              Member
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleOpenConsole}
            className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 cursor-pointer"
            title="Open Console Dashboard"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-800 shrink-0 flex items-center justify-between text-xs text-zinc-400 font-semibold">
        <span>Active website:</span>
        <span className="text-blue-400 font-mono font-bold truncate max-w-[180px]">
          {domain || "None"}
        </span>
      </div>

      <div className="px-4 pt-3.5 pb-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search matching guides..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5">
        {loading ? (
          <div className="flex-grow flex items-center justify-center text-zinc-500 text-xs">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent animate-spin mr-2 rounded-full" />
            Loading guides...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-zinc-500 gap-2 mt-8">
            <Compass className="w-8 h-8 text-zinc-700" />
            <p className="text-xs font-semibold">No guides matching domain</p>
            <button
              onClick={() => {
                setSearch("");
                fetchTutorials();
              }}
              className="text-[10px] text-blue-400 hover:underline cursor-pointer"
            >
              Show all library guides
            </button>
          </div>
        ) : (
          filtered.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              onPlay={() => handlePlayTutorial(tutorial.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}
