import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as notFound, _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { i as getServerFnById, n as __exportAll$1, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-QX_qkvv7.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { E as Menu, _ as Search, t as X } from "../_libs/lucide-react.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog.functions-CK3dsTwR.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchHome = createServerFn({ method: "GET" }).handler(createSsrRpc("45542b4d7e9455295ccfc71fbb3aaf52d6d252e915768984ff41c7698053ffcb"));
var fetchGenres = createServerFn({ method: "GET" }).handler(createSsrRpc("ad648885fb2cbfd310ac1a20ed3fc846844a8d4970bec7a4c244e9544ef84258"));
var fetchStories = createServerFn({ method: "GET" }).validator((data) => data ?? {}).handler(createSsrRpc("8566508aa4d5fe91ad57a2f6071a6dce2e618b6d82abee70e44fb42d417c743b"));
var fetchStory = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("6807633485cae9a9e8f528393cc925a14cf6facc250b00f305015f2a0a5b2a46"));
var fetchChapter = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("c2d008e00f69c4f19ff38bc311ebbd6d95a0294961431580a7d4e471be88f927"));
var fetchAudio = createServerFn({ method: "GET" }).handler(createSsrRpc("57439f67b857ba20b4966dd61bbcd7fe66f05ede7f039ce5697da86858bf4898"));
var fetchVideos = createServerFn({ method: "GET" }).handler(createSsrRpc("758363bc23b450c329ceb6abb739d3c0f5b173e62e720f53f36d5ea83b820b9e"));
var fetchSearch = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("0504c74ebe6f22fd5ba858d4261545edb46008ca419c59379df73f7b5fbdf926"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-WzjKqw9S.js
var router_WzjKqw9S_exports = /* @__PURE__ */ __exportAll({
	a: () => Route$24,
	c: () => Route$34,
	d: () => trackChapterProgress,
	f: () => useSession,
	getRouter: () => getRouter,
	i: () => Route$22,
	l: () => Route$37,
	n: () => Route,
	o: () => Route$26,
	p: () => supabaseAdmin,
	r: () => Route$17,
	s: () => Route$30,
	t: () => router_exports,
	u: () => track
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseAdminClient() {
	const SUPABASE_URL = process.env["SUPABASE_URL"];
	const SUPABASE_SERVICE_ROLE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
var styles_default = "/assets/styles-CJnHxtbj.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var SessionContext = (0, import_react.createContext)({
	session: null,
	user: null,
	loading: true,
	isAdmin: false
});
function SessionProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	(0, import_react.useEffect)(() => {
		const userId = session?.user?.id;
		if (!userId) {
			setIsAdmin(false);
			return;
		}
		supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(Boolean(data)));
	}, [session?.user?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionContext.Provider, {
		value: {
			session,
			user: session?.user ?? null,
			loading,
			isAdmin
		},
		children
	});
}
function useSession() {
	return (0, import_react.useContext)(SessionContext);
}
var NAV = [
	{
		to: "/stories",
		label: "Stories"
	},
	{
		to: "/audio",
		label: "Audio"
	},
	{
		to: "/watch",
		label: "Watch"
	},
	{
		to: "/genres",
		label: "Genres"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const { user, isAdmin } = useSession();
	function submitSearch(e) {
		e.preventDefault();
		if (!query.trim()) return;
		setOpen(false);
		navigate({
			to: "/search",
			search: { q: query.trim() }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex shrink-0 items-center gap-2",
					"aria-label": "Taleon Media home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg tracking-widest text-gold sm:text-xl",
						children: "TALEON"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "ml-4 hidden items-center gap-7 md:flex",
					"aria-label": "Primary",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						activeProps: { className: "text-foreground" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitSearch,
					className: "ml-auto hidden items-center md:flex",
					role: "search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "site-search",
						className: "sr-only",
						children: "Search Taleon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-4 text-muted-foreground",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "site-search",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search stories",
							className: "w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground lg:w-52"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2 md:ml-2",
					children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "hidden text-sm text-muted-foreground hover:text-foreground lg:block",
							children: "Admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							className: "hidden rounded-md border border-border px-3 py-2 text-sm hover:border-border-strong md:block",
							children: "My Taleon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								await supabase.auth.signOut();
								navigate({
									to: "/",
									replace: true
								});
							},
							className: "hidden text-sm text-muted-foreground hover:text-foreground md:block",
							children: "Log out"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "hidden px-2 text-sm text-muted-foreground hover:text-foreground md:block",
						children: "Log In"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "hidden rounded-md bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition-opacity hover:opacity-90 md:block",
						children: "Join Taleon"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-md border border-border p-2 md:hidden",
						onClick: () => setOpen((v) => !v),
						"aria-expanded": open,
						"aria-label": open ? "Close menu" : "Open menu",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitSearch,
					role: "search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "mobile-search",
						className: "sr-only",
						children: "Search Taleon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "size-4 text-muted-foreground",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "mobile-search",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search stories, chapters, characters",
							className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "grid gap-1",
					"aria-label": "Mobile",
					children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: "rounded-md px-2 py-3 text-base hover:bg-surface-2",
						children: item.label
					}, item.to)), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/account",
							onClick: () => setOpen(false),
							className: "rounded-md px-2 py-3 text-base hover:bg-surface-2",
							children: "My Taleon"
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							onClick: () => setOpen(false),
							className: "rounded-md px-2 py-3 text-base hover:bg-surface-2",
							children: "Admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								setOpen(false);
								await supabase.auth.signOut();
								navigate({
									to: "/",
									replace: true
								});
							},
							className: "rounded-md px-2 py-3 text-left text-base hover:bg-surface-2",
							children: "Log out"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							onClick: () => setOpen(false),
							className: "rounded-md border border-border px-4 py-3 text-center text-sm",
							children: "Log In"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							onClick: () => setOpen(false),
							className: "rounded-md bg-gold px-4 py-3 text-center text-sm font-medium text-gold-foreground",
							children: "Join Taleon"
						})]
					})]
				})]
			})
		})]
	});
}
var SOCIALS = [
	{
		label: "TikTok",
		href: "https://www.tiktok.com/@taleonmedia"
	},
	{
		label: "Instagram",
		href: "https://instagram.com/taleonmedia"
	},
	{
		label: "YouTube",
		href: "https://youtube.com/@taleonmedia"
	},
	{
		label: "Facebook",
		href: "https://facebook.com/taleonmedia"
	},
	{
		label: "X",
		href: "https://x.com/taleonmedia"
	}
];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-surface-2/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl tracking-widest text-gold",
					children: "TALEON"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm text-muted-foreground",
					children: "An original storytelling and entertainment company. Read, listen and watch original worlds."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Footer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "eyebrow",
						children: "Explore"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/stories",
								className: "hover:text-foreground",
								children: "Stories"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/audio",
								className: "hover:text-foreground",
								children: "Audio"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/watch",
								className: "hover:text-foreground",
								children: "Watch"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/genres",
								className: "hover:text-foreground",
								children: "Genres"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "hover:text-foreground",
								children: "About"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/pricing",
								className: "hover:text-foreground",
								children: "Membership"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "hover:text-foreground",
								children: "Contact"
							}) })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "eyebrow",
					children: "Follow @taleonmedia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: SOCIALS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: s.href,
						target: "_blank",
						rel: "noreferrer noopener",
						className: "hover:text-foreground",
						children: s.label
					}) }, s.label))
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Taleon Media. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							className: "hover:text-foreground",
							children: "Terms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "hover:text-foreground",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cookies",
							className: "hover:text-foreground",
							children: "Cookies"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/copyright",
							className: "hover:text-foreground",
							children: "Copyright"
						})
					]
				})]
			})
		})]
	});
}
/**
* TALEON — Google Analytics 4 integration layer.
*
* Architecture:
*   - GA4 handles audience/acquisition/attribution (marketing analytics).
*   - Supabase analytics_events remains the application telemetry store.
*   - Both systems are fed from the common helpers in src/lib/analytics.ts,
*     so components never call GA4 directly.
*
* Rules enforced here:
*   - Browser-only initialization; never during SSR.
*   - Measurement ID comes from VITE_GA_MEASUREMENT_ID (never hard-coded).
*   - Automatic page_view is disabled; exactly one manual page_view is sent
*     per route navigation from usePageTracking (no duplicates).
*   - Every operation is wrapped so GA4 failure can never break the app.
*   - No PII: no emails, names, user IDs, tokens, message contents.
*   - No actor_type/admin/role parameters — internal traffic filtering is a
*     GA4 admin-side concern (data filters), not an app-side flag.
*/
var MEASUREMENT_ID = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_GA_MEASUREMENT_ID": "G-DQPV5LGJ40",
	"VITE_SUPABASE_PROJECT_ID": "ikyyxmsmgzisociqtnwz",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_aZdKb5lY6mvGDniKrMQUzw_NLDURSkw",
	"VITE_SUPABASE_URL": "https://ikyyxmsmgzisociqtnwz.supabase.co"
}["VITE_GA_MEASUREMENT_ID"]?.trim();
var initialized = false;
/** True when GA4 can run in the current environment. */
function isGA4Enabled() {
	return typeof window !== "undefined" && !!window.gtag && !!MEASUREMENT_ID;
}
/**
* Inject the Google tag once, client-side only.
* Safe to call repeatedly; safe during SSR (no-op).
*/
function initGA4() {
	if (initialized) return;
	if (typeof window === "undefined") return;
	if (!MEASUREMENT_ID) return;
	initialized = true;
	try {
		window.dataLayer = window.dataLayer || [];
		if (!window.gtag) window.gtag = function gtag(...args) {
			window.dataLayer?.push(args);
		};
		window.gtag("js", /* @__PURE__ */ new Date());
		window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
		const script = document.createElement("script");
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
		document.head.appendChild(script);
	} catch {}
}
/** Core sender — strips empty values, never throws. */
function send(eventName, params) {
	try {
		if (!isGA4Enabled()) return;
		const clean = {};
		for (const [key, value] of Object.entries(params)) {
			if (value === void 0 || value === null || value === "") continue;
			if (typeof value === "number" && !Number.isFinite(value)) continue;
			clean[key] = value;
		}
		window.gtag?.("event", eventName, clean);
	} catch {}
}
function ga4PageView(pathname) {
	send("page_view", { page_path: pathname });
}
function ga4StoryView(p) {
	send("story_view", p);
}
function ga4StoryFollow(p) {
	send("story_follow", p);
}
function ga4StoryBookmark(p) {
	send("story_bookmark", p);
}
function ga4ChapterStart(p) {
	send("chapter_start", p);
}
function ga4ChapterProgress(p) {
	send("chapter_progress", p);
}
function ga4ChapterComplete(p) {
	send("chapter_complete", {
		...p,
		progress_percentage: 100
	});
}
function ga4Search(searchTerm) {
	send("search", { search_term: searchTerm });
}
function ga4Share(p) {
	send("share", p);
}
function ga4SignUp(method) {
	send("sign_up", { method });
}
function ga4Login(method) {
	send("login", { method });
}
function ga4AudioPlay(p) {
	send("audio_play", p);
}
function ga4AudioProgress(p) {
	send("audio_progress", p);
}
function ga4AudioComplete(p) {
	send("audio_complete", {
		...p,
		progress_percentage: 100
	});
}
function ga4VideoStart(p) {
	send("video_start", p);
}
function ga4VideoProgress(p) {
	send("video_progress", p);
}
function ga4VideoComplete(p) {
	send("video_complete", {
		...p,
		progress_percentage: 100
	});
}
function ga4NewsletterSubscribe(formType, formLocation) {
	send("newsletter_subscribe", {
		form_type: formType,
		form_location: formLocation
	});
}
function ga4GenerateLead(formType, formLocation) {
	send("generate_lead", {
		form_type: formType,
		form_location: formLocation
	});
}
initGA4();
var ANON_ID_KEY = "taleon_anon_id";
var CAMPAIGN_KEY = "taleon_campaign";
/**
* Anonymous visitor ID management.
*/
var _anonId = null;
var _attribution = null;
/** Generate or retrieve a persistent anonymous visitor ID. */
function getAnonymousId() {
	if (_anonId) return _anonId;
	if (typeof window === "undefined") return "";
	try {
		const existing = localStorage.getItem(ANON_ID_KEY);
		if (existing) {
			_anonId = existing;
			return existing;
		}
		const fresh = crypto.randomUUID();
		localStorage.setItem(ANON_ID_KEY, fresh);
		_anonId = fresh;
		return fresh;
	} catch {
		return "";
	}
}
/** Capture UTM parameters from the URL and persist the campaign
*  so we can attribute subsequent page views to the same campaign.
*/
function captureAttribution() {
	if (typeof window === "undefined") return emptyAttribution();
	if (_attribution) return _attribution;
	try {
		const cached = localStorage.getItem(CAMPAIGN_KEY);
		if (cached) {
			_attribution = JSON.parse(cached);
			return _attribution;
		}
	} catch {}
	const params = new URLSearchParams(window.location.search);
	const source = params.get("utm_source") || params.get("taleon_source") || "";
	const campaign = params.get("utm_campaign") || params.get("taleon_campaign") || "";
	const content = params.get("utm_content") || params.get("taleon_content") || "";
	const attribution = {
		source,
		campaign,
		content,
		referrer: document.referrer || ""
	};
	_attribution = attribution;
	try {
		localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(attribution));
	} catch {}
	if (source || campaign || content) {
		const url = new URL(window.location.href);
		url.searchParams.delete("utm_source");
		url.searchParams.delete("utm_campaign");
		url.searchParams.delete("utm_content");
		url.searchParams.delete("taleon_source");
		url.searchParams.delete("taleon_campaign");
		url.searchParams.delete("taleon_content");
		window.history.replaceState({}, "", url.toString());
	}
	return attribution;
}
function emptyAttribution() {
	return {
		source: "direct",
		campaign: "",
		content: "",
		referrer: ""
	};
}
/** Get device type from user agent. */
function getDevice() {
	if (typeof window === "undefined") return "desktop";
	const ua = navigator.userAgent || navigator.vendor;
	if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
	if (/tablet|ipad/i.test(ua)) return "tablet";
	return "desktop";
}
/**
* Server-authoritative actor type determination.
*
* The browser cannot safely determine whether an authenticated user is an
* administrator — that requires querying the user_roles table, which must
* be done server-side via the supabaseAdmin client (service-role key).
* Per requirement 7, the analytics write path is server-authoritative:
* the client track() function calls a server endpoint that validates the
* Supabase session and queries the user_roles table.
*
* Per requirement 5, admin status is determined server-side from the
* authenticated Supabase user and the user_roles table.
* Per requirement 6, the Supabase service-role key remains server-side
* (supabaseAdmin is imported from client.server, never exposed to the browser).
* Per requirement 8, anonymous analytics continue working without authentication.
* Per requirement 9, authenticated normal readers are counted as public audience.
* Per requirement 10, administrators are excluded from all public KPIs even
*  when browsing the public website.
* Per requirement 11, system events remain excluded from public KPIs.
* Per requirement 13, existing event types are preserved.
*/
async function fetchActorTypeFromServer(userId) {
	if (!userId) return "public";
	try {
		const { data: { session } } = await supabase.auth.getSession();
		const token = session?.access_token;
		if (!token) return "public";
		const res = await fetch("/api/analytics/role", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ userId })
		});
		if (!res.ok) return "public";
		return (await res.json()).actorType === "admin" ? "admin" : "public";
	} catch {
		return "public";
	}
}
/** Fire-and-forget analytics. Never blocks or breaks the UI.
*  Sends the event with full context: user_id (if authenticated),
*  anonymous_id, attribution, device, referrer, and actor_type
*  to classify the event as public, admin, or system.
* 
* IMPORTANT: actor_type is determined server-authoritatively. The client
* track() function runs in the browser and cannot reliably determine the
* user's role. It calls a server endpoint (/api/analytics/role) that:
*   1. Validates the Supabase session user_id (verified by Supabase auth)
*   2. Queries the user_roles table via the service-role key
*   3. Returns "admin" or "public"
*
* Per requirement 5, admin status is determined server-side from the
* authenticated Supabase user and the user_roles table.
* Per requirement 6, the Supabase service-role key remains server-side
* (supabaseAdmin is imported from client.server, never exposed to the browser).
* Per requirement 8, anonymous analytics continue working without authentication.
* Per requirement 9, authenticated normal readers are counted as public audience.
* Per requirement 10, administrators are excluded from all public KPIs even
*  when browsing the public website.
* Per requirement 11, system events remain excluded from public KPIs.
* Per requirement 13, existing event types are preserved.
*/
/**
* Mirror a public Taleon event to GA4.
*
* Only audience-facing events are mirrored. Internal/diagnostic events
* (admin/system activity) never reach GA4 — internal-traffic filtering for
* GA4 is handled by GA4 admin-side data filters, not by app code, and no
* actor_type/role/user-id parameters are ever sent to Google.
*
* Parameter names match the manually configured GA4 custom definitions:
* story_title, story_genre, chapter_number, progress_percentage,
* media_title, form_type.
*/
function mirrorToGA4(event, payload) {
	try {
		const md = payload.metadata ?? {};
		const story = {
			story_id: payload.storyId,
			story_slug: md["storySlug"],
			story_title: md["storyTitle"],
			story_genre: md["storyGenre"]
		};
		const chapter = {
			...story,
			chapter_id: payload.chapterId,
			chapter_number: typeof md["chapterNumber"] === "number" ? md["chapterNumber"] : void 0
		};
		switch (event) {
			case "story_view":
				ga4StoryView(story);
				break;
			case "story_follow":
				ga4StoryFollow(story);
				break;
			case "story_bookmark":
				ga4StoryBookmark({
					story_id: story.story_id,
					story_slug: story.story_slug,
					story_title: story.story_title,
					bookmark_action: md["action"] === "remove" ? "remove" : "add"
				});
				break;
			case "chapter_start":
				ga4ChapterStart(chapter);
				break;
			case "chapter_25":
				ga4ChapterProgress({
					...chapter,
					progress_percentage: 25
				});
				break;
			case "chapter_50":
				ga4ChapterProgress({
					...chapter,
					progress_percentage: 50
				});
				break;
			case "chapter_75":
				ga4ChapterProgress({
					...chapter,
					progress_percentage: 75
				});
				break;
			case "chapter_complete":
				ga4ChapterComplete(chapter);
				break;
			case "search":
				if (typeof md["query"] === "string" && md["query"]) ga4Search(md["query"]);
				break;
			case "share":
				ga4Share({
					method: String(md["target"] ?? "unknown").toLowerCase(),
					content_type: md["contentType"] === "chapter" ? "chapter" : "story",
					item_id: String(payload.storyId ?? md["itemId"] ?? "")
				});
				break;
			case "signup":
				ga4SignUp(String(md["method"] ?? "credentials"));
				break;
			case "login":
				ga4Login(String(md["method"] ?? "credentials"));
				break;
			case "audio_play":
				ga4AudioPlay({
					...chapter,
					media_title: md["mediaTitle"]
				});
				break;
			case "audio_25":
				ga4AudioProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 25
				});
				break;
			case "audio_50":
				ga4AudioProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 50
				});
				break;
			case "audio_75":
				ga4AudioProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 75
				});
				break;
			case "audio_complete":
				ga4AudioComplete({
					...chapter,
					media_title: md["mediaTitle"]
				});
				break;
			case "video_play":
				ga4VideoStart({
					...chapter,
					media_title: md["mediaTitle"]
				});
				break;
			case "video_25":
				ga4VideoProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 25
				});
				break;
			case "video_50":
				ga4VideoProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 50
				});
				break;
			case "video_75":
				ga4VideoProgress({
					...chapter,
					media_title: md["mediaTitle"],
					progress_percentage: 75
				});
				break;
			case "video_complete":
				ga4VideoComplete({
					...chapter,
					media_title: md["mediaTitle"]
				});
				break;
			case "newsletter_signup":
				ga4NewsletterSubscribe(String(md["formType"] ?? "email"), String(md["formLocation"] ?? ""));
				break;
			case "contact_submission": ga4GenerateLead(String(md["formType"] ?? "contact"), String(md["formLocation"] ?? ""));
		}
	} catch {}
}
async function track(event, payload = {}) {
	try {
		const { data: { session } } = await supabase.auth.getSession();
		const attribution = captureAttribution();
		const device = getDevice();
		let actorType;
		if (session?.user?.id) {
			actorType = await fetchActorTypeFromServer(session.user.id);
			await supabase.from("analytics_events").insert({
				event_name: event,
				user_id: session.user.id,
				anonymous_id: null,
				story_id: payload.storyId ?? null,
				chapter_id: payload.chapterId ?? null,
				funnel_stage: payload.funnelStage ?? null,
				attribution,
				referrer: typeof payload.metadata === "object" && payload.metadata !== null && "referrer" in payload.metadata ? payload.metadata["referrer"] : attribution.referrer ?? null,
				device,
				metadata: payload.metadata ?? {},
				actor_type: actorType
			});
		} else {
			const anonId = getAnonymousId();
			actorType = "public";
			await supabase.from("analytics_events").insert({
				event_name: event,
				user_id: null,
				anonymous_id: anonId,
				story_id: payload.storyId ?? null,
				chapter_id: payload.chapterId ?? null,
				funnel_stage: payload.funnelStage ?? null,
				attribution,
				referrer: typeof payload.metadata === "object" && payload.metadata !== null && "referrer" in payload.metadata ? payload.metadata["referrer"] : attribution.referrer ?? null,
				device,
				metadata: payload.metadata ?? {},
				actor_type: "public"
			});
		}
		if (actorType === "public") mirrorToGA4(event, payload);
	} catch {}
}
/** Track a page view with optional story context.
*
* GA4: exactly one manual page_view per navigation for EVERY route
* (automatic page_view is disabled in ga4.ts, so this is the single
* mechanism — initial load included, no SSR/hydration duplicates).
*
* Supabase: story/chapter pages are skipped here because dedicated
* story_view/chapter_view events already cover them.
*/
function trackPageView(pathname, storyId) {
	ga4PageView(pathname);
	if (pathname.startsWith("/story/")) return;
	if (pathname === "/") track("landing_page_view", { metadata: { pathname } });
	else track("page_view", { metadata: { pathname } });
}
/** Track chapter reading progress funnel events.
*
* NOTE: chapter_start is NOT emitted here — it fires exactly once when the
* chapter page mounts (see the chapter route). This function only emits the
* scroll milestones, each guarded by a milestone set in the caller so no
* threshold can fire twice.
*/
function trackChapterProgress(opts) {
	const { storyId, chapterId, percent, chapterNumber, wordLength } = opts;
	if (percent >= 25 && percent < 50) {
		track("chapter_25", {
			storyId,
			chapterId,
			funnelStage: "25%",
			metadata: {
				chapterNumber,
				percent: Math.round(percent)
			}
		});
		return;
	}
	if (percent >= 50 && percent < 75) {
		track("chapter_50", {
			storyId,
			chapterId,
			funnelStage: "50%",
			metadata: {
				chapterNumber,
				percent: Math.round(percent)
			}
		});
		return;
	}
	if (percent >= 75 && percent < 100) {
		track("chapter_75", {
			storyId,
			chapterId,
			funnelStage: "75%",
			metadata: {
				chapterNumber,
				percent: Math.round(percent)
			}
		});
		return;
	}
	if (percent >= 100) {
		track("chapter_complete", {
			storyId,
			chapterId,
			funnelStage: "100%",
			metadata: {
				chapterNumber,
				wordLength: wordLength ?? 0
			}
		});
		return;
	}
}
/**
* Automatically tracks a page_view (or story_view for story pages)
* whenever the current route changes.
*
* Call this once in the root layout component to capture all navigation.
*/
function usePageTracking() {
	const { location } = useRouterState();
	(0, import_react.useEffect)(() => {
		captureAttribution();
		trackPageView(location.pathname);
	}, [location.pathname]);
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Taleon Media"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-5xl",
					children: "Lost the signal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "This page doesn't exist, or the story it belonged to has moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90",
						children: "Go home"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stories",
						className: "rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong",
						children: "Browse stories"
					})]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Something went wrong on our end. Try again, or head back to the catalogue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-border px-5 py-2.5 text-sm hover:border-border-strong",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$38 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Taleon Media — Stories that come alive." },
			{
				name: "description",
				content: "Taleon Media is an original storytelling company. Read, listen to and watch cinematic original stories."
			},
			{
				property: "og:site_name",
				content: "Taleon Media"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#080B12"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Taleon Media",
				slogan: "Stories that come alive.",
				sameAs: [
					"https://www.tiktok.com/@taleonmedia",
					"https://instagram.com/taleonmedia",
					"https://youtube.com/@taleonmedia",
					"https://x.com/taleonmedia"
				]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$38.useRouteContext();
	usePageTracking();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SessionProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-gold-foreground",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "min-h-[60vh]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		] })
	});
}
var $$splitComponentImporter$32 = () => import("./routes-Bf3Yc5uy.mjs");
var Route$37 = createFileRoute("/")({
	loader: () => fetchHome(),
	head: () => ({
		meta: [
			{ title: "Taleon Media — Stories that come alive." },
			{
				name: "description",
				content: "Discover Taleon Originals: cinematic stories you can read, listen to and watch. Start with The Last Signal."
			},
			{
				property: "og:title",
				content: "Taleon Media — Stories that come alive."
			},
			{
				property: "og:description",
				content: "Cinematic original stories to read, listen to and watch."
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./route-Di7iQBCH.mjs");
var Route$36 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/login" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./about-DXcmfTvA.mjs");
var Route$35 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About | Taleon Media" },
			{
				name: "description",
				content: "Taleon Media is an original digital storytelling and entertainment company creating worlds to read, hear and watch."
			},
			{
				property: "og:title",
				content: "About | Taleon Media"
			},
			{
				property: "og:description",
				content: "An original storytelling and entertainment company."
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./audio-ekvyNTI0.mjs");
var Route$34 = createFileRoute("/audio")({
	loader: () => fetchAudio(),
	head: () => ({
		meta: [
			{ title: "Audio Library | Taleon Media" },
			{
				name: "description",
				content: "Listen to narrated Taleon chapters, audiobooks and audio drama."
			},
			{
				property: "og:title",
				content: "Audio Library | Taleon Media"
			},
			{
				property: "og:description",
				content: "Narrated Taleon stories and audiobooks."
			},
			{
				property: "og:url",
				content: "/audio"
			}
		],
		links: [{
			rel: "canonical",
			href: "/audio"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./contact-B4Bvq6eD.mjs");
var Route$33 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact | Taleon Media" },
			{
				name: "description",
				content: "Contact Taleon Media for general, business, partnership, copyright or support enquiries."
			},
			{
				property: "og:title",
				content: "Contact | Taleon Media"
			},
			{
				property: "og:description",
				content: "Get in touch with the Taleon Media team."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./cookies-Br2S1ide.mjs");
var Route$32 = createFileRoute("/cookies")({
	head: () => ({
		meta: [
			{ title: "Cookie Policy | Taleon Media" },
			{
				name: "description",
				content: "How Taleon Media uses cookies and similar technologies."
			},
			{
				property: "og:title",
				content: "Cookie Policy | Taleon Media"
			},
			{
				property: "og:description",
				content: "How Taleon Media uses cookies and similar technologies."
			},
			{
				property: "og:url",
				content: "/cookies"
			}
		],
		links: [{
			rel: "canonical",
			href: "/cookies"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./copyright-vohIgAa1.mjs");
var Route$31 = createFileRoute("/copyright")({
	head: () => ({
		meta: [
			{ title: "Copyright | Taleon Media" },
			{
				name: "description",
				content: "Copyright ownership and takedown process for Taleon Media originals."
			},
			{
				property: "og:title",
				content: "Copyright | Taleon Media"
			},
			{
				property: "og:description",
				content: "Copyright ownership and takedown process for Taleon Media."
			},
			{
				property: "og:url",
				content: "/copyright"
			}
		],
		links: [{
			rel: "canonical",
			href: "/copyright"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./genres-BTCvD9S4.mjs");
var Route$30 = createFileRoute("/genres")({
	loader: () => fetchGenres(),
	head: () => ({
		meta: [
			{ title: "Genres | Taleon Media" },
			{
				name: "description",
				content: "Explore Taleon stories by genre — sci-fi, horror, romance, African stories and more."
			},
			{
				property: "og:title",
				content: "Genres | Taleon Media"
			},
			{
				property: "og:description",
				content: "Explore Taleon stories by genre."
			},
			{
				property: "og:url",
				content: "/genres"
			}
		],
		links: [{
			rel: "canonical",
			href: "/genres"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./login-C7xk_KPp.mjs");
var Route$29 = createFileRoute("/login")({
	head: () => ({
		meta: [
			{ title: "Sign In | Taleon Media" },
			{
				name: "description",
				content: "Sign in to your Taleon Media account to keep reading, listening and watching."
			},
			{
				property: "og:title",
				content: "Sign In | Taleon Media"
			},
			{
				property: "og:description",
				content: "Sign in to your Taleon Media account."
			},
			{
				property: "og:url",
				content: "/login"
			}
		],
		links: [{
			rel: "canonical",
			href: "/login"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./pricing-D7xC19l1.mjs");
var Route$28 = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Membership | Taleon Media" },
			{
				name: "description",
				content: "Taleon membership tiers: Free, Taleon Plus and Taleon Premium."
			},
			{
				property: "og:title",
				content: "Membership | Taleon Media"
			},
			{
				property: "og:description",
				content: "Read ad-free, hear every narration and get chapters first."
			},
			{
				property: "og:url",
				content: "/pricing"
			}
		],
		links: [{
			rel: "canonical",
			href: "/pricing"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./privacy-DKmuKyHr.mjs");
var Route$27 = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy | Taleon Media" },
			{
				name: "description",
				content: "How Taleon Media collects, uses and protects your data."
			},
			{
				property: "og:title",
				content: "Privacy Policy | Taleon Media"
			},
			{
				property: "og:description",
				content: "How Taleon Media collects, uses and protects your data."
			},
			{
				property: "og:url",
				content: "/privacy"
			}
		],
		links: [{
			rel: "canonical",
			href: "/privacy"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./search-CdzlEtHm.mjs");
var Route$26 = createFileRoute("/search")({
	validateSearch: (search) => ({ q: typeof search["q"] === "string" ? search["q"] : void 0 }),
	loaderDeps: ({ search }) => ({ q: search.q ?? "" }),
	loader: ({ deps }) => fetchSearch({ data: { q: deps.q } }),
	head: () => ({
		meta: [
			{ title: "Search | Taleon Media" },
			{
				name: "description",
				content: "Search Taleon stories, chapters, characters and genres."
			},
			{
				property: "og:title",
				content: "Search | Taleon Media"
			},
			{
				property: "og:description",
				content: "Search the Taleon catalogue."
			},
			{
				property: "og:url",
				content: "/search"
			},
			{
				name: "robots",
				content: "noindex"
			}
		],
		links: [{
			rel: "canonical",
			href: "/search"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./signup-BMeidQVi.mjs");
var Route$25 = createFileRoute("/signup")({
	head: () => ({
		meta: [
			{ title: "Create Account | Taleon Media" },
			{
				name: "description",
				content: "Create a free Taleon Media account to save stories and keep your place."
			},
			{
				property: "og:title",
				content: "Create Account | Taleon Media"
			},
			{
				property: "og:description",
				content: "Create a free Taleon Media account."
			},
			{
				property: "og:url",
				content: "/signup"
			}
		],
		links: [{
			rel: "canonical",
			href: "/signup"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./stories-DJHtvyW5.mjs");
var Route$24 = createFileRoute("/stories")({
	validateSearch: (search) => ({
		genre: typeof search["genre"] === "string" ? search["genre"] : void 0,
		sort: typeof search["sort"] === "string" ? search["sort"] : void 0,
		q: typeof search["q"] === "string" ? search["q"] : void 0,
		status: typeof search["status"] === "string" ? search["status"] : void 0
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => ({
		stories: await fetchStories({ data: deps }),
		genres: await fetchGenres()
	}),
	head: () => ({
		meta: [
			{ title: "All Stories | Taleon Media" },
			{
				name: "description",
				content: "Browse the full Taleon catalogue — original serialized stories, audiobooks and story videos."
			},
			{
				property: "og:title",
				content: "All Stories | Taleon Media"
			},
			{
				property: "og:description",
				content: "Browse every Taleon original story."
			},
			{
				property: "og:url",
				content: "/stories"
			}
		],
		links: [{
			rel: "canonical",
			href: "/stories"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./terms-B_HHE0YP.mjs");
var Route$23 = createFileRoute("/terms")({
	head: () => ({
		meta: [
			{ title: "Terms of Service | Taleon Media" },
			{
				name: "description",
				content: "The terms that govern your use of Taleon Media."
			},
			{
				property: "og:title",
				content: "Terms of Service | Taleon Media"
			},
			{
				property: "og:description",
				content: "The terms that govern your use of Taleon Media."
			},
			{
				property: "og:url",
				content: "/terms"
			}
		],
		links: [{
			rel: "canonical",
			href: "/terms"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./watch-CJT84rtW.mjs");
var Route$22 = createFileRoute("/watch")({
	loader: () => fetchVideos(),
	head: () => ({
		meta: [
			{ title: "Watch | Taleon Media" },
			{
				name: "description",
				content: "Story trailers, cinematic chapters and shorts from Taleon Originals."
			},
			{
				property: "og:title",
				content: "Watch | Taleon Media"
			},
			{
				property: "og:description",
				content: "Cinematic story videos from Taleon Originals."
			},
			{
				property: "og:url",
				content: "/watch"
			}
		],
		links: [{
			rel: "canonical",
			href: "/watch"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./account-B0SU71G9.mjs");
var Route$21 = createFileRoute("/_authenticated/account")({
	head: () => ({
		meta: [
			{ title: "My Library | Taleon Media" },
			{
				name: "description",
				content: "Your Taleon library: saved stories, follows and reading progress."
			},
			{
				property: "og:title",
				content: "My Library | Taleon Media"
			},
			{
				property: "og:description",
				content: "Your Taleon library."
			},
			{
				property: "og:url",
				content: "/account"
			},
			{
				name: "robots",
				content: "noindex"
			}
		],
		links: [{
			rel: "canonical",
			href: "/account"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin-KieW4Mso.mjs");
var Route$20 = createFileRoute("/_authenticated/admin")({
	head: () => ({
		meta: [
			{ title: "Admin | Taleon Media" },
			{
				name: "description",
				content: "Taleon Media administration dashboard."
			},
			{
				property: "og:title",
				content: "Admin | Taleon Media"
			},
			{
				property: "og:description",
				content: "Taleon Media administration dashboard."
			},
			{
				property: "og:url",
				content: "/admin"
			},
			{
				name: "robots",
				content: "noindex"
			}
		],
		links: [{
			rel: "canonical",
			href: "/admin"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var contactSchema = objectType({
	name: stringType().min(1, "Name is required").max(100),
	email: stringType().email("Invalid email address"),
	subject: stringType().max(200).optional(),
	message: stringType().min(10, "Message must be at least 10 characters").max(5e3)
});
var Route$19 = createFileRoute("/api/contact")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.json();
		const validated = contactSchema.parse(body);
		const { error } = await supabaseAdmin.from("contact_submissions").insert({
			name: validated.name,
			email: validated.email,
			subject: validated.subject || null,
			message: validated.message
		});
		if (error) throw error;
		return new Response(JSON.stringify({
			success: true,
			message: "Thank you for your message. We'll get back to you soon."
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		if (err.name === "ZodError") return new Response(JSON.stringify({
			success: false,
			error: err.errors[0].message
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify({
			success: false,
			error: "Failed to submit. Please try again."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var subscribeSchema = objectType({ email: stringType().email("Invalid email address") });
var Route$18 = createFileRoute("/api/newsletter")({ server: { handlers: {
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const validated = subscribeSchema.parse(body);
			const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert({
				email: validated.email,
				is_active: true,
				unsubscribed_at: null
			}, { onConflict: "email" });
			if (error) throw error;
			return new Response(JSON.stringify({
				success: true,
				message: "Successfully subscribed to the newsletter!"
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} catch (err) {
			if (err.name === "ZodError") return new Response(JSON.stringify({
				success: false,
				error: err.errors[0].message
			}), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			return new Response(JSON.stringify({
				success: false,
				error: "Failed to subscribe. Please try again."
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ request }) => {
		try {
			const email = new URL(request.url).searchParams.get("email");
			if (!email) return new Response(JSON.stringify({
				success: false,
				error: "Email is required"
			}), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const { error } = await supabaseAdmin.from("newsletter_subscribers").update({
				is_active: false,
				unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("email", email);
			if (error) throw error;
			return new Response(JSON.stringify({
				success: true,
				message: "Successfully unsubscribed."
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} catch (err) {
			return new Response(JSON.stringify({
				success: false,
				error: "Failed to unsubscribe."
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var $$splitComponentImporter$14 = () => import("./story._slug-CfT9O1Dr.mjs");
var Route$17 = createFileRoute("/story/$slug")({
	loader: async ({ params }) => {
		const data = await fetchStory({ data: { slug: params.slug } });
		if (!data) throw notFound();
		return data;
	},
	head: ({ params, loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Story unavailable | Taleon Media" }, {
			name: "robots",
			content: "noindex"
		}] };
		const s = loaderData.story;
		const title = `${s.title} | Taleon Media`;
		const description = s.short_description ?? "A Taleon Original story.";
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: `/story/${params.slug}`
				}
			],
			links: [{
				rel: "canonical",
				href: `/story/${params.slug}`
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Book",
					name: s.title,
					author: {
						"@type": "Organization",
						name: s.author
					},
					description
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin-DsvgKdlc.mjs");
var Route$16 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "Admin Dashboard | Taleon Media" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./analytics-D8d-_zJY.mjs");
var Route$15 = createFileRoute("/_authenticated/admin/analytics")({
	head: () => ({ meta: [{ title: "Analytics | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./chapters-CaEnj2Pi.mjs");
var Route$14 = createFileRoute("/_authenticated/admin/chapters")({
	head: () => ({ meta: [{ title: "Manage Chapters | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./characters-BbdbRsWL.mjs");
var Route$13 = createFileRoute("/_authenticated/admin/characters")({
	head: () => ({ meta: [{ title: "Character Bible | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./contacts-Beu7bbkA.mjs");
var Route$12 = createFileRoute("/_authenticated/admin/contacts")({
	head: () => ({ meta: [{ title: "Contact Submissions | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./genres-3-cGenbk.mjs");
var Route$11 = createFileRoute("/_authenticated/admin/genres")({
	head: () => ({ meta: [{ title: "Manage Genres | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./locations-CkVMMtix.mjs");
var Route$10 = createFileRoute("/_authenticated/admin/locations")({
	head: () => ({ meta: [{ title: "Locations | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./media-CW1dXq5I.mjs");
var Route$9 = createFileRoute("/_authenticated/admin/media")({
	head: () => ({ meta: [{ title: "Media Studio | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./newsletter-Bp8zzA03.mjs");
var Route$8 = createFileRoute("/_authenticated/admin/newsletter")({
	head: () => ({ meta: [{ title: "Newsletter Subscribers | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./prompts-ch5RO0r4.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/prompts")({
	head: () => ({ meta: [{ title: "Prompt Library | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./scenes-BplhMhC6.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/scenes")({
	head: () => ({ meta: [{ title: "Scenes | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./stories-CAzxIqj9.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/stories")({
	head: () => ({ meta: [{ title: "Manage Stories | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./users-Avc5WjC0.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/users")({
	head: () => ({ meta: [{ title: "Manage Users | Taleon Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var SUPABASE_URL = process.env["SUPABASE_URL"];
var SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
function extractToken(request) {
	const authHeader = request.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
	const match = (request.headers.get("cookie") ?? "").match(/sb-[^=]+-auth-token=([^;]+)/);
	if (match?.[1]) try {
		const token = JSON.parse(decodeURIComponent(match[1]))?.["access_token"];
		return typeof token === "string" ? token : null;
	} catch {
		return null;
	}
	return null;
}
async function requireAdmin(request) {
	const token = extractToken(request);
	if (!token) throw new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
	if (authErr || !user) throw new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
	if (!roleRow) throw new Response(JSON.stringify({ error: "Forbidden" }), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	});
	return {
		id: user.id,
		email: user.email ?? ""
	};
}
var SupabaseStorageProvider = class {
	async upload(options) {
		try {
			await this.createBucketIfNotExists(options.bucket, {
				public: true,
				allowedMimeTypes: this.getAllowedMimeTypes(options.bucket)
			});
			const { data, error } = await supabaseAdmin.storage.from(options.bucket).upload(options.path, options.data, {
				contentType: options.contentType,
				upsert: options.upsert ?? true,
				cacheControl: options.cacheControl ?? "3600",
				metadata: options.metadata ?? {}
			});
			if (error) return {
				success: false,
				error: error.message
			};
			const { data: urlData } = supabaseAdmin.storage.from(options.bucket).getPublicUrl(data.path);
			return {
				success: true,
				path: data.path,
				publicUrl: urlData.publicUrl,
				metadata: {
					size: 0,
					contentType: options.contentType,
					lastModified: (/* @__PURE__ */ new Date()).toISOString()
				}
			};
		} catch (e) {
			return {
				success: false,
				error: e.message || "Upload failed"
			};
		}
	}
	async delete(path) {
		try {
			const bucket = this.extractBucketFromPath(path);
			const storagePath = this.extractStoragePath(path);
			const { error } = await supabaseAdmin.storage.from(bucket).remove([storagePath]);
			if (error) return {
				success: false,
				error: error.message
			};
			return { success: true };
		} catch (e) {
			return {
				success: false,
				error: e.message || "Delete failed"
			};
		}
	}
	async replace(oldPath, newOptions) {
		const uploadResult = await this.upload(newOptions);
		if (!uploadResult.success) return uploadResult;
		const deleteResult = await this.delete(oldPath);
		if (!deleteResult.success) console.warn(`Failed to delete old asset after replacement: ${deleteResult.error}`);
		return uploadResult;
	}
	getPublicUrl(path) {
		try {
			const bucket = this.extractBucketFromPath(path);
			const storagePath = this.extractStoragePath(path);
			const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
			return {
				success: true,
				url: data.publicUrl
			};
		} catch (e) {
			return {
				success: false,
				error: e.message || "Failed to get public URL"
			};
		}
	}
	async getSignedUrl(path, expiresIn = 3600) {
		try {
			const bucket = this.extractBucketFromPath(path);
			const storagePath = this.extractStoragePath(path);
			const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(storagePath, expiresIn);
			if (error) return {
				success: false,
				error: error.message
			};
			return {
				success: true,
				url: data.signedUrl
			};
		} catch (e) {
			return {
				success: false,
				error: e.message || "Failed to create signed URL"
			};
		}
	}
	async getMetadata(path) {
		try {
			const bucket = this.extractBucketFromPath(path);
			const storagePath = this.extractStoragePath(path);
			let metadataResult;
			try {
				metadataResult = await supabaseAdmin.storage.from(bucket).getMetadata(storagePath);
			} catch {
				metadataResult = { data: [{
					size: 0,
					mimetype: "application/octet-stream"
				}] };
			}
			if (metadataResult && metadataResult.data) {
				const metadata = metadataResult.data[0] || metadataResult.data;
				return {
					success: true,
					metadata: {
						size: metadata.size || 0,
						contentType: metadata.mimetype || metadata.contentType || "application/octet-stream",
						lastModified: metadata.lastModified || metadata.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
						etag: metadata.etag,
						width: metadata.width,
						height: metadata.height,
						duration: metadata.duration,
						bitrate: metadata.bitrate
					}
				};
			}
			return {
				success: false,
				error: "Metadata not available"
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error"
			};
		}
	}
	async listFiles(prefix) {
		try {
			const { data, error } = await supabaseAdmin.storage.from("story-assets").list(prefix, { limit: 1e3 });
			if (error) return [];
			return data.map((file) => `${prefix ? prefix + "/" : ""}${file.name}`).filter(Boolean);
		} catch {
			return [];
		}
	}
	async createBucketIfNotExists(bucket, options) {
		const { data: buckets } = await supabaseAdmin.storage.listBuckets();
		if (!buckets?.some((b) => b.name === bucket)) await supabaseAdmin.storage.createBucket(bucket, {
			public: options?.public ?? true,
			fileSizeLimit: options?.fileSizeLimit ?? this.getDefaultFileSizeLimit(bucket),
			allowedMimeTypes: options?.allowedMimeTypes ?? this.getAllowedMimeTypes(bucket)
		});
	}
	async bucketExists(bucket) {
		const { data: buckets } = await supabaseAdmin.storage.listBuckets();
		return buckets?.some((b) => b.name === bucket) ?? false;
	}
	extractBucketFromPath(path) {
		if (path.startsWith("story-audio/")) return "story-audio";
		if (path.startsWith("story-video/")) return "story-video";
		return "story-assets";
	}
	extractStoragePath(path) {
		const bucket = this.extractBucketFromPath(path);
		return path.replace(`${bucket}/`, "");
	}
	getDefaultFileSizeLimit(bucket) {
		switch (bucket) {
			case "story-audio": return parseInt(process.env["MAX_AUDIO_UPLOAD_MB"] || "200") * 1024 * 1024;
			case "story-video": return parseInt(process.env["MAX_VIDEO_UPLOAD_MB"] || "500") * 1024 * 1024;
			default: return 10485760;
		}
	}
	getAllowedMimeTypes(bucket) {
		switch (bucket) {
			case "story-audio": return [
				"audio/mpeg",
				"audio/mp4",
				"audio/m4a",
				"audio/aac",
				"audio/ogg",
				"audio/wav"
			];
			case "story-video": return [
				"video/mp4",
				"video/webm",
				"video/quicktime",
				"video/x-msvideo"
			];
			default: return [
				"image/jpeg",
				"image/png",
				"image/webp",
				"image/avif"
			];
		}
	}
};
function getStorageProvider() {
	const providerName = process.env["STORAGE_PROVIDER"] || "supabase";
	switch (providerName) {
		case "supabase": return new SupabaseStorageProvider();
		case "cloudflare_r2":
			console.warn("Cloudflare R2 provider not yet implemented, using Supabase");
			return new SupabaseStorageProvider();
		case "aws_s3":
			console.warn("AWS S3 provider not yet implemented, using Supabase");
			return new SupabaseStorageProvider();
		default:
			console.warn(`Unknown storage provider: ${providerName}, using Supabase`);
			return new SupabaseStorageProvider();
	}
}
parseInt(process.env["MAX_AUDIO_UPLOAD_MB"] || "200") * 1024 * 1024;
parseInt(process.env["MAX_VIDEO_UPLOAD_MB"] || "500") * 1024 * 1024;
var BUCKET = "story-assets";
function buildStoragePath(p) {
	const parts = [`stories/${p.storyId}`];
	if (p.kind === "covers") parts.push("covers");
	else if (p.kind === "characters") parts.push("characters");
	else if (p.kind === "locations") parts.push("locations");
	else if (p.kind === "social") parts.push("social");
	else if (p.kind === "thumbnails") parts.push("thumbnails");
	else if (p.kind === "uploads") parts.push("uploads");
	else if (p.kind === "audio") {
		parts.push("audio");
		if (p.chapterId) parts.push(`chapters/${p.chapterId}`);
	} else if (p.kind === "video") {
		parts.push("video");
		if (p.chapterId) parts.push(`chapters/${p.chapterId}`);
	} else if (p.chapterId) {
		parts.push(`chapters/${p.chapterId}`);
		if (p.kind === "scenes" && p.sceneId) parts.push(`scenes/${p.sceneId}`);
	}
	parts.push(p.filename);
	return parts.join("/");
}
function sanitizeFilename(raw) {
	return raw.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}
async function ensureBucket(bucket) {
	await getStorageProvider().createBucketIfNotExists(bucket);
}
async function uploadToStorage(path, data, contentType) {
	const bucket = BUCKET;
	await ensureBucket(bucket);
	const { error } = await supabaseAdmin.storage.from(bucket).upload(path, data, {
		contentType,
		upsert: true
	});
	if (error) return { error: error.message };
	const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
	return {
		path,
		publicUrl: urlData.publicUrl
	};
}
async function deleteFromStorage(path) {
	const bucket = BUCKET;
	await supabaseAdmin.storage.from(bucket).remove([path]);
}
var ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif"
];
var FETCH_TIMEOUT = 3e4;
function isPrivateIp(hostname) {
	if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "::ffff:127.0.0.1") return true;
	if (/^10\./.test(hostname)) return true;
	if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;
	if (/^192\.168\./.test(hostname)) return true;
	if (/^169\.254\./.test(hostname)) return true;
	return false;
}
async function importExternalImage(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			error: "Invalid URL format."
		};
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
		ok: false,
		error: "Only HTTP/HTTPS URLs are allowed."
	};
	if (isPrivateIp(parsed.hostname)) return {
		ok: false,
		error: "Private/local URLs are not allowed."
	};
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
	let response;
	try {
		response = await fetch(parsed.toString(), {
			signal: controller.signal,
			headers: { "User-Agent": "TaleonMedia/1.0" }
		});
	} catch (e) {
		clearTimeout(timer);
		return {
			ok: false,
			error: `Failed to fetch: ${e.message || "network error"}`
		};
	}
	clearTimeout(timer);
	if (!response.ok) return {
		ok: false,
		error: `HTTP ${response.status}: ${response.statusText}`
	};
	const contentType = response.headers.get("content-type") || "";
	const clHeader = response.headers.get("content-length");
	if (clHeader && parseInt(clHeader, 10) > 15728640) return {
		ok: false,
		error: "Image exceeds 15 MB limit."
	};
	if (!ALLOWED_TYPES.includes(contentType)) return {
		ok: false,
		error: `Unsupported image format. Allowed: JPEG, PNG, WEBP, AVIF.`
	};
	const buffer = await response.arrayBuffer();
	if (buffer.byteLength > 15728640) return {
		ok: false,
		error: "Image exceeds 15 MB limit."
	};
	const bytes = new Uint8Array(buffer.slice(0, 16));
	const mime = detectMime(bytes);
	if (!mime || !ALLOWED_TYPES.includes(mime)) return {
		ok: false,
		error: `Unsupported image format. Allowed: JPEG, PNG, WEBP, AVIF.`
	};
	const dims = detectDimensions(mime, bytes);
	const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
	return {
		ok: true,
		data: buffer,
		contentType: mime,
		width: dims?.width ?? 0,
		height: dims?.height ?? 0,
		format: ext,
		fileSize: buffer.byteLength
	};
}
function detectMime(bytes) {
	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
	if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "image/png";
	if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70) return "image/webp";
	return null;
}
function detectDimensions(mime, bytes) {
	try {
		if (mime === "image/png" && bytes.length >= 24) {
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			return {
				width: view.getUint32(16),
				height: view.getUint32(20)
			};
		}
		if (mime === "image/jpeg") {
			let offset = 2;
			while (offset < bytes.length - 1) {
				if (bytes[offset] !== 255) break;
				const marker = bytes[offset + 1];
				if (marker === 217 || marker === 218) break;
				const segLen = new DataView(bytes.buffer, bytes.byteOffset + offset + 2, 2).getUint16(0);
				if ((marker === 192 || marker === 193 || marker === 194) && segLen >= 7) {
					const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 5, 4);
					return {
						height: view.getUint16(0),
						width: view.getUint16(2)
					};
				}
				offset += 2 + segLen;
			}
		}
		if (mime === "image/webp" && bytes.length >= 30) {
			if (bytes[12] === 86 && bytes[13] === 80 && bytes[14] === 56) {
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				return {
					width: view.getUint16(26) & 16383,
					height: view.getUint16(28) & 16383
				};
			}
			if (bytes[12] === 86 && bytes[13] === 80 && bytes[14] === 50) {
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				return {
					width: view.getUint16(26) & 16383,
					height: view.getUint16(28) & 16383
				};
			}
		}
	} catch {}
	return null;
}
function sanitizeImportFilename(url, format) {
	let name = "image";
	try {
		const parts = new URL(url).pathname.split("/");
		const last = parts[parts.length - 1];
		if (last && last.includes(".")) name = last.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "image";
	} catch {}
	return `${name}-${Date.now()}.${format}`;
}
var Route$3 = createFileRoute("/api/admin/media")({ server: { handlers: {
	POST: async ({ request }) => {
		try {
			await requireAdmin(request);
			const formData = await request.formData();
			const action = formData.get("action");
			if (action === "upload") {
				const file = formData.get("file");
				const storyId = formData.get("storyId");
				const assetType = formData.get("assetType") || "other";
				const title = formData.get("title") || file.name;
				const chapterId = formData.get("chapterId") || null;
				const sceneId = formData.get("sceneId") || null;
				const characterId = formData.get("characterId") || null;
				const locationId = formData.get("locationId") || null;
				const description = formData.get("description") || null;
				const prompt = formData.get("prompt") || null;
				if (!file || !storyId) return new Response(JSON.stringify({ error: "file and storyId required" }), { status: 400 });
				const buffer = await file.arrayBuffer();
				const path = buildStoragePath({
					storyId,
					kind: "uploads",
					filename: sanitizeFilename(file.name)
				});
				await ensureBucket("story-assets");
				const upload = await uploadToStorage(path, buffer, file.type);
				if ("error" in upload) return new Response(JSON.stringify({ error: upload.error }), { status: 500 });
				const { data: asset, error: insertErr } = await supabaseAdmin.from("media_assets").insert({
					story_id: storyId,
					chapter_id: chapterId,
					scene_id: sceneId,
					character_id: characterId,
					location_id: locationId,
					asset_type: assetType,
					title,
					description,
					prompt,
					source_type: "upload",
					original_storage_path: upload.path,
					public_url: upload.publicUrl,
					status: "ready",
					version: 1,
					approved: false
				}).select().single();
				if (insertErr) return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
				return new Response(JSON.stringify({
					success: true,
					asset
				}), { status: 200 });
			}
			if (action === "import_url") {
				const url = formData.get("url");
				const storyId = formData.get("storyId");
				const assetType = formData.get("assetType") || "other";
				const title = formData.get("title") || "Imported image";
				const chapterId = formData.get("chapterId") || null;
				const sceneId = formData.get("sceneId") || null;
				const characterId = formData.get("characterId") || null;
				const locationId = formData.get("locationId") || null;
				const description = formData.get("description") || null;
				const prompt = formData.get("prompt") || null;
				if (!url || !storyId) return new Response(JSON.stringify({ error: "url and storyId required" }), { status: 400 });
				const imported = await importExternalImage(url);
				if (!imported.ok) return new Response(JSON.stringify({ error: imported.error }), { status: 400 });
				const path = buildStoragePath({
					storyId,
					kind: "uploads",
					filename: sanitizeImportFilename(url, imported.format)
				});
				await ensureBucket("story-assets");
				const upload = await uploadToStorage(path, imported.data, imported.contentType);
				if ("error" in upload) return new Response(JSON.stringify({ error: upload.error }), { status: 500 });
				const { data: asset, error: insertErr } = await supabaseAdmin.from("media_assets").insert({
					story_id: storyId,
					chapter_id: chapterId,
					scene_id: sceneId,
					character_id: characterId,
					location_id: locationId,
					asset_type: assetType,
					title,
					description,
					prompt,
					source_type: "external_url",
					source_url: url,
					original_storage_path: upload.path,
					public_url: upload.publicUrl,
					width: imported.width || null,
					height: imported.height || null,
					format: imported.format,
					file_size: imported.fileSize,
					status: "ready",
					version: 1,
					approved: false
				}).select().single();
				if (insertErr) return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 });
				return new Response(JSON.stringify({
					success: true,
					asset
				}), { status: 200 });
			}
			return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
		} catch (e) {
			if (e instanceof Response) return e;
			return new Response(JSON.stringify({ error: e.message || "Internal error" }), { status: 500 });
		}
	},
	GET: async ({ request }) => {
		try {
			await requireAdmin(request);
			const url = new URL(request.url);
			const storyId = url.searchParams.get("storyId") || void 0;
			const chapterId = url.searchParams.get("chapterId") || void 0;
			const sceneId = url.searchParams.get("sceneId") || void 0;
			const characterId = url.searchParams.get("characterId") || void 0;
			const locationId = url.searchParams.get("locationId") || void 0;
			const assetType = url.searchParams.get("assetType") || void 0;
			const status = url.searchParams.get("status") || void 0;
			const search = url.searchParams.get("search") || void 0;
			const page = parseInt(url.searchParams.get("page") || "1");
			const limit = parseInt(url.searchParams.get("limit") || "24");
			let query = supabaseAdmin.from("media_assets").select("*, story:stories(id,title,slug)", { count: "exact" });
			if (storyId) query = query.eq("story_id", storyId);
			if (chapterId) query = query.eq("chapter_id", chapterId);
			if (sceneId) query = query.eq("scene_id", sceneId);
			if (characterId) query = query.eq("character_id", characterId);
			if (locationId) query = query.eq("location_id", locationId);
			if (assetType) query = query.eq("asset_type", assetType);
			if (status) query = query.eq("status", status);
			if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
			const from = (page - 1) * limit;
			query = query.order("created_at", { ascending: false }).range(from, from + limit - 1);
			const { data, error, count } = await query;
			if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
			return new Response(JSON.stringify({
				data,
				count,
				page,
				limit
			}), { status: 200 });
		} catch (e) {
			if (e instanceof Response) return e;
			return new Response(JSON.stringify({ error: e.message }), { status: 500 });
		}
	}
} } });
var Route$2 = createFileRoute("/api/analytics/role")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
		if (!token) return new Response(JSON.stringify({ actorType: "public" }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const { supabaseAdmin } = await import("./client.server-CDHq_IZH.mjs");
		const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
		if (userError || !user?.id) return new Response(JSON.stringify({ actorType: "public" }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const { data: roleData, error: roleError } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
		if (roleError) return new Response(JSON.stringify({ actorType: "public" }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const isAdmin = roleData?.role === "admin";
		return new Response(JSON.stringify({ actorType: isAdmin ? "admin" : "public" }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch {
		return new Response(JSON.stringify({ error: "Internal error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$1 = createFileRoute("/api/admin/media/$assetId")({ server: { handlers: {
	POST: async ({ request, params }) => {
		try {
			await requireAdmin(request);
			const { assetId } = params;
			const body = await request.json();
			const action = body.action;
			if (action === "approve") {
				const { error } = await supabaseAdmin.from("media_assets").update({
					status: "approved",
					approved: true,
					approved_by: body.userId,
					approved_at: (/* @__PURE__ */ new Date()).toISOString()
				}).eq("id", assetId);
				if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
				return new Response(JSON.stringify({ success: true }), { status: 200 });
			}
			if (action === "reject") {
				const { error } = await supabaseAdmin.from("media_assets").update({
					status: "rejected",
					approved: false
				}).eq("id", assetId);
				if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
				return new Response(JSON.stringify({ success: true }), { status: 200 });
			}
			if (action === "archive") {
				const { error } = await supabaseAdmin.from("media_assets").update({ status: "archived" }).eq("id", assetId);
				if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
				return new Response(JSON.stringify({ success: true }), { status: 200 });
			}
			if (action === "publish") {
				const { error } = await supabaseAdmin.from("media_assets").update({ status: "published" }).eq("id", assetId);
				if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
				return new Response(JSON.stringify({ success: true }), { status: 200 });
			}
			return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
		} catch (e) {
			if (e instanceof Response) return e;
			return new Response(JSON.stringify({ error: e.message }), { status: 500 });
		}
	},
	DELETE: async ({ request, params }) => {
		try {
			await requireAdmin(request);
			const { assetId } = params;
			const { data: asset } = await supabaseAdmin.from("media_assets").select("original_storage_path, processed_storage_path, thumbnail_storage_path").eq("id", assetId).single();
			if (asset) {
				const paths = [
					asset.original_storage_path,
					asset.processed_storage_path,
					asset.thumbnail_storage_path
				].filter(Boolean);
				for (const p of paths) await deleteFromStorage(p);
			}
			const { error } = await supabaseAdmin.from("media_assets").delete().eq("id", assetId);
			if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
			return new Response(JSON.stringify({ success: true }), { status: 200 });
		} catch (e) {
			if (e instanceof Response) return e;
			return new Response(JSON.stringify({ error: e.message }), { status: 500 });
		}
	}
} } });
var $$splitComponentImporter = () => import("./story._slug.chapter._chapterNumber-CPPqMu7c.mjs");
var Route = createFileRoute("/story/$slug/chapter/$chapterNumber")({
	loader: async ({ params }) => {
		const data = await fetchChapter({ data: {
			slug: params.slug,
			chapterNumber: Number(params.chapterNumber)
		} });
		if (!data || !data.chapter) throw notFound();
		return {
			...data,
			chapter: data.chapter
		};
	},
	head: ({ params, loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Chapter unavailable | Taleon Media" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { story, chapter } = loaderData;
		const title = `${story.title} — Chapter ${chapter.chapter_number} | Taleon Media`;
		const description = `Read Chapter ${chapter.chapter_number}, "${chapter.title}", of ${story.title} on Taleon Media.`;
		const url = `/story/${params.slug}/chapter/${params.chapterNumber}`;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: url
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$37.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$38
});
var AuthenticatedRouteRoute = Route$36.update({
	id: "/_authenticated",
	getParentRoute: () => Route$38
});
var AboutRoute = Route$35.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$38
});
var AudioRoute = Route$34.update({
	id: "/audio",
	path: "/audio",
	getParentRoute: () => Route$38
});
var ContactRoute = Route$33.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$38
});
var CookiesRoute = Route$32.update({
	id: "/cookies",
	path: "/cookies",
	getParentRoute: () => Route$38
});
var CopyrightRoute = Route$31.update({
	id: "/copyright",
	path: "/copyright",
	getParentRoute: () => Route$38
});
var GenresRoute = Route$30.update({
	id: "/genres",
	path: "/genres",
	getParentRoute: () => Route$38
});
var LoginRoute = Route$29.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$38
});
var PricingRoute = Route$28.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$38
});
var PrivacyRoute = Route$27.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$38
});
var SearchRoute = Route$26.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$38
});
var SignupRoute = Route$25.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$38
});
var StoriesRoute = Route$24.update({
	id: "/stories",
	path: "/stories",
	getParentRoute: () => Route$38
});
var TermsRoute = Route$23.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$38
});
var WatchRoute = Route$22.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => Route$38
});
var AuthenticatedAccountRoute = Route$21.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$20.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiContactRoute = Route$19.update({
	id: "/api/contact",
	path: "/api/contact",
	getParentRoute: () => Route$38
});
var ApiNewsletterRoute = Route$18.update({
	id: "/api/newsletter",
	path: "/api/newsletter",
	getParentRoute: () => Route$38
});
var StorySlugRoute = Route$17.update({
	id: "/story/$slug",
	path: "/story/$slug",
	getParentRoute: () => Route$38
});
var AuthenticatedAdminIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAnalyticsRoute = Route$15.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminChaptersRoute = Route$14.update({
	id: "/chapters",
	path: "/chapters",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminCharactersRoute = Route$13.update({
	id: "/characters",
	path: "/characters",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminContactsRoute = Route$12.update({
	id: "/contacts",
	path: "/contacts",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminGenresRoute = Route$11.update({
	id: "/genres",
	path: "/genres",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminLocationsRoute = Route$10.update({
	id: "/locations",
	path: "/locations",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminMediaRoute = Route$9.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminNewsletterRoute = Route$8.update({
	id: "/newsletter",
	path: "/newsletter",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminPromptsRoute = Route$7.update({
	id: "/prompts",
	path: "/prompts",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminScenesRoute = Route$6.update({
	id: "/scenes",
	path: "/scenes",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminStoriesRoute = Route$5.update({
	id: "/stories",
	path: "/stories",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminUsersRoute = Route$4.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AuthenticatedAdminRoute
});
var ApiAdminMediaRoute = Route$3.update({
	id: "/api/admin/media",
	path: "/api/admin/media",
	getParentRoute: () => Route$38
});
var ApiAnalyticsRoleRouteRoute = Route$2.update({
	id: "/api/analytics/role",
	path: "/api/analytics/role",
	getParentRoute: () => Route$38
});
var ApiAdminMediaAssetIdRoute = Route$1.update({
	id: "/$assetId",
	path: "/$assetId",
	getParentRoute: () => ApiAdminMediaRoute
});
var StorySlugChapterChapterNumberRoute = Route.update({
	id: "/chapter/$chapterNumber",
	path: "/chapter/$chapterNumber",
	getParentRoute: () => StorySlugRoute
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminAnalyticsRoute,
	AuthenticatedAdminChaptersRoute,
	AuthenticatedAdminCharactersRoute,
	AuthenticatedAdminContactsRoute,
	AuthenticatedAdminGenresRoute,
	AuthenticatedAdminLocationsRoute,
	AuthenticatedAdminMediaRoute,
	AuthenticatedAdminNewsletterRoute,
	AuthenticatedAdminPromptsRoute,
	AuthenticatedAdminScenesRoute,
	AuthenticatedAdminStoriesRoute,
	AuthenticatedAdminUsersRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAccountRoute,
	AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren)
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var StorySlugRouteChildren = { StorySlugChapterChapterNumberRoute };
var StorySlugRouteWithChildren = StorySlugRoute._addFileChildren(StorySlugRouteChildren);
var ApiAdminMediaRouteChildren = { ApiAdminMediaAssetIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AboutRoute,
	AudioRoute,
	ContactRoute,
	CookiesRoute,
	CopyrightRoute,
	GenresRoute,
	LoginRoute,
	PricingRoute,
	PrivacyRoute,
	SearchRoute,
	SignupRoute,
	StoriesRoute,
	TermsRoute,
	WatchRoute,
	ApiContactRoute,
	ApiNewsletterRoute,
	StorySlugRoute: StorySlugRouteWithChildren,
	ApiAnalyticsRoleRouteRoute,
	ApiAdminMediaRoute: ApiAdminMediaRoute._addFileChildren(ApiAdminMediaRouteChildren)
};
var routeTree = Route$38._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 0,
		gcTime: 3e4,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		retry: 1
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$26 as a, Route$37 as c, track as d, trackChapterProgress as f, Route$24 as i, router_WzjKqw9S_exports as l, Route$17 as n, Route$30 as o, useSession as p, Route$22 as r, Route$34 as s, Route as t, supabaseAdmin as u };
