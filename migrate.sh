#!/bin/bash

# MCA-CRM Database Migration Script
# This script helps apply the follow-up priority and notes migration

echo "🚀 MCA-CRM Database Migration Tool"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the MCA-CRM root directory"
    echo "   Please navigate to your MCA-CRM folder and try again"
    exit 1
fi

echo "📋 Migration: Add Follow-up Priority and Notes"
echo "   - Adds followup_priority column with CHECK constraint"
echo "   - Adds followup_notes column for specific follow-up details"
echo "   - Creates indexes for better performance"
echo "   - Updates existing leads with default priority"
echo ""

# Read the migration file
if [ ! -f "migrations/001_add_followup_priority_notes.sql" ]; then
    echo "❌ Error: Migration file not found at migrations/001_add_followup_priority_notes.sql"
    exit 1
fi

echo "📁 Migration file found: migrations/001_add_followup_priority_notes.sql"
echo ""

echo "🔍 Migration SQL Preview:"
echo "========================="
head -20 migrations/001_add_followup_priority_notes.sql
echo "... (truncated for brevity)"
echo ""

echo "⚠️  IMPORTANT INSTRUCTIONS:"
echo "   1. This script will show you the SQL to run in Supabase"
echo "   2. You need to manually copy and paste it into your Supabase SQL Editor"
echo "   3. This migration is safe and will not delete any existing data"
echo ""

read -p "👀 Show full SQL migration? (y/n): " show_sql

if [ "$show_sql" = "y" ] || [ "$show_sql" = "Y" ]; then
    echo ""
    echo "📜 Full SQL Migration:"
    echo "======================"
    cat migrations/001_add_followup_priority_notes.sql
    echo ""
fi

echo "🔗 How to apply this migration:"
echo "==============================="
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to 'SQL Editor' in the left sidebar"
echo "3. Click 'New query' or use an existing query tab"
echo "4. Copy and paste the SQL from migrations/001_add_followup_priority_notes.sql"
echo "5. Click 'Run' to execute the migration"
echo ""

echo "✅ After running the migration, your database will support:"
echo "   - Follow-up priority levels (low, medium, high, urgent)"
echo "   - Specific follow-up notes for each scheduled follow-up"
echo "   - Better performance with new indexes"
echo "   - Automatic default priority for existing follow-ups"
echo ""

echo "🆘 Need help?"
echo "   - Check the README-UPDATES.md file for detailed instructions"
echo "   - Ensure you have proper database permissions"
echo "   - Contact support if you encounter any issues"
echo ""

echo "🎉 Migration script completed!"
echo "   Remember to apply the SQL in your Supabase dashboard"
