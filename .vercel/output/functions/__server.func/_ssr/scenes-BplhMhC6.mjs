import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { P as Film, d as Trash2, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { _ as useAdminScenes, c as useAdminChaptersDropdown, i as invalidateStoryData } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scenes-BplhMhC6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminScenesPage() {
	const { isAdmin, loading } = useSession();
	const qc = useQueryClient();
	const { query: scenesQuery, invalidate } = useAdminScenes();
	const { data: chapters = [] } = useAdminChaptersDropdown();
	const scenes = scenesQuery.data ?? [];
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [formChapterId, setFormChapterId] = (0, import_react.useState)("");
	const [formNumber, setFormNumber] = (0, import_react.useState)(1);
	const [formTitle, setFormTitle] = (0, import_react.useState)("");
	const [formDesc, setFormDesc] = (0, import_react.useState)("");
	const [formMood, setFormMood] = (0, import_react.useState)("");
	const [formLocation, setFormLocation] = (0, import_react.useState)("");
	const [formCharacters, setFormCharacters] = (0, import_react.useState)("");
	const [formVisualPrompt, setFormVisualPrompt] = (0, import_react.useState)("");
	const [formCamera, setFormCamera] = (0, import_react.useState)("");
	const [formLighting, setFormLighting] = (0, import_react.useState)("");
	function openCreate() {
		setEditing(null);
		setFormChapterId(chapters[0]?.id || "");
		setFormNumber(1);
		setFormTitle("");
		setFormDesc("");
		setFormMood("");
		setFormLocation("");
		setFormCharacters("");
		setFormVisualPrompt("");
		setFormCamera("");
		setFormLighting("");
		setDialogOpen(true);
	}
	function openEdit(s) {
		setEditing(s);
		setFormChapterId(s.chapter_id);
		setFormNumber(s.scene_number);
		setFormTitle(s.title);
		setFormDesc(s.description || "");
		setFormMood(s.mood || "");
		setFormLocation(s.location_name || "");
		setFormCharacters(s.characters_in_scene || "");
		setFormVisualPrompt(s.visual_prompt || "");
		setFormCamera(s.camera_direction || "");
		setFormLighting(s.lighting_direction || "");
		setDialogOpen(true);
	}
	const saveMutation = useMutation({
		mutationFn: async (data) => {
			if (editing) {
				const { error } = await supabase.from("scenes").update(data).eq("id", editing.id);
				if (error) throw new Error(error.message);
			} else {
				const { error } = await supabase.from("scenes").insert(data);
				if (error) throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success(editing ? "Scene updated" : "Scene created");
			setDialogOpen(false);
			invalidate();
			invalidateStoryData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("scenes").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Scene deleted");
			invalidate();
			invalidateStoryData(qc);
		}
	});
	function handleSave() {
		if (!formTitle.trim() || !formChapterId) {
			toast.error("Title and chapter required");
			return;
		}
		saveMutation.mutate({
			chapter_id: formChapterId,
			scene_number: formNumber,
			title: formTitle,
			description: formDesc || null,
			mood: formMood || null,
			location_name: formLocation || null,
			characters_in_scene: formCharacters || null,
			visual_prompt: formVisualPrompt || null,
			camera_direction: formCamera || null,
			lighting_direction: formLighting || null
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Admins only",
			body: "Restricted area."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Scenes",
		lede: "Manage chapter scenes for visual production."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Scene"]
				})
			}),
			scenesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading..."
			}) : scenes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No scenes",
				body: "Create scenes to organize visual assets per chapter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: scenes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-lg border border-border bg-surface-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium truncate",
								children: [
									"Scene ",
									s.scene_number,
									": ",
									s.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground truncate",
								children: [
									s.chapters?.stories?.title,
									" → Ch. ",
									s.chapters?.chapter_number,
									":",
									" ",
									s.chapters?.title,
									s.mood && ` • ${s.mood}`
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 flex-shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => openEdit(s),
							className: "p-1 text-muted-foreground hover:text-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (confirm("Delete this scene?")) deleteMutation.mutate(s.id);
							},
							className: "p-1 text-muted-foreground hover:text-red-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Scene" : "Create Scene" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Chapter *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formChapterId,
										onChange: (e) => setFormChapterId(e.target.value),
										className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
										children: chapters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: c.id,
											children: [
												"Ch. ",
												c.chapter_number,
												": ",
												c.title
											]
										}, c.id))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Scene Number *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formNumber,
										onChange: (e) => setFormNumber(parseInt(e.target.value))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Title *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formTitle,
									onChange: (e) => setFormTitle(e.target.value),
									placeholder: "e.g. Nairobi at 2:17 AM"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formDesc,
									onChange: (e) => setFormDesc(e.target.value),
									rows: 2
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Mood"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formMood,
										onChange: (e) => setFormMood(e.target.value),
										placeholder: "e.g. tense, atmospheric"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formLocation,
										onChange: (e) => setFormLocation(e.target.value),
										placeholder: "e.g. Nairobi"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Characters in Scene"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formCharacters,
									onChange: (e) => setFormCharacters(e.target.value),
									placeholder: "e.g. Amara, Detective Barasa"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Visual Prompt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formVisualPrompt,
									onChange: (e) => setFormVisualPrompt(e.target.value),
									rows: 3,
									placeholder: "Scene visual description for image generation"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Camera Direction"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formCamera,
										onChange: (e) => setFormCamera(e.target.value),
										placeholder: "e.g. wide shot, close-up"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Lighting Direction"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formLighting,
										onChange: (e) => setFormLighting(e.target.value),
										placeholder: "e.g. low-key, neon"
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
export { AdminScenesPage as component };
