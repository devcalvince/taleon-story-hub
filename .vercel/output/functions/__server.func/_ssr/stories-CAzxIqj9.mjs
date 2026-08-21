import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { B as ChevronUp, F as Eye, U as ChevronDown, W as Check, d as Trash2, p as Star, x as Pencil, y as Plus } from "../_libs/lucide-react.mjs";
import { f as useAdminGenres, i as invalidateStoryData, v as useAdminStories } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stories-CAzxIqj9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function AdminStoriesPage() {
	const { isAdmin, loading } = useSession();
	const queryClient = useQueryClient();
	const storiesQuery = useAdminStories();
	const genresQuery = useAdminGenres().query;
	const stories = storiesQuery.data ?? [];
	const genres = genresQuery.data ?? [];
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingStory, setEditingStory] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [formTitle, setFormTitle] = (0, import_react.useState)("");
	const [formSlug, setFormSlug] = (0, import_react.useState)("");
	const [formAuthor, setFormAuthor] = (0, import_react.useState)("Taleon Studios");
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formShortDesc, setFormShortDesc] = (0, import_react.useState)("");
	const [formStatus, setFormStatus] = (0, import_react.useState)("ongoing");
	const [formCoverUrl, setFormCoverUrl] = (0, import_react.useState)("");
	const [formBannerUrl, setFormBannerUrl] = (0, import_react.useState)("");
	const [formIsPremium, setFormIsPremium] = (0, import_react.useState)(false);
	const [formIsFeatured, setFormIsFeatured] = (0, import_react.useState)(false);
	const [formIsOriginal, setFormIsOriginal] = (0, import_react.useState)(true);
	const [formGenreIds, setFormGenreIds] = (0, import_react.useState)([]);
	function openCreate() {
		setEditingStory(null);
		setFormTitle("");
		setFormSlug("");
		setFormAuthor("Taleon Studios");
		setFormDescription("");
		setFormShortDesc("");
		setFormStatus("ongoing");
		setFormCoverUrl("");
		setFormBannerUrl("");
		setFormIsPremium(false);
		setFormIsFeatured(false);
		setFormIsOriginal(true);
		setFormGenreIds([]);
		setDialogOpen(true);
	}
	function openEdit(story) {
		setEditingStory(story);
		setFormTitle(story.title);
		setFormSlug(story.slug);
		setFormAuthor(story.author || "Taleon Studios");
		setFormDescription(story.description || "");
		setFormShortDesc(story.short_description || "");
		setFormStatus(story.status);
		setFormCoverUrl(story.cover_url || "");
		setFormBannerUrl("");
		setFormIsPremium(story.is_premium);
		setFormIsFeatured(story.is_featured);
		setFormIsOriginal(true);
		setFormGenreIds([]);
		setDialogOpen(true);
	}
	function generateSlug(title) {
		return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	}
	async function handleSave() {
		if (!formTitle.trim()) {
			toast.error("Title is required");
			return;
		}
		setSaving(true);
		const slug = formSlug || generateSlug(formTitle);
		const storyData = {
			title: formTitle,
			slug,
			author: formAuthor,
			description: formDescription || null,
			short_description: formShortDesc || null,
			status: formStatus,
			cover_url: formCoverUrl || null,
			banner_url: formBannerUrl || null,
			is_premium: formIsPremium,
			is_featured: formIsFeatured,
			is_original: formIsOriginal,
			is_published: true
		};
		if (editingStory) {
			const { error } = await supabase.from("stories").update(storyData).eq("id", editingStory.id);
			if (error) {
				toast.error(error.message);
				setSaving(false);
				return;
			}
			await supabase.from("story_genres").delete().eq("story_id", editingStory.id);
			if (formGenreIds.length) await supabase.from("story_genres").insert(formGenreIds.map((gid) => ({
				story_id: editingStory.id,
				genre_id: gid
			})));
			toast.success("Story updated");
		} else {
			const { data, error } = await supabase.from("stories").insert(storyData).select().single();
			if (error) {
				toast.error(error.message);
				setSaving(false);
				return;
			}
			if (formGenreIds.length && data) await supabase.from("story_genres").insert(formGenreIds.map((gid) => ({
				story_id: data.id,
				genre_id: gid
			})));
			toast.success("Story created");
		}
		setDialogOpen(false);
		setSaving(false);
		invalidateStoryData(queryClient);
	}
	async function deleteStory(id) {
		if (!confirm("Delete this story and all its chapters?")) return;
		await supabase.from("story_genres").delete().eq("story_id", id);
		await supabase.from("chapters").delete().eq("story_id", id);
		await supabase.from("stories").delete().eq("id", id);
		toast.success("Story deleted");
		invalidateStoryData(queryClient);
	}
	async function toggleFeatured(story) {
		await supabase.from("stories").update({ is_featured: !story.is_featured }).eq("id", story.id);
		invalidateStoryData(queryClient);
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
		title: "Manage Stories",
		lede: "Create, edit, and publish stories."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openCreate,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Story"]
				})
			}),
			storiesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-8 text-muted-foreground",
				children: "Loading stories..."
			}) : stories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No stories",
				body: "Create your first story to get started."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Author"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Views"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Featured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Published"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-surface-2/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: s.author
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: s.status === "ongoing" ? "default" : s.status === "completed" ? "secondary" : "outline",
										children: s.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: s.is_premium ? "Premium" : "Free"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: s.views ?? 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleFeatured(s),
										className: s.is_featured ? "text-gold" : "text-muted-foreground hover:text-gold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${s.is_featured ? "fill-current" : ""}` })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: s.published_at ? new Date(s.published_at).toLocaleDateString() : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/story/$slug",
												params: { slug: s.slug },
												className: "p-1 text-muted-foreground hover:text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => openEdit(s),
												className: "p-1 text-muted-foreground hover:text-gold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => deleteStory(s.id),
												className: "p-1 text-muted-foreground hover:text-red-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										]
									})
								})
							]
						}, s.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingStory ? "Edit Story" : "Create Story" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Title *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formTitle,
										onChange: (e) => {
											setFormTitle(e.target.value);
											if (!editingStory) setFormSlug(generateSlug(e.target.value));
										},
										placeholder: "Story title"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Slug"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formSlug,
										onChange: (e) => setFormSlug(e.target.value),
										placeholder: "auto-generated"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Author"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formAuthor,
									onChange: (e) => setFormAuthor(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Short Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formShortDesc,
									onChange: (e) => setFormShortDesc(e.target.value),
									placeholder: "One-line description for cards"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Full Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: formDescription,
									onChange: (e) => setFormDescription(e.target.value),
									rows: 4,
									placeholder: "Full story description"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Cover Image URL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formCoverUrl,
										onChange: (e) => setFormCoverUrl(e.target.value),
										placeholder: "https://..."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Banner Image URL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formBannerUrl,
										onChange: (e) => setFormBannerUrl(e.target.value),
										placeholder: "https://..."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formStatus,
									onValueChange: setFormStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ongoing",
											children: "Ongoing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "completed",
											children: "Completed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "coming_soon",
											children: "Coming Soon"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Genres"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setFormGenreIds((prev) => prev.includes(g.id) ? prev.filter((id) => id !== g.id) : [...prev, g.id]),
										className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formGenreIds.includes(g.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
										children: g.name
									}, g.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: formIsPremium,
											onChange: (e) => setFormIsPremium(e.target.checked),
											className: "rounded"
										}), "Premium"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: formIsFeatured,
											onChange: (e) => setFormIsFeatured(e.target.checked),
											className: "rounded"
										}), "Featured"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: formIsOriginal,
											onChange: (e) => setFormIsOriginal(e.target.checked),
											className: "rounded"
										}), "Taleon Original"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setDialogOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleSave,
									disabled: saving,
									children: saving ? "Saving..." : editingStory ? "Update" : "Create"
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
export { AdminStoriesPage as component };
