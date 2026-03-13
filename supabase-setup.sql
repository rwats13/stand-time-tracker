-- Stand Time Tracker: Supabase Database Setup
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. Create the standing_sessions table
CREATE TABLE standing_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT NOT NULL DEFAULT 'default',
  started_at    TIMESTAMPTZ NOT NULL,
  ended_at      TIMESTAMPTZ NOT NULL,
  duration_min  INTEGER NOT NULL,
  source        TEXT NOT NULL CHECK (source IN ('timer', 'stopwatch', 'manual')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  synced_at     TIMESTAMPTZ DEFAULT now()
);

-- 2. Create index for efficient queries (covers date-range lookups and ordering)
CREATE INDEX idx_sessions_user_date ON standing_sessions (user_id, started_at DESC);

-- 3. Enable Row Level Security (permissive for v1, tighten in v2 with auth)
ALTER TABLE standing_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for v1" ON standing_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Create daily totals aggregation function
CREATE OR REPLACE FUNCTION get_daily_totals(
  p_user_id TEXT,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (day DATE, total_minutes INTEGER, session_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (started_at AT TIME ZONE 'UTC')::date AS day,
    SUM(duration_min)::integer AS total_minutes,
    COUNT(*)::integer AS session_count
  FROM standing_sessions
  WHERE user_id = p_user_id
    AND (started_at AT TIME ZONE 'UTC')::date BETWEEN p_start_date AND p_end_date
  GROUP BY (started_at AT TIME ZONE 'UTC')::date
  ORDER BY day;
END;
$$ LANGUAGE plpgsql STABLE;
