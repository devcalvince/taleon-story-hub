import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as Headphones, b as Play } from "../_libs/lucide-react.mjs";
import { n as coverFor } from "./artwork-PyNNFBXk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StoryCard-Dy49yDu_.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	ongoing: "Ongoing",
	completed: "Completed",
	coming_soon: "Coming Soon"
};
function StoryCard({ story, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/story/$slug",
				params: { slug: story.slug },
				className: "block focus-visible:outline-none",
				"aria-label": story.title,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-surface-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: coverFor(story),
							alt: `Cover art for ${story.title}`,
							loading: "lazy",
							width: 768,
							height: 1024,
							className: "size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent opacity-80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-[11px] text-muted-foreground",
							children: [
								story.has_audio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, {
									className: "size-3.5 text-gold",
									"aria-label": "Audio available"
								}),
								story.has_video && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-3.5 text-gold",
									"aria-label": "Video available"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto",
									children: STATUS_LABEL[story.status] ?? story.status
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 text-base leading-tight font-semibold",
					children: story.title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [(story.genres ?? []).map((g) => g.name).slice(0, 2).join(" / "), story.chapter_count ? ` • ${story.chapter_count} chapters` : ""]
			}),
			story.short_description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
				children: story.short_description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/story/$slug",
				params: { slug: story.slug },
				className: "mt-3 inline-block text-xs font-medium tracking-widest text-gold uppercase hover:opacity-80",
				children: action
			})
		]
	});
}
function StoryGrid({ stories, empty }) {
	if (!stories.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel px-6 py-14 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: empty ?? "Nothing here yet. New Taleon stories are on the way."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
		children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story: s }, s.id))
	});
}
//#endregion
export { StoryGrid as n, StoryCard as t };
