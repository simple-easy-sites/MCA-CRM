-- Migration: Add business_type_details and client_timezone columns
-- Run this SQL command in your Supabase SQL editor

-- Add the business_type_details column (should already exist but ensuring it's there)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS business_type_details TEXT;

-- Add the client_timezone column (should already exist from previous migration)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS client_timezone TEXT DEFAULT 'America/New_York';

-- Add comments to document the columns
COMMENT ON COLUMN leads.business_type_details IS 'Specific business details within the business type category';
COMMENT ON COLUMN leads.client_timezone IS 'Client timezone (e.g., America/New_York, America/Chicago, etc.)';

-- Update existing leads to have the default timezone if NULL
UPDATE leads 
SET client_timezone = 'America/New_York' 
WHERE client_timezone IS NULL;

-- Update existing leads to have empty string for business_type_details if NULL
UPDATE leads 
SET business_type_details = '' 
WHERE business_type_details IS NULL;
