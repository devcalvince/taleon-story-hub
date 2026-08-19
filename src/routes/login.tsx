import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Taleon Media" },
      { name: "description", content: "Sign in to your Taleon Media account to keep reading, listening and watching." },
      { property: "og:title", content: "Sign In | Taleon Media" },
      { property: "og:description", content: "Sign in to your Taleon Media account." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: () => <AuthForm mode="login" />,
});
