import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validated = subscribeSchema.parse(body);

          // Upsert: if already subscribed, reactivate
          const { error } = await supabaseAdmin
            .from("newsletter_subscribers")
            .upsert(
              {
                email: validated.email,
                is_active: true,
                unsubscribed_at: null,
              },
              { onConflict: "email" }
            );

          if (error) throw error;

          return new Response(
            JSON.stringify({ success: true, message: "Successfully subscribed to the newsletter!" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          if (err.name === "ZodError") {
            return new Response(
              JSON.stringify({ success: false, error: err.errors[0].message }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
          return new Response(
            JSON.stringify({ success: false, error: "Failed to subscribe. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const email = url.searchParams.get("email");

          if (!email) {
            return new Response(
              JSON.stringify({ success: false, error: "Email is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { error } = await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
            .eq("email", email);

          if (error) throw error;

          return new Response(
            JSON.stringify({ success: true, message: "Successfully unsubscribed." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: "Failed to unsubscribe." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});