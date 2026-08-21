import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { a as Route$26, d as track } from "./router-WzjKqw9S.mjs";
import { n as StoryGrid } from "./StoryCard-Dy49yDu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CdzlEtHm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const results = Route$26.useLoaderData();
	const { q } = Route$26.useSearch();
	const [term, setTerm] = (0, import_react.useState)(q ?? "");
	const navigate = useNavigate({ from: "/search" });
	const nothing = !results.stories.length && !results.chapters.length && !results.characters.length && !results.genres.length;
	const trackedQuery = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!q || trackedQuery.current === q) return;
		trackedQuery.current = q;
		track("search", { metadata: {
			query: q,
			result_count: results.stories.length + results.chapters.length + results.characters.length + results.genres.length
		} });
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Search",
			title: q ? `Results for “${q}”` : "Search Taleon"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				role: "search",
				onSubmit: (e) => {
					e.preventDefault();
					navigate({ search: { q: term.trim() } });
				},
				className: "flex gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "search-input",
						className: "sr-only",
						children: "Search stories, chapters and characters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "search-input",
						value: term,
						maxLength: 120,
						onChange: (e) => setTerm(e.target.value),
						placeholder: "Search stories, chapters, characters",
						className: "w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground",
						children: "Search"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6",
			children: !q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "What are you looking for?",
				body: "Search across every Taleon story, chapter, character and genre."
			}) : nothing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No results",
				body: `Nothing matched “${q}”. Try a different title, character or genre.`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/stories",
					className: "rounded-md border border-border px-5 py-2.5 text-sm",
					children: "Browse all stories"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				results.stories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-xl tracking-wide",
					children: "Stories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryGrid, { stories: results.stories })] }),
				results.chapters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-xl tracking-wide",
					children: "Chapters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border overflow-hidden rounded-lg border border-border",
					children: results.chapters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: c.stories?.slug ?? "",
							chapterNumber: String(c.chapter_number)
						},
						className: "block bg-surface-2/50 px-5 py-4 text-sm hover:bg-surface-2",
						children: [
							c.stories?.title,
							" — Chapter ",
							c.chapter_number,
							": ",
							c.title
						]
					}) }, c.id))
				})] }),
				results.characters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-xl tracking-wide",
					children: "Characters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: results.characters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "panel p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								c.role,
								" • ",
								c.stories?.title
							]
						})]
					}, c.id))
				})] }),
				results.genres.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-xl tracking-wide",
					children: "Genres"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: results.genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stories",
						search: { genre: g.slug },
						className: "rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong",
						children: g.name
					}, g.id))
				})] })
			] })
		})
	] });
}
//#endregion
export { SearchPage as component };
