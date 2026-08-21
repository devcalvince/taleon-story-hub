import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { r as Route$22 } from "./router-WzjKqw9S.mjs";
import { b as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch-CJT84rtW.js
var import_jsx_runtime = require_jsx_runtime();
function WatchPage() {
	const videos = Route$22.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Watch",
		title: "Story Videos",
		lede: "Trailers, cinematic chapters and shorts from the Taleon universe."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6",
		children: videos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No videos published yet",
			body: "Taleon story videos are in production. Follow @taleonmedia for release news."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: videos.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "panel overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex aspect-video items-center justify-center bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "size-8 text-gold",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-3 bottom-3 rounded bg-background/80 px-2 py-1 text-[10px] tracking-widest uppercase",
						children: v.kind
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base leading-tight font-medium",
							children: v.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: v.description
						}),
						v.stories?.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/story/$slug",
							params: { slug: v.stories.slug },
							className: "mt-4 inline-block text-xs tracking-widest text-gold uppercase hover:opacity-80",
							children: "Related story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Playback opens when this release goes live."
						})
					]
				})]
			}, v.id))
		})
	})] });
}
//#endregion
export { WatchPage as component };
