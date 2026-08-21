import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Outlet, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { t as supabase } from "./client-DpjBY_Px.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { A as Image, C as Newspaper, D as MapPin, G as ChartColumn, N as FolderTree, O as Mail, P as Film, a as User, i as Users, n as WandSparkles, q as BookOpen } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-KieW4Mso.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABLE_INVALIDATION_MAP = {
	stories: [
		["admin", "stories"],
		["admin", "counts"],
		["home"],
		["stories"]
	],
	chapters: [
		["admin", "chapters"],
		["admin", "stories"],
		["admin", "counts"],
		["story"],
		["chapter"]
	],
	genres: [
		["admin", "genres"],
		["genres"],
		["stories"],
		["home"]
	],
	media_assets: [["admin", "media"]],
	analytics_events: [["admin", "analytics"]],
	newsletter_subscribers: [["admin", "newsletter"]],
	contact_submissions: [["admin", "contacts"]],
	profiles: [["admin", "users"], ["admin", "counts"]],
	user_roles: [["admin", "users"], ["admin", "counts"]]
};
function useRealtimeAdmin(tables) {
	const qc = useQueryClient();
	const id = (0, import_react.useRef)(`admin-realtime-${Math.random().toString(36).slice(2, 11)}`).current;
	(0, import_react.useEffect)(() => {
		const channels = tables.map((table) => {
			const queryKeys = TABLE_INVALIDATION_MAP[table] ?? [];
			return supabase.channel(`${id}-${table}`).on("postgres_changes", {
				event: "*",
				schema: "public",
				table
			}, () => {
				for (const key of queryKeys) qc.invalidateQueries({ queryKey: key });
			}).subscribe();
		});
		return () => {
			for (const ch of channels) try {
				supabase.removeChannel(ch);
			} catch {}
		};
	}, [qc, tables.join(",")]);
}
var NAV_ITEMS = [
	{
		label: "Dashboard",
		icon: ChartColumn,
		to: "/admin",
		color: "bg-indigo-500/10 text-indigo-400"
	},
	{
		label: "Stories",
		icon: BookOpen,
		to: "/admin/stories",
		color: "bg-blue-500/10 text-blue-400"
	},
	{
		label: "Chapters",
		icon: BookOpen,
		to: "/admin/chapters",
		color: "bg-sky-500/10 text-sky-400"
	},
	{
		label: "Media",
		icon: Image,
		to: "/admin/media",
		color: "bg-purple-500/10 text-purple-400"
	},
	{
		label: "Scenes",
		icon: Film,
		to: "/admin/scenes",
		color: "bg-amber-500/10 text-amber-400"
	},
	{
		label: "Characters",
		icon: User,
		to: "/admin/characters",
		color: "bg-cyan-500/10 text-cyan-400"
	},
	{
		label: "Locations",
		icon: MapPin,
		to: "/admin/locations",
		color: "bg-emerald-500/10 text-emerald-400"
	},
	{
		label: "Prompts",
		icon: WandSparkles,
		to: "/admin/prompts",
		color: "bg-rose-500/10 text-rose-400"
	},
	{
		label: "Analytics",
		icon: ChartColumn,
		to: "/admin/analytics",
		color: "bg-green-500/10 text-green-400"
	},
	{
		label: "Genres",
		icon: FolderTree,
		to: "/admin/genres",
		color: "bg-violet-500/10 text-violet-400"
	},
	{
		label: "Users",
		icon: Users,
		to: "/admin/users",
		color: "bg-orange-500/10 text-orange-400"
	},
	{
		label: "Contacts",
		icon: Mail,
		to: "/admin/contacts",
		color: "bg-teal-500/10 text-teal-400"
	},
	{
		label: "Newsletter",
		icon: Newspaper,
		to: "/admin/newsletter",
		color: "bg-pink-500/10 text-pink-400"
	}
];
function AdminLayout() {
	const { isAdmin, loading } = useSession();
	useRealtimeAdmin([
		"stories",
		"chapters",
		"profiles",
		"analytics_events"
	]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex flex-wrap gap-2 py-6",
			children: NAV_ITEMS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				activeOptions: { exact: item.to === "/admin" },
				activeProps: { className: "border-gold bg-gold/10 text-gold" },
				className: "flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:border-gold/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-md p-1 ${item.color}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: item.label
				})]
			}, item.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	});
}
//#endregion
export { AdminLayout as component };
