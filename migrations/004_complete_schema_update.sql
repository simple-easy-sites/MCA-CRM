-- ============================================
-- MCA CRM Database Schema Updates (Non-Destructive)
-- Run these commands in your Supabase SQL editor
-- ============================================

-- Add missing columns to leads table (non-destructive)
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS business_type_details TEXT;

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS client_timezone TEXT DEFAULT 'America/New_York';

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS followup_priority TEXT DEFAULT 'medium' 
CHECK (followup_priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS followup_notes TEXT;

-- Update the stage column to include missing stages (non-destructive)
ALTER TABLE leads 
DROP CONSTRAINT IF EXISTS leads_stage_check;

ALTER TABLE leads 
ADD CONSTRAINT leads_stage_check CHECK (
    stage IN (
        'Prospect',
        'Email Sent',
        'Bank Statements Received',
        'Submitted to Underwriting',
        'Offer Presented',
        'Closed',
        'Cold Lead',
        'Not Interested'
    )
);

-- Update next_followup to support datetime instead of just date
ALTER TABLE leads 
ALTER COLUMN next_followup TYPE TIMESTAMP WITH TIME ZONE;

-- Add comments to document the new columns
COMMENT ON COLUMN leads.business_type_details IS 'Specific business details within the business type category (e.g., Clothing Store, Liquor Store)';
COMMENT ON COLUMN leads.client_timezone IS 'Client timezone for scheduling follow-ups (e.g., America/New_York, America/Chicago)';
COMMENT ON COLUMN leads.followup_priority IS 'Priority level for the scheduled follow-up: low, medium, high, urgent';
COMMENT ON COLUMN leads.followup_notes IS 'Specific notes about what to discuss during the follow-up';

-- Update existing records with default values (non-destructive)
UPDATE leads 
SET client_timezone = 'America/New_York' 
WHERE client_timezone IS NULL;

UPDATE leads 
SET followup_priority = 'medium' 
WHERE followup_priority IS NULL AND next_followup IS NOT NULL;

UPDATE leads 
SET business_type_details = '' 
WHERE business_type_details IS NULL;

UPDATE leads 
SET followup_notes = '' 
WHERE followup_notes IS NULL;

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_followup_priority ON leads(followup_priority);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup_priority ON leads(next_followup, followup_priority) 
WHERE next_followup IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_business_type ON leads(business_type);
CREATE INDEX IF NOT EXISTS idx_leads_client_timezone ON leads(client_timezone);

-- ============================================
-- Update the leads_with_position_summary view
-- ============================================
DROP VIEW IF EXISTS leads_with_position_summary;

CREATE VIEW leads_with_position_summary AS
SELECT 
    l.*,
    COALESCE(p.position_count, 0) as position_count,
    COALESCE(p.total_original_amount, 0) as total_original_amount,
    COALESCE(p.total_current_balance, 0) as total_current_balance
FROM leads l
LEFT JOIN (
    SELECT 
        lead_id,
        COUNT(*) as position_count,
        SUM(original_amount) as total_original_amount,
        SUM(current_balance) as total_current_balance
    FROM positions
    GROUP BY lead_id
) p ON l.id = p.lead_id;

-- ============================================
-- Update the upcoming_follow_ups view
-- ============================================
DROP VIEW IF EXISTS upcoming_follow_ups;

CREATE VIEW upcoming_follow_ups AS
SELECT 
    l.id as lead_id,
    l.business_name,
    l.owner_name,
    l.phone,
    l.stage,
    l.next_followup,
    l.followup_priority,
    l.followup_notes,
    l.internal_notes,
    l.client_timezone
FROM leads l
WHERE l.next_followup IS NOT NULL 
AND l.next_followup >= NOW()
AND l.stage NOT IN ('Closed', 'Not Interested')
ORDER BY 
    CASE l.followup_priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
    END,
    l.next_followup ASC;

-- ============================================
-- Enhanced Functions
-- ============================================

-- Update the get_lead_statistics function to include more metrics
CREATE OR REPLACE FUNCTION get_lead_statistics()
RETURNS TABLE (
    total_leads BIGINT,
    prospects BIGINT,
    active_leads BIGINT,
    closed_leads BIGINT,
    cold_leads BIGINT,
    not_interested BIGINT,
    total_funding_requested DECIMAL,
    avg_credit_score DECIMAL,
    urgent_followups BIGINT,
    high_priority_followups BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE stage = 'Prospect') as prospects,
        COUNT(*) FILTER (WHERE stage NOT IN ('Prospect', 'Closed', 'Cold Lead', 'Not Interested')) as active_leads,
        COUNT(*) FILTER (WHERE stage = 'Closed') as closed_leads,
        COUNT(*) FILTER (WHERE stage = 'Cold Lead') as cold_leads,
        COUNT(*) FILTER (WHERE stage = 'Not Interested') as not_interested,
        COALESCE(SUM(funding_amount), 0) as total_funding_requested,
        COALESCE(AVG(credit_score), 0) as avg_credit_score,
        COUNT(*) FILTER (WHERE followup_priority = 'urgent' AND next_followup >= NOW() AND stage NOT IN ('Closed', 'Not Interested')) as urgent_followups,
        COUNT(*) FILTER (WHERE followup_priority = 'high' AND next_followup >= NOW() AND stage NOT IN ('Closed', 'Not Interested')) as high_priority_followups
    FROM leads;
END;
$$ LANGUAGE plpgsql;

-- Function to get leads by follow-up priority
CREATE OR REPLACE FUNCTION get_leads_by_priority(priority_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    business_name TEXT,
    owner_name TEXT,
    phone TEXT,
    email TEXT,
    stage TEXT,
    next_followup TIMESTAMP WITH TIME ZONE,
    followup_priority TEXT,
    followup_notes TEXT,
    client_timezone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.business_name,
        l.owner_name,
        l.phone,
        l.email,
        l.stage,
        l.next_followup,
        l.followup_priority,
        l.followup_notes,
        l.client_timezone
    FROM leads l
    WHERE 
        l.next_followup IS NOT NULL 
        AND l.next_followup >= NOW()
        AND l.stage NOT IN ('Closed', 'Not Interested')
        AND (priority_filter IS NULL OR l.followup_priority = priority_filter)
    ORDER BY 
        CASE l.followup_priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
        END,
        l.next_followup ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get leads by business type
CREATE OR REPLACE FUNCTION get_leads_by_business_type(business_type_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    business_name TEXT,
    owner_name TEXT,
    business_type TEXT,
    business_type_details TEXT,
    stage TEXT,
    funding_amount DECIMAL,
    monthly_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.business_name,
        l.owner_name,
        l.business_type,
        l.business_type_details,
        l.stage,
        l.funding_amount,
        l.monthly_revenue
    FROM leads l
    WHERE 
        (business_type_filter IS NULL OR l.business_type = business_type_filter)
    ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Insert sample data with new fields (only if no leads exist)
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM leads LIMIT 1) THEN
        -- Insert sample lead with all new fields
        INSERT INTO leads (
            business_name,
            owner_name,
            phone,
            email,
            business_type,
            business_type_details,
            credit_score,
            funding_amount,
            monthly_revenue,
            funding_purpose,
            payback_time,
            has_mca_history,
            has_defaults,
            stage,
            next_followup,
            followup_priority,
            followup_notes,
            internal_notes,
            client_timezone
        ) VALUES (
            'Tony''s Pizza Palace',
            'Tony Rodriguez',
            '(555) 123-4567',
            'tony@tonypizza.com',
            'Food & Beverage',
            'Pizza Shop',
            680,
            75000.00,
            35000.00,
            'Kitchen equipment upgrade and expansion',
            '12-months',
            true,
            false,
            'Prospect',
            NOW() + INTERVAL '2 days',
            'high',
            'Follow up on equipment financing needs. Very motivated buyer.',
            'Very interested in quick funding. Has been in business for 8 years. Good cash flow.',
            'America/New_York'
        );

        -- Insert sample position for the lead
        INSERT INTO positions (
            lead_id,
            lender_name,
            original_amount,
            current_balance,
            payment_frequency
        ) SELECT 
            id,
            'ABC Capital',
            50000.00,
            25000.00,
            'Daily'
        FROM leads 
        WHERE business_name = 'Tony''s Pizza Palace'
        LIMIT 1;
    END IF;
END $$;

-- ============================================
-- Verify the updates
-- ============================================

-- Check if all columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'MCA CRM Database schema has been successfully updated!';
    RAISE NOTICE 'New fields added: business_type_details, client_timezone, followup_priority, followup_notes';
    RAISE NOTICE 'Updated stage constraints and next_followup to support datetime';
    RAISE NOTICE 'Enhanced views and functions for better reporting';
END $$;
