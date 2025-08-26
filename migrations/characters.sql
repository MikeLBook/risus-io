-- Create the characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  creator_name TEXT NOT NULL,
  campaign_id UUID,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cliches JSONB NOT NULL DEFAULT '[]'::jsonb,
  lucky_shots INTEGER NOT NULL DEFAULT 0,
  has_hook BOOLEAN NOT NULL DEFAULT false,
  hook_text TEXT NOT NULL DEFAULT '',
  has_tale BOOLEAN NOT NULL DEFAULT false,
  tale_text TEXT NOT NULL DEFAULT '',
  tools TEXT NOT NULL DEFAULT '',
  deceased BOOLEAN NOT NULL DEFAULT false,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM NOW() AT TIME ZONE 'UTC') * 1000,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(epoch FROM NOW() AT TIME ZONE 'UTC') * 1000
);

-- Create indexes for common query patterns
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_campaign_id ON characters(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_characters_creator_name ON characters(creator_name);
CREATE INDEX idx_characters_archived ON characters(archived);
CREATE INDEX idx_characters_deceased ON characters(deceased);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = EXTRACT(epoch FROM NOW() AT TIME ZONE 'UTC') * 1000;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_characters_updated_at();

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
-- Allow authenticated users to read all characters
CREATE POLICY "Authenticated users can read all characters"
ON characters FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert characters
CREATE POLICY "Authenticated users can insert characters"
ON characters FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update all characters
CREATE POLICY "Authenticated users can update all characters"
ON characters FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete all characters
CREATE POLICY "Authenticated users can delete all characters"
ON characters FOR DELETE
TO authenticated
USING (true);

-- Enable real-time for the characters table
ALTER PUBLICATION supabase_realtime ADD TABLE characters;

-- Add comments for documentation
COMMENT ON TABLE characters IS 'Stores character data with nested cliches and injuries as JSONB. Real-time enabled for game updates.';
COMMENT ON COLUMN characters.cliches IS 'Array of cliche objects with structure: {id, name, description, dice, injuries: [{description, penalty}], isPrimary}';
COMMENT ON COLUMN characters.created_at IS 'Unix timestamp in milliseconds';
COMMENT ON COLUMN characters.updated_at IS 'Unix timestamp in milliseconds, auto-updated on row changes';