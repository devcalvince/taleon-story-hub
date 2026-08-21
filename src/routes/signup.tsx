import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account | Taleon Media" },
      {
        name: "description",
        content: "Create a free Taleon Media account to save stories and keep your place.",
      },
      { property: "og:title", content: "Create Account | Taleon Media" },
      { property: "og:description", content: "Create a free Taleon Media account." },
      { property: "og:url", content: "/signup" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: () => <AuthForm mode="signup" />,
});
