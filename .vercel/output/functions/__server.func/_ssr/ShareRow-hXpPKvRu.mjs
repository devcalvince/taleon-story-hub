import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as track } from "./router-WzjKqw9S.mjs";
import { W as Check, k as Link2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ShareRow-hXpPKvRu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TARGETS = [
	{
		label: "WhatsApp",
		url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`
	},
	{
		label: "X",
		url: (u, t) => `https://x.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`
	},
	{
		label: "Facebook",
		url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`
	}
];
var PROFILES = [
	{
		label: "TikTok",
		href: "https://www.tiktok.com/@taleonmedia"
	},
	{
		label: "Instagram",
		href: "https://instagram.com/taleonmedia"
	},
	{
		label: "YouTube",
		href: "https://youtube.com/@taleonmedia"
	}
];
function ShareRow({ title, storyId }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const url = typeof window === "undefined" ? "" : window.location.href;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "eyebrow mr-1",
				children: "Share"
			}),
			TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: t.url(url, title),
				target: "_blank",
				rel: "noreferrer noopener",
				onClick: () => track("share", {
					storyId,
					metadata: { target: t.label }
				}),
				className: "rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground",
				children: t.label
			}, t.label)),
			PROFILES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: p.href,
				target: "_blank",
				rel: "noreferrer noopener",
				className: "rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground",
				children: p.label
			}, p.label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: async () => {
					await navigator.clipboard.writeText(url);
					setCopied(true);
					track("share", {
						storyId,
						metadata: { target: "copy_link" }
					});
					setTimeout(() => setCopied(false), 2e3);
				},
				className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground",
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), copied ? "Copied" : "Copy link"]
			})
		]
	});
}
//#endregion
export { ShareRow as t };
