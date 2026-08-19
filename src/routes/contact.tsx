import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/Section";

const CATEGORIES = ["General", "Business", "Partnership", "Copyright", "Support"];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Taleon Media" },
      {
        name: "description",
        content: "Contact Taleon Media for general, business, partnership, copyright or support enquiries.",
      },
      { property: "og:title", content: "Contact | Taleon Media" },
      { property: "og:description", content: "Get in touch with the Taleon Media team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", category: "General", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || name.length > 100) return setError("Please enter your name (under 100 characters).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 255)
      return setError("Please enter a valid email address.");
    if (!message || message.length > 1000) return setError("Please enter a message under 1000 characters.");
    setError("");
    setSent(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lede="Tell us what you need and we'll route it to the right team."
      />
      <div className="mx-auto w-full max-w-2xl px-4 pb-20 sm:px-6">
        {sent ? (
          <div className="panel px-6 py-14 text-center">
            <h2 className="text-xl">Message received</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Thanks, {form.name.trim()}. Your {form.category.toLowerCase()} enquiry has been logged and the Taleon team
              will respond by email.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="name" className="eyebrow block">
                Name
              </label>
              <input
                id="name"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow block">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={255}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
              />
            </div>
            <div>
              <label htmlFor="category" className="eyebrow block">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message" className="eyebrow block">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                maxLength={1000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase">
              Send message
            </button>
          </form>
        )}
      </div>
    </>
  );
}
