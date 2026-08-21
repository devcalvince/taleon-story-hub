import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { d as track, n as Route$17, p as useSession } from "./router-WzjKqw9S.mjs";
import { M as Headphones, b as Play, j as Heart, q as BookOpen, y as Plus } from "../_libs/lucide-react.mjs";
import { n as coverFor, t as bannerFor } from "./artwork-PyNNFBXk.mjs";
import { t as StoryCard } from "./StoryCard-Dy49yDu_.mjs";
import { t as ShareRow } from "./ShareRow-hXpPKvRu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/story._slug-CfT9O1Dr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StoryPage() {
	const { story, chapters, characters, videos, related } = Route$17.useLoaderData();
	const params = Route$17.useParams();
	const { user } = useSession();
	const [following, setFollowing] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		track("story_view", {
			storyId: story.id,
			metadata: {
				pathname: window.location.pathname,
				storySlug: params.slug,
				storyTitle: story.title,
				storyGenre: story.genres?.[0]?.slug ?? ""
			}
		});
	}, [story.id]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("follows").select("story_id").eq("story_id", story.id).maybeSingle().then(({ data }) => setFollowing(Boolean(data)));
		supabase.from("bookmarks").select("story_id").eq("story_id", story.id).maybeSingle().then(({ data }) => setSaved(Boolean(data)));
	}, [user, story.id]);
	async function toggleFollow() {
		if (!user) return;
		if (following) {
			await supabase.from("follows").delete().eq("story_id", story.id).eq("user_id", user.id);
			setFollowing(false);
		} else {
			const { error } = await supabase.from("follows").insert({
				story_id: story.id,
				user_id: user.id
			});
			if (error) return;
			setFollowing(true);
			track("story_follow", {
				storyId: story.id,
				metadata: {
					storySlug: params.slug,
					storyTitle: story.title,
					storyGenre: story.genres?.[0]?.slug ?? ""
				}
			});
		}
	}
	async function toggleSave() {
		if (!user) return;
		if (saved) {
			const { error } = await supabase.from("bookmarks").delete().eq("story_id", story.id).eq("user_id", user.id);
			if (error) return;
			setSaved(false);
			track("story_bookmark", {
				storyId: story.id,
				metadata: {
					action: "remove",
					storySlug: params.slug,
					storyTitle: story.title
				}
			});
		} else {
			const { error } = await supabase.from("bookmarks").insert({
				story_id: story.id,
				user_id: user.id
			});
			if (error) return;
			setSaved(true);
			track("story_bookmark", {
				storyId: story.id,
				metadata: {
					action: "add",
					storySlug: params.slug,
					storyTitle: story.title
				}
			});
		}
	}
	const firstChapter = chapters[0]?.chapter_number ?? 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate overflow-hidden border-b border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bannerFor(story),
				alt: "",
				"aria-hidden": true,
				className: "absolute inset-0 size-full object-cover opacity-35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: "var(--gradient-veil)" },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[260px_1fr] md:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: coverFor(story),
					alt: `Cover art for ${story.title}`,
					width: 768,
					height: 1024,
					className: "w-40 rounded-lg border border-border shadow-[var(--shadow-cinema)] md:w-full"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: story.author
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl tracking-wide sm:text-5xl",
						children: story.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs tracking-[0.2em] text-gold uppercase",
						children: (story.genres ?? []).map((g) => g.name).join(" • ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-2xl text-base text-muted-foreground",
						children: story.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "eyebrow",
								children: "Chapters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: chapters.length })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "eyebrow",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "capitalize",
								children: String(story.status).replace("_", " ")
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "eyebrow",
								children: "Audio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: story.has_audio ? "Available" : "In production" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "eyebrow",
								children: "Video"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: story.has_video ? "Available" : "In production" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "eyebrow",
								children: "Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: Number(story.rating) > 0 ? `${story.rating} / 5` : "Unrated" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							chapters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/story/$slug/chapter/$chapterNumber",
								params: {
									slug: story.slug,
									chapterNumber: String(firstChapter)
								},
								className: "flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), " Start Reading"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/audio",
								className: "flex items-center gap-2 rounded-md border border-border-strong px-6 py-3 text-sm tracking-wider uppercase hover:bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" }), " Listen"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/watch",
								className: "flex items-center gap-2 rounded-md border border-border-strong px-6 py-3 text-sm tracking-wider uppercase hover:bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), " Watch"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-3",
						children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: toggleFollow,
							className: "flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
								" ",
								following ? "Following" : "Follow"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: toggleSave,
							className: "flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${saved ? "fill-current text-gold" : ""}` }),
								" ",
								saved ? "Saved" : "Save"
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "rounded-md border border-border px-4 py-2 text-sm hover:border-border-strong",
							children: "Sign in to follow and save"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRow, {
							title: story.title,
							storyId: story.id
						})
					})
				] })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 py-14 sm:px-6",
		children: [
			characters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: "Characters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: characters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-5",
						children: [
							c.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image_url,
								alt: c.name,
								className: "mb-3 h-20 w-20 rounded-full object-cover",
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-widest text-gold uppercase",
								children: c.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: c.bio
							})
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryVisualAssets, { storyId: story.id }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: "Chapters"
				}), chapters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "panel mt-5 px-6 py-12 text-center text-sm text-muted-foreground",
					children: "The first chapter is being finished. Follow this story to be notified."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border",
					children: chapters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: story.slug,
							chapterNumber: String(c.chapter_number)
						},
						className: "flex items-center gap-4 bg-surface-2/50 px-5 py-4 transition-colors hover:bg-surface-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display w-10 shrink-0 text-sm text-muted-foreground",
								children: String(c.chapter_number).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-muted-foreground",
									children: [
										c.word_count,
										" words",
										c.audio_url ? " • Audio" : ""
									]
								})]
							}),
							c.is_premium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-gold px-2.5 py-1 text-[10px] tracking-widest text-gold uppercase",
								children: "Plus"
							})
						]
					}) }, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: "Audio"
				}), chapters.some((c) => c.audio_url) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-2",
					children: chapters.filter((c) => c.audio_url).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "panel px-5 py-4 text-sm",
						children: [
							"Chapter ",
							c.chapter_number,
							" — ",
							c.title
						]
					}, c.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "panel mt-5 px-6 py-10 text-center text-sm text-muted-foreground",
					children: "Narration for this story is in production. Audio chapters will appear here on release."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl tracking-wide",
					children: "Videos"
				}), videos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: videos.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-video items-center justify-center bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-6 text-gold",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: v.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: v.description
							})]
						})]
					}, v.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "panel mt-5 px-6 py-10 text-center text-sm text-muted-foreground",
					children: "No video yet for this story."
				})]
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl tracking-wide",
				children: "Related Stories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4",
				children: related.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story: s }, s.id))
			})] })
		]
	})] });
}
function StoryVisualAssets({ storyId }) {
	const [assets, setAssets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		supabase.from("media_assets").select("id, title, asset_type, public_url, status").eq("story_id", storyId).in("status", ["approved", "published"]).order("asset_type").then(({ data }) => setAssets(data ?? []));
	}, [storyId]);
	if (assets.length === 0) return null;
	const covers = assets.filter((a) => ["cover", "story_cover"].includes(a.asset_type));
	const scenes = assets.filter((a) => a.asset_type === "scene");
	const others = assets.filter((a) => ![
		"cover",
		"story_cover",
		"scene"
	].includes(a.asset_type));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		covers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl tracking-wide",
				children: "Artwork"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: covers.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-lg border border-border bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: a.public_url,
						alt: a.title,
						className: "w-full object-cover",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: a.title
						})
					})]
				}, a.id))
			})]
		}),
		scenes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl tracking-wide",
				children: "Scenes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: scenes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-lg border border-border bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: a.public_url,
						alt: a.title,
						className: "w-full object-cover",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: a.title
						})
					})]
				}, a.id))
			})]
		}),
		others.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl tracking-wide",
				children: "Gallery"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: others.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-lg border border-border bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: a.public_url,
						alt: a.title,
						className: "w-full object-cover",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: a.title
						})
					})]
				}, a.id))
			})]
		})
	] });
}
//#endregion
export { StoryPage as component };
