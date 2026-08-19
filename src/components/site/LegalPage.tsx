import { PageHeader } from "@/components/site/Section";

export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} />
      <div className="mx-auto max-w-3xl space-y-10 px-4 pb-20 sm:px-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-xl tracking-wide">{s.h}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <p className="border-t border-border pt-6 text-xs text-muted-foreground">
          Last updated {new Date().getFullYear()}. Taleon Media.
        </p>
      </div>
    </>
  );
}
