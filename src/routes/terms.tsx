import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Taleon Media" },
      { name: "description", content: "The terms that govern your use of Taleon Media." },
      { property: "og:title", content: "Terms of Service | Taleon Media" },
      { property: "og:description", content: "The terms that govern your use of Taleon Media." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      title="Terms of Service"
      sections={[
        {
          h: "Using Taleon",
          p: "By accessing Taleon Media you agree to these terms. You must be old enough to consent to them in your country, and you are responsible for activity on your account.",
        },
        {
          h: "Your account",
          p: "Keep your credentials secure and provide accurate information. We may suspend accounts that abuse the service, attempt to bypass access controls, or infringe others' rights.",
        },
        {
          h: "Content and licence",
          p: "All stories, audio, video, artwork and characters on Taleon are original works owned by Taleon Media or its creators. You receive a personal, non-transferable licence to read, listen and watch on the platform. You may not redistribute, republish, resell, scrape or use our content to train models without written permission.",
        },
        {
          h: "Memberships",
          p: "Paid memberships, when available, renew until cancelled. Prices, benefits and availability may change; we will announce material changes in advance.",
        },
        {
          h: "Availability",
          p: "We work to keep Taleon online but do not guarantee uninterrupted access. Stories, chapters and features may change or be withdrawn.",
        },
        {
          h: "Contact",
          p: "Questions about these terms can be sent through the contact page.",
        },
      ]}
    />
  ),
});
