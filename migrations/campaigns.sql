CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dm_id UUID NOT NULL,
  dm_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_date BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000,
  updated_date BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000,
  game_mode TEXT NOT NULL CHECK (game_mode IN ('GM_CONTROL', 'TARGET_ROLL', 'CONTESTED_ROLL', 'COMBAT')),
  game_data JSONB NOT NULL,
  lucky_shots JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_campaigns_dm_id ON campaigns(dm_id);
CREATE INDEX idx_campaigns_game_mode ON campaigns(game_mode);
CREATE INDEX idx_campaigns_updated_date ON campaigns(updated_date);

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read, create, and update campaigns (application logic handles permissions)
CREATE POLICY "Authenticated users can read campaigns" ON campaigns
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update campaigns" ON campaigns  
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only DMs can delete their own campaigns
CREATE POLICY "DMs can delete their campaigns" ON campaigns
  FOR DELETE USING (auth.uid()::text = dm_id::text);

-- Add a trigger to automatically update the updated_date field
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = extract(epoch from now()) * 1000;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_date
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_date();

-- Basic validation that type matches game_mode
CREATE OR REPLACE FUNCTION validate_game_data()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.game_mode = 'GM_CONTROL' AND NEW.game_data->>'type' != 'GM_CONTROL' THEN
    RAISE EXCEPTION 'game_data type must match game_mode';
  END IF;
  
  IF NEW.game_mode = 'TARGET_ROLL' AND NEW.game_data->>'type' != 'TARGET_ROLL' THEN
    RAISE EXCEPTION 'game_data type must match game_mode';
  END IF;
  
  IF NEW.game_mode = 'CONTESTED_ROLL' AND NEW.game_data->>'type' != 'CONTESTED_ROLL' THEN
    RAISE EXCEPTION 'game_data type must match game_mode';
  END IF;
  
  IF NEW.game_mode = 'COMBAT' AND NEW.game_data->>'type' != 'COMBAT' THEN
    RAISE EXCEPTION 'game_data type must match game_mode';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_campaigns_game_data
  BEFORE INSERT OR UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION validate_game_data();