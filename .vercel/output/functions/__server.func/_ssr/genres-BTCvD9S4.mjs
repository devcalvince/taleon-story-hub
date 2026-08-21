import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { o as Route$30 } from "./router-WzjKqw9S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/genres-BTCvD9S4.js
var import_jsx_runtime = require_jsx_runtime();
function GenresPage() {
	const genres = Route$30.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Discover",
		title: "Genres",
		lede: "Choose the kind of world you want to disappear into."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto grid w-full max-w-7xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3",
		children: genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/stories",
			search: { genre: g.slug },
			className: "group relative overflow-hidden rounded-lg border border-border bg-surface-2 p-8 transition-colors hover:border-border-strong",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-0 left-0 h-full w-1 opacity-70 transition-opacity group-hover:opacity-100",
					style: { background: g.accent },
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: g.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: g.description
				})
			]
		}, g.id))
	})] });
}
//#endregion
export { GenresPage as component };
