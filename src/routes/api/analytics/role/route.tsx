import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/analytics/role")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // SECURITY: the caller's identity comes from the verified Supabase
          // access token in the Authorization header — never from the
          // request body. A browser cannot declare itself admin.
          const authHeader = request.headers.get("Authorization") ?? "";
          const token = authHeader.replace(/^Bearer\s+/i, "").trim();
          if (!token) {
            return new Response(JSON.stringify({ actorType: "public" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Dynamic import per project convention: route files ship to the
          // client bundle; the service-role client must stay server-side.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const {
            data: { user },
            error: userError,
          } = await supabaseAdmin.auth.getUser(token);

          if (userError || !user?.id) {
            return new Response(JSON.stringify({ actorType: "public" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Query user_roles via the service-role key to determine admin
          // status for this verified user.
          const { data: roleData, error: roleError } = await supabaseAdmin
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleError) {
            // On error default to "public" — never misclassify upward.
            return new Response(JSON.stringify({ actorType: "public" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const isAdmin = roleData?.role === "admin";
          return new Response(JSON.stringify({ actorType: isAdmin ? "admin" : "public" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
