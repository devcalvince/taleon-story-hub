import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { i as Route$24 } from "./router-WzjKqw9S.mjs";
import { n as StoryGrid } from "./StoryCard-Dy49yDu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stories-DJHtvyW5.js
var import_jsx_runtime = require_jsx_runtime();
var SORTS = [
	{
		key: "trending",
		label: "Trending"
	},
	{
		key: "newest",
		label: "Newest"
	},
	{
		key: "most_read",
		label: "Most Read"
	},
	{
		key: "most_listened",
		label: "Most Listened"
	},
	{
		key: "top_rated",
		label: "Highest Rated"
	}
];
function StoriesPage() {
	const { stories, genres } = Route$24.useLoaderData();
	const search = Route$24.useSearch();
	const navigate = useNavigate({ from: "/stories" });
	const setSearch = (next) => navigate({ search: (prev) => ({
		...prev,
		...next
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Catalogue",
			title: "Stories",
			lede: "Every world Taleon has opened so far."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearch({ genre: void 0 }),
						className: `rounded-md border px-3 py-1.5 text-xs ${!search.genre ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`,
						children: "All genres"
					}), genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearch({ genre: g.slug }),
						className: `rounded-md border px-3 py-1.5 text-xs ${search.genre === g.slug ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`,
						children: g.name
					}, g.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 lg:ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "sort",
						className: "text-xs text-muted-foreground",
						children: "Sort"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "sort",
						value: search.sort ?? "trending",
						onChange: (e) => setSearch({ sort: e.target.value }),
						className: "rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
						children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.key,
							children: s.label
						}, s.key))
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6",
			children: stories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel px-6 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg",
						children: "No stories match those filters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Try another genre, or browse everything."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stories",
						search: {},
						className: "mt-6 inline-block rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong",
						children: "Clear filters"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryGrid, { stories })
		})
	] });
}
//#endregion
export { StoriesPage as component };
