import { createClient } from "@/lib/supabase/server";
import { jsonResponse, handleOptions } from "@/lib/api-cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return jsonResponse(true, { authenticated: false }, 200, request);
  }

  return jsonResponse(
    true,
    {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      },
    },
    200,
    request
  );
}
