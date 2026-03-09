export type StandingSession = {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string;
  duration_min: number;
  source: "timer" | "stopwatch" | "manual";
  created_at: string;
  synced_at: string | null;
};

export type DailyTotal = {
  day: string;
  total_minutes: number;
  session_count: number;
};

export type Database = {
  public: {
    Tables: {
      standing_sessions: {
        Row: StandingSession;
        Insert: Omit<StandingSession, "id" | "created_at" | "synced_at"> & {
          id?: string;
          created_at?: string;
          synced_at?: string | null;
        };
        Update: Partial<StandingSession>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_daily_totals: {
        Args: {
          p_user_id: string;
          p_start_date: string;
          p_end_date: string;
        };
        Returns: DailyTotal[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
