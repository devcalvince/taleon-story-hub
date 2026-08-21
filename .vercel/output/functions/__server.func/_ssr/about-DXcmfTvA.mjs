import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-DXcmfTvA.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "About",
		title: "Stories that come alive.",
		lede: "Taleon Media is an original digital storytelling and entertainment company."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8 px-4 pb-20 text-base leading-relaxed text-muted-foreground sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We create original worlds and release them in the three ways people actually experience stories today: reading, listening and watching. Every Taleon Original is written, produced and owned in-house." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Our first flagship world is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground",
					children: "The Last Signal"
				}),
				" — a sci-fi mystery set in Nairobi in 2047, released chapter by chapter, with narration and cinematic adaptations following each release."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3",
				children: [
					{
						k: "Read",
						v: "Serialized stories and novels"
					},
					{
						k: "Listen",
						v: "Narrated chapters and audiobooks"
					},
					{
						k: "Watch",
						v: "Cinematic story videos"
					}
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface-2 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg tracking-[0.2em] text-foreground uppercase",
						children: i.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: i.v
					})]
				}, i.k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Taleon is built for a mobile-first audience discovering stories on TikTok, Instagram and YouTube — and built to grow into a full storytelling ecosystem with membership, community and a mobile app." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/stories",
					className: "rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground",
					children: "Explore the catalogue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					className: "rounded-md border border-border px-6 py-3 text-sm",
					children: "Work with us"
				})]
			})
		]
	})] });
}
//#endregion
export { AboutPage as component };
