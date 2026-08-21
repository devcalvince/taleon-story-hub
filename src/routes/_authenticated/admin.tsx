import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useSession } from "@/hooks/useSession";
import { useRealtimeAdmin } from "@/hooks/useRealtimeAdmin";
import { EmptyState } from "@/components/site/Section";
import {
  BarChart3,
  BookOpen,
  FolderTree,
  Image,
  Mail,
  MapPin,
  Newspaper,
  User,
  Users,
  Wand2,
  Film,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Taleon Media" },
      { name: "description", content: "Taleon Media administration dashboard." },
      { property: "og:title", content: "Admin | Taleon Media" },
      { property: "og:description", content: "Taleon Media administration dashboard." },
      { property: "og:url", content: "/admin" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminLayout,
});

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: BarChart3,
    to: "/admin" as const,
    color: "bg-indigo-500/10 text-indigo-400",
  },
  {
    label: "Stories",
    icon: BookOpen,
    to: "/admin/stories" as const,
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    label: "Chapters",
    icon: BookOpen,
    to: "/admin/chapters" as const,
    color: "bg-sky-500/10 text-sky-400",
  },
  {
    label: "Media",
    icon: Image,
    to: "/admin/media" as const,
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    label: "Scenes",
    icon: Film,
    to: "/admin/scenes" as const,
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    label: "Characters",
    icon: User,
    to: "/admin/characters" as const,
    color: "bg-cyan-500/10 text-cyan-400",
  },
  {
    label: "Locations",
    icon: MapPin,
    to: "/admin/locations" as const,
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    label: "Prompts",
    icon: Wand2,
    to: "/admin/prompts" as const,
    color: "bg-rose-500/10 text-rose-400",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    to: "/admin/analytics" as const,
    color: "bg-green-500/10 text-green-400",
  },
  {
    label: "Genres",
    icon: FolderTree,
    to: "/admin/genres" as const,
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    label: "Users",
    icon: Users,
    to: "/admin/users" as const,
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    label: "Contacts",
    icon: Mail,
    to: "/admin/contacts" as const,
    color: "bg-teal-500/10 text-teal-400",
  },
  {
    label: "Newsletter",
    icon: Newspaper,
    to: "/admin/newsletter" as const,
    color: "bg-pink-500/10 text-pink-400",
  },
];

function AdminLayout() {
  const { isAdmin, loading } = useSession();

  useRealtimeAdmin(["stories", "chapters", "profiles", "analytics_events"]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6">
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <EmptyState title="Admins only" body="This area is restricted to Taleon administrators.">
          <Link to="/account" className="rounded-md border border-border px-5 py-2.5 text-sm">
            Back to my library
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      {/* Admin Nav Bar */}
      <nav className="flex flex-wrap gap-2 py-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.to === "/admin" }}
            activeProps={{ className: "border-gold bg-gold/10 text-gold" }}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm transition-colors hover:border-gold/50"
          >
            <div className={`rounded-md p-1 ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Child Route Content */}
      <Outlet />
    </div>
  );
}
