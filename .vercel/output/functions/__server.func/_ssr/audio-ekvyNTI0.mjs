import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { d as track, p as useSession, s as Route$34 } from "./router-WzjKqw9S.mjs";
import { S as Pause, b as Play, h as SkipBack, m as SkipForward, r as Volume2 } from "../_libs/lucide-react.mjs";
import { n as StoryGrid } from "./StoryCard-Dy49yDu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audio-ekvyNTI0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(seconds) {
	if (!Number.isFinite(seconds)) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${String(s).padStart(2, "0")}`;
}
function AudioPlayer({ track: track$1, onPrev, onNext }) {
	const audioRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [rate, setRate] = (0, import_react.useState)(1);
	const [volume, setVolume] = (0, import_react.useState)(1);
	const { user } = useSession();
	const playTrackedFor = (0, import_react.useRef)(null);
	const milestones = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		setPlaying(false);
		setPosition(0);
		playTrackedFor.current = null;
		milestones.current = /* @__PURE__ */ new Set();
	}, [track$1?.id]);
	function mediaMetadata() {
		return {
			mediaTitle: track$1?.title ?? "",
			chapterNumber: 0
		};
	}
	/** Fire milestone events once each, based on actual playback position. */
	function handleMilestones(current, total) {
		if (!track$1 || !total || total <= 0) return;
		const pct = current / total * 100;
		for (const m of [
			25,
			50,
			75
		]) if (pct >= m && !milestones.current.has(m)) {
			milestones.current.add(m);
			track(m === 25 ? "audio_25" : m === 50 ? "audio_50" : "audio_75", {
				storyId: track$1.storyId,
				chapterId: track$1.id,
				metadata: mediaMetadata()
			});
		}
	}
	(0, import_react.useEffect)(() => {
		if (!user || !track$1?.id || !track$1.storyId || position < 5) return;
		const timer = setTimeout(() => {
			supabase.from("listening_progress").upsert({
				user_id: user.id,
				chapter_id: track$1.id,
				story_id: track$1.storyId,
				position_seconds: position,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}, 5e3);
		return () => clearTimeout(timer);
	}, [
		user,
		track$1?.id,
		track$1?.storyId,
		position
	]);
	if (!track$1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel px-5 py-6 text-sm text-muted-foreground",
		children: "Select a chapter to start listening."
	});
	const unavailable = !track$1.src;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Now playing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1 text-lg leading-tight",
				children: track$1.title
			}),
			track$1.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: track$1.subtitle
			}),
			unavailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground",
				children: "Narration for this chapter is being recorded. It will appear here as soon as it is released."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
					ref: audioRef,
					src: track$1.src ?? void 0,
					preload: "none",
					onPlay: () => {
						if (playTrackedFor.current !== track$1.id) {
							playTrackedFor.current = track$1.id;
							track("audio_play", {
								storyId: track$1.storyId,
								chapterId: track$1.id,
								metadata: mediaMetadata()
							});
						}
					},
					onTimeUpdate: (e) => {
						setPosition(e.currentTarget.currentTime);
						handleMilestones(e.currentTarget.currentTime, e.currentTarget.duration);
					},
					onLoadedMetadata: (e) => setDuration(e.currentTarget.duration),
					onEnded: () => {
						setPlaying(false);
						if (playTrackedFor.current === track$1.id) track("audio_complete", {
							storyId: track$1.storyId,
							chapterId: track$1.id,
							metadata: mediaMetadata()
						});
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: duration || 0,
						value: position,
						"aria-label": "Seek",
						onChange: (e) => {
							const next = Number(e.target.value);
							setPosition(next);
							if (audioRef.current) audioRef.current.currentTime = next;
						},
						className: "w-full accent-[var(--color-gold)]"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmt(position) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmt(duration) })]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onPrev,
						disabled: !onPrev,
						"aria-label": "Previous chapter",
						className: "rounded-md border border-border p-2 disabled:opacity-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (!audioRef.current) return;
							if (playing) {
								audioRef.current.pause();
								setPlaying(false);
							} else {
								audioRef.current.play();
								setPlaying(true);
							}
						},
						disabled: unavailable,
						"aria-label": playing ? "Pause" : "Play",
						className: "rounded-md bg-gold p-3 text-gold-foreground disabled:opacity-40",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onNext,
						disabled: !onNext,
						"aria-label": "Next chapter",
						className: "rounded-md border border-border p-2 disabled:opacity-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "ml-auto flex items-center gap-2 text-xs text-muted-foreground",
						children: ["Speed", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: rate,
							onChange: (e) => {
								const next = Number(e.target.value);
								setRate(next);
								if (audioRef.current) audioRef.current.playbackRate = next;
							},
							className: "rounded-md border border-border bg-surface-2 px-2 py-1 text-foreground",
							children: [
								.75,
								1,
								1.25,
								1.5,
								2
							].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: r,
								children: [r, "×"]
							}, r))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-4",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Volume"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .05,
								value: volume,
								onChange: (e) => {
									const next = Number(e.target.value);
									setVolume(next);
									if (audioRef.current) audioRef.current.volume = next;
								},
								className: "w-20 accent-[var(--color-gold)]"
							})
						]
					})
				]
			})
		]
	});
}
function AudioPage() {
	const { chapters, stories } = Route$34.useLoaderData();
	const [index, setIndex] = (0, import_react.useState)(0);
	const tracks = chapters.map((c) => ({
		id: c.id,
		title: `Chapter ${c.chapter_number} — ${c.title}`,
		subtitle: c.stories?.title ?? "",
		src: c.audio_url,
		storyId: c.story_id
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Listen",
			title: "Audio Library",
			lede: "Narrated chapters and audiobooks from the Taleon catalogue. Your place is saved automatically when you're signed in."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl tracking-wide",
				children: "Chapters"
			}), tracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "panel mt-4 px-6 py-14 text-center text-sm text-muted-foreground",
				children: "No narrated chapters are published yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border",
				children: tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setIndex(i),
					className: `flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${i === index ? "bg-surface-2" : "bg-surface-2/40 hover:bg-surface-2"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs text-muted-foreground",
							children: t.subtitle
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] tracking-widest text-muted-foreground uppercase",
						children: t.src ? "Play" : "Soon"
					})]
				}) }, t.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "lg:sticky lg:top-24 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPlayer, {
					track: tracks[index] ?? null,
					...index > 0 ? { onPrev: () => setIndex((i) => i - 1) } : {},
					...index < tracks.length - 1 ? { onNext: () => setIndex((i) => i + 1) } : {}
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl tracking-wide",
				children: "Stories with narration"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryGrid, {
					stories,
					empty: "Narration is in production for the first Taleon Originals."
				})
			})]
		})
	] });
}
//#endregion
export { AudioPage as component };
