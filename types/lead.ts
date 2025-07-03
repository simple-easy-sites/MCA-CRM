export interface Position {
  id: string
  lender_name: string
  original_amount: number
  current_balance: number
  payment_frequency: "Daily" | "Weekly"
}

export interface Lead {
  id: string
  business_name: string
  owner_name: string
  phone: string
  email: string
  business_type: string
  funding_amount: number
  monthly_revenue: number
  funding_purpose: string
  payback_time: string
  current_positions: Position[]
  has_mca_history: boolean
  default_details: string
  stage:
    | "Initial Contact"
    | "Email Sent"
    | "Bank Statements Received"
    | "Submitted to Underwriting"
    | "Offer Presented"
    | "Closed"
  next_followup: string
  internal_notes: string
  created_at: string
  updated_at: string
}
