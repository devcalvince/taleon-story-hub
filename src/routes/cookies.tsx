import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | Taleon Media" },
      { name: "description", content: "How Taleon Media uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy | Taleon Media" },
      { property: "og:description", content: "How Taleon Media uses cookies and similar technologies." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalPage
      title="Cookie Policy"
      sections={[
        {
          h: "Essential",
          p: "Required to sign you in and keep your session active. Taleon cannot function without these.",
        },
        {
          h: "Preferences",
          p: "Remember reading settings such as text size and light or dark reading mode.",
        },
        {
          h: "Analytics",
          p: "Help us understand which stories are read, heard and watched so we can commission more of what you love. These are aggregated and never used to identify you personally.",
        },
        {
          h: "Managing cookies",
          p: "You can clear or block cookies in your browser settings. Blocking essential cookies will sign you out and disable saved progress.",
        },
      ]}
    />
  ),
});
