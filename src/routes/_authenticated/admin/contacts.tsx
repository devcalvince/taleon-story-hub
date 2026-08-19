import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAdminContacts } from "@/hooks/use-admin-data";
import { queryKeys } from "@/lib/query-keys";
import { PageHeader, EmptyState } from "@/components/site/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, CheckCircle, Clock, Reply } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  head: () => ({
    meta: [
      { title: "Contact Submissions | Taleon Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminContactsPage,
});

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
}

function AdminContactsPage() {
  const { isAdmin, loading } = useSession();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const { query, invalidate } = useAdminContacts();
  const submissions = (query.data ?? []) as ContactSubmission[];

  const filtered = submissions.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) ||
           s.email.toLowerCase().includes(q) ||
           (s.subject?.toLowerCase().includes(q)) ||
           s.message.toLowerCase().includes(q);
  });

  const unreadCount = submissions.filter(s => s.status === "unread").length;

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("contact_submissions").update({ status: "read" }).eq("id", id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.adminContacts });
      const previous = queryClient.getQueryData<ContactSubmission[]>(queryKeys.adminContacts);
      queryClient.setQueryData<ContactSubmission[]>(queryKeys.adminContacts, (old) =>
        (old ?? []).map(s => s.id === id ? { ...s, status: "read" as const } : s)
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: "read" } : null);
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.adminContacts, context.previous);
      }
    },
    onSettled: () => {
      invalidate();
    },
  });

  const markAsRepliedMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("contact_submissions").update({ status: "replied" }).eq("id", id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.adminContacts });
      const previous = queryClient.getQueryData<ContactSubmission[]>(queryKeys.adminContacts);
      queryClient.setQueryData<ContactSubmission[]>(queryKeys.adminContacts, (old) =>
        (old ?? []).map(s => s.id === id ? { ...s, status: "replied" as const } : s)
      );
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status: "replied" } : null);
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.adminContacts, context.previous);
      }
    },
    onSettled: () => {
      invalidate();
      toast.success("Marked as replied");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm("Delete this submission?")) throw new Error("Cancelled");
      await supabase.from("contact_submissions").delete().eq("id", id);
      return id;
    },
    onSuccess: (id) => {
      invalidate();
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      toast.success("Deleted");
    },
  });

  function getStatusBadge(status: string) {
    switch (status) {
      case "unread": return <Badge className="gap-1 bg-blue-500/10 text-blue-400"><Clock className="h-3 w-3" /> Unread</Badge>;
      case "read": return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Read</Badge>;
      case "replied": return <Badge className="gap-1 bg-green-500/10 text-green-400"><Reply className="h-3 w-3" /> Replied</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  }

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6">Loading…</div>;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <EmptyState title="Admins only" body="This area is restricted to Taleon administrators.">
          <Link to="/account" className="rounded-md border border-border px-5 py-2.5 text-sm">Back to my library</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Contact Submissions" lede={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}.`} />
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-20 sm:px-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search submissions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>

        {query.isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No submissions" body={searchQuery ? "Try a different search." : "No contact form submissions yet."} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-2">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSubmission(s); if (s.status === "unread") markAsReadMutation.mutate(s.id); }}
                  className={`w-full rounded-lg border border-border p-4 text-left transition-colors ${
                    selectedSubmission?.id === s.id
                      ? "border-gold/50 bg-surface-2"
                      : s.status === "unread"
                      ? "bg-surface-2/60 hover:bg-surface-2"
                      : "bg-surface-2/40 hover:bg-surface-2/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {s.status === "unread" && <div className="h-2 w-2 rounded-full bg-gold" />}
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.email}</span>
                      </div>
                      {s.subject && <p className="mt-1 text-sm text-muted-foreground truncate">{s.subject}</p>}
                      <p className="mt-1 text-xs text-muted-foreground truncate">{s.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getStatusBadge(s.status)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedSubmission ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 sticky top-24">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{selectedSubmission.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.email}</p>
                    {selectedSubmission.subject && <p className="mt-1 font-medium">{selectedSubmission.subject}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(selectedSubmission.created_at).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
                <div className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                  {selectedSubmission.message}
                </div>
                <div className="mt-6 flex gap-2">
                  <a href={`mailto:${selectedSubmission.email}`} className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-background hover:bg-gold/90">
                    Reply via Email
                  </a>
                  {selectedSubmission.status !== "replied" && (
                    <Button variant="outline" size="sm" onClick={() => markAsRepliedMutation.mutate(selectedSubmission.id)}>
                      Mark as Replied
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(selectedSubmission.id)} className="text-red-500 hover:text-red-600">
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-surface-2/40 p-12 text-muted-foreground">
                Select a submission to view
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
