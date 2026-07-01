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

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return jsonResponse(
      false,
      { code: "UNAUTHORIZED", message: "Authentication required to fetch progress." },
      401,
      request
    );
  }

  try {
    const { data: progress, error } = await supabase
      .from("tutorial_progress")
      .select("*")
      .eq("tutorial_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return jsonResponse(
        false,
        { code: "DATABASE_ERROR", message: error.message },
        500,
        request
      );
    }

    if (!progress) {
      return jsonResponse(
        true,
        {
          currentStep: 1,
          completedSteps: [],
          startedAt: null,
          completedAt: null,
          updatedAt: null,
        },
        200,
        request
      );
    }

    return jsonResponse(
      true,
      {
        currentStep: progress.current_step,
        completedSteps: progress.completed_steps || [],
        startedAt: progress.started_at,
        completedAt: progress.completed_at,
        updatedAt: progress.updated_at,
      },
      200,
      request
    );
  } catch (err: any) {
    return jsonResponse(
      false,
      { code: "BAD_REQUEST", message: err.message },
      400,
      request
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return jsonResponse(
      false,
      { code: "UNAUTHORIZED", message: "Authentication required to sync progress." },
      401,
      request
    );
  }

  try {
    const { currentStep, completedSteps } = await request.json();

    // Fetch steps count to determine if completed
    const { count: stepsCount } = await supabase
      .from("tutorial_steps")
      .select("id", { count: "exact", head: true })
      .eq("tutorial_id", id);

    const totalSteps = stepsCount || 0;
    const isCompleted = totalSteps > 0 && Array.isArray(completedSteps) && completedSteps.length >= totalSteps;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    // Upsert progress
    const { data, error } = await supabase
      .from("tutorial_progress")
      .upsert({
        user_id: user.id,
        tutorial_id: id,
        current_step: currentStep,
        completed_steps: completedSteps || [],
        completed_at: completedAt,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id,tutorial_id"
      })
      .select()
      .single();

    if (error) {
      return jsonResponse(
        false,
        { code: "DATABASE_ERROR", message: error.message },
        400,
        request
      );
    }

    return jsonResponse(
      true,
      {
        currentStep: data.current_step,
        completedSteps: data.completed_steps || [],
        startedAt: data.started_at,
        completedAt: data.completed_at,
        updatedAt: data.updated_at,
      },
      200,
      request
    );
  } catch (err: any) {
    return jsonResponse(
      false,
      { code: "BAD_REQUEST", message: err.message },
      400,
      request
    );
  }
}
