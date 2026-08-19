import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminNewsletter } from "@/hooks/use-admin-data";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, UserCheck, UserX, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter Subscribers | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminNewsletterPage,
});

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
}

function AdminNewsletterPage() {
  const { isAdmin, loading } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const { query, invalidate } = useAdminNewsletter();
  const subscribers = (query.data ?? []) as Subscriber[];

  const unsubscribeMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase
        .from("newsletter_subscribers")
        .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
        .eq("id", id);
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("Subscriber removed");
    },
  });

  const resubscribeMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase
        .from("newsletter_subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", id);
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("Subscriber reactivated");
    },
  });

  const filtered = subscribers.filter((s) => {
    if (!searchQuery) return true;
    return s.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const unsubscribedCount = subscribers.filter((s) => !s.is_active).length;

  function exportCSV() {
    const headers = ["Email", "Status", "Subscribed At", "Unsubscribed At"];
    const rows = filtered.map((s) => [
      s.email,
      s.is_active ? "Active" : "Unsubscribed",
      new Date(s.subscribed_at).toISOString(),
      s.unsubscribed_at ? new Date(s.unsubscribed_at).toISOString() : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

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
      <PageHeader
        eyebrow="Admin"
        title="Newsletter Subscribers"
        lede={`${activeCount} active subscriber${activeCount !== 1 ? "s" : ""}.`}
      />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 font-display text-2xl">{subscribers.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="mt-1 font-display text-2xl text-green-400">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-xs text-muted-foreground">Unsubscribed</p>
            <p className="mt-1 font-display text-2xl text-muted-foreground">{unsubscribedCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {query.isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading subscribers...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No subscribers"
            body={searchQuery ? "Try a different search." : "No newsletter subscribers yet."}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Subscribed</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="bg-surface-2/40">
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3">
                      {s.is_active ? (
                        <Badge className="gap-1 bg-green-500/10 text-green-400">
                          <UserCheck className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <UserX className="h-3 w-3" /> Unsubscribed
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(s.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {s.is_active ? (
                        <button
                          onClick={() => unsubscribeMutation.mutate(s.id)}
                          disabled={unsubscribeMutation.isPending}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <button
                          onClick={() => resubscribeMutation.mutate(s.id)}
                          disabled={resubscribeMutation.isPending}
                          className="text-xs text-gold hover:text-gold/80"
                        >
                          Reactivate
                        </button>
                      )}
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
