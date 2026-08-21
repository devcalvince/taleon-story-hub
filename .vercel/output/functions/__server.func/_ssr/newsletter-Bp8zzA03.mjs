import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { I as Download, _ as Search, c as UserCheck, o as UserX } from "../_libs/lucide-react.mjs";
import { h as useAdminNewsletter } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter-Bp8zzA03.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminNewsletterPage() {
	const { isAdmin, loading } = useSession();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const { query, invalidate } = useAdminNewsletter();
	const subscribers = query.data ?? [];
	const unsubscribeMutation = useMutation({
		mutationFn: async (id) => {
			await supabase.from("newsletter_subscribers").update({
				is_active: false,
				unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
		},
		onSuccess: async () => {
			await invalidate();
			toast.success("Subscriber removed");
		}
	});
	const resubscribeMutation = useMutation({
		mutationFn: async (id) => {
			await supabase.from("newsletter_subscribers").update({
				is_active: true,
				unsubscribed_at: null
			}).eq("id", id);
		},
		onSuccess: async () => {
			await invalidate();
			toast.success("Subscriber reactivated");
		}
	});
	const filtered = subscribers.filter((s) => {
		if (!searchQuery) return true;
		return s.email.toLowerCase().includes(searchQuery.toLowerCase());
	});
	const activeCount = subscribers.filter((s) => s.is_active).length;
	const unsubscribedCount = subscribers.filter((s) => !s.is_active).length;
	function exportCSV() {
		const csv = [[
			"Email",
			"Status",
			"Subscribed At",
			"Unsubscribed At"
		], ...filtered.map((s) => [
			s.email,
			s.is_active ? "Active" : "Unsubscribed",
			new Date(s.subscribed_at).toISOString(),
			s.unsubscribed_at ? new Date(s.unsubscribed_at).toISOString() : ""
		])].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `newsletter-subscribers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("CSV exported");
	}
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
		title: "Newsletter Subscribers",
		lede: `${activeCount} active subscriber${activeCount !== 1 ? "s" : ""}.`
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
							children: "Total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl",
							children: subscribers.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl text-green-400",
							children: activeCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface-2 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Unsubscribed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl text-muted-foreground",
							children: unsubscribedCount
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by email...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCSV,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export CSV"]
				})]
			}),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-8 text-center text-muted-foreground",
				children: "Loading subscribers..."
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No subscribers",
				body: searchQuery ? "Try a different search." : "No newsletter subscribers yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-xs uppercase text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Subscribed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: s.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "gap-1 bg-green-500/10 text-green-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3 w-3" }), " Active"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-3 w-3" }), " Unsubscribed"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: new Date(s.subscribed_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: s.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => unsubscribeMutation.mutate(s.id),
										disabled: unsubscribeMutation.isPending,
										className: "text-xs text-red-400 hover:text-red-300",
										children: "Unsubscribe"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => resubscribeMutation.mutate(s.id),
										disabled: resubscribeMutation.isPending,
										className: "text-xs text-gold hover:text-gold/80",
										children: "Reactivate"
									})
								})
							]
						}, s.id))
					})]
				})
			})
		]
	})] });
}
//#endregion
export { AdminNewsletterPage as component };
