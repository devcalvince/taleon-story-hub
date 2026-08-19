import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Table = "stories" | "chapters" | "genres" | "media_assets" | "analytics_events" | "newsletter_subscribers" | "contact_submissions" | "profiles" | "user_roles";

const TABLE_INVALIDATION_MAP: Record<Table, string[][]> = {
  stories: [["admin", "stories"], ["admin", "counts"], ["home"], ["stories"]],
  chapters: [["admin", "chapters"], ["admin", "stories"], ["admin", "counts"], ["story"], ["chapter"]],
  genres: [["admin", "genres"], ["genres"], ["stories"], ["home"]],
  media_assets: [["admin", "media"]],
  analytics_events: [["admin", "analytics"]],
  newsletter_subscribers: [["admin", "newsletter"]],
  contact_submissions: [["admin", "contacts"]],
  profiles: [["admin", "users"], ["admin", "counts"]],
  user_roles: [["admin", "users"], ["admin", "counts"]],
};

export function useRealtimeAdmin(tables: Table[]) {
  const qc = useQueryClient();

  useEffect(() => {
    const channels = tables.map((table) => {
      const queryKeys = TABLE_INVALIDATION_MAP[table] ?? [];

      const channel = supabase
        .channel(`admin-${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            for (const key of queryKeys) {
              qc.invalidateQueries({ queryKey: key });
            }
          },
        )
        .subscribe();

      return channel;
    });

    return () => {
      for (const ch of channels) {
        supabase.removeChannel(ch);
      }
    };
  }, [qc, tables.join(",")]);
}
