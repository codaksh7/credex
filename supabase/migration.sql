-- Run this in Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)
CREATE TABLE IF NOT EXISTS audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  company TEXT,
  role TEXT,
  team_size INTEGER,
  tools JSONB,
  results JSONB,
  total_savings NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON audits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read by id" ON audits
  FOR SELECT USING (true);
