import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rateLimit } from "@/lib/rate-limit.server";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const limit = rateLimit(request, "contact", 5);
          if (!limit.ok) {
            return new Response(
              JSON.stringify({ success: false, error: "Too many submissions. Try again shortly." }),
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
          const validated = contactSchema.parse(body);

          const { error } = await supabaseAdmin.from("contact_submissions").insert({
            name: validated.name,
            email: validated.email,
            subject: validated.subject || null,
            message: validated.message,
          });

          if (error) throw error;

          return new Response(
            JSON.stringify({
              success: true,
              message: "Thank you for your message. We'll get back to you soon.",
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
            JSON.stringify({ success: false, error: "Failed to submit. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
