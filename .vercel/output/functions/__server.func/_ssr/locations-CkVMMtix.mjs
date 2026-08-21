import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as MapPin, d as Trash2, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { i as invalidateStoryData, p as useAdminLocations, y as useAdminStoriesDropdown } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/locations-CkVMMtix.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLocationsPage() {
	const { isAdmin, loading } = useSession();
	const qc = useQueryClient();
	const { query: locationsQuery, invalidate } = useAdminLocations();
	const { data: stories = [] } = useAdminStoriesDropdown();
	const locations = locationsQuery.data ?? [];
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [fStory, setFStory] = (0, import_react.useState)("");
	const [fName, setFName] = (0, import_react.useState)("");
	const [fDesc, setFDesc] = (0, import_react.useState)("");
	const [fVisualPrompt, setFVisualPrompt] = (0, import_react.useState)("");
	const [fRefImage, setFRefImage] = (0, import_react.useState)("");
	const [fNotes, setFNotes] = (0, import_react.useState)("");
	function openCreate() {
		setEditing(null);
		setFStory(stories[0]?.id || "");
		setFName("");
		setFDesc("");
		setFVisualPrompt("");
		setFRefImage("");
		setFNotes("");
		setDialogOpen(true);
	}
	function openEdit(loc) {
		setEditing(loc);
		setFStory(loc.story_id);
		setFName(loc.name);
		setFDesc(loc.description || "");
		setFVisualPrompt(loc.visual_prompt || "");
		setFRefImage(loc.reference_image_url || "");
		setFNotes(loc.notes || "");
		setDialogOpen(true);
	}
	const saveMutation = useMutation({
		mutationFn: async (data) => {
			if (editing) {
				const { error } = await supabase.from("locations").update(data).eq("id", editing.id);
				if (error) throw new Error(error.message);
			} else {
				const { error } = await supabase.from("locations").insert(data);
				if (error) throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Location updated" : "Location created");
			setDialogOpen(false);
			invalidate();
			invalidateStoryData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("locations").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Location deleted");
			invalidate();
			invalidateStoryData(qc);
		}
	});
	function handleSave() {
		if (!fName.trim() || !fStory) {
			toast.error("Name and story required");
			return;
		}
		saveMutation.mutate({
			story_id: fStory,
			name: fName,
			description: fDesc || null,
			visual_prompt: fVisualPrompt || null,
			reference_image_url: fRefImage || null,
			notes: fNotes || null
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Admins only" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Location Bible",
		lede: "Reusable environments for visual consistency."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Location"]
				})
			}),
			locationsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading..."
			}) : locations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No locations",
				body: "Create location profiles for consistent scene environments."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: locations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: loc.name
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: loc.stories?.title
								}),
								loc.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground line-clamp-2",
									children: loc.description
								}),
								loc.visual_prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-gold/70 line-clamp-2 italic",
									children: ["Prompt: ", loc.visual_prompt]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(loc),
								className: "p-1 text-muted-foreground hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Delete this location?")) deleteMutation.mutate(loc.id);
								},
								className: "p-1 text-muted-foreground hover:text-red-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})
				}, loc.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Location" : "Create Location" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Story *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: fStory,
									onChange: (e) => setFStory(e.target.value),
									className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
									children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s.id,
										children: s.title
									}, s.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fName,
									onChange: (e) => setFName(e.target.value),
									placeholder: "e.g. Nairobi — 2047"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: fDesc,
									onChange: (e) => setFDesc(e.target.value),
									rows: 2
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Visual Prompt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: fVisualPrompt,
									onChange: (e) => setFVisualPrompt(e.target.value),
									rows: 2,
									placeholder: "Environment visual description"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Reference Image URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fRefImage,
									onChange: (e) => setFRefImage(e.target.value),
									placeholder: "https://..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: fNotes,
									onChange: (e) => setFNotes(e.target.value),
									rows: 2
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
									disabled: saveMutation.isPending,
									children: saveMutation.isPending ? "Saving..." : editing ? "Update" : "Create"
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
export { AdminLocationsPage as component };
