import { supabase } from './supabase'
import type { Lead, Position } from '@/types/lead'
import type { Database } from '@/types/database'

// Type for inserting a new lead (without id, created_at, updated_at)
type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>

// ============================================
// LEAD OPERATIONS
// ============================================

export const leadService = {
  // Get all leads with their positions
  async getAllLeads(): Promise<Lead[]> {
    try {
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          positions (*)
        `)
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError

      // Transform the data to match our Lead interface
      return leads.map(lead => ({
        ...lead,
        current_positions: lead.positions || [],
        credit_score: lead.credit_score || 0,
        funding_amount: lead.funding_amount || 0,
        monthly_revenue: lead.monthly_revenue || 0,
        has_mca_history: lead.has_mca_history || false,
        has_defaults: lead.has_defaults || false,
        email: lead.email || '',
        business_type: lead.business_type || '',
        business_type_details: lead.business_type_details || '',
        funding_purpose: lead.funding_purpose || '',
        payback_time: lead.payback_time || '',
        default_details: lead.default_details || '',
        next_followup: lead.next_followup || '',
        followup_priority: lead.followup_priority || 'medium',
        followup_notes: lead.followup_notes || '',
        internal_notes: lead.internal_notes || '',
        client_timezone: lead.client_timezone || 'America/New_York',
        client_city: lead.client_city || '',
        client_state: lead.client_state || ''
      }))
    } catch (error) {
      console.error('Error fetching leads:', error)
      throw new Error('Failed to fetch leads')
    }
  },

  // Get a single lead by ID
  async getLeadById(id: string): Promise<Lead | null> {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .select(`
          *,
          positions (*)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Lead not found
        throw error
      }

      return {
        ...lead,
        current_positions: lead.positions || [],
        credit_score: lead.credit_score || 0,
        funding_amount: lead.funding_amount || 0,
        monthly_revenue: lead.monthly_revenue || 0,
        has_mca_history: lead.has_mca_history || false,
        has_defaults: lead.has_defaults || false,
        email: lead.email || '',
        business_type: lead.business_type || '',
        business_type_details: lead.business_type_details || '',
        funding_purpose: lead.funding_purpose || '',
        payback_time: lead.payback_time || '',
        default_details: lead.default_details || '',
        next_followup: lead.next_followup || '',
        followup_priority: lead.followup_priority || 'medium',
        followup_notes: lead.followup_notes || '',
        internal_notes: lead.internal_notes || '',
        client_timezone: lead.client_timezone || 'America/New_York',
        client_city: lead.client_city || '',
        client_state: lead.client_state || ''
      }
    } catch (error) {
      console.error('Error fetching lead:', error)
      throw new Error('Failed to fetch lead')
    }
  },

  // Create a new lead
  async createLead(leadData: LeadInsert): Promise<Lead> {
    try {
      console.log('📊 Supabase: Creating lead with data:', leadData)
      // Separate positions from lead data
      const { current_positions, ...leadWithoutPositions } = leadData
      
      // Clean up the data - convert empty strings to null for database
      const cleanedLeadData = {
        ...leadWithoutPositions,
        email: leadWithoutPositions.email || null,
        business_type: leadWithoutPositions.business_type || null,
        business_type_details: leadWithoutPositions.business_type_details || null,
        credit_score: leadWithoutPositions.credit_score || null,
        funding_amount: leadWithoutPositions.funding_amount || null,
        monthly_revenue: leadWithoutPositions.monthly_revenue || null,
        funding_purpose: leadWithoutPositions.funding_purpose || null,
        payback_time: leadWithoutPositions.payback_time || null,
        default_details: leadWithoutPositions.default_details || null,
        next_followup: leadWithoutPositions.next_followup || null,
        followup_priority: leadWithoutPositions.followup_priority || null,
        followup_notes: leadWithoutPositions.followup_notes || null,
        internal_notes: leadWithoutPositions.internal_notes || null,
        client_timezone: leadWithoutPositions.client_timezone || 'America/New_York',
        client_city: leadWithoutPositions.client_city || null,
        client_state: leadWithoutPositions.client_state || null
      }
      
      console.log('📊 Cleaned lead data:', cleanedLeadData)

      // Insert the lead first
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert([cleanedLeadData])
        .select()
        .single()

      if (leadError) {
        console.error('❌ Supabase lead insert error:', leadError)
        throw leadError
      }
      console.log('✅ Supabase: Lead inserted successfully:', newLead)

      // Insert positions if any
      let positions: Position[] = []
      if (current_positions && current_positions.length > 0) {
        console.log('📊 Creating positions for lead:', current_positions)
        positions = await positionService.createPositions(newLead.id, current_positions)
        console.log('✅ Positions created successfully:', positions)
      } else {
        console.log('📊 No positions to create')
      }

      return {
        ...newLead,
        current_positions: positions,
        credit_score: newLead.credit_score || 0,
        funding_amount: newLead.funding_amount || 0,
        monthly_revenue: newLead.monthly_revenue || 0,
        has_mca_history: newLead.has_mca_history || false,
        has_defaults: newLead.has_defaults || false,
        email: newLead.email || '',
        business_type: newLead.business_type || '',
        business_type_details: newLead.business_type_details || '',
        funding_purpose: newLead.funding_purpose || '',
        payback_time: newLead.payback_time || '',
        default_details: newLead.default_details || '',
        next_followup: newLead.next_followup || '',
        followup_priority: newLead.followup_priority || 'medium',
        followup_notes: newLead.followup_notes || '',
        internal_notes: newLead.internal_notes || '',
        client_timezone: newLead.client_timezone || 'America/New_York',
        client_city: newLead.client_city || '',
        client_state: newLead.client_state || ''
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      throw new Error('Failed to create lead')
    }
  },

  // Update an existing lead
  async updateLead(lead: Lead): Promise<Lead> {
    try {
      console.log('🔄 Supabase: Updating lead with data:', lead)
      
      // Separate positions from lead data and remove read-only fields
      const { current_positions, created_at, updated_at, ...leadWithoutPositions } = lead

      // Clean up the data - convert empty strings to null for database
      // Don't include id in the update data since it's the primary key
      const cleanedLeadData = {
        business_name: leadWithoutPositions.business_name,
        owner_name: leadWithoutPositions.owner_name,
        phone: leadWithoutPositions.phone,
        email: leadWithoutPositions.email || null,
        business_type: leadWithoutPositions.business_type || null,
        business_type_details: leadWithoutPositions.business_type_details || null,
        credit_score: leadWithoutPositions.credit_score || null,
        funding_amount: leadWithoutPositions.funding_amount || null,
        monthly_revenue: leadWithoutPositions.monthly_revenue || null,
        funding_purpose: leadWithoutPositions.funding_purpose || null,
        payback_time: leadWithoutPositions.payback_time || null,
        has_mca_history: leadWithoutPositions.has_mca_history || false,
        has_defaults: leadWithoutPositions.has_defaults || false,
        default_details: leadWithoutPositions.default_details || null,
        stage: leadWithoutPositions.stage,
        next_followup: leadWithoutPositions.next_followup || null,
        followup_priority: leadWithoutPositions.followup_priority || null,
        followup_notes: leadWithoutPositions.followup_notes || null,
        internal_notes: leadWithoutPositions.internal_notes || null,
        client_timezone: leadWithoutPositions.client_timezone || 'America/New_York',
        client_city: leadWithoutPositions.client_city || null,
        client_state: leadWithoutPositions.client_state || null,
        updated_at: new Date().toISOString()
      }
      
      console.log('📊 Cleaned data for update:', cleanedLeadData)

      // Update the lead
      const { data: updatedLead, error: leadError } = await supabase
        .from('leads')
        .update(cleanedLeadData)
        .eq('id', lead.id)
        .select()
        .single()

      if (leadError) {
        console.error('❌ Supabase update error:', leadError)
        throw leadError
      }
      
      console.log('✅ Lead updated successfully:', updatedLead)

      // Update positions - delete existing and insert new ones
      await positionService.deletePositionsByLeadId(lead.id)
      let positions: Position[] = []
      if (current_positions && current_positions.length > 0) {
        positions = await positionService.createPositions(lead.id, current_positions)
      }

      return {
        ...updatedLead,
        current_positions: positions,
        credit_score: updatedLead.credit_score || 0,
        funding_amount: updatedLead.funding_amount || 0,
        monthly_revenue: updatedLead.monthly_revenue || 0,
        has_mca_history: updatedLead.has_mca_history || false,
        has_defaults: updatedLead.has_defaults || false,
        email: updatedLead.email || '',
        business_type: updatedLead.business_type || '',
        business_type_details: updatedLead.business_type_details || '',
        funding_purpose: updatedLead.funding_purpose || '',
        payback_time: updatedLead.payback_time || '',
        default_details: updatedLead.default_details || '',
        next_followup: updatedLead.next_followup || '',
        followup_priority: updatedLead.followup_priority || 'medium',
        followup_notes: updatedLead.followup_notes || '',
        internal_notes: updatedLead.internal_notes || '',
        client_timezone: updatedLead.client_timezone || 'America/New_York',
        client_city: updatedLead.client_city || '',
        client_state: updatedLead.client_state || ''
      }
    } catch (error) {
      console.error('❌ Error updating lead:', error)
      throw new Error(`Failed to update lead: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  },

  // Delete a lead
  async deleteLead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting lead:', error)
      throw new Error('Failed to delete lead')
    }
  },

  // Search leads
  async searchLeads(searchTerm: string): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_leads', { search_term: searchTerm })

      if (error) throw error

      // Get full lead data for search results
      const leadIds = data.map(result => result.id)
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          positions (*)
        `)
        .in('id', leadIds)

      if (leadsError) throw leadsError

      return leads.map(lead => ({
        ...lead,
        current_positions: lead.positions || [],
        credit_score: lead.credit_score || 0,
        funding_amount: lead.funding_amount || 0,
        monthly_revenue: lead.monthly_revenue || 0,
        has_mca_history: lead.has_mca_history || false,
        has_defaults: lead.has_defaults || false,
        email: lead.email || '',
        business_type: lead.business_type || '',
        business_type_details: lead.business_type_details || '',
        funding_purpose: lead.funding_purpose || '',
        payback_time: lead.payback_time || '',
        default_details: lead.default_details || '',
        next_followup: lead.next_followup || '',
        followup_priority: lead.followup_priority || 'medium',
        followup_notes: lead.followup_notes || '',
        internal_notes: lead.internal_notes || '',
        client_timezone: lead.client_timezone || 'America/New_York',
        client_city: lead.client_city || '',
        client_state: lead.client_state || ''
      }))
    } catch (error) {
      console.error('Error searching leads:', error)
      throw new Error('Failed to search leads')
    }
  }
}

// ============================================
// POSITION OPERATIONS
// ============================================

export const positionService = {
  // Create multiple positions for a lead
  async createPositions(leadId: string, positions: Position[]): Promise<Position[]> {
    try {
      const positionsToInsert = positions.map(position => ({
        lead_id: leadId,
        lender_name: position.lender_name,
        original_amount: position.original_amount,
        current_balance: position.current_balance,
        payment_frequency: position.payment_frequency
      }))

      const { data, error } = await supabase
        .from('positions')
        .insert(positionsToInsert)
        .select()

      if (error) throw error

      return data.map(position => ({
        id: position.id,
        lender_name: position.lender_name,
        original_amount: position.original_amount,
        current_balance: position.current_balance,
        payment_frequency: position.payment_frequency as "Daily" | "Weekly" | "Monthly"
      }))
    } catch (error) {
      console.error('Error creating positions:', error)
      throw new Error('Failed to create positions')
    }
  },

  // Delete all positions for a lead
  async deletePositionsByLeadId(leadId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('lead_id', leadId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting positions:', error)
      throw new Error('Failed to delete positions')
    }
  }
}

// ============================================
// STATISTICS AND ANALYTICS
// ============================================

export const analyticsService = {
  // Get lead statistics
  async getLeadStatistics() {
    try {
      const { data, error } = await supabase
        .rpc('get_lead_statistics')

      if (error) throw error

      return data[0] || {
        total_leads: 0,
        prospects: 0,
        active_leads: 0,
        closed_leads: 0,
        total_funding_requested: 0,
        avg_credit_score: 0
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      throw new Error('Failed to fetch statistics')
    }
  },

  // Get upcoming follow-ups
  async getUpcomingFollowUps() {
    try {
      const { data, error } = await supabase
        .from('upcoming_follow_ups')
        .select('*')
        .limit(10)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching follow-ups:', error)
      throw new Error('Failed to fetch follow-ups')
    }
  }
}
