export type MediaType = "movie" | "tv";
export type MediaStatus = "planned" | "watching" | "completed" | "dropped";

export interface Database {
  public: {
    Tables: {
      media: {
        Row: {
          id: number;
          tmdb_id: number;
          type: MediaType;
          title: string;
          poster_path: string | null;
          status: MediaStatus;
          rating: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          tmdb_id: number;
          type: MediaType;
          title: string;
          poster_path?: string | null;
          status?: MediaStatus;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          tmdb_id?: number;
          type?: MediaType;
          title?: string;
          poster_path?: string | null;
          status?: MediaStatus;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      seasons: {
        Row: {
          id: number;
          media_id: number;
          tmdb_id: number;
          season_number: number;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          media_id: number;
          tmdb_id: number;
          season_number: number;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          media_id?: number;
          tmdb_id?: number;
          season_number?: number;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "seasons_media_id_fkey";
            columns: ["media_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };
      episodes: {
        Row: {
          id: number;
          season_id: number;
          tmdb_id: number;
          episode_number: number;
          name: string | null;
          watched: boolean;
          watched_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          season_id: number;
          tmdb_id: number;
          episode_number: number;
          name?: string | null;
          watched?: boolean;
          watched_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          season_id?: number;
          tmdb_id?: number;
          episode_number?: number;
          name?: string | null;
          watched?: boolean;
          watched_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Media = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
export type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

export type Season = Database["public"]["Tables"]["seasons"]["Row"];
export type SeasonInsert = Database["public"]["Tables"]["seasons"]["Insert"];
export type SeasonUpdate = Database["public"]["Tables"]["seasons"]["Update"];

export type Episode = Database["public"]["Tables"]["episodes"]["Row"];
export type EpisodeInsert = Database["public"]["Tables"]["episodes"]["Insert"];
export type EpisodeUpdate = Database["public"]["Tables"]["episodes"]["Update"];
