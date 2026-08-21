import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SessionProvider } from "@/hooks/useSession";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { usePageTracking } from "@/hooks/usePageTracking";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Taleon Media</p>
        <h1 className="mt-3 text-5xl">Lost the signal</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page doesn't exist, or the story it belonged to has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            to="/stories"
            className="rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong"
          >
            Browse stories
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong on our end. Try again, or head back to the catalogue.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Taleon Media — Stories that come alive." },
      {
        name: "description",
        content:
          "Taleon Media is an original storytelling company. Read, listen to and watch cinematic original stories.",
      },
      { property: "og:site_name", content: "Taleon Media" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#080B12" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Taleon Media",
          slogan: "Stories that come alive.",
          sameAs: [
            "https://www.tiktok.com/@taleonmedia",
            "https://instagram.com/taleonmedia",
            "https://youtube.com/@taleonmedia",
            "https://x.com/taleonmedia",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  usePageTracking();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-gold-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[60vh]">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </SessionProvider>
    </QueryClientProvider>
  );
}
