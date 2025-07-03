"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Position } from "@/types/lead"

export function AddLeadContent() {
  const [positions, setPositions] = useState<Position[]>([])
  const [hasMcaHistory, setHasMcaHistory] = useState<string>("")
  const [numPositions, setNumPositions] = useState<number>(0)

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

  const handleNumPositionsChange = (value: string) => {
    const num = Number.parseInt(value) || 0
    setNumPositions(num)

    // Adjust positions array to match the number
    if (num > positions.length) {
      const newPositions = []
      for (let i = positions.length; i < num; i++) {
        newPositions.push({
          id: Date.now().toString() + i,
          lender_name: "",
          original_amount: 0,
          current_balance: 0,
          payment_frequency: "Daily" as const,
        })
      }
      setPositions([...positions, ...newPositions])
    } else if (num < positions.length) {
      setPositions(positions.slice(0, num))
    }
  }

  const totalOriginal = positions.reduce((sum, pos) => sum + pos.original_amount, 0)
  const totalRemaining = positions.reduce((sum, pos) => sum + pos.current_balance, 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/leads">
            <Button variant="outline" size="sm" className="border-slate-200/60 bg-white/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Add New Lead</h2>
            <p className="text-slate-600 mt-1">Enter the business information and funding requirements</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-200/60 bg-white/80">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            Save Lead
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium text-slate-700">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  placeholder="Enter business name"
                  className="bg-white/80 border-slate-200/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-sm font-medium text-slate-700">
                  Owner Name *
                </Label>
                <Input
                  id="ownerName"
                  placeholder="Enter owner's full name"
                  className="bg-white/80 border-slate-200/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone Number *
                </Label>
                <Input id="phone" placeholder="(555) 123-4567" className="bg-white/80 border-slate-200/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@business.com"
                  className="bg-white/80 border-slate-200/60"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessType" className="text-sm font-medium text-slate-700">
                  Business Type
                </Label>
                <Input
                  id="businessType"
                  placeholder="e.g., Restaurant, Retail, Construction"
                  className="bg-white/80 border-slate-200/60"
                />
              </div>
            </div>
          </Card>

          {/* Funding Requirements */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Funding Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fundingAmount" className="text-sm font-medium text-slate-700">
                  Funding Amount Needed *
                </Label>
                <Input id="fundingAmount" placeholder="$50,000" className="bg-white/80 border-slate-200/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue" className="text-sm font-medium text-slate-700">
                  Monthly Revenue *
                </Label>
                <Input id="monthlyRevenue" placeholder="$25,000" className="bg-white/80 border-slate-200/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paybackTime" className="text-sm font-medium text-slate-700">
                  Funding Payback Time *
                </Label>
                <Select>
                  <SelectTrigger className="bg-white/80 border-slate-200/60">
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
                <Label htmlFor="purpose" className="text-sm font-medium text-slate-700">
                  Purpose of Funding
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="Equipment purchase, inventory, expansion, etc."
                  className="bg-white/80 border-slate-200/60 min-h-[80px]"
                />
              </div>
            </div>
          </Card>

          {/* Current Positions */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Current Positions</h3>
              <Button
                type="button"
                onClick={addPosition}
                variant="outline"
                size="sm"
                className="border-slate-200/60 bg-white/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Position
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numPositions" className="text-sm font-medium text-slate-700">
                    Number of Current Positions
                  </Label>
                  <Input
                    id="numPositions"
                    type="number"
                    min="0"
                    value={numPositions}
                    onChange={(e) => handleNumPositionsChange(e.target.value)}
                    placeholder="0"
                    className="bg-white/80 border-slate-200/60"
                  />
                </div>
              </div>

              {positions.length > 0 && (
                <div className="space-y-4">
                  <div className="border-t border-slate-200/60 pt-4">
                    <h4 className="text-md font-medium text-slate-800 mb-3">Position Details</h4>
                    {positions.map((position, index) => (
                      <div
                        key={position.id}
                        className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Position {index + 1}</span>
                          <Button
                            type="button"
                            onClick={() => removePosition(position.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Lender/Funder Name</Label>
                            <Input
                              value={position.lender_name}
                              onChange={(e) => updatePosition(position.id, "lender_name", e.target.value)}
                              placeholder="Enter lender name"
                              className="bg-white/80 border-slate-200/60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Payment Frequency</Label>
                            <Select
                              value={position.payment_frequency}
                              onValueChange={(value) => updatePosition(position.id, "payment_frequency", value)}
                            >
                              <SelectTrigger className="bg-white/80 border-slate-200/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Original Amount</Label>
                            <Input
                              type="number"
                              value={position.original_amount || ""}
                              onChange={(e) =>
                                updatePosition(position.id, "original_amount", Number.parseFloat(e.target.value) || 0)
                              }
                              placeholder="$0"
                              className="bg-white/80 border-slate-200/60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Current Balance Remaining</Label>
                            <Input
                              type="number"
                              value={position.current_balance || ""}
                              onChange={(e) =>
                                updatePosition(position.id, "current_balance", Number.parseFloat(e.target.value) || 0)
                              }
                              placeholder="$0"
                              className="bg-white/80 border-slate-200/60"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {positions.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200/40">
                        <div className="text-sm text-slate-700">
                          <strong>Summary:</strong> {positions.length} positions totaling{" "}
                          <span className="font-medium">${totalOriginal.toLocaleString()}</span> original /{" "}
                          <span className="font-medium">${totalRemaining.toLocaleString()}</span> remaining
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* MCA History */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">MCA History</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Previous MCA Experience *</Label>
                <RadioGroup value={hasMcaHistory} onValueChange={setHasMcaHistory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mca-yes" />
                    <Label htmlFor="mca-yes" className="text-sm text-slate-700">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mca-no" />
                    <Label htmlFor="mca-no" className="text-sm text-slate-700">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasMcaHistory === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="defaultDetails" className="text-sm font-medium text-slate-700">
                    Default Details
                  </Label>
                  <Textarea
                    id="defaultDetails"
                    placeholder="Please describe any previous defaults, payment issues, or relevant MCA history..."
                    className="bg-white/80 border-slate-200/60 min-h-[100px]"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Internal Notes */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Internal Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Notes & Comments
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this lead..."
                className="bg-white/80 border-slate-200/60 min-h-[120px]"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Status */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Initial Stage</Label>
                <Select defaultValue="initial-contact">
                  <SelectTrigger className="bg-white/80 border-slate-200/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial-contact">Initial Contact</SelectItem>
                    <SelectItem value="email-sent">Email Sent</SelectItem>
                    <SelectItem value="bank-statements-received">Bank Statements Received</SelectItem>
                    <SelectItem value="submitted-to-underwriting">Submitted to Underwriting</SelectItem>
                    <SelectItem value="offer-presented">Offer Presented</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextFollowup" className="text-sm font-medium text-slate-700">
                  Next Follow-up
                </Label>
                <Input id="nextFollowup" type="date" className="bg-white/80 border-slate-200/60" />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                Schedule Follow-up Call
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                Send Welcome Email
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                Add to Priority List
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
