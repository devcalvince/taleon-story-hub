import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { d as track } from "./router-WzjKqw9S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-B4Bvq6eD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"General",
	"Business",
	"Partnership",
	"Copyright",
	"Support"
];
function ContactPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		category: "General",
		message: ""
	});
	async function submit(e) {
		e.preventDefault();
		const name = form.name.trim();
		const email = form.email.trim();
		const message = form.message.trim();
		if (!name || name.length > 100) return setError("Please enter your name (under 100 characters).");
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 255) return setError("Please enter a valid email address.");
		if (!message || message.length > 1e3) return setError("Please enter a message under 1000 characters.");
		setError("");
		setBusy(true);
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					subject: form.category,
					message
				})
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				setError(data.error ?? "Failed to send. Please try again.");
				return;
			}
			track("contact_submission", { metadata: {
				formType: "contact",
				formLocation: "contact_page"
			} });
			setSent(true);
		} catch {
			setError("Failed to send. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Contact",
		title: "Get in touch",
		lede: "Tell us what you need and we'll route it to the right team."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-full max-w-2xl px-4 pb-20 sm:px-6",
		children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel px-6 py-14 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl",
				children: "Message received"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					"Thanks, ",
					form.name.trim(),
					". Your ",
					form.category.toLowerCase(),
					" enquiry has been logged and the Taleon team will respond by email."
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "name",
					className: "eyebrow block",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "name",
					required: true,
					maxLength: 100,
					value: form.name,
					onChange: (e) => setForm({
						...form,
						name: e.target.value
					}),
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
					value: form.email,
					onChange: (e) => setForm({
						...form,
						email: e.target.value
					}),
					className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "category",
					className: "eyebrow block",
					children: "Category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					id: "category",
					value: form.category,
					onChange: (e) => setForm({
						...form,
						category: e.target.value
					}),
					className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c,
						children: c
					}, c))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "message",
					className: "eyebrow block",
					children: "Message"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "message",
					required: true,
					rows: 6,
					maxLength: 1e3,
					value: form.message,
					onChange: (e) => setForm({
						...form,
						message: e.target.value
					}),
					className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
				})] }),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					className: "rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase disabled:opacity-60",
					children: busy ? "Sending…" : "Send message"
				})
			]
		})
	})] });
}
//#endregion
export { ContactPage as component };
