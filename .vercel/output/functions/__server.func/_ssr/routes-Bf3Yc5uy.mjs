import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as Section } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { c as Route$37, d as track, p as useSession } from "./router-WzjKqw9S.mjs";
import { M as Headphones, b as Play, q as BookOpen } from "../_libs/lucide-react.mjs";
import { t as bannerFor } from "./artwork-PyNNFBXk.mjs";
import { n as StoryGrid, t as StoryCard } from "./StoryCard-Dy49yDu_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bf3Yc5uy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { featured, trending, newest, popular, genres } = Route$37.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { story: featured }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContinueReading, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Trending",
			eyebrow: "Right now",
			href: "/stories",
			hrefLabel: "All stories",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryGrid, { stories: trending })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "New Stories",
			eyebrow: "Just released",
			href: "/stories",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryGrid, { stories: newest })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formats, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Popular This Week",
			eyebrow: "Most read",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: popular.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/story/$slug",
					params: { slug: s.slug },
					className: "flex items-center gap-4 rounded-lg border border-border bg-surface-2/60 p-4 transition-colors hover:border-border-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl text-gold",
						children: String(i + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-sm font-medium",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs text-muted-foreground",
							children: (s.genres ?? []).map((g) => g.name).join(" / ")
						})]
					})]
				}, s.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Genres",
			eyebrow: "Find your world",
			href: "/genres",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
				children: genres.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/stories",
					search: { genre: g.slug },
					className: "group relative overflow-hidden rounded-lg border border-border bg-surface-2 px-4 py-8 text-center transition-colors hover:border-border-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-x-0 bottom-0 h-px opacity-60",
						style: { background: g.accent },
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm tracking-wide",
						children: g.name
					})]
				}, g.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Originals, { stories: [...trending].slice(0, 6) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newsletter, {})
	] });
}
function Hero({ story }) {
	(0, import_react.useEffect)(() => {
		track("landing_page_view", { metadata: { page: "home" } });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: bannerFor(story),
				alt: `Key art for ${story.title}`,
				width: 1920,
				height: 1088,
				className: "absolute inset-0 size-full object-cover opacity-60"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				style: { background: "var(--gradient-veil)" },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pt-28 pb-16 sm:px-6 md:min-h-[86vh]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Taleon Originals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-3xl text-4xl leading-[1.05] tracking-wide sm:text-6xl md:text-7xl",
						children: story.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs tracking-[0.2em] text-gold uppercase",
						children: (story.genres ?? []).map((g) => g.name).join(" • ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base text-muted-foreground sm:text-lg",
						children: story.short_description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/story/$slug/chapter/$chapterNumber",
								params: {
									slug: story.slug,
									chapterNumber: "1"
								},
								className: "flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), " Read Story"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/audio",
								className: "flex items-center gap-2 rounded-md border border-border-strong bg-background/40 px-6 py-3 text-sm tracking-wider uppercase backdrop-blur hover:bg-background/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-4" }), " Listen"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/watch",
								className: "flex items-center gap-2 rounded-md border border-border-strong bg-background/40 px-6 py-3 text-sm tracking-wider uppercase backdrop-blur hover:bg-background/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), " Watch"]
							})
						]
					})
				]
			})
		]
	});
}
function ContinueReading() {
	const { user } = useSession();
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) {
			setRows([]);
			return;
		}
		supabase.from("reading_progress").select("chapter_number, percent, stories(slug,title,cover_url)").order("updated_at", { ascending: false }).limit(3).then(({ data }) => setRows(data ?? []));
	}, [user]);
	if (!user || !rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Continue Reading",
		eyebrow: "Pick up where you stopped",
		href: "/continue",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel flex flex-col gap-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: row.stories?.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Chapter ", row.chapter_number]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1 w-full overflow-hidden rounded-full bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gold",
							style: { width: `${Math.min(100, Number(row.percent) || 0)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: row.stories?.slug,
							chapterNumber: String(row.chapter_number)
						},
						className: "mt-1 text-xs tracking-widest text-gold uppercase hover:opacity-80",
						children: "Continue reading"
					})
				]
			}, row.stories?.slug))
		})
	});
}
function Formats() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3",
			children: [
				{
					icon: BookOpen,
					title: "Read",
					body: "Serialized stories and novels, released chapter by chapter.",
					to: "/stories"
				},
				{
					icon: Headphones,
					title: "Listen",
					body: "Narrated chapters, audiobooks and audio drama.",
					to: "/audio"
				},
				{
					icon: Play,
					title: "Watch",
					body: "Cinematic story videos, trailers and adaptations.",
					to: "/watch"
				}
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: "group bg-surface-2 p-8 transition-colors hover:bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
						className: "size-5 text-gold",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 text-2xl tracking-[0.2em] uppercase",
						children: item.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xs text-sm text-muted-foreground",
						children: item.body
					})
				]
			}, item.title))
		})
	});
}
function Originals({ stories }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative border-y border-border bg-surface-2/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-16 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Original intellectual property"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl tracking-wide sm:text-4xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gold-text",
						children: "Taleon Originals"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-sm text-muted-foreground",
					children: "Worlds created, written and produced in-house — built to be read, heard and seen."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6",
					children: stories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story: s }, s.id))
				})
			]
		})
	});
}
function Newsletter() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function subscribe(e) {
		e.preventDefault();
		const mail = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return;
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: mail })
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				setError(data.error ?? "Subscription failed. Please try again.");
				return;
			}
			track("newsletter_signup", { metadata: {
				formType: "email",
				formLocation: "homepage"
			} });
			setDone(true);
		} catch {
			setError("Subscription failed. Please try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl tracking-wide",
				children: "Never miss the next chapter."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Join Taleon for new chapters, narrated releases and story videos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row",
				onSubmit: subscribe,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "newsletter-email",
						className: "sr-only",
						children: "Email address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "newsletter-email",
						type: "email",
						required: true,
						maxLength: 255,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@example.com",
						className: "w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "rounded-md bg-gold px-6 py-3 text-sm font-medium tracking-wider text-gold-foreground uppercase hover:opacity-90 disabled:opacity-60",
						children: busy ? "Joining…" : "Join Taleon"
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-destructive",
				children: error
			}),
			done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-gold",
				children: "You're on the list. Welcome to Taleon."
			})
		]
	});
}
//#endregion
export { Home as component };
