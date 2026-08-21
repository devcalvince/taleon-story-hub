import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LegalPage-D27WKLZI.js
var import_jsx_runtime = require_jsx_runtime();
function LegalPage({ title, sections }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Legal",
		title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-10 px-4 pb-20 sm:px-6",
		children: [sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl tracking-wide",
			children: s.h
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm leading-relaxed text-muted-foreground",
			children: s.p
		})] }, s.h)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "border-t border-border pt-6 text-xs text-muted-foreground",
			children: [
				"Last updated ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				". Taleon Media."
			]
		})]
	})] });
}
//#endregion
export { LegalPage as t };
