import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { d as Trash2, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { f as useAdminGenres, n as invalidateGenreData } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/genres-3-cGenbk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminGenresPage() {
	const { isAdmin, loading } = useSession();
	const qc = useQueryClient();
	const { query, invalidate } = useAdminGenres();
	const genres = query.data ?? [];
	const loadingData = query.isLoading;
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingGenre, setEditingGenre] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formSlug, setFormSlug] = (0, import_react.useState)("");
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formAccent, setFormAccent] = (0, import_react.useState)("#7C3AED");
	const [formSortOrder, setFormSortOrder] = (0, import_react.useState)(0);
	function generateSlug(name) {
		return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	}
	function openCreate() {
		setEditingGenre(null);
		setFormName("");
		setFormSlug("");
		setFormDescription("");
		setFormAccent("#7C3AED");
		setFormSortOrder(genres.length);
		setDialogOpen(true);
	}
	function openEdit(genre) {
		setEditingGenre(genre);
		setFormName(genre.name);
		setFormSlug(genre.slug);
		setFormDescription(genre.description || "");
		setFormAccent(genre.accent);
		setFormSortOrder(genre.sort_order);
		setDialogOpen(true);
	}
	const createMutation = useMutation({
		mutationFn: async (genreData) => {
			const { error } = await supabase.from("genres").insert(genreData);
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Genre created");
			setDialogOpen(false);
			await invalidateGenreData(qc);
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
	const updateMutation = useMutation({
		mutationFn: async ({ id, ...genreData }) => {
			const { error } = await supabase.from("genres").update(genreData).eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Genre updated");
			setDialogOpen(false);
			await invalidateGenreData(qc);
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			await supabase.from("story_genres").delete().eq("genre_id", id);
			const { error } = await supabase.from("genres").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Genre deleted");
			await invalidateGenreData(qc);
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
	const isSaving = createMutation.isPending || updateMutation.isPending;
	function handleSave() {
		if (!formName.trim()) {
			toast.error("Name is required");
			return;
		}
		const slug = formSlug || generateSlug(formName);
		const genreData = {
			name: formName,
			slug,
			description: formDescription || null,
			accent: formAccent,
			sort_order: formSortOrder
		};
		if (editingGenre) updateMutation.mutate({
			id: editingGenre.id,
			...genreData
		});
		else createMutation.mutate(genreData);
	}
	function deleteGenre(id) {
		if (!confirm("Delete this genre? Stories with this genre will lose the association.")) return;
		deleteMutation.mutate(id);
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
		title: "Manage Genres",
		lede: "Create and organize story genres."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Genre"]
				})
			}),
			loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading genres..."
			}) : genres.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No genres",
				body: "Create your first genre to get started."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-3 w-3 rounded-full",
									style: { backgroundColor: g.accent }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: g.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["/", g.slug]
							}),
							g.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: g.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [g.story_count, " stories"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(g),
								className: "p-1 text-muted-foreground hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteGenre(g.id),
								className: "p-1 text-muted-foreground hover:text-red-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})
				}, g.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingGenre ? "Edit Genre" : "Create Genre" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formName,
									onChange: (e) => {
										setFormName(e.target.value);
										if (!editingGenre) setFormSlug(generateSlug(e.target.value));
									},
									placeholder: "Genre name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Slug"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formSlug,
									onChange: (e) => setFormSlug(e.target.value),
									placeholder: "auto-generated"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formDescription,
									onChange: (e) => setFormDescription(e.target.value),
									rows: 2,
									placeholder: "Brief description"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Accent Color"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: formAccent,
											onChange: (e) => setFormAccent(e.target.value),
											className: "h-8 w-8 rounded border-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formAccent,
											onChange: (e) => setFormAccent(e.target.value),
											className: "flex-1"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Sort Order"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formSortOrder,
										onChange: (e) => setFormSortOrder(parseInt(e.target.value))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDialogOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSave,
									disabled: isSaving,
									children: isSaving ? "Saving..." : editingGenre ? "Update" : "Create"
								})]
							})
						]
					})]
				})
			})
		]
	})] });
}
//#endregion
export { AdminGenresPage as component };
