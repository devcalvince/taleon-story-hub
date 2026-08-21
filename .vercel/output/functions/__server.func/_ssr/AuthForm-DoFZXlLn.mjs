import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { d as track } from "./router-WzjKqw9S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthForm-DoFZXlLn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthForm({ mode }) {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function google() {
		setError("");
		const { error: err } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (err) setError("Google sign-in failed. " + err.message);
	}
	async function submit(e) {
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
					data: { display_name: name.trim().slice(0, 60) }
				}
			});
			setBusy(false);
			if (err) return setError(err.message);
			if (!data.session) return setNotice("Check your email to confirm your account, then sign in.");
			track("signup", { metadata: { method: "credentials" } });
			navigate({ to: "/account" });
		} else {
			const { error: err } = await supabase.auth.signInWithPassword({
				email: mail,
				password
			});
			setBusy(false);
			if (err) return setError("Incorrect email or password.");
			track("login", { metadata: { method: "credentials" } });
			navigate({ to: "/account" });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-md px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl tracking-wide",
				children: mode === "signup" ? "Create your account" : "Welcome back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: mode === "signup" ? "Save stories, keep your place and unlock your Taleon library." : "Sign in to continue reading where you left off."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: google,
				className: "mt-8 w-full rounded-md border border-border bg-surface-2 px-5 py-3 text-sm font-medium hover:border-border-strong",
				children: "Continue with Google"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex items-center gap-4 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
					"or",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-4",
				children: [
					mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "name",
						className: "eyebrow block",
						children: "Display name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "name",
						value: name,
						maxLength: 60,
						onChange: (e) => setName(e.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "email",
						className: "eyebrow block",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "email",
						type: "email",
						required: true,
						maxLength: 255,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "password",
						className: "eyebrow block",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "password",
						type: "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gold",
						children: notice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "w-full rounded-md bg-gold px-5 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase disabled:opacity-60",
						children: busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Already have an account?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-gold",
						children: "Sign in"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"New to Taleon?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "text-gold",
						children: "Create an account"
					})
				] })
			})
		]
	});
}
//#endregion
export { AuthForm as t };
