import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useAdminUsers } from "@/hooks/use-admin-data";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [{ title: "Manage Users | Taleon Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { isAdmin, loading } = useSession();
  const { data: users = [], isLoading: loadingData } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.display_name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.bio?.toLowerCase().includes(q)
    );
  });

  const adminCount = users.filter((u) => u.user_roles?.some((r) => r.role === "admin")).length;
  const totalFollows = users.reduce((acc, u) => acc + (u._follows || 0), 0);
  const totalBookmarks = users.reduce((acc, u) => acc + (u._bookmarks || 0), 0);

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6">
        Loading…
      </div>
    );
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
    <>
      <PageHeader eyebrow="Admin" title="Manage Users" lede="View and manage user accounts." />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="mt-1 font-display text-2xl">{users.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Admins</p>
            <p className="mt-1 font-display text-2xl">{adminCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Total Follows</p>
            <p className="mt-1 font-display text-2xl">{totalFollows}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loadingData ? (
          <div className="text-center py-8 text-muted-foreground">Loading users...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No users found"
            body={searchQuery ? "Try a different search." : "No users have signed up yet."}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Follows</th>
                  <th className="px-4 py-3">Saved</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="bg-surface-2/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-2">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              {(u.display_name ?? u.username ?? "?")[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {u.display_name || u.username || "Anonymous"}
                          </p>
                          {u.username && (
                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.user_roles?.some((r) => r.role === "admin") ? (
                        <Badge className="gap-1">
                          <Shield className="h-3 w-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u._follows || 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u._bookmarks || 0}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
