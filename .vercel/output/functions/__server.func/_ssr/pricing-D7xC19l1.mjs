import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { W as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-D7xC19l1.js
var import_jsx_runtime = require_jsx_runtime();
var PLANS = [
	{
		name: "Free",
		tagline: "Start reading today",
		features: [
			"Free stories and chapters",
			"Limited audio",
			"Supported by advertising",
			"Save and follow stories"
		],
		highlight: false
	},
	{
		name: "Taleon Plus",
		tagline: "For regular readers",
		features: [
			"Ad-free reading",
			"Early chapters",
			"Premium stories",
			"Full narration library"
		],
		highlight: true
	},
	{
		name: "Taleon Premium",
		tagline: "For the deepest fans",
		features: [
			"Everything in Plus",
			"Exclusive audiobooks",
			"Early releases",
			"Special editions and extras"
		],
		highlight: false
	}
];
function PricingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Membership",
		title: "Join Taleon",
		lede: "Membership tiers are being finalised. Pricing activates once the payment provider is connected."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3",
		children: PLANS.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-lg border p-8 ${plan.highlight ? "border-gold bg-surface-2" : "border-border bg-surface-2/50"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: plan.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: plan.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-gold",
					children: "Pricing announced at launch"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-3 text-sm",
					children: plan.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "mt-0.5 size-4 shrink-0 text-gold",
							"aria-hidden": true
						}), f]
					}, f))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: `mt-8 block rounded-md px-5 py-3 text-center text-sm font-medium ${plan.highlight ? "bg-gold text-gold-foreground" : "border border-border"}`,
					children: "Create a free account"
				})
			]
		}, plan.name))
	})] });
}
//#endregion
export { PricingPage as component };
