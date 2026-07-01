"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateTutorialFromSource } from "@/lib/ai";

export interface TutorialInput {
  title: string;
  description: string;
  source_type: "youtube" | "website" | "upload";
  source_url?: string;
  thumbnail_url?: string;
  status?: "draft" | "processing" | "ready" | "published" | "failed";
}

export interface StepInput {
  step_number: number;
  title: string;
  instruction?: string;
  selector?: string;
  action_type?: string;
  metadata?: any;
}

// Helper to check user session
async function getAuthenticatedUser(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized: Please log in to perform this action.");
  }
  return user;
}

export async function createTutorial(input: TutorialInput) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("tutorials")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      source_type: input.source_type,
      source_url: input.source_url || null,
      thumbnail_url: input.thumbnail_url || null,
      status: input.status || "draft",
      visibility: "private",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create tutorial: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/tutorials");
  return data;
}

export async function getTutorials() {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("tutorials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tutorials: ${error.message}`);
  }

  // For each tutorial, fetch its steps count
  const tutorialsWithSteps = await Promise.all(
    data.map(async (tutorial) => {
      const { count, error: stepsError } = await supabase
        .from("tutorial_steps")
        .select("*", { count: "exact", head: true })
        .eq("tutorial_id", tutorial.id);
      
      return {
        ...tutorial,
        steps_count: count || 0,
      };
    })
  );

  return tutorialsWithSteps;
}

export async function getTutorial(id: string) {
  const supabase = await createClient();
  // Fetch tutorial (checks RLS - owner or public)
  const { data: tutorial, error: tutorialError } = await supabase
    .from("tutorials")
    .select("*")
    .eq("id", id)
    .single();

  if (tutorialError) {
    throw new Error(`Failed to fetch tutorial details: ${tutorialError.message}`);
  }

  // Fetch steps
  const { data: steps, error: stepsError } = await supabase
    .from("tutorial_steps")
    .select("*")
    .eq("tutorial_id", id)
    .order("step_number", { ascending: true });

  if (stepsError) {
    throw new Error(`Failed to fetch tutorial steps: ${stepsError.message}`);
  }

  // Fetch progress if authenticated
  let progress = null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: progData } = await supabase
      .from("tutorial_progress")
      .select("*")
      .eq("tutorial_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    progress = progData;
  }

  return {
    ...tutorial,
    steps: steps || [],
    progress,
  };
}

export async function updateTutorial(
  id: string,
  updates: Partial<Omit<TutorialInput, "source_type">> & {
    status?: "draft" | "processing" | "ready" | "published";
    visibility?: "private" | "public";
  }
) {
  const supabase = await createClient();
  await getAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("tutorials")
    .update({
      title: updates.title,
      description: updates.description,
      thumbnail_url: updates.thumbnail_url,
      status: updates.status,
      visibility: updates.visibility,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tutorial: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/tutorials");
  revalidatePath(`/tutorials/${id}`);
  revalidatePath(`/tutorials/${id}/edit`);
  return data;
}

export async function deleteTutorial(id: string) {
  const supabase = await createClient();
  await getAuthenticatedUser(supabase);

  const { error } = await supabase.from("tutorials").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete tutorial: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/tutorials");
  return { success: true };
}

export async function duplicateTutorial(id: string) {
  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  // Fetch existing
  const { data: tutorial, error: tutorialError } = await supabase
    .from("tutorials")
    .select("*")
    .eq("id", id)
    .single();

  if (tutorialError) {
    throw new Error(`Failed to fetch tutorial to duplicate: ${tutorialError.message}`);
  }

  // Fetch steps
  const { data: steps, error: stepsError } = await supabase
    .from("tutorial_steps")
    .select("*")
    .eq("tutorial_id", id);

  if (stepsError) {
    throw new Error(`Failed to fetch steps to duplicate: ${stepsError.message}`);
  }

  // Insert duplicated tutorial
  const { data: newTutorial, error: insertError } = await supabase
    .from("tutorials")
    .insert({
      user_id: user.id,
      title: `${tutorial.title} (Copy)`,
      description: tutorial.description,
      source_type: tutorial.source_type,
      source_url: tutorial.source_url,
      thumbnail_url: tutorial.thumbnail_url,
      status: "draft",
      visibility: "private",
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to insert duplicated tutorial: ${insertError.message}`);
  }

  // Insert steps
  if (steps && steps.length > 0) {
    const stepsToInsert = steps.map((step) => ({
      tutorial_id: newTutorial.id,
      step_number: step.step_number,
      title: step.title,
      instruction: step.instruction,
      selector: step.selector,
      action_type: step.action_type,
      metadata: step.metadata,
    }));

    const { error: stepsInsertError } = await supabase
      .from("tutorial_steps")
      .insert(stepsToInsert);

    if (stepsInsertError) {
      throw new Error(`Failed to duplicate tutorial steps: ${stepsInsertError.message}`);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/tutorials");
  return newTutorial;
}

export async function saveTutorialSteps(id: string, steps: StepInput[]) {
  const supabase = await createClient();
  await getAuthenticatedUser(supabase);

  // Delete existing steps
  const { error: deleteError } = await supabase
    .from("tutorial_steps")
    .delete()
    .eq("tutorial_id", id);

  if (deleteError) {
    throw new Error(`Failed to clear old tutorial steps: ${deleteError.message}`);
  }

  // Insert new steps
  if (steps.length > 0) {
    const stepsToInsert = steps.map((step) => ({
      tutorial_id: id,
      step_number: step.step_number,
      title: step.title,
      instruction: step.instruction || null,
      selector: step.selector || null,
      action_type: step.action_type || null,
      metadata: step.metadata || {},
    }));

    const { error: insertError } = await supabase
      .from("tutorial_steps")
      .insert(stepsToInsert);

    if (insertError) {
      throw new Error(`Failed to save tutorial steps: ${insertError.message}`);
    }
  }

  revalidatePath(`/tutorials/${id}`);
  revalidatePath(`/tutorials/${id}/edit`);
  return { success: true };
}

export async function generateAITutorial(tutorialId: string) {
  const supabase = await createClient();
  await getAuthenticatedUser(supabase);

  // 1. Update status to 'processing'
  await supabase
    .from("tutorials")
    .update({ status: "processing" })
    .eq("id", tutorialId);

  try {
    // 2. Fetch tutorial details
    const { data: tutorial, error: fetchError } = await supabase
      .from("tutorials")
      .select("*")
      .eq("id", tutorialId)
      .single();

    if (fetchError || !tutorial) {
      throw new Error(`Failed to fetch tutorial for generation: ${fetchError?.message || "Not found"}`);
    }

    // 3. Call AI pipeline
    const generated = await generateTutorialFromSource(
      tutorial.source_type as any,
      tutorial.source_url || "",
      tutorial.title,
      tutorial.description
    );

    // 4. Save tutorial steps to database
    // Clear any pre-existing steps (safe for retries)
    await supabase
      .from("tutorial_steps")
      .delete()
      .eq("tutorial_id", tutorialId);

    const stepsToInsert = generated.steps.map((step, idx) => ({
      tutorial_id: tutorialId,
      step_number: idx + 1,
      title: step.title,
      instruction: step.instruction,
      selector: step.selector || "",
      action_type: step.actionType,
      url: step.url || "",
      metadata: (step.metadata || {}) as any,
    }));

    const { error: stepsError } = await supabase
      .from("tutorial_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      throw new Error(`Failed to save AI steps to database: ${stepsError.message}`);
    }

    // 5. Update tutorial details (title, description if updated by AI, status = 'ready')
    const { error: updateError } = await supabase
      .from("tutorials")
      .update({
        title: generated.title || tutorial.title,
        description: generated.description || tutorial.description,
        domain: generated.domain || tutorial.domain || "",
        url_pattern: generated.urlPattern || tutorial.url_pattern || "",
        status: "ready",
        prompt_version: "1.0",
        ai_model: "gemini-2.5-flash",
      })
      .eq("id", tutorialId);

    if (updateError) {
      throw new Error(`Failed to update tutorial status to ready: ${updateError.message}`);
    }

    revalidatePath("/dashboard");
    revalidatePath("/tutorials");
    revalidatePath(`/tutorials/${tutorialId}`);
    revalidatePath(`/tutorials/${tutorialId}/edit`);

    return { success: true };
  } catch (err: any) {
    console.error("generateAITutorial Server Action error:", err);
    
    // Update tutorial status to 'failed'
    await supabase
      .from("tutorials")
      .update({ status: "failed" })
      .eq("id", tutorialId);

    revalidatePath("/dashboard");
    revalidatePath("/tutorials");
    revalidatePath(`/tutorials/${tutorialId}`);

    throw new Error(err.message || "Failed to generate AI tutorial.");
  }
}
