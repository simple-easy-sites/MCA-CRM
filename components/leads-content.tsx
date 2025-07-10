"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Phone, Mail } from "lucide-react"
import { useLeads } from "@/contexts/lead-context"
import { useRouter } from "next/navigation"
import { formatCurrencyAbbreviated, formatPhoneNumber } from "@/lib/format-utils"
import { LeadFiltersComponent, type LeadFilters } from "@/components/lead-filters"

export function LeadsContent() {
  const { leads } = useLeads()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<LeadFilters>({
    fundingAmountMin: 0,
    fundingAmountMax: 1000000,
    monthlyRevenueMin: 0,
    monthlyRevenueMax: 500000,
    businessType: "",
    stage: "",
    hasMcaHistory: "",
    creditScoreMin: 300,
    creditScoreMax: 850,
    paybackTime: ""
  })

  const filteredLeads = leads.filter((lead) => {
    // Search filter
    const matchesSearch = searchTerm === "" ||
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Funding amount filter
    if (lead.funding_amount < filters.fundingAmountMin || lead.funding_amount > filters.fundingAmountMax) {
      return false
    }

    // Monthly revenue filter
    if (lead.monthly_revenue < filters.monthlyRevenueMin || lead.monthly_revenue > filters.monthlyRevenueMax) {
      return false
    }

    // Credit score filter
    if (lead.credit_score && (lead.credit_score < filters.creditScoreMin || lead.credit_score > filters.creditScoreMax)) {
      return false
    }

    // Business type filter
    if (filters.businessType && lead.business_type !== filters.businessType) {
      return false
    }

    // Stage filter
    if (filters.stage && lead.stage !== filters.stage) {
      return false
    }

    // Payback time filter
    if (filters.paybackTime && lead.payback_time !== filters.paybackTime) {
      return false
    }

    // MCA history filter
    if (filters.hasMcaHistory === "true" && !lead.has_mca_history) {
      return false
    }
    if (filters.hasMcaHistory === "false" && lead.has_mca_history) {
      return false
    }

    return true
  })

  const clearFilters = () => {
    setFilters({
      fundingAmountMin: 0,
      fundingAmountMax: 1000000,
      monthlyRevenueMin: 0,
      monthlyRevenueMax: 500000,
      businessType: "",
      stage: "",
      hasMcaHistory: "",
      creditScoreMin: 300,
      creditScoreMax: 850,
      paybackTime: ""
    })
    setSearchTerm("")
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospect":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      case "Email Sent":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Bank Statements Received":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "Submitted to Underwriting":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "Offer Presented":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Closed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "Cold Lead":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Not Interested":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const exportLeads = () => {
    const csvContent = [
      ["Business Name", "Owner Name", "Phone", "Email", "Monthly Revenue", "Funding Amount", "Stage"],
      ...filteredLeads.map((lead) => [
        lead.business_name,
        lead.owner_name,
        lead.phone,
        lead.email,
        lead.monthly_revenue.toString(),
        lead.funding_amount.toString(),
        lead.stage,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `jons-crm-leads-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between slide-in">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            All <span className="gradient-text">Leads</span>
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage and track all your merchant cash advance leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="glow-button text-white font-semibold" onClick={exportLeads} disabled={leads.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/add-lead")} className="glow-button text-white font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="glow-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by business name, owner, email, or phone..."
                className="pl-10 w-80 glow-input bg-card/50 border-white/10 text-white placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <LeadFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
              totalLeads={leads.length}
              filteredCount={filteredLeads.length}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-white">{filteredLeads.length}</span> of{" "}
            <span className="font-medium text-white">{leads.length}</span> leads
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="glow-card p-6">
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Owner Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Funding Amount
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredLeads.map((lead) => {
                  const monthlyRevenue = formatCurrencyAbbreviated(lead.monthly_revenue)
                  const fundingAmount = formatCurrencyAbbreviated(lead.funding_amount)
                  const formattedPhone = formatPhoneNumber(lead.phone)

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all duration-300 group"
                    >
                      {/* Business Name */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white group-hover:text-neon-purple transition-colors">
                            {lead.business_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.business_type || "Not specified"}</p>
                        </div>
                      </td>

                      {/* Owner Name */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-white">{lead.owner_name}</p>
                          <p className="text-sm text-muted-foreground">Owner</p>
                        </div>
                      </td>

                      {/* Monthly Revenue */}
                      <td className="py-4 px-4">
                        <div className="group/tooltip relative" title={`${monthlyRevenue.full} per month`}>
                          <p className="font-semibold text-white cursor-help">{monthlyRevenue.abbreviated}</p>
                          <p className="text-sm text-muted-foreground">per month</p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {monthlyRevenue.full}
                          </div>
                        </div>
                      </td>

                      {/* Funding Amount */}
                      <td className="py-4 px-4">
                        <div className="group/tooltip relative" title={`${fundingAmount.full} - ${lead.payback_time}`}>
                          <p className="font-semibold text-white cursor-help">{fundingAmount.abbreviated}</p>
                          <p className="text-sm text-muted-foreground">{lead.payback_time}</p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {fundingAmount.full}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-white">{formattedPhone}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <Badge className={`${getStageColor(lead.stage)} border font-medium`}>{lead.stage}</Badge>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <Button
                          size="sm"
                          className="glow-button text-white font-semibold text-xs px-3 py-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/leads/${lead.id}`)
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-purple/30">
              <Search className="w-10 h-10 text-neon-purple" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">{searchTerm ? "No leads found" : "No leads found"}</h4>
            <p className="text-muted-foreground mb-8 text-lg">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all leads."
                : "Start building your pipeline by adding leads to track and manage."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push("/add-lead")}
                className="glow-button text-white font-semibold px-8 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Lead
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
