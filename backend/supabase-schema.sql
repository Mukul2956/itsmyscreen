-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position INTEGER NOT NULL
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_poll ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_ip ON votes(poll_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_votes_fingerprint ON votes(poll_id, fingerprint);
CREATE INDEX IF NOT EXISTS idx_options_poll ON options(poll_id);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write (for our use case)
CREATE POLICY "Enable read access for all users" ON polls FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON polls FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON options FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON options FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON votes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON votes FOR INSERT WITH CHECK (true);
