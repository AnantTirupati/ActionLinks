import { createClient } from "@/lib/supabase/server";
import { jsonResponse, handleOptions } from "@/lib/api-cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Authenticate (optional)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch tutorial
  const { data: tutorial, error: tutorialError } = await supabase
    .from("tutorials")
    .select("*")
    .eq("id", id)
    .single();

  if (tutorialError || !tutorial) {
    return jsonResponse(
      false,
      { code: "NOT_FOUND", message: "Tutorial not found." },
      404,
      request
    );
  }

  // Visibility Check
  const isOwner = user?.id === tutorial.user_id;
  if (tutorial.visibility !== "public" && !isOwner) {
    return jsonResponse(
      false,
      { code: "FORBIDDEN", message: "Tutorial is private." },
      403,
      request
    );
  }

  // Fetch steps
  const { data: steps, error: stepsError } = await supabase
    .from("tutorial_steps")
    .select("*")
    .eq("tutorial_id", id)
    .order("step_number", { ascending: true });

  if (stepsError) {
    return jsonResponse(
      false,
      { code: "STEPS_NOT_FOUND", message: "Failed to fetch tutorial steps." },
      404,
      request
    );
  }

  // Fetch progress if authenticated
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

  const currentStep = progress ? progress.current_step : 1;
  const completed = progress && Array.isArray(progress.completed_steps) 
    ? progress.completed_steps 
    : [];

  return jsonResponse(
    true,
    {
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      difficulty: "Beginner",
      estimatedTime: (steps || []).length * 2,
      progress: {
        currentStep,
        completed
      },
      steps: (steps || []).map(s => ({
        id: s.id,
        step_number: s.step_number,
        title: s.title,
        instruction: s.instruction || "",
        action_type: s.action_type || "click",
        selector: s.selector || "",
        metadata: s.metadata || {}
      }))
    },
    200,
    request
  );
}
