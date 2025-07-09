"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import { BUSINESS_CATEGORIES } from "@/lib/business-types"
import { US_STATES } from "@/lib/us-states"

export interface LeadFilters {
  fundingAmountMin: number
  fundingAmountMax: number
  monthlyRevenueMin: number
  monthlyRevenueMax: number
  businessType: string
  stage: string
  hasMcaHistory: string
  creditScoreMin: number
  creditScoreMax: number
  paybackTime: string
}

interface LeadFiltersComponentProps {
  filters: LeadFilters
  onFiltersChange: (filters: LeadFilters) => void
  onClearFilters: () => void
  totalLeads: number
  filteredCount: number
}

const LEAD_STAGES = [
  "Prospect",
  "Email Sent", 
  "Bank Statements Received",
  "Submitted to Underwriting",
  "Offer Presented",
  "Closed",
  "Cold Lead",
  "Not Interested"
]

const PAYBACK_TIMES = [
  "3-months",
  "6-months", 
  "9-months",
  "12-months",
  "18-months"
]

export function LeadFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  totalLeads, 
  filteredCount 
}: LeadFiltersComponentProps) {
  const [open, setOpen] = useState(false)

  const updateFilter = (key: keyof LeadFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'string') return value !== ''
    if (typeof value === 'number') return value !== 0 && value !== 1000000
    return false
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="glow-button text-white font-semibold relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full border border-background"></div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="glow-card border-white/20 bg-background/95 backdrop-blur-lg w-[400px] sm:w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Filter Leads</span>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Showing {filteredCount} of {totalLeads} leads
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Funding Amount Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Funding Amount</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>${filters.fundingAmountMin.toLocaleString()}</span>
                <span>${filters.fundingAmountMax.toLocaleString()}</span>
              </div>
              <Slider
                value={[filters.fundingAmountMin, filters.fundingAmountMax]}
                onValueChange={([min, max]) => {
                  updateFilter('fundingAmountMin', min)
                  updateFilter('fundingAmountMax', max)
                }}
                min={0}
                max={1000000}
                step={5000}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    value={filters.fundingAmountMin || ''}
                    onChange={(e) => updateFilter('fundingAmountMin', Number(e.target.value) || 0)}
                    className="glow-input text-xs"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    value={filters.fundingAmountMax || ''}
                    onChange={(e) => updateFilter('fundingAmountMax', Number(e.target.value) || 1000000)}
                    className="glow-input text-xs"
                    placeholder="1,000,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Monthly Revenue</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>${filters.monthlyRevenueMin.toLocaleString()}</span>
                <span>${filters.monthlyRevenueMax.toLocaleString()}</span>
              </div>
              <Slider
                value={[filters.monthlyRevenueMin, filters.monthlyRevenueMax]}
                onValueChange={([min, max]) => {
                  updateFilter('monthlyRevenueMin', min)
                  updateFilter('monthlyRevenueMax', max)
                }}
                min={0}
                max={500000}
                step={1000}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    value={filters.monthlyRevenueMin || ''}
                    onChange={(e) => updateFilter('monthlyRevenueMin', Number(e.target.value) || 0)}
                    className="glow-input text-xs"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    value={filters.monthlyRevenueMax || ''}
                    onChange={(e) => updateFilter('monthlyRevenueMax', Number(e.target.value) || 500000)}
                    className="glow-input text-xs"
                    placeholder="500,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credit Score Range */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-white">Credit Score</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.creditScoreMin}</span>
                <span>{filters.creditScoreMax}</span>
              </div>
              <Slider
                value={[filters.creditScoreMin, filters.creditScoreMax]}
                onValueChange={([min, max]) => {
                  updateFilter('creditScoreMin', min)
                  updateFilter('creditScoreMax', max)
                }}
                min={300}
                max={850}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Business Type</Label>
            <Select value={filters.businessType} onValueChange={(value) => updateFilter('businessType', value)}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="All business types" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="">All business types</SelectItem>
              {BUSINESS_CATEGORIES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lead Stage */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Lead Stage</Label>
            <Select value={filters.stage} onValueChange={(value) => updateFilter('stage', value)}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All stages</SelectItem>
                {LEAD_STAGES.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payback Time */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Payback Time</Label>
            <Select value={filters.paybackTime} onValueChange={(value) => updateFilter('paybackTime', value)}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="All payback times" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All payback times</SelectItem>
                {PAYBACK_TIMES.map(time => (
                  <SelectItem key={time} value={time}>{time.replace('-', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MCA History */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">MCA History</Label>
            <Select value={filters.hasMcaHistory} onValueChange={(value) => updateFilter('hasMcaHistory', value)}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="Any MCA history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any MCA history</SelectItem>
                <SelectItem value="true">Has MCA history</SelectItem>
                <SelectItem value="false">No MCA history</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2 pt-4 border-t border-white/10">
          <Button 
            onClick={() => setOpen(false)}
            className="glow-button text-white flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
