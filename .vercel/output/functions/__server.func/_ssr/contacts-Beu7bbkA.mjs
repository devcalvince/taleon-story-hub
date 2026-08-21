import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { R as Clock, _ as Search, v as Reply, z as CircleCheckBig } from "../_libs/lucide-react.mjs";
import { a as queryKeys, u as useAdminContacts } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacts-Beu7bbkA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminContactsPage() {
	const { isAdmin, loading } = useSession();
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedSubmission, setSelectedSubmission] = (0, import_react.useState)(null);
	const { query, invalidate } = useAdminContacts();
	const submissions = query.data ?? [];
	const filtered = submissions.filter((s) => {
		if (!searchQuery) return true;
		const q = searchQuery.toLowerCase();
		return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.subject?.toLowerCase().includes(q) || s.message.toLowerCase().includes(q);
	});
	const unreadCount = submissions.filter((s) => s.status === "unread").length;
	const markAsReadMutation = useMutation({
		mutationFn: async (id) => {
			await supabase.from("contact_submissions").update({ status: "read" }).eq("id", id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.adminContacts });
			const previous = queryClient.getQueryData(queryKeys.adminContacts);
			queryClient.setQueryData(queryKeys.adminContacts, (old) => (old ?? []).map((s) => s.id === id ? {
				...s,
				status: "read"
			} : s));
			if (selectedSubmission?.id === id) setSelectedSubmission((prev) => prev ? {
				...prev,
				status: "read"
			} : null);
			return { previous };
		},
		onError: (_err, _id, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.adminContacts, context.previous);
		},
		onSettled: () => {
			invalidate();
		}
	});
	const markAsRepliedMutation = useMutation({
		mutationFn: async (id) => {
			await supabase.from("contact_submissions").update({ status: "replied" }).eq("id", id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.adminContacts });
			const previous = queryClient.getQueryData(queryKeys.adminContacts);
			queryClient.setQueryData(queryKeys.adminContacts, (old) => (old ?? []).map((s) => s.id === id ? {
				...s,
				status: "replied"
			} : s));
			if (selectedSubmission?.id === id) setSelectedSubmission((prev) => prev ? {
				...prev,
				status: "replied"
			} : null);
			return { previous };
		},
		onError: (_err, _id, context) => {
			if (context?.previous) queryClient.setQueryData(queryKeys.adminContacts, context.previous);
		},
		onSettled: () => {
			invalidate();
			toast.success("Marked as replied");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			if (!confirm("Delete this submission?")) throw new Error("Cancelled");
			await supabase.from("contact_submissions").delete().eq("id", id);
			return id;
		},
		onSuccess: (id) => {
			invalidate();
			if (selectedSubmission?.id === id) setSelectedSubmission(null);
			toast.success("Deleted");
		}
	});
	function getStatusBadge(status) {
		switch (status) {
			case "unread": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "gap-1 bg-blue-500/10 text-blue-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Unread"]
			});
			case "read": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }), " Read"]
			});
			case "replied": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "gap-1 bg-green-500/10 text-green-400",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "h-3 w-3" }), " Replied"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: status
			});
		}
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
		title: "Contact Submissions",
		lede: `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}.`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search submissions...",
				value: searchQuery,
				onChange: (e) => setSearchQuery(e.target.value),
				className: "pl-9"
			})]
		}), query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-8 text-muted-foreground",
			children: "Loading submissions..."
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No submissions",
			body: searchQuery ? "Try a different search." : "No contact form submissions yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: filtered.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setSelectedSubmission(s);
						if (s.status === "unread") markAsReadMutation.mutate(s.id);
					},
					className: `w-full rounded-lg border border-border p-4 text-left transition-colors ${selectedSubmission?.id === s.id ? "border-gold/50 bg-surface-2" : s.status === "unread" ? "bg-surface-2/60 hover:bg-surface-2" : "bg-surface-2/40 hover:bg-surface-2/60"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										s.status === "unread" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-gold" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: s.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: s.email
										})
									]
								}),
								s.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground truncate",
									children: s.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground truncate",
									children: s.message
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-4 flex-shrink-0",
							children: getStatusBadge(s.status)
						})]
					})
				}, s.id))
			}), selectedSubmission ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6 sticky top-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: selectedSubmission.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: selectedSubmission.email
							}),
							selectedSubmission.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-medium",
								children: selectedSubmission.subject
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: new Date(selectedSubmission.created_at).toLocaleString()
							})
						] }), getStatusBadge(selectedSubmission.status)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 whitespace-pre-wrap text-sm text-muted-foreground",
						children: selectedSubmission.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${selectedSubmission.email}`,
								className: "rounded-md bg-gold px-4 py-2 text-sm font-medium text-background hover:bg-gold/90",
								children: "Reply via Email"
							}),
							selectedSubmission.status !== "replied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => markAsRepliedMutation.mutate(selectedSubmission.id),
								children: "Mark as Replied"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => deleteMutation.mutate(selectedSubmission.id),
								className: "text-red-500 hover:text-red-600",
								children: "Delete"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center rounded-lg border border-dashed border-border bg-surface-2/40 p-12 text-muted-foreground",
				children: "Select a submission to view"
			})]
		})]
	})] });
}
//#endregion
export { AdminContactsPage as component };
