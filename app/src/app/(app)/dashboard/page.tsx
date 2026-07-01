"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TutorialCard } from "@/components/ui/tutorial-card";
import { ActivityFeed } from "@/components/ui/activity-feed";
import {
  continueLearningTutorial as defaultContinue,
  recentTutorials as defaultRecents,
  activityFeedItems,
} from "@/lib/mock-data";
import { Play, ArrowRight, Video } from "lucide-react";
import { getTutorials } from "@/features/tutorials/actions";
import { mapDatabaseTutorial } from "@/lib/tutorials";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [dbTutorials, setDbTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        icon: "Clock",
        label: "Hours Saved",
        value: (dbTutorials.length * 2.5).toFixed(0),
        colorClass: "text-tertiary",
      },
      {
        icon: "Users",
        label: "Team Members",
        value: "1",
        colorClass: "text-secondary",
      },
    ];
  }, [activeCount, dbTutorials.length]);

  const latestTutorial = tutorials[0] || null;
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

  const continueTutorial = latestTutorial || defaultContinue;
  const recentDisplayList = recentList.length > 0 ? recentList : defaultRecents;

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
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-sm">
            {/* Thumbnail */}
            <div className="relative w-full md:w-48 h-32 bg-surface-container-low rounded-lg overflow-hidden shrink-0 group">
              {continueTutorial.image && (
                <Image
                  src={continueTutorial.image}
                  alt={continueTutorial.title}
                  fill
                  className="object-cover"
                />
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentDisplayList.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="h-fit">
          <ActivityFeed items={activityFeedItems} />
        </div>
      </div>
    </AppShell>
  );
}
