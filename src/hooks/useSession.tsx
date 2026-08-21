import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

type SessionState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

const SessionContext = createContext<SessionState>({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
});

/**
 * Post-OAuth login tracking.
 *
 * Credentials logins/signups are tracked explicitly in AuthForm after the
 * request succeeds. This handler covers OAuth redirects (e.g. Google), which
 * return to the app with a fresh session and no explicit submit point.
 *
 * Guarantees:
 * - Fires only on a real SIGNED_IN auth event (never on render).
 * - Deduped per actual sign-in via user id + last_sign_in_at, so token
 *   refreshes and re-renders cannot double-count.
 * - OAuth providers only — credentials would double-fire with AuthForm.
 * - No PII: only the provider name reaches analytics. Admin exclusion is
 *   handled inside track() (server-authoritative actor check).
 */
const TRACKED_LOGIN_KEY = "taleon_tracked_login";

function trackOAuthLogin(session: Session): void {
  try {
    const provider = session.user?.app_metadata?.provider;
    if (!provider || provider === "email") return;
    const key = `${session.user.id}:${session.user.last_sign_in_at ?? ""}`;
    if (localStorage.getItem(TRACKED_LOGIN_KEY) === key) return;
    localStorage.setItem(TRACKED_LOGIN_KEY, key);
    track("login", { metadata: { method: provider } });
  } catch {
    /* analytics must never break auth flow */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setLoading(false);
      if (event === "SIGNED_IN" && next) trackOAuthLogin(next);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session?.user?.id]);

  return (
    <SessionContext.Provider value={{ session, user: session?.user ?? null, loading, isAdmin }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
