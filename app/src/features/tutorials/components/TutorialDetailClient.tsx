"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProgressBar } from "@/components/ui/progress-bar";
import { tutorialComments, relatedTutorials } from "@/lib/mock-data";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Star,
  Play,
  CheckCircle2,
  Circle,
  ThumbsUp,
  Bookmark,
  Share2,
  Check,
} from "lucide-react";
import { deleteTutorial, duplicateTutorial } from "@/features/tutorials/actions";
import { mapDatabaseTutorial } from "@/lib/tutorials";

interface TutorialDetailClientProps {
  dbTutorial: any;
  user: User | null;
}

export function TutorialDetailClient({ dbTutorial, user }: TutorialDetailClientProps) {
  const router = useRouter();
  const id = dbTutorial.id;

  const [actionLoading, setActionLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [shareCopied, setShareCopied] = useState(false);
  const [anonProgress, setAnonProgress] = useState<any>(null);

  // Load anonymous progress from localStorage on mount
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(`actionlinks_progress_${id}`);
      if (stored) {
        try {
          setAnonProgress(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse local progress", e);
        }
      }
    }
  }, [user, id]);

  const tutorialDetail = useMemo(() => {
    return mapDatabaseTutorial(dbTutorial, dbTutorial.steps || []);
  }, [dbTutorial]);

  const activeProgress = user ? dbTutorial.progress : anonProgress;
  const completedList = activeProgress && Array.isArray(activeProgress.completed_steps)
    ? activeProgress.completed_steps
    : [];
  const completedCount = completedList.length;
  const totalCount = tutorialDetail?.steps?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const hasProgress = completedCount > 0 || (activeProgress?.current_step && activeProgress.current_step > 1);
  const ctaLabel = hasProgress ? "Resume Tutorial" : "Start Tutorial";

  const isOwner = user?.id === dbTutorial.user_id;

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email || "Guest";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleDuplicate = async () => {
    setActionLoading(true);
    try {
      const copy = await duplicateTutorial(id);
      router.push(`/tutorials/${copy.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate guide.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this guide?")) return;
    setActionLoading(true);
    try {
      await deleteTutorial(id);
      router.push("/tutorials");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete guide.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy link:", err);
    });
  };

  const handleLike = (commentId: string) => {
    if (liked[commentId]) {
      setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) - 1 }));
      setLiked((prev) => ({ ...prev, [commentId]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
      setLiked((prev) => ({ ...prev, [commentId]: true }));
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    { label: "Library", href: "/tutorials" },
    { label: tutorialDetail?.title || "Loading..." },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      {/* Back to Library */}
      <Link
        href="/tutorials"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-md mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-display text-on-surface font-black tracking-tight leading-tight">
          {tutorialDetail.title}
        </h1>
        
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-md text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-primary">{tutorialDetail.category}</span>
          </div>
          <span className="text-outline-variant">•</span>
          <span>{tutorialDetail.updatedAt}</span>
          <span className="text-outline-variant">•</span>
          <span>{tutorialDetail.views.toLocaleString()} views</span>
          <span className="text-outline-variant">•</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(tutorialDetail.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-outline-variant"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-on-surface ml-1">
              {tutorialDetail.rating}
            </span>
            <span className="text-label-sm">
              ({tutorialDetail.ratingCount})
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Column: Player, curriculum, comments */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Mock Video Player */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black shadow-lg group">
            {tutorialDetail.image && (
              <Image
                src={tutorialDetail.image}
                alt="Video preview"
                fill
                className="object-cover opacity-90 group-hover:scale-[1.01] transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                <Play className="w-7 h-7 fill-on-primary ml-1" />
              </button>
            </div>
            {/* Player Controls Bar Mockup */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2">
              <ProgressBar value={25} barClassName="bg-primary" />
              <div className="flex justify-between items-center text-white text-[12px]">
                <span>06:00 / {tutorialDetail.duration}</span>
                <span className="hover:text-primary cursor-pointer">HD</span>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-headline-lg font-bold text-on-surface mb-6">
              Curriculum Steps
            </h2>
            <div className="flex flex-col gap-6">
              {tutorialDetail.steps.map((step) => {
                const isStepFinished = completedList.includes(step.number);

                return (
                  <div key={step.id} className="flex gap-4 items-start">
                    <div className="mt-1 shrink-0">
                      {isStepFinished ? (
                        <CheckCircle2 className="w-6 h-6 text-primary fill-primary text-on-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-label-md font-semibold text-on-surface">
                          Step {step.number}: {step.title}
                        </h4>
                        {isStepFinished && (
                          <span className="text-[11px] text-primary bg-secondary-container px-2 py-0.5 rounded font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discussion / Comments */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h2 className="text-headline-lg font-bold text-on-surface mb-6">
              Discussion
            </h2>
            {/* Input Form */}
            <div className="flex gap-3 items-start mb-8">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center bg-primary/10 text-primary font-bold text-xs select-none">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  rows={3}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-all"
                />
                <div className="flex justify-end">
                  <button
                    disabled={!commentText.trim()}
                    className="bg-primary text-on-primary px-4 py-2 rounded-md text-label-md hover:bg-primary-container disabled:opacity-50 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex flex-col gap-6">
              {tutorialComments.map((comment) => (
                <div key={comment.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-outline-variant relative">
                    {comment.author.avatar && (
                      <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-label-md text-on-surface">
                        {comment.author.name}
                      </span>
                      <span className="text-[12px] text-on-surface-variant">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface mt-1.5 leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1.5 text-label-sm transition-colors ${
                          liked[comment.id]
                            ? "text-primary font-bold"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>
                          {comment.likes + (likes[comment.id] || 0)}
                        </span>
                      </button>
                      <button className="text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CTAs, meta info, related items */}
        <div className="flex flex-col gap-6">
          {/* CTA Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center text-label-sm text-on-surface-variant mb-1 font-medium">
              <span>Your progress</span>
              <span className="font-bold text-primary">{progressPercent}% Done</span>
            </div>
            <ProgressBar value={progressPercent} />
            <Link
              href={`/tutorials/${id}/view`}
              className="w-full text-center bg-primary text-on-primary py-2.5 rounded-lg text-label-md hover:bg-primary-container transition-colors shadow-sm font-semibold"
            >
              {ctaLabel}
            </Link>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`py-2 px-4 border rounded-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  bookmarked
                    ? "bg-secondary-container border-primary-container text-primary font-semibold"
                    : "bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
                {bookmarked ? "Saved" : "Save"}
              </button>
              
              <button
                onClick={handleShare}
                className="py-2 px-4 bg-surface border border-outline-variant text-on-surface rounded-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors cursor-pointer relative"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-4 h-4 text-primary" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Share
                  </>
                )}
              </button>
            </div>

            {/* Owner Actions section */}
            {isOwner && (
              <>
                <div className="h-px bg-outline-variant w-full my-1" />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleDuplicate}
                    disabled={actionLoading}
                    className="w-full py-2 bg-surface border border-outline-variant text-on-surface rounded-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Duplicating..." : "Duplicate Guide"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="w-full py-2 bg-error-container text-on-error-container border border-error-container rounded-md text-label-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? "Deleting..." : "Delete Guide"}
                  </button>
                </div>
              </>
            )}
            
            {/* Guest message prompt */}
            {!user && (
              <div className="bg-surface-container-lowest border border-dashed border-outline-variant p-3 rounded-lg text-center mt-2">
                <span className="text-[11px] text-outline font-semibold">
                  Sign up to sync progress online!
                </span>
              </div>
            )}
          </div>

          {/* Stats Box */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-label-md font-bold text-on-surface mb-4">
              Details
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Category", value: tutorialDetail.category },
                { label: "Difficulty", value: tutorialDetail.difficulty },
                { label: "Total Duration", value: tutorialDetail.duration },
                {
                  label: "Completed By",
                  value: `${tutorialDetail.completions} users`,
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-outline-variant/60 last:border-0"
                >
                  <span className="text-body-md text-on-surface-variant">
                    {row.label}
                  </span>
                  <span className="text-label-sm font-semibold text-on-surface">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Related tutorials */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="text-label-md font-bold text-on-surface mb-4">
              Related Guides
            </h3>
            <div className="flex flex-col gap-4">
              {relatedTutorials.map((item) => (
                <Link
                  key={item.id}
                  href={`/tutorials/${item.id}`}
                  className="flex gap-3 hover:opacity-90 group cursor-pointer"
                >
                  <div className="relative w-16 h-12 rounded bg-surface-container-low overflow-hidden shrink-0 border border-outline-variant">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="text-label-sm text-on-surface group-hover:text-primary transition-colors font-semibold truncate leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-on-surface-variant mt-1">
                      {item.duration}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
