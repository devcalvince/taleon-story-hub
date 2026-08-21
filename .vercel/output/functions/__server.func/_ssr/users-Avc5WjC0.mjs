import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { _ as Search, g as Shield } from "../_libs/lucide-react.mjs";
import { b as useAdminUsers } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-Avc5WjC0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminUsersPage() {
	const { isAdmin, loading } = useSession();
	const { data: users = [], isLoading: loadingData } = useAdminUsers();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const filtered = users.filter((u) => {
		if (!searchQuery) return true;
		const q = searchQuery.toLowerCase();
		return u.display_name?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q) || u.bio?.toLowerCase().includes(q);
	});
	const adminCount = users.filter((u) => u.user_roles?.some((r) => r.role === "admin")).length;
	const totalFollows = users.reduce((acc, u) => acc + (u._follows || 0), 0);
	users.reduce((acc, u) => acc + (u._bookmarks || 0), 0);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Admins only",
			body: "This area is restricted to Taleon administrators.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				className: "rounded-md border border-border px-5 py-2.5 text-sm",
				children: "Back to my library"
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Manage Users",
		lede: "View and manage user accounts."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total Users"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: users.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Admins"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: adminCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Total Follows"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: totalFollows
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search users...",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					className: "pl-9"
				})]
			}),
			loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading users..."
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No users found",
				body: searchQuery ? "Try a different search." : "No users have signed up yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Follows"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Saved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Joined"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 overflow-hidden rounded-full bg-surface-2",
											children: u.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: u.avatar_url,
												alt: "",
												className: "h-full w-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full w-full items-center justify-center text-xs text-muted-foreground",
												children: (u.display_name ?? u.username ?? "?")[0]?.toUpperCase()
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: u.display_name || u.username || "Anonymous"
										}), u.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["@", u.username]
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: u.user_roles?.some((r) => r.role === "admin") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), " Admin"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: "User"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: u._follows || 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: u._bookmarks || 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: new Date(u.created_at).toLocaleDateString()
								})
							]
						}, u.id))
					})]
				})
			})
		]
	})] });
}
//#endregion
export { AdminUsersPage as component };
