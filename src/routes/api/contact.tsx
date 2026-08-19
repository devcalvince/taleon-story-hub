import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
          const body = await request.json();
          const validated = contactSchema.parse(body);

          const { error } = await getSupabaseAdmin()
            .from("contact_submissions")
            .insert({
              name: validated.name,
              email: validated.email,
              subject: validated.subject || null,
              message: validated.message,
            });

          if (error) throw error;

          return new Response(
            JSON.stringify({ success: true, message: "Thank you for your message. We'll get back to you soon." }),
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
            JSON.stringify({ success: false, error: "Failed to submit. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});