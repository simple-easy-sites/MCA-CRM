-- Add follow-up priority and notes columns to leads table
-- Migration: Add Follow-up Priority and Notes - 2025-07-06

-- Add followup_priority column
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS followup_priority TEXT DEFAULT 'medium' 
CHECK (followup_priority IN ('low', 'medium', 'high', 'urgent'));

-- Add followup_notes column
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS followup_notes TEXT;

-- Update existing leads that have a next_followup but no priority
UPDATE leads 
SET followup_priority = 'medium' 
WHERE next_followup IS NOT NULL 
  AND next_followup != '' 
  AND followup_priority IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN leads.followup_priority IS 'Priority level for the scheduled follow-up: low, medium, high, urgent';
COMMENT ON COLUMN leads.followup_notes IS 'Specific notes about what to discuss during the follow-up';

-- Create index for better query performance on priority
CREATE INDEX IF NOT EXISTS idx_leads_followup_priority ON leads(followup_priority);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup_priority ON leads(next_followup, followup_priority) WHERE next_followup IS NOT NULL AND next_followup != '';
