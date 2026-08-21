import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Taleon Media" },
      { name: "description", content: "How Taleon Media collects, uses and protects your data." },
      { property: "og:title", content: "Privacy Policy | Taleon Media" },
      {
        property: "og:description",
        content: "How Taleon Media collects, uses and protects your data.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      sections={[
        {
          h: "What we collect",
          p: "Account details you provide (name, email, avatar), your reading, listening and viewing activity, saved stories and follows, and basic technical data such as device type and pages visited.",
        },
        {
          h: "Why we collect it",
          p: "To keep you signed in, remember where you stopped reading, recommend stories, improve the catalogue and understand which stories resonate.",
        },
        {
          h: "Sharing",
          p: "We do not sell your personal data. We share only with the infrastructure providers needed to run Taleon — hosting, database, authentication and analytics — under their own privacy obligations.",
        },
        {
          h: "Your choices",
          p: "You can update your profile, clear your reading history, or request deletion of your account and associated data at any time via the contact page.",
        },
        {
          h: "Security",
          p: "Access to your data is protected by row-level security rules, so only you (and where necessary, Taleon administrators) can access your account records.",
        },
      ]}
    />
  ),
});
