import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { d as track, f as trackChapterProgress, p as useSession, t as Route } from "./router-WzjKqw9S.mjs";
import { J as ArrowRight, K as Bookmark, M as Headphones, T as Minus, Y as ArrowLeft, f as Sun, y as Plus } from "../_libs/lucide-react.mjs";
import { t as ShareRow } from "./ShareRow-hXpPKvRu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/story._slug.chapter._chapterNumber-CPPqMu7c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChapterPage() {
	const { story, chapter, prev, next, total } = Route.useLoaderData();
	const params = Route.useParams();
	const { user } = useSession();
	const [fontSize, setFontSize] = (0, import_react.useState)(18);
	const [wide, setWide] = (0, import_react.useState)(false);
	const [light, setLight] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [bookmarked, setBookmarked] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		track("chapter_view", {
			storyId: story.id,
			chapterId: chapter.id,
			metadata: {
				storySlug: params.slug,
				storyTitle: story.title,
				chapterNumber: chapter.chapter_number
			}
		});
		track("chapter_start", {
			storyId: story.id,
			chapterId: chapter.id,
			funnelStage: "started",
			metadata: {
				storySlug: params.slug,
				storyTitle: story.title,
				chapterNumber: chapter.chapter_number
			}
		});
	}, [story.id, chapter.id]);
	const [funnelMilestones, setFunnelMilestones] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		function onScroll() {
			const total = document.body.scrollHeight - window.innerHeight;
			const pct = total > 0 ? Math.min(100, window.scrollY / total * 100) : 0;
			setProgress(pct);
			for (const milestone of [
				25,
				50,
				75,
				100
			]) if (pct >= milestone && !funnelMilestones.has(milestone)) {
				setFunnelMilestones((prev) => /* @__PURE__ */ new Set([...prev, milestone]));
				trackChapterProgress({
					storyId: story.id,
					chapterId: chapter.id,
					percent: milestone,
					chapterNumber: chapter.chapter_number,
					wordLength: chapter.word_count
				});
			}
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [
		chapter.id,
		story.id,
		funnelMilestones
	]);
	(0, import_react.useEffect)(() => {
		if (!user || progress < 5) return;
		const timer = setTimeout(() => {
			supabase.from("reading_progress").upsert({
				user_id: user.id,
				story_id: story.id,
				chapter_id: chapter.id,
				chapter_number: chapter.chapter_number,
				percent: Math.round(progress),
				completed: progress > 92,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}, 4e3);
		return () => clearTimeout(timer);
	}, [
		user,
		progress,
		story.id,
		chapter.id,
		chapter.chapter_number
	]);
	const paragraphs = String(chapter.content).split(/\n\s*\n/).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: light ? "reader-light bg-background text-foreground" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-gold transition-[width] duration-150",
				style: { width: `${progress}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mx-auto px-4 pt-10 pb-24 sm:px-6 ${wide ? "max-w-4xl" : "max-w-2xl"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/story/$slug",
					params: { slug: story.slug },
					className: "eyebrow hover:text-foreground",
					children: ["← ", story.title]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mt-6 border-b border-border pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tracking-[0.28em] text-gold uppercase",
						children: [
							"Chapter ",
							chapter.chapter_number,
							" of ",
							total
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-3xl tracking-wide sm:text-4xl",
						children: chapter.title
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-md border border-border p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFontSize((s) => Math.max(15, s - 1)),
									"aria-label": "Decrease font size",
									className: "p-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-1 text-muted-foreground",
									children: "Aa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFontSize((s) => Math.min(26, s + 1)),
									"aria-label": "Increase font size",
									className: "p-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setWide((v) => !v),
							className: "rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground",
							children: wide ? "Narrow" : "Wide"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setLight((v) => !v),
							className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground",
							"aria-pressed": light,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" }),
								" ",
								light ? "Dark mode" : "Light mode"
							]
						}),
						user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								await supabase.from("bookmarks").upsert({
									user_id: user.id,
									story_id: story.id,
									chapter_id: chapter.id
								});
								setBookmarked(true);
							},
							className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `size-3.5 ${bookmarked ? "fill-current text-gold" : ""}` }), bookmarked ? "Bookmarked" : "Bookmark"]
						})
					]
				}),
				chapter.is_premium ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel mt-10 px-6 py-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Taleon Plus"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-2xl",
							children: "This chapter is for members"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground",
							children: "Members read new chapters first, ad-free, with full narration."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							className: "mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase",
							children: "See membership"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "mt-10 space-y-6 leading-[1.85]",
					style: { fontSize: `${fontSize}px` },
					children: paragraphs.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, i))
				}),
				chapter.audio_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: chapter.audio_url,
					className: "mt-10 flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm hover:border-border-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" }), " Listen to this chapter"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/audio",
					className: "mt-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" }), " Narration coming soon — browse the audio library"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareRow, {
						title: `${story.title} — Chapter ${chapter.chapter_number}`,
						storyId: story.id
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-12 flex items-center justify-between border-t border-border pt-8",
					"aria-label": "Chapter navigation",
					children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: story.slug,
							chapterNumber: String(prev)
						},
						className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Previous"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: story.slug,
							chapterNumber: String(next)
						},
						className: "flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90",
						children: ["Continue reading ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/story/$slug",
						params: { slug: story.slug },
						className: "text-sm text-muted-foreground hover:text-foreground",
						children: "Back to story"
					})]
				})
			]
		})]
	});
}
//#endregion
export { ChapterPage as component };
