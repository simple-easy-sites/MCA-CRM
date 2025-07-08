"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimePicker, TimePickerQuick } from "@/components/ui/time-picker"
import { ArrowLeft, Calendar, Save, Loader2, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLeads } from "@/contexts/lead-context"
import { useToast } from "@/hooks/use-toast"

interface ScheduleFollowupContentProps {
  leadId: string
}

export function ScheduleFollowupContent({ leadId }: ScheduleFollowupContentProps) {
  const router = useRouter()
  const { getLeadById, updateLead } = useLeads()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const lead = getLeadById(leadId)

  const [formData, setFormData] = useState({
    followup_date: "",
    followup_time: "09:00",
    followup_type: "call",
    priority: "medium",
    notes: "",
    reminder: "1-day",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.followup_date) {
        toast({
          title: "Validation Error",
          description: "Please select a follow-up date.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Validate date is not in the past
      const selectedDate = new Date(`${formData.followup_date}T${formData.followup_time}:00`)
      const now = new Date()
      if (selectedDate < now) {
        toast({
          title: "Validation Error",
          description: "Follow-up date cannot be in the past.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Combine date and time into proper datetime format  
      const dateTimeString = `${formData.followup_date}T${formData.followup_time}:00`
      
      console.log('📅 Scheduling follow-up for:', dateTimeString)
      console.log('📋 Form data:', formData)
      console.log('👤 Lead data:', lead)

      // Create a clean copy of the lead with only the fields that should be updated
      const updatedLead = {
        id: lead.id,
        business_name: lead.business_name,
        owner_name: lead.owner_name,
        phone: lead.phone,
        email: lead.email,
        business_type: lead.business_type,
        business_type_details: lead.business_type_details,
        credit_score: lead.credit_score,
        funding_amount: lead.funding_amount,
        monthly_revenue: lead.monthly_revenue,
        funding_purpose: lead.funding_purpose,
        payback_time: lead.payback_time,
        has_mca_history: lead.has_mca_history,
        has_defaults: lead.has_defaults,
        default_details: lead.default_details,
        stage: lead.stage,
        next_followup: dateTimeString,
        followup_priority: formData.priority as "low" | "medium" | "high" | "urgent",
        followup_notes: formData.notes,
        internal_notes: lead.internal_notes
          ? `${lead.internal_notes}\n\n[${new Date().toLocaleDateString()}] Follow-up scheduled for ${new Date(dateTimeString).toLocaleString()} - ${formData.followup_type} (${formData.priority} priority) - ${formData.notes}`
          : `[${new Date().toLocaleDateString()}] Follow-up scheduled for ${new Date(dateTimeString).toLocaleString()} - ${formData.followup_type} (${formData.priority} priority) - ${formData.notes}`,
        current_positions: lead.current_positions || [],
        created_at: lead.created_at,
        updated_at: new Date().toISOString(),
      }

      console.log('🔄 Updating lead with:', updatedLead)
      await updateLead(updatedLead)
      
      console.log('✅ Follow-up scheduled successfully!')
      toast({
        title: "Follow-up Scheduled!",
        description: `Follow-up scheduled for ${new Date(dateTimeString).toLocaleString()}`,
      })

      // Navigate back immediately
      router.push(`/leads/${leadId}`)
      
    } catch (error) {
      console.error('❌ Error scheduling follow-up:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule follow-up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getQuickDateOptions = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const twoWeeks = new Date(today)
    twoWeeks.setDate(twoWeeks.getDate() + 14)

    const oneMonth = new Date(today)
    oneMonth.setMonth(oneMonth.getMonth() + 1)

    return [
      { label: "Tomorrow", date: tomorrow.toISOString().split("T")[0] },
      { label: "Next Week", date: nextWeek.toISOString().split("T")[0] },
      { label: "2 Weeks", date: twoWeeks.toISOString().split("T")[0] },
      { label: "1 Month", date: oneMonth.toISOString().split("T")[0] },
    ]
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
              Schedule <span className="gradient-text">Follow-up</span>
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">
              Schedule a follow-up for <span className="text-white font-medium">{lead.business_name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="glow-card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-neon-purple" />
                <h3 className="text-lg font-bold text-white">Follow-up Details</h3>
              </div>

              {/* Quick Date Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-white">Quick Date Selection</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {getQuickDateOptions().map((option) => (
                    <Button
                      key={option.label}
                      type="button"
                      variant="outline"
                      className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => handleInputChange("followup_date", option.date)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Follow-up Date *</Label>
                  <Input
                    type="date"
                    className="glow-input"
                    value={formData.followup_date}
                    onChange={(e) => handleInputChange("followup_date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Follow-up Time</Label>
                  <TimePicker
                    value={formData.followup_time}
                    onChange={(time) => handleInputChange("followup_time", time)}
                    placeholder="Select time"
                  />
                </div>
              </div>

              {/* Quick Time Selection */}
              <div className="space-y-2">
                <TimePickerQuick
                  value={formData.followup_time}
                  onChange={(time) => handleInputChange("followup_time", time)}
                />
              </div>

              {/* Follow-up Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Follow-up Type</Label>
                  <Select
                    value={formData.followup_type}
                    onValueChange={(value) => handleInputChange("followup_type", value)}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">In-Person Meeting</SelectItem>
                      <SelectItem value="check-in">General Check-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
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
              </div>

              {/* Reminder */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-white">Reminder</Label>
                <Select value={formData.reminder} onValueChange={(value) => handleInputChange("reminder", value)}>
                  <SelectTrigger className="glow-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Reminder</SelectItem>
                    <SelectItem value="1-hour">1 Hour Before</SelectItem>
                    <SelectItem value="1-day">1 Day Before</SelectItem>
                    <SelectItem value="3-days">3 Days Before</SelectItem>
                    <SelectItem value="1-week">1 Week Before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-white">Follow-up Notes</Label>
                <Textarea
                  placeholder="Add notes about what to discuss during the follow-up..."
                  className="glow-input min-h-[120px]"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => router.push(`/leads/${leadId}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="glow-button text-white font-semibold px-6"
                  disabled={loading || !formData.followup_date}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Schedule Follow-up
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Summary */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Lead Summary</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Business</Label>
                <p className="text-white font-medium">{lead.business_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                <p className="text-white">{lead.owner_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Current Stage</Label>
                <p className="text-white">{lead.stage}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Follow-up</Label>
                <p className="text-white">
                  {lead.next_followup ? new Date(lead.next_followup).toLocaleDateString() : "No previous follow-up"}
                </p>
              </div>
            </div>
          </Card>

          {/* Follow-up Tips */}
          <Card className="glow-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-neon-purple" />
              <h3 className="text-lg font-bold text-white">Follow-up Tips</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                • <span className="text-white">High-intent leads:</span> Follow up within 24-48 hours
              </p>
              <p>
                • <span className="text-white">Warm leads:</span> Follow up within 1 week
              </p>
              <p>
                • <span className="text-white">Cold leads:</span> Follow up monthly
              </p>
              <p>
                • <span className="text-white">Always:</span> Add specific notes about next steps
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
