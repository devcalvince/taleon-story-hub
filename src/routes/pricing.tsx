import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/site/Section";

const PLANS = [
  {
    name: "Free",
    tagline: "Start reading today",
    features: ["Free stories and chapters", "Limited audio", "Supported by advertising", "Save and follow stories"],
    highlight: false,
  },
  {
    name: "Taleon Plus",
    tagline: "For regular readers",
    features: ["Ad-free reading", "Early chapters", "Premium stories", "Full narration library"],
    highlight: true,
  },
  {
    name: "Taleon Premium",
    tagline: "For the deepest fans",
    features: ["Everything in Plus", "Exclusive audiobooks", "Early releases", "Special editions and extras"],
    highlight: false,
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Membership | Taleon Media" },
      { name: "description", content: "Taleon membership tiers: Free, Taleon Plus and Taleon Premium." },
      { property: "og:title", content: "Membership | Taleon Media" },
      { property: "og:description", content: "Read ad-free, hear every narration and get chapters first." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Join Taleon"
        lede="Membership tiers are being finalised. Pricing activates once the payment provider is connected."
      />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-8 ${plan.highlight ? "border-gold bg-surface-2" : "border-border bg-surface-2/50"}`}
          >
            <h2 className="text-2xl tracking-wide">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            <p className="mt-6 text-sm text-gold">Pricing announced at launch</p>
            <ul className="mt-6 space-y-3 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className={`mt-8 block rounded-md px-5 py-3 text-center text-sm font-medium ${plan.highlight ? "bg-gold text-gold-foreground" : "border border-border"}`}
            >
              Create a free account
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
