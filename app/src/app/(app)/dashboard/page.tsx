"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TutorialCard } from "@/components/ui/tutorial-card";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { Play, ArrowRight, Video, BookOpen, Plus } from "lucide-react";
import { getTutorials } from "@/features/tutorials/actions";
import { mapDatabaseTutorial } from "@/lib/tutorials";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [dbTutorials, setDbTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [startedCount, setStartedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [continueTutorial, setContinueTutorial] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadTutorials() {
      try {
        const data = await getTutorials();
        setDbTutorials(data);
      } catch (err) {
        console.error("Failed to load dashboard tutorials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTutorials();
  }, []);

  const name = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
  const breadcrumbs = [{ label: "Home" }];

  const tutorials = useMemo(() => {
    return dbTutorials.map((t) => {
      const dummySteps = Array.from({ length: t.steps_count || 0 }, (_, i) => ({
        id: `step-${i}`,
        step_number: i + 1,
        title: `Step ${i + 1}`,
      }));
      return mapDatabaseTutorial(t, dummySteps);
    });
  }, [dbTutorials]);

  // Load progress details and activities from database
  useEffect(() => {
    async function loadProgressStats() {
      if (!user) return;

      const { data: progressList } = await supabase
        .from("tutorial_progress")
        .select("*")
        .eq("user_id", user.id);

      if (progressList) {
        setStartedCount(progressList.length);
        const completed = progressList.filter((p) => p.completed_at !== null).length;
        setCompletedCount(completed);

        // Find the most recently updated tutorial progress
        const latestProgress = [...progressList].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];

        if (latestProgress) {
          const match = tutorials.find((t) => t.id === latestProgress.tutorial_id);
          if (match) {
            const stepsCount = match.steps.length;
            const completedStepsCount = Array.isArray(latestProgress.completed_steps)
              ? latestProgress.completed_steps.length
              : 0;
            const percentage = stepsCount > 0 ? Math.round((completedStepsCount / stepsCount) * 100) : 0;

            setContinueTutorial({
              ...match,
              progress: percentage,
              duration: `${match.steps.length * 2} min total`,
            });
          }
        }

        // Generate activities from progress records
        const sortedProgress = [...progressList]
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5);

        const items = sortedProgress.map((p, idx) => {
          const match = tutorials.find((t) => t.id === p.tutorial_id);
          const title = match ? match.title : "Walkthrough Guide";
          const isFinished = p.completed_at !== null;

          return {
            id: `act-${idx}`,
            type: isFinished ? "complete" : "progress",
            user: {
              name: name,
              avatar: user?.user_metadata?.avatar_url || "",
            },
            message: isFinished
              ? `Completed "${title}"`
              : `Step ${p.current_step} of "${title}"`,
            timestamp: new Date(p.updated_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
        setActivities(items);
      }
    }

    if (user) {
      loadProgressStats();
    }
  }, [user, tutorials, name]);

  const activeCount = tutorials.length.toString();

  const dynamicStats = useMemo(() => {
    return [
      {
        icon: "BookOpen",
        label: "Active Tutorials",
        value: activeCount,
        colorClass: "text-primary",
      },
      {
        icon: "Play",
        label: "Started Guides",
        value: startedCount.toString(),
        colorClass: "text-tertiary",
      },
      {
        icon: "CheckCircle",
        label: "Completed Guides",
        value: completedCount.toString(),
        colorClass: "text-secondary",
      },
    ];
  }, [activeCount, startedCount, completedCount]);

  const recentList = tutorials.slice(0, 3);

  if (loading) {
    return (
      <AppShell breadcrumbs={breadcrumbs}>
        <div className="flex flex-col gap-6">
          <div className="h-8 w-48 bg-outline-variant/20 rounded animate-pulse" />
          <div className="h-4 w-96 bg-outline-variant/10 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-surface-container rounded-xl border border-outline-variant animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 flex flex-col gap-8">
              <div className="h-40 bg-surface-container rounded-xl border border-outline-variant animate-pulse" />
              <div className="h-64 bg-surface-container rounded-xl border border-outline-variant animate-pulse" />
            </div>
            <div className="h-96 bg-surface-container rounded-xl border border-outline-variant animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-display text-on-surface font-black">
            Welcome back, {name}!
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Here is what is happening in your workspace today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dynamicStats.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            colorClass={stat.colorClass}
          />
        ))}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Learning & Recent */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Continue Learning */}
          {continueTutorial ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
              {/* Thumbnail */}
              <div className="relative w-full md:w-48 h-32 bg-surface-container-low rounded-lg overflow-hidden shrink-0 group flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-outline-variant" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                    <Play className="w-5 h-5 fill-on-primary" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <span className="text-label-sm text-primary uppercase font-bold tracking-wider">
                    Continue Learning
                  </span>
                  <h3 className="text-headline-md font-semibold text-on-surface mt-1">
                    {continueTutorial.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mt-1">
                    {continueTutorial.description}
                  </p>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-label-sm text-on-surface-variant mb-2">
                    <span>Progress: {continueTutorial.progress || 0}%</span>
                    <span>{continueTutorial.duration}</span>
                  </div>
                  <ProgressBar value={continueTutorial.progress || 0} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-headline-md font-semibold text-on-surface">
                No tutorials in progress
              </h3>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
                Create your first tutorial or import one from YouTube to get started with interactive learning.
              </p>
              <Link
                href="/tutorials/create"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-label-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Tutorial
              </Link>
            </div>
          )}

          {/* Recent Tutorials */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-lg font-bold text-on-surface">
                Recent Tutorials
              </h2>
              <Link
                href="/tutorials"
                className="text-label-md text-primary flex items-center gap-1 hover:underline font-semibold"
              >
                View all Library
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentList.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-10 h-10 text-outline-variant mb-3" />
                <p className="text-body-lg text-on-surface-variant font-medium">
                  No tutorials yet
                </p>
                <p className="text-body-md text-on-surface-variant/70 mt-1">
                  Your created and imported tutorials will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="h-fit">
          {activities.length > 0 ? (
            <ActivityFeed items={activities} />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
              <h3 className="text-headline-sm font-bold text-on-surface mb-4">Activity Feed</h3>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-outline-variant/10 flex items-center justify-center mb-3">
                  <Play className="w-5 h-5 text-outline-variant" />
                </div>
                <p className="text-body-md text-on-surface-variant">
                  No activity yet
                </p>
                <p className="text-body-sm text-on-surface-variant/70 mt-1">
                  Start a tutorial to see your progress here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
