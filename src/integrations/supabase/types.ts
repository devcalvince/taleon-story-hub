export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      analytics_events: {
        Row: {
          chapter_id: string | null;
          created_at: string;
          actor_type: "public" | "admin" | "system";
          event_name: string;
          id: number;
          metadata: Json;
          story_id: string | null;
          user_id: string | null;
          anonymous_id: string | null;
          attribution: Json;
          funnel_stage: string | null;
          referrer: string | null;
          device: string | null;
          country: string | null;
        };
        Insert: {
          chapter_id?: string | null;
          created_at?: string;
          actor_type?: "public" | "admin" | "system";
          event_name: string;
          id?: number;
          metadata?: Json;
          story_id?: string | null;
          user_id?: string | null;
          anonymous_id?: string | null;
          attribution?: Json;
          funnel_stage?: string | null;
          referrer?: string | null;
          device?: string | null;
          country?: string | null;
        };
        Update: {
          chapter_id?: string | null;
          created_at?: string;
          event_name?: string;
          id?: number;
          metadata?: Json;
          story_id?: string | null;
          user_id?: string | null;
          anonymous_id?: string | null;
          attribution?: Json;
          funnel_stage?: string | null;
          referrer?: string | null;
          device?: string | null;
          country?: string | null;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          chapter_id: string | null;
          created_at: string;
          story_id: string;
          user_id: string;
        };
        Insert: {
          chapter_id?: string | null;
          created_at?: string;
          story_id: string;
          user_id: string;
        };
        Update: {
          chapter_id?: string | null;
          created_at?: string;
          story_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookmarks_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters: {
        Row: {
          audio_url: string | null;
          chapter_number: number;
          content: string;
          created_at: string;
          id: string;
          is_premium: boolean;
          is_published: boolean;
          listens: number;
          published_at: string;
          reads: number;
          scene_image_url: string | null;
          story_id: string;
          title: string;
          updated_at: string;
          video_url: string | null;
          views: number;
          word_count: number;
        };
        Insert: {
          audio_url?: string | null;
          chapter_number: number;
          content?: string;
          created_at?: string;
          id?: string;
          is_premium?: boolean;
          is_published?: boolean;
          listens?: number;
          published_at?: string;
          reads?: number;
          scene_image_url?: string | null;
          story_id: string;
          title: string;
          updated_at?: string;
          video_url?: string | null;
          views?: number;
          word_count?: number;
        };
        Update: {
          audio_url?: string | null;
          chapter_number?: number;
          content?: string;
          created_at?: string;
          id?: string;
          is_premium?: boolean;
          is_published?: boolean;
          listens?: number;
          published_at?: string;
          reads?: number;
          scene_image_url?: string | null;
          story_id?: string;
          title?: string;
          updated_at?: string;
          video_url?: string | null;
          views?: number;
          word_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      characters: {
        Row: {
          age: string | null;
          appearance: string | null;
          bio: string | null;
          clothing: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          notes: string | null;
          personality: string | null;
          reference_image_url: string | null;
          role: string | null;
          sort_order: number;
          story_id: string;
          visual_prompt: string | null;
        };
        Insert: {
          age?: string | null;
          appearance?: string | null;
          bio?: string | null;
          clothing?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          notes?: string | null;
          personality?: string | null;
          reference_image_url?: string | null;
          role?: string | null;
          sort_order?: number;
          story_id: string;
          visual_prompt?: string | null;
        };
        Update: {
          age?: string | null;
          appearance?: string | null;
          bio?: string | null;
          clothing?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          notes?: string | null;
          personality?: string | null;
          reference_image_url?: string | null;
          role?: string | null;
          sort_order?: number;
          story_id?: string;
          visual_prompt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "characters_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_submissions: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: string;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: string;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: string;
          subject?: string | null;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          created_at: string;
          story_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          story_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          story_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "follows_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      generation_jobs: {
        Row: {
          actual_cost: number | null;
          chapter_id: string | null;
          completed_at: string | null;
          created_at: string;
          created_by: string | null;
          currency: string | null;
          error_message: string | null;
          estimated_cost: number | null;
          generation_duration_ms: number | null;
          id: string;
          media_asset_id: string | null;
          model: string | null;
          progress: number | null;
          prompt: string;
          provider: string;
          scene_id: string | null;
          started_at: string | null;
          status: Database["public"]["Enums"]["generation_job_status"];
          story_id: string | null;
          updated_at: string;
        };
        Insert: {
          actual_cost?: number | null;
          chapter_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string | null;
          error_message?: string | null;
          estimated_cost?: number | null;
          generation_duration_ms?: number | null;
          id?: string;
          media_asset_id?: string | null;
          model?: string | null;
          progress?: number | null;
          prompt: string;
          provider?: string;
          scene_id?: string | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["generation_job_status"];
          story_id?: string | null;
          updated_at?: string;
        };
        Update: {
          actual_cost?: number | null;
          chapter_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string | null;
          error_message?: string | null;
          estimated_cost?: number | null;
          generation_duration_ms?: number | null;
          id?: string;
          media_asset_id?: string | null;
          model?: string | null;
          progress?: number | null;
          prompt?: string;
          provider?: string;
          scene_id?: string | null;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["generation_job_status"];
          story_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generation_jobs_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_jobs_media_asset_id_fkey";
            columns: ["media_asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_jobs_scene_id_fkey";
            columns: ["scene_id"];
            isOneToOne: false;
            referencedRelation: "scenes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_jobs_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      genres: {
        Row: {
          accent: string;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          accent?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: {
          accent?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      listening_progress: {
        Row: {
          chapter_id: string;
          completed: boolean;
          position_seconds: number;
          story_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          chapter_id: string;
          completed?: boolean;
          position_seconds?: number;
          story_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          chapter_id?: string;
          completed?: boolean;
          position_seconds?: number;
          story_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listening_progress_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listening_progress_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      locations: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          notes: string | null;
          reference_image_url: string | null;
          story_id: string;
          updated_at: string;
          visual_prompt: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          reference_image_url?: string | null;
          story_id: string;
          updated_at?: string;
          visual_prompt?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          reference_image_url?: string | null;
          story_id?: string;
          updated_at?: string;
          visual_prompt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "locations_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      media_assets: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          approved_by: string | null;
          asset_type: Database["public"]["Enums"]["asset_type"];
          chapter_id: string | null;
          character_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          file_size: number | null;
          format: string | null;
          height: number | null;
          id: string;
          location_id: string | null;
          model: string | null;
          negative_prompt: string | null;
          original_storage_path: string | null;
          processed_storage_path: string | null;
          prompt: string | null;
          provider: string;
          public_url: string | null;
          scene_id: string | null;
          source_type: Database["public"]["Enums"]["source_type"];
          source_url: string | null;
          status: Database["public"]["Enums"]["asset_status"];
          story_id: string | null;
          thumbnail_storage_path: string | null;
          title: string;
          updated_at: string;
          version: number;
          width: number | null;
        };
        Insert: {
          approved?: boolean;
          approved_at?: string | null;
          approved_by?: string | null;
          asset_type?: Database["public"]["Enums"]["asset_type"];
          chapter_id?: string | null;
          character_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_size?: number | null;
          format?: string | null;
          height?: number | null;
          id?: string;
          location_id?: string | null;
          model?: string | null;
          negative_prompt?: string | null;
          original_storage_path?: string | null;
          processed_storage_path?: string | null;
          prompt?: string | null;
          provider?: string;
          public_url?: string | null;
          scene_id?: string | null;
          source_type?: Database["public"]["Enums"]["source_type"];
          source_url?: string | null;
          status?: Database["public"]["Enums"]["asset_status"];
          story_id?: string | null;
          thumbnail_storage_path?: string | null;
          title: string;
          updated_at?: string;
          version?: number;
          width?: number | null;
        };
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          approved_by?: string | null;
          asset_type?: Database["public"]["Enums"]["asset_type"];
          chapter_id?: string | null;
          character_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_size?: number | null;
          format?: string | null;
          height?: number | null;
          id?: string;
          location_id?: string | null;
          model?: string | null;
          negative_prompt?: string | null;
          original_storage_path?: string | null;
          processed_storage_path?: string | null;
          prompt?: string | null;
          provider?: string;
          public_url?: string | null;
          scene_id?: string | null;
          source_type?: Database["public"]["Enums"]["source_type"];
          source_url?: string | null;
          status?: Database["public"]["Enums"]["asset_status"];
          story_id?: string | null;
          thumbnail_storage_path?: string | null;
          title?: string;
          updated_at?: string;
          version?: number;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_scene_id_fkey";
            columns: ["scene_id"];
            isOneToOne: false;
            referencedRelation: "scenes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          email: string;
          id: string;
          is_active: boolean;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          email: string;
          id?: string;
          is_active?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          email?: string;
          id?: string;
          is_active?: boolean;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      production_config: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      reading_progress: {
        Row: {
          chapter_id: string | null;
          chapter_number: number;
          completed: boolean;
          percent: number;
          story_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          chapter_id?: string | null;
          chapter_number?: number;
          completed?: boolean;
          percent?: number;
          story_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          chapter_id?: string | null;
          chapter_number?: number;
          completed?: boolean;
          percent?: number;
          story_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reading_progress_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_progress_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      scenes: {
        Row: {
          camera_direction: string | null;
          chapter_id: string;
          characters_in_scene: string | null;
          created_at: string;
          description: string | null;
          id: string;
          lighting_direction: string | null;
          location_name: string | null;
          mood: string | null;
          scene_number: number;
          status: Database["public"]["Enums"]["asset_status"];
          title: string;
          updated_at: string;
          visual_prompt: string | null;
        };
        Insert: {
          camera_direction?: string | null;
          chapter_id: string;
          characters_in_scene?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          lighting_direction?: string | null;
          location_name?: string | null;
          mood?: string | null;
          scene_number: number;
          status?: Database["public"]["Enums"]["asset_status"];
          title: string;
          updated_at?: string;
          visual_prompt?: string | null;
        };
        Update: {
          camera_direction?: string | null;
          chapter_id?: string;
          characters_in_scene?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          lighting_direction?: string | null;
          location_name?: string | null;
          mood?: string | null;
          scene_number?: number;
          status?: Database["public"]["Enums"]["asset_status"];
          title?: string;
          updated_at?: string;
          visual_prompt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "scenes_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      stories: {
        Row: {
          author: string;
          banner_url: string | null;
          cover_url: string | null;
          created_at: string;
          description: string | null;
          has_audio: boolean;
          has_video: boolean;
          id: string;
          is_featured: boolean;
          is_original: boolean;
          is_premium: boolean;
          is_published: boolean;
          listens: number;
          published_at: string;
          rating: number;
          reads: number;
          short_description: string | null;
          slug: string;
          status: Database["public"]["Enums"]["story_status"];
          title: string;
          trending_score: number;
          updated_at: string;
          views: number;
          watch_count: number;
        };
        Insert: {
          author?: string;
          banner_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          has_audio?: boolean;
          has_video?: boolean;
          id?: string;
          is_featured?: boolean;
          is_original?: boolean;
          is_premium?: boolean;
          is_published?: boolean;
          listens?: number;
          published_at?: string;
          rating?: number;
          reads?: number;
          short_description?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["story_status"];
          title: string;
          trending_score?: number;
          updated_at?: string;
          views?: number;
          watch_count?: number;
        };
        Update: {
          author?: string;
          banner_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          description?: string | null;
          has_audio?: boolean;
          has_video?: boolean;
          id?: string;
          is_featured?: boolean;
          is_original?: boolean;
          is_premium?: boolean;
          is_published?: boolean;
          listens?: number;
          published_at?: string;
          rating?: number;
          reads?: number;
          short_description?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["story_status"];
          title?: string;
          trending_score?: number;
          updated_at?: string;
          views?: number;
          watch_count?: number;
        };
        Relationships: [];
      };
      story_genres: {
        Row: {
          genre_id: string;
          story_id: string;
        };
        Insert: {
          genre_id: string;
          story_id: string;
        };
        Update: {
          genre_id?: string;
          story_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_genres_genre_id_fkey";
            columns: ["genre_id"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "story_genres_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          created_at: string;
          description: string | null;
          duration_seconds: number | null;
          id: string;
          is_published: boolean;
          kind: string;
          story_id: string | null;
          thumbnail_url: string | null;
          title: string;
          video_url: string | null;
          views: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          id?: string;
          is_published?: boolean;
          kind?: string;
          story_id?: string | null;
          thumbnail_url?: string | null;
          title: string;
          video_url?: string | null;
          views?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          duration_seconds?: number | null;
          id?: string;
          is_published?: boolean;
          kind?: string;
          story_id?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          video_url?: string | null;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: "videos_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      watch_history: {
        Row: {
          completed: boolean;
          position_seconds: number;
          updated_at: string;
          user_id: string;
          video_id: string;
        };
        Insert: {
          completed?: boolean;
          position_seconds?: number;
          updated_at?: string;
          user_id: string;
          video_id: string;
        };
        Update: {
          completed?: boolean;
          position_seconds?: number;
          updated_at?: string;
          user_id?: string;
          video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watch_history_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
      asset_status:
        | "draft"
        | "processing"
        | "ready"
        | "approved"
        | "published"
        | "rejected"
        | "failed"
        | "archived";
      asset_type:
        | "cover"
        | "scene"
        | "character"
        | "location"
        | "thumbnail"
        | "banner"
        | "poster"
        | "social_vertical"
        | "social_square"
        | "youtube_thumbnail"
        | "story_cinematic"
        | "story_cover"
        | "other";
      generation_job_status:
        "queued" | "generating" | "processing" | "uploading" | "completed" | "failed" | "cancelled";
      source_type: "upload" | "external_url" | "ai_generated" | "imported";
      story_status: "ongoing" | "completed" | "coming_soon";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      asset_status: [
        "draft",
        "processing",
        "ready",
        "approved",
        "published",
        "rejected",
        "failed",
        "archived",
        "deleted",
      ],
      asset_type: [
        "cover",
        "scene",
        "character",
        "location",
        "thumbnail",
        "banner",
        "poster",
        "social_vertical",
        "social_square",
        "youtube_thumbnail",
        "story_cinematic",
        "story_cover",
        "other",
      ],
      generation_job_status: [
        "queued",
        "generating",
        "processing",
        "uploading",
        "completed",
        "failed",
        "cancelled",
      ],
      source_type: ["upload", "external_url", "ai_generated", "imported"],
      story_status: ["ongoing", "completed", "coming_soon"],
    },
  },
} as const;
