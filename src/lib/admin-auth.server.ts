import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

export interface AdminUser {
  id: string;
  email: string;
}

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
  if (match?.[1]) {
    try {
      const decoded = JSON.parse(decodeURIComponent(match[1]));
      const token = decoded?.["access_token"];
      return typeof token === "string" ? token : null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function requireAdmin(request: Request): Promise<AdminUser> {
  const token = extractToken(request);
  if (!token) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleRow) {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { id: user.id, email: user.email ?? "" };
}
