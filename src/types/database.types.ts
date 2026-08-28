export type TipoMidia = "movie" | "tv";

export type StatusMidia =
  | "planejado"
  | "assistindo"
  | "concluido"
  | "abandonado";

export interface BancoDeDados {
  public: {
    Tables: {
      midias: {
        Row: {
          id: number;
          tmdb_id: number;
          type: TipoMidia;
          titulo: string;
          caminho_poster: string | null;
          descricao: string | null;
          duracao: number | null;
          status: StatusMidia;
          avaliacao: number | null;
          observacoes: string | null;
          criado_em: string;
        };

        Insert: {
          id?: never;
          tmdb_id: number;
          type: TipoMidia;
          titulo: string;
          caminho_poster?: string | null;
          descricao?: string | null;
          duracao?: number | null;
          status?: StatusMidia;
          avaliacao?: number | null;
          observacoes?: string | null;
          criado_em?: string;
        };

        Update: {
          id?: never;
          tmdb_id?: number;
          type?: TipoMidia;
          titulo?: string;
          caminho_poster?: string | null;
          descricao?: string | null;
          duracao?: number | null;
          status?: StatusMidia;
          avaliacao?: number | null;
          observacoes?: string | null;
          criado_em?: string;
        };

        Relationships: [];
      };

      temporadas: {
        Row: {
          id: number;
          midia_id: number;
          tmdb_id: number;
          numero_temporada: number;
          nome: string | null;
          criado_em: string;
        };

        Insert: {
          id?: never;
          midia_id: number;
          tmdb_id: number;
          numero_temporada: number;
          nome?: string | null;
          criado_em?: string;
        };

        Update: {
          id?: never;
          midia_id?: number;
          tmdb_id?: number;
          numero_temporada?: number;
          nome?: string | null;
          criado_em?: string;
        };

        Relationships: [
          {
            foreignKeyName: "temporadas_midia_id_fkey";
            columns: ["midia_id"];
            isOneToOne: false;
            referencedRelation: "midias";
            referencedColumns: ["id"];
          },
        ];
      };

      episodios: {
        Row: {
          id: number;
          temporada_id: number;
          tmdb_id: number;
          numero_episodio: number;
          nome: string | null;
          assistido: boolean;
          assistido_em: string | null;
          criado_em: string;
          duracao: number | null;
        };

        Insert: {
          id?: never;
          temporada_id: number;
          tmdb_id: number;
          numero_episodio: number;
          nome?: string | null;
          assistido?: boolean;
          assistido_em?: string | null;
          criado_em?: string;
          duracao?: number | null;
        };

        Update: {
          id?: never;
          temporada_id?: number;
          tmdb_id?: number;
          numero_episodio?: number;
          nome?: string | null;
          assistido?: boolean;
          assistido_em?: string | null;
          criado_em?: string;
          duracao?: number | null;
        };

        Relationships: [
          {
            foreignKeyName: "episodios_temporada_id_fkey";
            columns: ["temporada_id"];
            isOneToOne: false;
            referencedRelation: "temporadas";
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

export type Midia =
  BancoDeDados["public"]["Tables"]["midias"]["Row"];

export type InsercaoMidia =
  BancoDeDados["public"]["Tables"]["midias"]["Insert"];

export type AtualizacaoMidia =
  BancoDeDados["public"]["Tables"]["midias"]["Update"];

export type Temporada =
  BancoDeDados["public"]["Tables"]["temporadas"]["Row"];

export type InsercaoTemporada =
  BancoDeDados["public"]["Tables"]["temporadas"]["Insert"];

export type AtualizacaoTemporada =
  BancoDeDados["public"]["Tables"]["temporadas"]["Update"];

export type Episodio =
  BancoDeDados["public"]["Tables"]["episodios"]["Row"];

export type InsercaoEpisodio =
  BancoDeDados["public"]["Tables"]["episodios"]["Insert"];

export type AtualizacaoEpisodio =
  BancoDeDados["public"]["Tables"]["episodios"]["Update"];
