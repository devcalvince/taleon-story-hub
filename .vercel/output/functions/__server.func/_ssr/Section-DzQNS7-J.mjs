import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Section-DzQNS7-J.js
var import_jsx_runtime = require_jsx_runtime();
function Section({ title, eyebrow, href, hrefLabel = "See all", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-7xl px-4 py-12 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: eyebrow
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-2xl tracking-wide sm:text-3xl",
				children: title
			})] }), href && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: href,
				className: "shrink-0 text-xs tracking-widest text-gold uppercase hover:opacity-80",
				children: hrefLabel
			})]
		}), children]
	});
}
function PageHeader({ title, lede, eyebrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mx-auto w-full max-w-7xl px-4 pt-14 pb-6 sm:px-6",
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-3xl tracking-wide sm:text-5xl",
				children: title
			}),
			lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-base text-muted-foreground",
				children: lede
			})
		]
	});
}
function EmptyState({ title, body, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg",
				children: title
			}),
			body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: body
			}),
			children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex justify-center gap-3",
				children
			})
		]
	});
}
//#endregion
export { PageHeader as n, Section as r, EmptyState as t };
