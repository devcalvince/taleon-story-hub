import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { deleteFromStorage } from "@/lib/storage";

export const Route = createFileRoute("/api/admin/media/$assetId")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const { assetId } = params;
          const body = await request.json();
          const action = body.action;

          if (action === "approve") {
            const { error } = await supabaseAdmin
              .from("media_assets")
              .update({ status: "approved" as any, approved: true, approved_by: body.userId, approved_at: new Date().toISOString() } as any)
              .eq("id", assetId);
            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
          }

          if (action === "reject") {
            const { error } = await supabaseAdmin
              .from("media_assets")
              .update({ status: "rejected" as any, approved: false } as any)
              .eq("id", assetId);
            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
          }

          if (action === "archive") {
            const { error } = await supabaseAdmin
              .from("media_assets")
              .update({ status: "archived" as any } as any)
              .eq("id", assetId);
            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
          }

          if (action === "publish") {
            const { error } = await supabaseAdmin
              .from("media_assets")
              .update({ status: "published" as any } as any)
              .eq("id", assetId);
            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
          }

          return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
      },

      DELETE: async ({ params }) => {
        try {
          const { assetId } = params;

          const { data: asset } = await supabaseAdmin
            .from("media_assets")
            .select("original_storage_path, processed_storage_path, thumbnail_storage_path")
            .eq("id", assetId)
            .single();

          if (asset) {
            const paths = [asset.original_storage_path, asset.processed_storage_path, asset.thumbnail_storage_path].filter(Boolean);
            for (const p of paths) await deleteFromStorage(p!);
          }

          const { error } = await supabaseAdmin
            .from("media_assets")
            .delete()
            .eq("id", assetId);

          if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
          return new Response(JSON.stringify({ success: true }), { status: 200 });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
      },
    },
  },
});
