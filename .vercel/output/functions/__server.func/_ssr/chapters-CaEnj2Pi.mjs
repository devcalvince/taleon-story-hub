import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as Eye, d as Trash2, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { a as queryKeys, s as useAdminChapters, t as invalidateChapterData } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chapters-CaEnj2Pi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminChaptersPage() {
	const { isAdmin, loading } = useSession();
	const queryClient = useQueryClient();
	const { query: chaptersQuery, invalidate: invalidateChapters } = useAdminChapters();
	const storiesQuery = useQuery({
		queryKey: [...queryKeys.adminStories, "dropdown"],
		queryFn: async () => {
			const { data, error } = await supabase.from("stories").select("id, title, slug").order("title");
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: 0
	});
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingChapter, setEditingChapter] = (0, import_react.useState)(null);
	const [formStoryId, setFormStoryId] = (0, import_react.useState)("");
	const [formTitle, setFormTitle] = (0, import_react.useState)("");
	const [formChapterNumber, setFormChapterNumber] = (0, import_react.useState)(1);
	const [formContent, setFormContent] = (0, import_react.useState)("");
	const [formIsPremium, setFormIsPremium] = (0, import_react.useState)(false);
	const [formIsPublished, setFormIsPublished] = (0, import_react.useState)(true);
	const [formAudioUrl, setFormAudioUrl] = (0, import_react.useState)("");
	const [formVideoUrl, setFormVideoUrl] = (0, import_react.useState)("");
	const [formMediaAssetId, setFormMediaAssetId] = (0, import_react.useState)("");
	const chapters = chaptersQuery.data ?? [];
	const stories = storiesQuery.data ?? [];
	const isLoadingData = chaptersQuery.isLoading || storiesQuery.isLoading;
	const invalidateAll = () => {
		invalidateChapterData(queryClient);
	};
	const saveMutation = useMutation({
		mutationFn: async (chapterData) => {
			if (editingChapter) {
				const { error } = await supabase.from("chapters").update(chapterData).eq("id", editingChapter.id);
				if (error) throw new Error(error.message);
			} else {
				const { error } = await supabase.from("chapters").insert(chapterData);
				if (error) throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success(editingChapter ? "Chapter updated" : "Chapter created");
			setDialogOpen(false);
			invalidateAll();
		},
		onError: (err) => {
			toast.error(err.message);
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("chapters").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Chapter deleted");
			invalidateAll();
		}
	});
	const toggleMutation = useMutation({
		mutationFn: async (ch) => {
			const { error } = await supabase.from("chapters").update({
				is_published: !ch.is_published,
				published_at: !ch.is_published ? (/* @__PURE__ */ new Date()).toISOString() : null
			}).eq("id", ch.id);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			invalidateAll();
		}
	});
	function openCreate() {
		setEditingChapter(null);
		setFormStoryId(stories[0]?.id || "");
		setFormTitle("");
		setFormChapterNumber(1);
		setFormContent("");
		setFormIsPremium(false);
		setFormIsPublished(true);
		setFormAudioUrl("");
		setFormVideoUrl("");
		setDialogOpen(true);
	}
	function openEdit(ch) {
		setEditingChapter(ch);
		setFormStoryId(ch.story_id);
		setFormTitle(ch.title);
		setFormChapterNumber(ch.chapter_number);
		setFormContent(ch.content || "");
		setFormIsPremium(ch.is_premium);
		setFormIsPublished(ch.is_published);
		setFormAudioUrl(ch.audio_url || "");
		setFormVideoUrl(ch.video_url || "");
		setDialogOpen(true);
	}
	function handleSave() {
		if (!formStoryId || !formTitle.trim()) {
			toast.error("Story and title are required");
			return;
		}
		const wordCount = formContent ? formContent.split(/\s+/).filter(Boolean).length : 0;
		saveMutation.mutate({
			story_id: formStoryId,
			title: formTitle,
			chapter_number: formChapterNumber,
			content: formContent,
			word_count: wordCount,
			is_premium: formIsPremium,
			is_published: formIsPublished,
			published_at: formIsPublished ? (/* @__PURE__ */ new Date()).toISOString() : null,
			audio_url: formAudioUrl || null,
			video_url: formVideoUrl || null,
			media_asset_id: formMediaAssetId || null
		});
	}
	function deleteChapter(id) {
		if (!confirm("Delete this chapter?")) return;
		deleteMutation.mutate(id);
	}
	function togglePublished(ch) {
		toggleMutation.mutate(ch);
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
		title: "Manage Chapters",
		lede: "Create, edit, and publish chapters."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Chapter"]
				})
			}),
			isLoadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading chapters..."
			}) : chapters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No chapters",
				body: "Create your first chapter to get started."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Story"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Ch #"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Words"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: chapters.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: ch.stories?.title || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 font-mono text-muted-foreground",
									children: ["#", ch.chapter_number]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: ch.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: ch.word_count?.toLocaleString() || 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: ch.is_premium ? "default" : "secondary",
										children: ch.is_premium ? "Premium" : "Free"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => togglePublished(ch),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: ch.is_published ? "default" : "outline",
											className: "cursor-pointer",
											children: ch.is_published ? "Published" : "Draft"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											ch.stories?.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/story/$slug/chapter/$chapterNumber",
												params: {
													slug: ch.stories.slug,
													chapterNumber: String(ch.chapter_number)
												},
												className: "p-1 text-muted-foreground hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => openEdit(ch),
												className: "p-1 text-muted-foreground hover:text-gold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => deleteChapter(ch.id),
												className: "p-1 text-muted-foreground hover:text-red-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										]
									})
								})
							]
						}, ch.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingChapter ? "Edit Chapter" : "Create Chapter" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Story *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formStoryId,
										onChange: (e) => setFormStoryId(e.target.value),
										className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select story..."
										}), stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s.id,
											children: s.title
										}, s.id))]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Chapter Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formChapterNumber,
										onChange: (e) => setFormChapterNumber(parseInt(e.target.value)),
										min: 1
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
									placeholder: "Chapter title"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Content"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [formContent ? formContent.split(/\s+/).filter(Boolean).length : 0, " words"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formContent,
									onChange: (e) => setFormContent(e.target.value),
									rows: 16,
									placeholder: "Write your chapter content here... (supports markdown)",
									className: "font-mono text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Audio URL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formAudioUrl,
										onChange: (e) => setFormAudioUrl(e.target.value),
										placeholder: "https://..."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Video URL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formVideoUrl,
										onChange: (e) => setFormVideoUrl(e.target.value),
										placeholder: "https://..."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: formIsPremium,
										onChange: (e) => setFormIsPremium(e.target.checked),
										className: "rounded"
									}), "Premium Chapter"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: formIsPublished,
										onChange: (e) => setFormIsPublished(e.target.checked),
										className: "rounded"
									}), "Published"]
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
									children: saveMutation.isPending ? "Saving..." : editingChapter ? "Update" : "Create"
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
export { AdminChaptersPage as component };
