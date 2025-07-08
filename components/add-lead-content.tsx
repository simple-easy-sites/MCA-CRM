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
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLeads } from "@/contexts/lead-context"
import { useToast } from "@/hooks/use-toast"
import type { Position } from "@/types/lead"

interface FormData {
  business_name: string
  owner_name: string
  phone: string
  email: string
  business_type: string
  business_type_details: string
  credit_score: number
  funding_amount: number
  monthly_revenue: number
  funding_purpose: string
  payback_time: string
  current_positions: Position[]
  has_mca_history: boolean
  has_defaults: boolean
  default_details: string
  stage: string
  next_followup: string
  followup_priority: "low" | "medium" | "high" | "urgent"
  followup_notes: string
  internal_notes: string
  client_timezone: string // NEW: Client's timezone
}

interface FormErrors {
  [key: string]: string
}

export function AddLeadContent() {
  const router = useRouter()
  const { addLead } = useLeads()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [positions, setPositions] = useState<Position[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    business_type: "",
    business_type_details: "",
    credit_score: 0,
    funding_amount: 0,
    monthly_revenue: 0,
    funding_purpose: "",
    payback_time: "",
    current_positions: [],
    has_mca_history: false,
    has_defaults: false,
    default_details: "",
    stage: "Prospect",
    next_followup: "",
    followup_priority: "medium",
    followup_notes: "",
    internal_notes: "",
    client_timezone: "America/New_York", // Default to Eastern Time
  })

  // Auto-focus first field
  useEffect(() => {
    const firstInput = document.getElementById("businessName")
    if (firstInput) {
      firstInput.focus()
    }
  }, [])

  // Save draft to localStorage
  useEffect(() => {
    const draft = { ...formData, current_positions: positions }
    localStorage.setItem("mca-crm-draft", JSON.stringify(draft))
  }, [formData, positions])

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("mca-crm-draft")
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft)
        if (draft.current_positions) {
          setPositions(draft.current_positions)
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    const cleanPhone = phone.replace(/[\s\-()]/g, "")
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Only required fields: business name, owner name, phone
    if (!formData.business_name.trim()) {
      newErrors.business_name = "Business name is required"
    }
    if (!formData.owner_name.trim()) {
      newErrors.owner_name = "Owner name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Optional email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Validate positions if any exist
    positions.forEach((position, index) => {
      if (position.lender_name && position.original_amount <= 0) {
        newErrors[`position_${index}_original`] = "Original amount must be greater than 0"
      }
      if (position.lender_name && position.current_balance < 0) {
        newErrors[`position_${index}_balance`] = "Current balance cannot be negative"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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
    const newPositions = positions.filter((pos) => pos.id !== id)
    setPositions(newPositions)
  }

  const updatePosition = (id: string, field: keyof Position, value: any) => {
    setPositions(positions.map((pos) => (pos.id === id ? { ...pos, [field]: value } : pos)))
    // Clear position errors
    const positionIndex = positions.findIndex((pos) => pos.id === id)
    if (positionIndex !== -1) {
      const errorKey = `position_${positionIndex}_${field === "lender_name" ? "lender" : field === "original_amount" ? "original" : "balance"}`
      if (errors[errorKey]) {
        setErrors((prev) => ({ ...prev, [errorKey]: "" }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const leadData = {
        ...formData,
        current_positions: positions,
      }

      // Wait for the lead to be saved to Supabase
      await addLead(leadData)

      // Clear draft
      localStorage.removeItem("mca-crm-draft")

      toast({
        title: "Success!",
        description: "Lead has been saved successfully.",
      })

      // Reset form
      setFormData({
        business_name: "",
        owner_name: "",
        phone: "",
        email: "",
        business_type: "",
        business_type_details: "",
        credit_score: 0,
        funding_amount: 0,
        monthly_revenue: 0,
        funding_purpose: "",
        payback_time: "",
        current_positions: [],
        has_mca_history: false,
        has_defaults: false,
        default_details: "",
        stage: "Prospect",
        next_followup: "",
        followup_priority: "medium",
        followup_notes: "",
        internal_notes: "",
        client_timezone: "America/New_York", // Reset to default
      })
      setPositions([])
      setErrors({})

      // Navigate to leads page
      router.push("/leads")
    } catch (error) {
      console.error("Error saving lead:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (
      Object.values(formData).some((value) => value !== "" && value !== 0 && value !== false) ||
      positions.length > 0
    ) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        localStorage.removeItem("mca-crm-draft")
        router.push("/leads")
      }
    } else {
      router.push("/leads")
    }
  }

  const totalOriginal = positions.reduce((sum, pos) => sum + pos.original_amount, 0)
  const totalRemaining = positions.reduce((sum, pos) => sum + pos.current_balance, 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between slide-in">
        <div className="flex items-center space-x-4">
          <Link href="/leads">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Add New <span className="gradient-text">Lead</span>
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">Enter the business information and contact details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={handleCancel}
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
                Save Lead
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
                  <Label className="text-sm font-semibold text-white">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter business name"
                    className={`glow-input ${errors.business_name ? "border-red-300" : ""}`}
                    value={formData.business_name}
                    onChange={(e) => handleInputChange("business_name", e.target.value)}
                  />
                  {errors.business_name && <p className="text-sm text-red-400">{errors.business_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Owner Name *</Label>
                  <Input
                    placeholder="Enter owner's full name"
                    className={`glow-input ${errors.owner_name ? "border-red-300" : ""}`}
                    value={formData.owner_name}
                    onChange={(e) => handleInputChange("owner_name", e.target.value)}
                  />
                  {errors.owner_name && <p className="text-sm text-red-400">{errors.owner_name}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Phone Number *</Label>
                  <Input
                    placeholder="(555) 123-4567"
                    className={`glow-input ${errors.phone ? "border-red-300" : ""}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="owner@business.com"
                    className={`glow-input ${errors.email ? "border-red-300" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Business Type</Label>
                  <Input
                    placeholder="e.g., Restaurant, Retail, Construction"
                    className="glow-input"
                    value={formData.business_type}
                    onChange={(e) => handleInputChange("business_type", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Business Type Details</Label>
                  <Input
                    placeholder="e.g., Peruvian Restaurant, Commercial Construction"
                    className="glow-input"
                    value={formData.business_type_details}
                    onChange={(e) => handleInputChange("business_type_details", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Credit Score</Label>
                  <Input
                    type="number"
                    placeholder="650"
                    min="300"
                    max="850"
                    className="glow-input"
                    value={formData.credit_score || ""}
                    onChange={(e) => handleInputChange("credit_score", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-white">Client Timezone</Label>
                  <Select
                    value={formData.client_timezone}
                    onValueChange={(value) => handleInputChange("client_timezone", value)}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (New York)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (Chicago)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (Denver)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (Los Angeles)</SelectItem>
                      <SelectItem value="America/Phoenix">Arizona Time (Phoenix)</SelectItem>
                      <SelectItem value="America/Anchorage">Alaska Time (Anchorage)</SelectItem>
                      <SelectItem value="Pacific/Honolulu">Hawaii Time (Honolulu)</SelectItem>
                    </SelectContent>
                  </Select>
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
                {positions.length > 0 && (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={position.id} className="p-4 bg-card/50 rounded-lg border border-white/10 space-y-3">
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
                              className={`glow-input ${errors[`position_${index}_lender`] ? "border-red-300" : ""}`}
                            />
                            {errors[`position_${index}_lender`] && (
                              <p className="text-sm text-red-400">{errors[`position_${index}_lender`]}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-white">Payment Frequency</Label>
                            <Select
                              value={position.payment_frequency}
                              onValueChange={(value) =>
                                updatePosition(
                                  position.id,
                                  "payment_frequency",
                                  value as "Daily" | "Weekly" | "Monthly",
                                )
                              }
                            >
                              <SelectTrigger className="glow-input">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
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
                              className={`glow-input ${errors[`position_${index}_original`] ? "border-red-300" : ""}`}
                            />
                            {errors[`position_${index}_original`] && (
                              <p className="text-sm text-red-400">{errors[`position_${index}_original`]}</p>
                            )}
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
                              className={`glow-input ${errors[`position_${index}_balance`] ? "border-red-300" : ""}`}
                            />
                            {errors[`position_${index}_balance`] && (
                              <p className="text-sm text-red-400">{errors[`position_${index}_balance`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {positions.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-sm text-blue-300">
                          <strong>Summary:</strong> {positions.length} positions totaling{" "}
                          <span className="font-medium">${totalOriginal.toLocaleString()}</span> original /{" "}
                          <span className="font-medium">${totalRemaining.toLocaleString()}</span> remaining
                        </div>
                      </div>
                    )}
                  </div>
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
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-white">Has Defaults?</Label>
                    <RadioGroup
                      value={formData.has_defaults ? "yes" : "no"}
                      onValueChange={(value) => handleInputChange("has_defaults", value === "yes")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="defaults-yes" />
                        <Label htmlFor="defaults-yes" className="text-sm text-white">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="defaults-no" />
                        <Label htmlFor="defaults-no" className="text-sm text-white">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {formData.has_mca_history && formData.has_defaults && (
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
                  <Label className="text-sm font-semibold text-white">Initial Stage</Label>
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
                  <Label className="text-sm font-semibold text-white">Next Follow-up (Date & Time)</Label>
                  <Input
                    type="datetime-local"
                    className="glow-input"
                    value={formData.next_followup}
                    onChange={(e) => handleInputChange("next_followup", e.target.value)}
                  />
                </div>
                {formData.next_followup && (
                  <>
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

            {/* Quick Actions */}
            <Card className="glow-card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => {
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    tomorrow.setHours(9, 0, 0, 0) // Set to 9:00 AM
                    const isoString = tomorrow.toISOString().slice(0, 16) // Format for datetime-local
                    handleInputChange("next_followup", isoString)
                  }}
                >
                  Schedule Follow-up Call (9 AM Tomorrow)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => handleInputChange("stage", "Email Sent")}
                >
                  Mark Email Sent
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => handleInputChange("stage", "Bank Statements Received")}
                >
                  Mark Statements Received
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
