import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Section({
  title,
  eyebrow,
  href,
  hrefLabel = "See all",
  children,
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-1 text-2xl tracking-wide sm:text-3xl">{title}</h2>
        </div>
        {href && (
          <Link
            to={href as never}
            className="shrink-0 text-xs tracking-widest text-gold uppercase hover:opacity-80"
          >
            {hrefLabel}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  lede,
  eyebrow,
}: {
  title: string;
  lede?: string;
  eyebrow?: string;
}) {
  return (
    <header className="mx-auto w-full max-w-7xl px-4 pt-14 pb-6 sm:px-6">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl tracking-wide sm:text-5xl">{title}</h1>
      {lede && <p className="mt-4 max-w-2xl text-base text-muted-foreground">{lede}</p>}
    </header>
  );
}

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel px-6 py-16 text-center">
      <h3 className="text-lg">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>}
      {children && <div className="mt-6 flex justify-center gap-3">{children}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="panel flex items-center justify-center px-6 py-16"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm text-muted-foreground">{label}…</span>
    </div>
  );
}
