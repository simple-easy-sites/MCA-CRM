-- Migration: Add client_timezone column to leads table
-- Run this SQL command in your Supabase SQL editor

-- Add the client_timezone column
ALTER TABLE leads 
ADD COLUMN client_timezone TEXT DEFAULT 'America/New_York';

-- Add a comment to document the column
COMMENT ON COLUMN leads.client_timezone IS 'Client timezone (e.g., America/New_York, America/Chicago, etc.)';

-- Optional: Update existing leads to have the default timezone
UPDATE leads 
SET client_timezone = 'America/New_York' 
WHERE client_timezone IS NULL;
