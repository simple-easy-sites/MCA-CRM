"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { TimePicker, TimePickerQuick } from "@/components/ui/time-picker"
import { TimezoneSelector } from "@/components/timezone-selector"
import { BUSINESS_TYPES } from "@/lib/business-types"
import { US_STATES, getTimezoneByState } from "@/lib/us-states"
import { ArrowLeft, Save, Plus, Trash2, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLeads } from "@/contexts/lead-context"
import { useToast } from "@/hooks/use-toast"
import type { Position, Lead } from "@/types/lead"

interface EditLeadContentProps {
  leadId: string
}

export function EditLeadContent({ leadId }: EditLeadContentProps) {
  const router = useRouter()
  const { getLeadById, updateLead, deleteLead, refreshLeads } = useLeads()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [positions, setPositions] = useState<Position[]>([])

  const lead = getLeadById(leadId)

  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    business_type: "",
    funding_amount: 0,
    monthly_revenue: 0,
    funding_purpose: "",
    payback_time: "",
    has_mca_history: false,
    default_details: "",
    stage: "Prospect",
    next_followup_date: "",
    next_followup_time: "09:00",
    followup_priority: "medium",
    followup_notes: "",
    internal_notes: "",
    client_timezone: "America/New_York", // Client timezone
    client_city: "", // Client city
    client_state: "", // Client state
  })

  useEffect(() => {
    if (lead) {
      // FIXED: Split next_followup into date and time components properly
      let followupDate = ""
      let followupTime = "09:00"
      
      if (lead.next_followup && lead.next_followup.trim() !== "") {
        try {
          // Parse the ISO string directly to avoid timezone conversion
          const isoString = lead.next_followup.includes('T') ? lead.next_followup : lead.next_followup + 'T00:00:00.000Z'
          const datePart = isoString.split('T')[0] // Gets YYYY-MM-DD
          const timePart = isoString.split('T')[1].split('.')[0] // Gets HH:MM:SS
          
          followupDate = datePart // YYYY-MM-DD format for date input
          followupTime = timePart.substring(0, 5) // HH:MM format for time input
          
          console.log('📅 Edit Lead: Parsing follow-up:', {
            original: lead.next_followup,
            parsed_date: followupDate,
            parsed_time: followupTime
          })
        } catch (error) {
          console.error('Error parsing follow-up date:', error)
        }
      }

      setFormData({
        business_name: lead.business_name,
        owner_name: lead.owner_name,
        phone: lead.phone,
        email: lead.email,
        business_type: lead.business_type,
        funding_amount: lead.funding_amount,
        monthly_revenue: lead.monthly_revenue,
        funding_purpose: lead.funding_purpose,
        payback_time: lead.payback_time,
        has_mca_history: lead.has_mca_history,
        default_details: lead.default_details,
        stage: lead.stage,
        next_followup_date: followupDate,
        next_followup_time: followupTime,
        followup_priority: lead.followup_priority || "medium",
        followup_notes: lead.followup_notes || "",
        internal_notes: lead.internal_notes,
        client_timezone: lead.client_timezone || "America/New_York",
        client_city: lead.client_city || "",
        client_state: lead.client_state || "",
      })
      setPositions(lead.current_positions)
    }
  }, [lead])

  if (!lead) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Link href="/leads">
            <Button className="glow-button text-white font-semibold" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Lead Not Found</h2>
            <p className="text-muted-foreground mt-1">The requested lead could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      lender_name: "",
      original_amount: 0,
      current_balance: 0,
      payment_frequency: "Daily",
    }
    setPositions([...positions, newPosition])
  }

  const removePosition = (id: string) => {
    setPositions(positions.filter((pos) => pos.id !== id))
  }

  const updatePosition = (id: string, field: keyof Position, value: any) => {
    setPositions(positions.map((pos) => (pos.id === id ? { ...pos, [field]: value } : pos)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // FIXED: Combine date and time into proper datetime format without timezone conversion
      let nextFollowup = ""
      if (formData.next_followup_date) {
        const year = formData.next_followup_date.split('-')[0]
        const month = formData.next_followup_date.split('-')[1]
        const day = formData.next_followup_date.split('-')[2]
        const time = formData.next_followup_time
        
        // Create the datetime string exactly as entered (no timezone conversion)
        nextFollowup = `${year}-${month}-${day}T${time}:00.000Z`
        
        console.log('🔄 Edit Lead: Creating follow-up datetime:', {
          date_input: formData.next_followup_date,
          time_input: formData.next_followup_time,
          combined: nextFollowup
        })
      }

      console.log('📝 Edit Lead: Form data:', formData)
      console.log('👤 Edit Lead: Original lead:', lead)

      const updatedLead: Lead = {
        id: lead.id,
        business_name: formData.business_name,
        owner_name: formData.owner_name,
        phone: formData.phone,
        email: formData.email,
        business_type: formData.business_type,
        business_type_details: lead.business_type_details,
        credit_score: lead.credit_score,
        funding_amount: formData.funding_amount,
        monthly_revenue: formData.monthly_revenue,
        funding_purpose: formData.funding_purpose,
        payback_time: formData.payback_time,
        has_mca_history: formData.has_mca_history,
        has_defaults: lead.has_defaults,
        default_details: formData.default_details,
        stage: formData.stage,
        next_followup: nextFollowup,
        followup_priority: formData.followup_priority as "low" | "medium" | "high" | "urgent",
        followup_notes: formData.followup_notes,
        internal_notes: formData.internal_notes,
        current_positions: positions,
        created_at: lead.created_at,
        updated_at: new Date().toISOString(),
        client_timezone: formData.client_timezone,
      }

      await updateLead(updatedLead)

      toast({
        title: "Success!",
        description: "Lead has been updated successfully.",
      })

      // Refresh leads data and navigate back to lead detail
      await refreshLeads()
      router.push(`/leads/${leadId}`)
      
    } catch (error) {
      console.error('❌ Error updating lead:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteLead(leadId)
      toast({
        title: "Lead Deleted",
        description: "Lead has been permanently deleted.",
      })
      router.push("/leads")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between slide-in">
        <div className="flex items-center space-x-4">
          <Link href={`/leads/${leadId}`}>
            <Button className="glow-button text-white font-semibold" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lead
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Edit <span className="gradient-text">{lead.business_name}</span>
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">Update lead information and details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Lead
          </Button>
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={() => router.push(`/leads/${leadId}`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="glow-button text-white font-semibold px-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Business <span className="gradient-text">Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Business Name</Label>
                  <Input
                    placeholder="Enter business name"
                    className="glow-input"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange("business_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Owner Name</Label>
                  <Input
                    placeholder="Enter owner's full name"
                    className="glow-input"
                    value={formData.owner_name}
                    onChange={(e) => handleInputChange("owner_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Phone Number</Label>
                  <Input
                    placeholder="(555) 123-4567"
                    className="glow-input"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="owner@business.com"
                    className="glow-input"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-white">Business Type</Label>
                  <Select 
                    value={formData.business_type} 
                    onValueChange={(value) => handleInputChange("business_type", value)}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Client City</Label>
                  <Input
                    placeholder="Enter city name"
                    className="glow-input"
                    value={formData.client_city}
                    onChange={(e) => handleInputChange("client_city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Client State</Label>
                  <Select 
                    value={formData.client_state} 
                    onValueChange={(value) => {
                      handleInputChange("client_state", value)
                      // Automatically set timezone based on state
                      const timezone = getTimezoneByState(value)
                      handleInputChange("client_timezone", timezone)
                    }}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.client_state && (
                    <p className="text-xs text-muted-foreground">
                      Timezone: {formData.client_timezone.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Funding Requirements */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Funding <span className="gradient-text">Requirements</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Funding Amount Needed</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    className="glow-input"
                    value={formData.funding_amount || ""}
                    onChange={(e) => handleInputChange("funding_amount", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Monthly Revenue</Label>
                  <Input
                    type="number"
                    placeholder="25000"
                    className="glow-input"
                    value={formData.monthly_revenue || ""}
                    onChange={(e) => handleInputChange("monthly_revenue", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Funding Payback Time</Label>
                  <Select
                    value={formData.payback_time}
                    onValueChange={(value) => handleInputChange("payback_time", value)}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue placeholder="Select payback time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 months</SelectItem>
                      <SelectItem value="6-months">6 months</SelectItem>
                      <SelectItem value="9-months">9 months</SelectItem>
                      <SelectItem value="12-months">12 months</SelectItem>
                      <SelectItem value="18-months">18+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-white">Purpose of Funding</Label>
                  <Textarea
                    placeholder="Equipment purchase, inventory, expansion, etc."
                    className="glow-input min-h-[80px]"
                    value={formData.funding_purpose}
                    onChange={(e) => handleInputChange("funding_purpose", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Current Positions */}
            <Card className="glow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Current Positions</h3>
                <Button
                  type="button"
                  onClick={addPosition}
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Position
                </Button>
              </div>

              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div key={position.id} className="p-4 bg-card/30 rounded-lg border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Position {index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => removePosition(position.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">Lender/Funder Name</Label>
                        <Input
                          value={position.lender_name}
                          onChange={(e) => updatePosition(position.id, "lender_name", e.target.value)}
                          placeholder="Enter lender name"
                          className="glow-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">Payment Frequency</Label>
                        <Select
                          value={position.payment_frequency}
                          onValueChange={(value) => updatePosition(position.id, "payment_frequency", value)}
                        >
                          <SelectTrigger className="glow-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">Original Amount</Label>
                        <Input
                          type="number"
                          value={position.original_amount || ""}
                          onChange={(e) =>
                            updatePosition(position.id, "original_amount", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="0"
                          className="glow-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">Current Balance Remaining</Label>
                        <Input
                          type="number"
                          value={position.current_balance || ""}
                          onChange={(e) =>
                            updatePosition(position.id, "current_balance", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="0"
                          className="glow-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Internal Notes */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Internal Notes</h3>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-white">Notes & Comments</Label>
                <Textarea
                  placeholder="Add any additional notes about this lead..."
                  className="glow-input min-h-[120px]"
                  value={formData.internal_notes}
                  onChange={(e) => handleInputChange("internal_notes", e.target.value)}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Status */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Lead Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Current Stage</Label>
                  <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                    <SelectTrigger className="glow-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Email Sent">Email Sent</SelectItem>
                      <SelectItem value="Bank Statements Received">Bank Statements Received</SelectItem>
                      <SelectItem value="Submitted to Underwriting">Submitted to Underwriting</SelectItem>
                      <SelectItem value="Offer Presented">Offer Presented</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                      <SelectItem value="Not Interested">Not Interested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Next Follow-up Date</Label>
                  <Input
                    type="date"
                    className="glow-input"
                    value={formData.next_followup_date}
                    onChange={(e) => handleInputChange("next_followup_date", e.target.value)}
                  />
                </div>
                {formData.next_followup_date && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white">Follow-up Time</Label>
                      <TimePicker
                        value={formData.next_followup_time}
                        onChange={(time) => handleInputChange("next_followup_time", time)}
                        placeholder="Select time"
                      />
                    </div>
                    <div className="space-y-2">
                      <TimePickerQuick
                        value={formData.next_followup_time}
                        onChange={(time) => handleInputChange("next_followup_time", time)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white">Follow-up Priority</Label>
                      <Select value={formData.followup_priority} onValueChange={(value) => handleInputChange("followup_priority", value)}>
                        <SelectTrigger className="glow-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-white">Follow-up Notes</Label>
                      <Textarea
                        placeholder="Notes about what to discuss during follow-up..."
                        className="glow-input min-h-[80px]"
                        value={formData.followup_notes}
                        onChange={(e) => handleInputChange("followup_notes", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* MCA History */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">MCA History</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-white">Previous MCA Experience</Label>
                  <RadioGroup
                    value={formData.has_mca_history ? "yes" : "no"}
                    onValueChange={(value) => handleInputChange("has_mca_history", value === "yes")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mca-yes" />
                      <Label htmlFor="mca-yes" className="text-sm text-white">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="mca-no" />
                      <Label htmlFor="mca-no" className="text-sm text-white">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.has_mca_history && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-white">Default Details</Label>
                    <Textarea
                      placeholder="Please describe any previous defaults, payment issues, or relevant MCA history..."
                      className="glow-input min-h-[100px]"
                      value={formData.default_details}
                      onChange={(e) => handleInputChange("default_details", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glow-card border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>Delete Lead</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete <strong className="text-white">{lead?.business_name}</strong>? 
              This action cannot be undone and will permanently remove all lead data, positions, and follow-ups.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
