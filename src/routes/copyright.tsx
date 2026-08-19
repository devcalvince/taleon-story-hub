import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/copyright")({
  head: () => ({
    meta: [
      { title: "Copyright | Taleon Media" },
      { name: "description", content: "Copyright ownership and takedown process for Taleon Media originals." },
      { property: "og:title", content: "Copyright | Taleon Media" },
      { property: "og:description", content: "Copyright ownership and takedown process for Taleon Media." },
      { property: "og:url", content: "/copyright" },
    ],
    links: [{ rel: "canonical", href: "/copyright" }],
  }),
  component: () => (
    <LegalPage
      title="Copyright"
      sections={[
        {
          h: "Ownership",
          p: "All Taleon Originals — text, narration, video, artwork, characters, titles and world names — are the intellectual property of Taleon Media. Reposting full chapters, uploading our narration or re-cutting our videos is not permitted.",
        },
        {
          h: "Fair use and fan work",
          p: "Short quotes with attribution and non-commercial fan art are welcome. Always credit Taleon Media and link back to the original story.",
        },
        {
          h: "Reporting infringement",
          p: "If you believe content on Taleon infringes your rights, contact us with the work in question, the URL, and evidence of ownership. We review every report and remove infringing material.",
        },
        {
          h: "Protecting our work",
          p: "We monitor for unauthorised redistribution and issue takedowns where necessary.",
        },
      ]}
    />
  ),
});
