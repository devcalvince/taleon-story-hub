import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as coverFor } from "./artwork-PyNNFBXk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-B0SU71G9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user } = useSession();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [bookmarks, setBookmarks] = (0, import_react.useState)([]);
	const [follows, setFollows] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)([]);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("reading");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const select = "story_id, stories:story_id (id, slug, title, tagline, cover_url)";
		supabase.from("bookmarks").select(select).eq("user_id", user.id).then(({ data }) => setBookmarks(data ?? []));
		supabase.from("follows").select(select).eq("user_id", user.id).then(({ data }) => setFollows(data ?? []));
		supabase.from("reading_progress").select("story_id, percent, chapter_number, updated_at, stories:story_id (id, slug, title, cover_url)").eq("user_id", user.id).order("updated_at", { ascending: false }).then(({ data }) => setProgress(data ?? []));
		supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => setDisplayName(data?.display_name ?? ""));
	}, [user]);
	async function saveProfile(e) {
		e.preventDefault();
		if (!user) return;
		await supabase.from("profiles").update({ display_name: displayName.trim().slice(0, 60) }).eq("id", user.id);
		setSaved(true);
		setTimeout(() => setSaved(false), 2500);
	}
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/login",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "My library",
		title: displayName || user?.email || "Your account"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 border-y border-border py-4",
			children: [[
				{
					key: "reading",
					label: "Continue reading"
				},
				{
					key: "saved",
					label: "Saved"
				},
				{
					key: "following",
					label: "Following"
				},
				{
					key: "profile",
					label: "Profile"
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setTab(t.key),
				className: `rounded-md border px-4 py-2 text-xs ${tab === t.key ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"}`,
				children: t.label
			}, t.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: signOut,
				className: "ml-auto text-xs text-muted-foreground hover:text-foreground",
				children: "Sign out"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-10",
			children: [
				tab === "reading" && (progress.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nothing in progress",
					body: "Open a story and your place will be saved automatically.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stories",
						className: "rounded-md border border-border px-5 py-2.5 text-sm",
						children: "Browse stories"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: progress.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/story/$slug/chapter/$chapterNumber",
						params: {
							slug: p.stories?.slug ?? "",
							chapterNumber: String(p.chapter_number ?? 1)
						},
						className: "flex items-center gap-4 rounded-lg border border-border bg-surface-2/50 p-4 hover:bg-surface-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: coverFor({
								slug: p.stories?.slug ?? "",
								cover_url: p.stories?.cover_url
							}),
							alt: "",
							className: "h-20 w-14 rounded object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display",
									children: p.stories?.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Chapter ",
										p.chapter_number,
										" • ",
										Math.round(p.percent ?? 0),
										"% read"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-1 w-full rounded bg-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1 rounded bg-gold",
										style: { width: `${Math.min(100, p.percent ?? 0)}%` }
									})
								})
							]
						})]
					}) }, p.story_id))
				})),
				(tab === "saved" || tab === "following") && (() => {
					const rows = tab === "saved" ? bookmarks : follows;
					if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: tab === "saved" ? "No saved stories" : "Not following anything yet",
						body: "Use the save and follow buttons on any story page.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/stories",
							className: "rounded-md border border-border px-5 py-2.5 text-sm",
							children: "Browse stories"
						})
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5",
						children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/story/$slug",
							params: { slug: r.stories?.slug ?? "" },
							className: "group block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: coverFor({
									slug: r.stories?.slug ?? "",
									cover_url: r.stories?.cover_url
								}),
								alt: r.stories?.title ?? "",
								className: "aspect-2/3 w-full rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 truncate text-sm group-hover:text-gold",
								children: r.stories?.title
							})]
						}, r.story_id))
					});
				})(),
				tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveProfile,
					className: "max-w-md space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "display",
							className: "eyebrow block",
							children: "Display name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "display",
							value: displayName,
							maxLength: 60,
							onChange: (e) => setDisplayName(e.target.value),
							className: "mt-2 w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-border-strong"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: user?.email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md bg-gold px-6 py-3 text-sm font-medium text-gold-foreground",
							children: "Save profile"
						}),
						saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gold",
							children: "Profile updated."
						})
					]
				})
			]
		})]
	})] });
}
//#endregion
export { AccountPage as component };
