import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView, captureAttribution } from "@/lib/analytics";

/**
 * Automatically tracks a page_view (or story_view for story pages)
 * whenever the current route changes.
 *
 * Call this once in the root layout component to capture all navigation.
 */
export function usePageTracking() {
  const { location } = useRouterState();

  useEffect(() => {
    // Initialize attribution capture on first render
    captureAttribution();
    trackPageView(location.pathname);
  }, [location.pathname]);
}
