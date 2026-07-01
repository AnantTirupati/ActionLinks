import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonResponse, handleOptions } from "@/lib/api-cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");

  // Get active user (optional - public tutorials are open)
  const { data: { user } } = await supabase.auth.getUser();

  // Construct query on tutorials
  let query = supabase.from("tutorials").select("*");

  // If user is authenticated, they can see their own tutorials OR any public tutorials
  if (user) {
    query = query.or(`user_id.eq.${user.id},visibility.eq.public`);
  } else {
    query = query.eq("visibility", "public");
  }

  // Filter by status = 'ready' or 'published'
  query = query.in("status", ["ready", "published"]);

  const { data: tutorials, error } = await query;

  if (error) {
    return jsonResponse(false, { code: "DATABASE_ERROR", message: error.message }, 500, request);
  }

  let filtered = tutorials || [];

  // Filter by domain source or domain column if specified
  if (domain) {
    const cleanDomain = domain.toLowerCase().trim();
    filtered = filtered.filter((t) => {
      if (t.domain && (t.domain.toLowerCase().includes(cleanDomain) || cleanDomain.includes(t.domain.toLowerCase()))) {
        return true;
      }
      if (!t.source_url) return false;
      try {
        const hostname = new URL(t.source_url).hostname;
        return hostname.includes(cleanDomain) || cleanDomain.includes(hostname);
      } catch {
        return t.source_url.toLowerCase().includes(cleanDomain);
      }
    });
  }

  return jsonResponse(true, filtered, 200, request);
}
