import { createClient } from "@/lib/supabase/server";
import { jsonResponse, handleOptions } from "@/lib/api-cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
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

    return jsonResponse(true, data, 200, request);
  } catch (err: any) {
    return jsonResponse(
      false,
      { code: "BAD_REQUEST", message: err.message },
      400,
      request
    );
  }
}
