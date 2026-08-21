import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { d as useAdminCounts, g as useAdminRecentStories } from "./use-admin-data-Ci0dyhh6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DsvgKdlc.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboardPage() {
	const countsQuery = useAdminCounts();
	const recentStoriesQuery = useAdminRecentStories();
	const counts = countsQuery.data ?? {
		stories: 0,
		chapters: 0,
		users: 0,
		genres: 0
	};
	const stories = recentStoriesQuery.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Taleon control room",
		lede: "Catalogue overview and publishing status."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4",
			children: [
				{
					k: "Stories",
					v: counts.stories
				},
				{
					k: "Chapters",
					v: counts.chapters
				},
				{
					k: "Users",
					v: counts.users
				},
				{
					k: "Genres",
					v: counts.genres
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-surface-2 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: s.k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl",
					children: s.v
				})]
			}, s.k))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 text-xl tracking-wide",
			children: "Recent Stories"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface-2 text-xs text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Views"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border",
					children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-surface-2/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: s.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: s.is_premium ? "Premium" : "Free"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: s.views ?? 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/story/$slug",
									params: { slug: s.slug },
									className: "text-gold",
									children: "View"
								})
							})
						]
					}, s.id))
				})]
			})
		})] })]
	})] });
}
//#endregion
export { AdminDashboardPage as component };
