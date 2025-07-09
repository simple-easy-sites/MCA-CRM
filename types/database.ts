export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          business_name: string
          owner_name: string
          phone: string
          email: string | null
          business_type: string | null
          business_type_details: string | null
          credit_score: number | null
          funding_amount: number | null
          monthly_revenue: number | null
          funding_purpose: string | null
          payback_time: string | null
          has_mca_history: boolean | null
          has_defaults: boolean | null
          default_details: string | null
          stage: string
          next_followup: string | null
          followup_priority: string | null
          followup_notes: string | null
          internal_notes: string | null
          client_timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_name: string
          owner_name: string
          phone: string
          email?: string | null
          business_type?: string | null
          business_type_details?: string | null
          credit_score?: number | null
          funding_amount?: number | null
          monthly_revenue?: number | null
          funding_purpose?: string | null
          payback_time?: string | null
          has_mca_history?: boolean | null
          has_defaults?: boolean | null
          default_details?: string | null
          stage?: string
          next_followup?: string | null
          followup_priority?: string | null
          followup_notes?: string | null
          internal_notes?: string | null
          client_timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          owner_name?: string
          phone?: string
          email?: string | null
          business_type?: string | null
          business_type_details?: string | null
          credit_score?: number | null
          funding_amount?: number | null
          monthly_revenue?: number | null
          funding_purpose?: string | null
          payback_time?: string | null
          has_mca_history?: boolean | null
          has_defaults?: boolean | null
          default_details?: string | null
          stage?: string
          next_followup?: string | null
          followup_priority?: string | null
          followup_notes?: string | null
          internal_notes?: string | null
          client_timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          lead_id: string
          lender_name: string
          original_amount: number
          current_balance: number
          payment_frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          lender_name: string
          original_amount: number
          current_balance: number
          payment_frequency: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          lender_name?: string
          original_amount?: number
          current_balance?: number
          payment_frequency?: string
          created_at?: string
          updated_at?: string
        }
      }
      follow_ups: {
        Row: {
          id: string
          lead_id: string
          follow_up_type: string
          subject: string | null
          notes: string | null
          scheduled_for: string | null
          completed_at: string | null
          completed: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          follow_up_type: string
          subject?: string | null
          notes?: string | null
          scheduled_for?: string | null
          completed_at?: string | null
          completed?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          follow_up_type?: string
          subject?: string | null
          notes?: string | null
          scheduled_for?: string | null
          completed_at?: string | null
          completed?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      leads_with_position_summary: {
        Row: {
          id: string | null
          business_name: string | null
          owner_name: string | null
          phone: string | null
          email: string | null
          business_type: string | null
          business_type_details: string | null
          credit_score: number | null
          funding_amount: number | null
          monthly_revenue: number | null
          funding_purpose: string | null
          payback_time: string | null
          has_mca_history: boolean | null
          has_defaults: boolean | null
          default_details: string | null
          stage: string | null
          next_followup: string | null
          internal_notes: string | null
          created_at: string | null
          updated_at: string | null
          position_count: number | null
          total_original_amount: number | null
          total_current_balance: number | null
        }
      }
      upcoming_follow_ups: {
        Row: {
          lead_id: string | null
          business_name: string | null
          owner_name: string | null
          phone: string | null
          stage: string | null
          next_followup: string | null
          internal_notes: string | null
        }
      }
    }
    Functions: {
      get_lead_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_leads: number
          prospects: number
          active_leads: number
          closed_leads: number
          total_funding_requested: number
          avg_credit_score: number
        }[]
      }
      search_leads: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          business_name: string
          owner_name: string
          phone: string
          email: string
          stage: string
          rank: number
        }[]
      }
    }
  }
}