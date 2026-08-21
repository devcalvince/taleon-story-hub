import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSessionUser, isVerifiedAdmin } from "@/lib/admin-auth.server";
import { rateLimit } from "@/lib/rate-limit.server";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const limit = rateLimit(request, "newsletter", 5);
          if (!limit.ok) {
            return new Response(
              JSON.stringify({ success: false, error: "Too many attempts. Try again shortly." }),
              {
                status: 429,
                headers: {
                  "Content-Type": "application/json",
                  "Retry-After": String(limit.retryAfter),
                },
              },
            );
          }

          const body = await request.json();
          const validated = subscribeSchema.parse(body);

          // Upsert: if already subscribed, reactivate
          const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert(
            {
              email: validated.email,
              is_active: true,
              unsubscribed_at: null,
            },
            { onConflict: "email" },
          );

          if (error) throw error;

          return new Response(
            JSON.stringify({
              success: true,
              message: "Successfully subscribed to the newsletter!",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          if (err instanceof z.ZodError) {
            return new Response(
              JSON.stringify({ success: false, error: err.issues[0]?.message ?? "Invalid input." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }
          return new Response(
            JSON.stringify({ success: false, error: "Failed to subscribe. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          // SECURITY: an anonymous caller must never be able to unsubscribe
          // an arbitrary address. The requester must be authenticated and
          // either own the email address or hold the admin role.
          const user = await getSessionUser(request);
          if (!user) {
            return new Response(
              JSON.stringify({ success: false, error: "Sign in to manage your subscription." }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const url = new URL(request.url);
          const email = url.searchParams.get("email");

          if (!email) {
            return new Response(JSON.stringify({ success: false, error: "Email is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (user.email.toLowerCase() !== email.toLowerCase()) {
            const admin = await isVerifiedAdmin(user.id);
            if (!admin) {
              return new Response(
                JSON.stringify({
                  success: false,
                  error: "You can only manage your own subscription.",
                }),
                { status: 403, headers: { "Content-Type": "application/json" } },
              );
            }
          }

          const { error } = await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
            .eq("email", email);

          if (error) throw error;

          return new Response(
            JSON.stringify({ success: true, message: "Successfully unsubscribed." }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch {
          return new Response(JSON.stringify({ success: false, error: "Failed to unsubscribe." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
