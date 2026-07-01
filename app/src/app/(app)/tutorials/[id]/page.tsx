import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TutorialDetailClient } from "@/features/tutorials/components/TutorialDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tutorial } = await supabase
    .from("tutorials")
    .select("title, description, thumbnail_url, visibility")
    .eq("id", id)
    .single();

  if (!tutorial || tutorial.visibility !== "public") {
    return {
      title: "Action Links Guide",
      description: "Interactive application training guide.",
    };
  }

  return {
    title: `${tutorial.title} | Action Links Guide`,
    description: tutorial.description || "Learn how to use this feature with step-by-step interactive instructions.",
    openGraph: {
      title: tutorial.title,
      description: tutorial.description || "Step-by-step interactive guide.",
      images: tutorial.thumbnail_url ? [{ url: tutorial.thumbnail_url }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tutorial.title,
      description: tutorial.description || "Step-by-step interactive guide.",
      images: tutorial.thumbnail_url ? [tutorial.thumbnail_url] : [],
    },
  };
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch logged-in user if any
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch tutorial
  const { data: dbTutorial, error: tutorialError } = await supabase
    .from("tutorials")
    .select("*")
    .eq("id", id)
    .single();

  if (tutorialError || !dbTutorial) {
    notFound();
  }

  // Enforce visibility gate
  const isOwner = user?.id === dbTutorial.user_id;
  if (dbTutorial.visibility !== "public" && !isOwner) {
    notFound();
  }

  // Fetch steps
  const { data: steps } = await supabase
    .from("tutorial_steps")
    .select("*")
    .eq("tutorial_id", id)
    .order("step_number", { ascending: true });

  // Fetch progress if logged in
  let progress = null;
  if (user) {
    const { data: progressData } = await supabase
      .from("tutorial_progress")
      .select("*")
      .eq("tutorial_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    progress = progressData;
  }

  const mergedTutorial = {
    ...dbTutorial,
    steps: steps || [],
    progress,
  };

  return <TutorialDetailClient dbTutorial={mergedTutorial} user={user} />;
}
