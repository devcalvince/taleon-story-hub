import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as User, d as Trash2, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { i as invalidateStoryData, l as useAdminCharacters, y as useAdminStoriesDropdown } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/characters-BbdbRsWL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCharactersPage() {
	const { isAdmin, loading } = useSession();
	const qc = useQueryClient();
	const { query: charactersQuery, invalidate } = useAdminCharacters();
	const { data: stories = [] } = useAdminStoriesDropdown();
	const characters = charactersQuery.data ?? [];
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [fStory, setFStory] = (0, import_react.useState)("");
	const [fName, setFName] = (0, import_react.useState)("");
	const [fRole, setFRole] = (0, import_react.useState)("");
	const [fBio, setFBio] = (0, import_react.useState)("");
	const [fAge, setFAge] = (0, import_react.useState)("");
	const [fAppearance, setFAppearance] = (0, import_react.useState)("");
	const [fPersonality, setFPersonality] = (0, import_react.useState)("");
	const [fClothing, setFClothing] = (0, import_react.useState)("");
	const [fVisualPrompt, setFVisualPrompt] = (0, import_react.useState)("");
	const [fRefImage, setFRefImage] = (0, import_react.useState)("");
	const [fNotes, setFNotes] = (0, import_react.useState)("");
	const [fOrder, setFOrder] = (0, import_react.useState)(0);
	function openCreate() {
		setEditing(null);
		setFStory(stories[0]?.id || "");
		setFName("");
		setFRole("");
		setFBio("");
		setFAge("");
		setFAppearance("");
		setFPersonality("");
		setFClothing("");
		setFVisualPrompt("");
		setFRefImage("");
		setFNotes("");
		setFOrder(characters.length);
		setDialogOpen(true);
	}
	function openEdit(c) {
		setEditing(c);
		setFStory(c.story_id);
		setFName(c.name);
		setFRole(c.role || "");
		setFBio(c.bio || "");
		setFAge(c.age || "");
		setFAppearance(c.appearance || "");
		setFPersonality(c.personality || "");
		setFClothing(c.clothing || "");
		setFVisualPrompt(c.visual_prompt || "");
		setFRefImage(c.reference_image_url || "");
		setFNotes(c.notes || "");
		setFOrder(c.sort_order);
		setDialogOpen(true);
	}
	const saveMutation = useMutation({
		mutationFn: async (data) => {
			if (editing) {
				const { error } = await supabase.from("characters").update(data).eq("id", editing.id);
				if (error) throw new Error(error.message);
			} else {
				const { error } = await supabase.from("characters").insert(data);
				if (error) throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Character updated" : "Character created");
			setDialogOpen(false);
			invalidate();
			invalidateStoryData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("characters").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Character deleted");
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
			role: fRole || null,
			bio: fBio || null,
			age: fAge || null,
			appearance: fAppearance || null,
			personality: fPersonality || null,
			clothing: fClothing || null,
			visual_prompt: fVisualPrompt || null,
			reference_image_url: fRefImage || null,
			notes: fNotes || null,
			sort_order: fOrder
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
		title: "Character Bible",
		lede: "Visual consistency guides for every character."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Character"]
				})
			}),
			charactersQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading..."
			}) : characters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No characters",
				body: "Create character profiles for visual consistency."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: characters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [c.image_url || c.reference_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: c.image_url || c.reference_image_url,
										alt: "",
										className: "h-8 w-8 rounded-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-full bg-surface-1 text-xs text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: c.name
									}), c.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: c.role
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: c.stories?.title
								}),
								c.appearance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground line-clamp-2",
									children: c.appearance
								}),
								c.visual_prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-gold/70 line-clamp-2 italic",
									children: ["Prompt: ", c.visual_prompt]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(c),
								className: "p-1 text-muted-foreground hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Delete this character?")) deleteMutation.mutate(c.id);
								},
								className: "p-1 text-muted-foreground hover:text-red-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Character" : "Create Character" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fName,
										onChange: (e) => setFName(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Role"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fRole,
										onChange: (e) => setFRole(e.target.value),
										placeholder: "Protagonist, Antagonist..."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Age"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fAge,
										onChange: (e) => setFAge(e.target.value),
										placeholder: "21"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Bio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: fBio,
									onChange: (e) => setFBio(e.target.value),
									rows: 2
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Appearance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: fAppearance,
									onChange: (e) => setFAppearance(e.target.value),
									rows: 2,
									placeholder: "Short natural hair, brown eyes, medium build..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Personality"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fPersonality,
										onChange: (e) => setFPersonality(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Clothing"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fClothing,
										onChange: (e) => setFClothing(e.target.value)
									})]
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
									placeholder: "Description for consistent image generation"
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
export { AdminCharactersPage as component };
