import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as Image, F as Eye, H as ChevronLeft, L as Copy, V as ChevronRight, W as Check, X as Archive, _ as Search, k as Link2, l as Upload, t as X, y as Plus } from "../_libs/lucide-react.mjs";
import { m as useAdminMedia, r as invalidateMediaData, y as useAdminStoriesDropdown } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-B69u1cPq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-CW1dXq5I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var assetTypes = [
	"cover",
	"scene",
	"character",
	"location",
	"thumbnail",
	"banner",
	"poster",
	"social_vertical",
	"social_square",
	"youtube_thumbnail",
	"story_cinematic",
	"story_cover",
	"other"
];
var statuses = [
	"draft",
	"processing",
	"ready",
	"approved",
	"published",
	"rejected",
	"failed",
	"archived"
];
function AdminMediaPage() {
	const { isAdmin, user, loading } = useSession();
	const qc = useQueryClient();
	const [page, setPage] = (0, import_react.useState)(1);
	const [filterType, setFilterType] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("");
	const [filterStory, setFilterStory] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const assetsQuery = useAdminMedia({
		page,
		filterType,
		filterStatus,
		filterStory,
		search
	});
	const { data: stories = [] } = useAdminStoriesDropdown();
	const assets = assetsQuery.data?.data ?? [];
	const count = assetsQuery.data?.count ?? 0;
	const totalPages = Math.ceil(count / 24);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [uploadMode, setUploadMode] = (0, import_react.useState)("file");
	const [uploadFile, setUploadFile] = (0, import_react.useState)(null);
	const [uploadUrl, setUploadUrl] = (0, import_react.useState)("");
	const [uploadTitle, setUploadTitle] = (0, import_react.useState)("");
	const [uploadDesc, setUploadDesc] = (0, import_react.useState)("");
	const [uploadType, setUploadType] = (0, import_react.useState)("other");
	const [uploadStory, setUploadStory] = (0, import_react.useState)("");
	const [uploadChapter, setUploadChapter] = (0, import_react.useState)("");
	const [uploadScene, setUploadScene] = (0, import_react.useState)("");
	const [uploadCharacter, setUploadCharacter] = (0, import_react.useState)("");
	const [uploadLocation, setUploadLocation] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const { data: chapters = [] } = useQuery({
		queryKey: [
			"admin",
			"media",
			"chapters",
			uploadStory
		],
		queryFn: async () => {
			if (!uploadStory) return [];
			const { data } = await supabase.from("chapters").select("id, title, chapter_number").eq("story_id", uploadStory).order("chapter_number");
			return data ?? [];
		},
		enabled: !!uploadStory
	});
	const { data: storyCharacters = [] } = useQuery({
		queryKey: [
			"admin",
			"media",
			"characters",
			uploadStory
		],
		queryFn: async () => {
			if (!uploadStory) return [];
			const { data } = await supabase.from("characters").select("id, name").eq("story_id", uploadStory).order("name");
			return data ?? [];
		},
		enabled: !!uploadStory
	});
	const { data: storyLocations = [] } = useQuery({
		queryKey: [
			"admin",
			"media",
			"locations",
			uploadStory
		],
		queryFn: async () => {
			if (!uploadStory) return [];
			const { data } = await supabase.from("locations").select("id, name").eq("story_id", uploadStory).order("name");
			return data ?? [];
		},
		enabled: !!uploadStory
	});
	const { data: storyScenes = [] } = useQuery({
		queryKey: [
			"admin",
			"media",
			"scenes",
			uploadStory
		],
		queryFn: async () => {
			if (!uploadStory) return [];
			const chIds = ((await supabase.from("chapters").select("id").eq("story_id", uploadStory)).data ?? []).map((c) => c.id);
			if (chIds.length === 0) return [];
			const { data } = await supabase.from("scenes").select("id, title, scene_number, chapter_id").in("chapter_id", chIds).order("scene_number");
			return data ?? [];
		},
		enabled: !!uploadStory
	});
	const uploadMutation = useMutation({
		mutationFn: async () => {
			const fd = new FormData();
			fd.append("action", uploadMode === "file" ? "upload" : "import_url");
			fd.append("storyId", uploadStory);
			fd.append("assetType", uploadType);
			fd.append("title", uploadTitle || (uploadMode === "file" && uploadFile ? uploadFile.name : "Imported"));
			fd.append("description", uploadDesc);
			if (uploadChapter) fd.append("chapterId", uploadChapter);
			if (uploadScene) fd.append("sceneId", uploadScene);
			if (uploadCharacter) fd.append("characterId", uploadCharacter);
			if (uploadLocation) fd.append("locationId", uploadLocation);
			if (uploadMode === "file" && uploadFile) fd.append("file", uploadFile);
			else fd.append("url", uploadUrl);
			const json = await (await fetch("/api/admin/media", {
				method: "POST",
				body: fd
			})).json();
			if (json.error) throw new Error(json.error);
		},
		onSuccess: () => {
			toast.success("Asset created");
			setUploadOpen(false);
			resetUpload();
			invalidateMediaData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	const actionMutation = useMutation({
		mutationFn: async ({ assetId, action }) => {
			const json = await (await fetch(`/api/admin/media/${assetId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action,
					userId: user?.id
				})
			})).json();
			if (json.error) throw new Error(json.error);
		},
		onSuccess: () => {
			toast.success("Asset updated");
			invalidateMediaData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	useMutation({
		mutationFn: async (assetId) => {
			const json = await (await fetch(`/api/admin/media/${assetId}`, { method: "DELETE" })).json();
			if (json.error) throw new Error(json.error);
		},
		onSuccess: () => {
			toast.success("Deleted");
			invalidateMediaData(qc);
		},
		onError: (err) => toast.error(err.message)
	});
	function resetUpload() {
		setUploadFile(null);
		setUploadUrl("");
		setUploadTitle("");
		setUploadDesc("");
		setUploadType("other");
		setUploadStory("");
		setUploadChapter("");
		setUploadScene("");
		setUploadCharacter("");
		setUploadLocation("");
	}
	function handleUpload() {
		if (uploadMode === "file" && !uploadFile) {
			toast.error("Select a file");
			return;
		}
		if (uploadMode === "url" && !uploadUrl) {
			toast.error("Enter a URL");
			return;
		}
		if (!uploadStory) {
			toast.error("Select a story");
			return;
		}
		uploadMutation.mutate();
	}
	const [detailAsset, setDetailAsset] = (0, import_react.useState)(null);
	const [detailOpen, setDetailOpen] = (0, import_react.useState)(false);
	function statusColor(s) {
		switch (s) {
			case "approved":
			case "published": return "bg-green-500/10 text-green-400";
			case "ready": return "bg-blue-500/10 text-blue-400";
			case "draft": return "bg-yellow-500/10 text-yellow-400";
			case "rejected":
			case "failed": return "bg-red-500/10 text-red-400";
			case "archived": return "bg-gray-500/10 text-gray-400";
			default: return "bg-muted text-muted-foreground";
		}
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
		title: "Media Studio",
		lede: `${count} asset${count !== 1 ? "s" : ""} in library.`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						resetUpload();
						setUploadOpen(true);
					},
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Upload / Import"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search...",
								value: search,
								onChange: (e) => {
									setSearch(e.target.value);
									setPage(1);
								},
								className: "pl-9 w-48"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterType,
							onChange: (e) => {
								setFilterType(e.target.value);
								setPage(1);
							},
							className: "rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All Types"
							}), assetTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t,
								children: t.replace(/_/g, " ")
							}, t))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterStatus,
							onChange: (e) => {
								setFilterStatus(e.target.value);
								setPage(1);
							},
							className: "rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All Status"
							}), statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterStory,
							onChange: (e) => {
								setFilterStory(e.target.value);
								setPage(1);
							},
							className: "rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All Stories"
							}), stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.title
							}, s.id))]
						})
					]
				})]
			}),
			assetsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-12 text-muted-foreground",
				children: "Loading..."
			}) : assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No assets",
				body: "Upload or import images to start building your visual library."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group rounded-lg border border-border bg-surface-2 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-square bg-surface-1 flex items-center justify-center overflow-hidden",
						children: a.public_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: a.public_url,
							alt: a.title,
							className: "h-full w-full object-cover",
							loading: "lazy"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-12 w-12 text-muted-foreground/30" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium truncate",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: a.asset_type.replace(/_/g, " ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["v", a.version] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: `text-xs ${statusColor(a.status)}`,
									children: a.status
								}), a.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "text-xs bg-green-500/10 text-green-400",
									children: "✓"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											setDetailAsset(a);
											setDetailOpen(true);
										},
										className: "h-7 px-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" })
									}),
									a.status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => actionMutation.mutate({
											assetId: a.id,
											action: "approve"
										}),
										className: "h-7 px-2 text-green-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
									}),
									a.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => actionMutation.mutate({
											assetId: a.id,
											action: "reject"
										}),
										className: "h-7 px-2 text-red-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									}),
									a.status !== "archived" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => actionMutation.mutate({
											assetId: a.id,
											action: "archive"
										}),
										className: "h-7 px-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3 w-3" })
									})
								]
							})
						]
					})]
				}, a.id))
			}), totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-4 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page <= 1,
						onClick: () => setPage((p) => p - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Page ",
							page,
							" of ",
							totalPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page >= totalPages,
						onClick: () => setPage((p) => p + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Upload / Import Asset" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: uploadMode === "file" ? "default" : "outline",
									size: "sm",
									onClick: () => setUploadMode("file"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-1" }), " File"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: uploadMode === "url" ? "default" : "outline",
									size: "sm",
									onClick: () => setUploadMode("url"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 mr-1" }), " External URL"]
								})]
							}),
							uploadMode === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/jpeg,image/png,image/webp",
										onChange: (e) => {
											const f = e.target.files?.[0];
											if (f) {
												setUploadFile(f);
												if (!uploadTitle) setUploadTitle(f.name.replace(/\.[^.]+$/, ""));
											}
										},
										className: "hidden"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => fileRef.current?.click(),
										children: uploadFile ? uploadFile.name : "Choose image..."
									}),
									uploadFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [(uploadFile.size / 1024 / 1024).toFixed(2), " MB"]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Image URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: uploadUrl,
									onChange: (e) => setUploadUrl(e.target.value),
									placeholder: "https://example.com/image.jpg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: uploadTitle,
									onChange: (e) => setUploadTitle(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: uploadDesc,
									onChange: (e) => setUploadDesc(e.target.value),
									rows: 2
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Asset Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: uploadType,
										onChange: (e) => setUploadType(e.target.value),
										className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
										children: assetTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t,
											children: t.replace(/_/g, " ")
										}, t))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Story *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: uploadStory,
										onChange: (e) => setUploadStory(e.target.value),
										className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select story..."
										}), stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s.id,
											children: s.title
										}, s.id))]
									})]
								})]
							}),
							uploadStory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-sm font-medium",
											children: "Chapter"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: uploadChapter,
											onChange: (e) => setUploadChapter(e.target.value),
											className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None"
											}), chapters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: c.id,
												children: [
													"Ch. ",
													c.chapter_number,
													": ",
													c.title
												]
											}, c.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-sm font-medium",
											children: "Scene"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: uploadScene,
											onChange: (e) => setUploadScene(e.target.value),
											className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None"
											}), storyScenes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: s.id,
												children: [
													"Scene ",
													s.scene_number,
													": ",
													s.title
												]
											}, s.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-sm font-medium",
											children: "Character"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: uploadCharacter,
											onChange: (e) => setUploadCharacter(e.target.value),
											className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None"
											}), storyCharacters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: c.id,
												children: c.name
											}, c.id))]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-sm font-medium",
											children: "Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: uploadLocation,
											onChange: (e) => setUploadLocation(e.target.value),
											className: "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "None"
											}), storyLocations.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: l.id,
												children: l.name
											}, l.id))]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setUploadOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleUpload,
									disabled: uploadMutation.isPending,
									children: uploadMutation.isPending ? "Uploading..." : "Upload"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: detailOpen,
				onOpenChange: setDetailOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] overflow-y-auto",
					children: detailAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: detailAsset.title }) }),
							detailAsset.public_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg overflow-hidden bg-surface-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: detailAsset.public_url,
									alt: detailAsset.title,
									className: "w-full object-contain max-h-96"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Type:"
										}),
										" ",
										detailAsset.asset_type.replace(/_/g, " ")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Status:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: statusColor(detailAsset.status),
											children: detailAsset.status
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Source:"
										}),
										" ",
										detailAsset.source_type.replace(/_/g, " ")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Version:"
										}),
										" ",
										detailAsset.version
									] }),
									detailAsset.width && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Dimensions:"
										}),
										" ",
										detailAsset.width,
										"×",
										detailAsset.height
									] }),
									detailAsset.format && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Format:"
										}),
										" ",
										detailAsset.format.toUpperCase()
									] }),
									detailAsset.file_size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Size:"
										}),
										" ",
										(Number(detailAsset.file_size) / 1024 / 1024).toFixed(2),
										" MB"
									] }),
									detailAsset.story && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Story:"
										}),
										" ",
										detailAsset.story.title
									] })
								]
							}),
							detailAsset.prompt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mb-1",
										children: "Prompt"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm whitespace-pre-wrap",
										children: detailAsset.prompt
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "mt-2",
										onClick: () => {
											navigator.clipboard.writeText(detailAsset.prompt);
											toast.success("Copied");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 mr-1" }), " Copy Prompt"]
									})
								]
							}),
							detailAsset.source_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Source URL:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: detailAsset.source_url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-gold hover:underline",
										children: detailAsset.source_url
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 pt-2",
								children: [
									detailAsset.status === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											actionMutation.mutate({
												assetId: detailAsset.id,
												action: "approve"
											});
											setDetailOpen(false);
										},
										className: "bg-green-600 hover:bg-green-700",
										children: "Approve"
									}),
									detailAsset.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											actionMutation.mutate({
												assetId: detailAsset.id,
												action: "reject"
											});
											setDetailOpen(false);
										},
										className: "text-red-400",
										children: "Reject"
									}),
									detailAsset.status !== "archived" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											actionMutation.mutate({
												assetId: detailAsset.id,
												action: "archive"
											});
											setDetailOpen(false);
										},
										children: "Archive"
									}),
									detailAsset.public_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => window.open(detailAsset.public_url, "_blank"),
										children: "View Full Size"
									})
								]
							})
						]
					})
				})
			})
		]
	})] });
}
//#endregion
export { AdminMediaPage as component };
