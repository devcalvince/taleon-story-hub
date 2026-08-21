import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (err) {
      setError("Google sign-in failed. " + err.message);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail) || mail.length > 255) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email: mail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: name.trim().slice(0, 60) },
        },
      });
      setBusy(false);
      if (err) return setError(err.message);
      if (!data.session)
        return setNotice("Check your email to confirm your account, then sign in.");
      // Fired only after successful signup. No PII — method only.
      track("signup", { metadata: { method: "credentials" } });
      navigate({ to: "/account" });
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email: mail, password });
      setBusy(false);
      if (err) return setError("Incorrect email or password.");
      // Fired only after successful login. No PII — method only.
      track("login", { metadata: { method: "credentials" } });
      navigate({ to: "/account" });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl tracking-wide">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "signup"
          ? "Save stories, keep your place and unlock your Taleon library."
          : "Sign in to continue reading where you left off."}
      </p>

      <button
        onClick={google}
        className="mt-8 w-full rounded-md border border-border bg-surface-2 px-5 py-3 text-sm font-medium hover:border-border-strong"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="eyebrow block">
              Display name
            </label>
            <input
              id="name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
          />
        </div>
        <div>
          <label htmlFor="password" className="eyebrow block">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {notice && <p className="text-sm text-gold">{notice}</p>}
        <button
          disabled={busy}
          className="w-full rounded-md bg-gold px-5 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-gold">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Taleon?{" "}
            <Link to="/signup" className="text-gold">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
