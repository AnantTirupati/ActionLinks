"use client";

import { useState, useMemo, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TutorialCard } from "@/components/ui/tutorial-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { getTutorials } from "@/features/tutorials/actions";
import { mapDatabaseTutorial } from "@/lib/tutorials";

export default function TutorialLibraryPage() {
  const [dbTutorials, setDbTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Tutorial Library" },
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await getTutorials();
        setDbTutorials(data);
      } catch (err) {
        console.error("Failed to load tutorials:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tutorials = useMemo(() => {
    return dbTutorials.map((t) => {
      // Mock steps array structure to display correct steps count
      const dummySteps = Array.from({ length: t.steps_count || 0 }, (_, i) => ({
        id: `step-${i}`,
        step_number: i + 1,
        title: `Step ${i + 1}`,
      }));
      return mapDatabaseTutorial(t, dummySteps);
    });
  }, [dbTutorials]);

  // Filtering Logic
  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSearch =
        tutorial.title.toLowerCase().includes(search.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || tutorial.category === category;
      const matchesDifficulty =
        difficulty === "All" || tutorial.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [tutorials, search, category, difficulty]);

  if (loading) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <div className="flex flex-col gap-6">
          <div className="h-8 w-48 bg-outline-variant/20 rounded animate-pulse" />
          <div className="h-4 w-96 bg-outline-variant/10 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-surface-container rounded-xl border border-outline-variant animate-pulse"
              />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-display text-on-surface font-black">
            Tutorial Library
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Browse and manage your workspace's training materials.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-all ${
              view === "grid"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-all ${
              view === "list"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-[18px] h-[18px]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Filter select inputs */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
          <div className="flex items-center gap-1 text-label-sm text-on-surface-variant mr-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Onboarding">Onboarding</option>
            <option value="API">API</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-surface border border-outline-variant rounded-md px-3 py-1.5 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Tutorials Grid / List */}
      {filteredTutorials.length > 0 ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredTutorials.map((tutorial) => (
            <div key={tutorial.id} className={view === "list" ? "w-full" : ""}>
              {view === "grid" ? (
                <TutorialCard tutorial={tutorial} />
              ) : (
                /* Compact List Row */
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl hover:border-primary transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-secondary-container text-on-secondary-container text-label-sm px-2 py-0.5 rounded-full font-bold">
                        {tutorial.category}
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-medium">
                        {tutorial.difficulty}
                      </span>
                    </div>
                    <h3 className="text-headline-md font-bold text-on-surface">
                      {tutorial.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant line-clamp-1">
                      {tutorial.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 justify-end w-full sm:w-auto">
                    <span className="text-body-md text-on-surface-variant">
                      {tutorial.duration}
                    </span>
                    <button
                      onClick={() => (window.location.href = `/tutorials/${tutorial.id}`)}
                      className="bg-primary text-on-primary text-label-md px-4 py-2 rounded hover:bg-primary-container transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="no-results"
          title="We couldn't find anything"
          description="No results match your current query. Try adjusting your filters or search keywords."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setCategory("All");
            setDifficulty("All");
          }}
        />
      )}

      {/* Pagination Footer */}
      {filteredTutorials.length > 0 && (
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-outline-variant">
          <button className="px-4 py-2 border border-outline-variant rounded-md hover:bg-surface-container-low text-label-md text-on-surface disabled:opacity-50" disabled>
            Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-md font-semibold cursor-pointer">
              1
            </span>
            <span className="w-8 h-8 rounded-full hover:bg-surface-container-high text-on-surface flex items-center justify-center text-label-md cursor-pointer">
              2
            </span>
            <span className="w-8 h-8 rounded-full hover:bg-surface-container-high text-on-surface flex items-center justify-center text-label-md cursor-pointer">
              3
            </span>
          </div>
          <button className="px-4 py-2 border border-outline-variant rounded-md hover:bg-surface-container-low text-label-md text-on-surface">
            Next
          </button>
        </div>
      )}
    </AppShell>
  );
}
