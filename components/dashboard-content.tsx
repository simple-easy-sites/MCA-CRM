"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, Clock, Phone, Zap, Activity, Target, Filter, Mail, Bug } from "lucide-react"
import { useLeads } from "@/contexts/lead-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatCurrencyAbbreviated, formatPhoneNumber } from "@/lib/format-utils"
import { SupabaseTestComponent } from "@/components/supabase-test"

export function DashboardContent() {
  const { leads } = useLeads()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showDebug, setShowDebug] = useState(false)

  const filteredLeads = leads.filter(
    (lead) =>
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalLeads = leads.length
  const followUpsDue = leads.filter((lead) => {
    if (!lead.next_followup) return false
    const followUpDate = new Date(lead.next_followup)
    const today = new Date()
    return followUpDate <= today
  }).length

  const inPipeline = leads.filter((lead) => !["Closed", "Initial Contact"].includes(lead.stage)).length

  const closedThisMonth = leads.filter((lead) => {
    if (lead.stage !== "Closed") return false
    const createdDate = new Date(lead.created_at)
    const now = new Date()
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
  }).length

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Initial Contact":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
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
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-8 slide-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Jon's <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">Advanced merchant cash advance pipeline analytics</p>
        </div>
        <Button
          onClick={() => router.push("/add-lead")}
          className="glow-button text-white font-semibold px-6 py-3 text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glow-card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Leads</p>
              <p className="text-3xl font-bold text-white mt-2">{totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:shadow-glow">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {totalLeads > 0 ? (
              <span className="text-blue-400 font-medium">Active leads in system</span>
            ) : (
              <span className="text-muted-foreground">Start adding leads to see metrics</span>
            )}
          </div>
        </Card>

        <Card className="glow-card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Follow-ups Due</p>
              <p className="text-3xl font-bold text-white mt-2">{followUpsDue}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center border border-orange-500/30 group-hover:shadow-glow">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {followUpsDue > 0 ? (
              <span className="text-orange-400 font-medium">{followUpsDue} need attention</span>
            ) : (
              <span className="text-muted-foreground">No follow-ups due</span>
            )}
          </div>
        </Card>

        <Card className="glow-card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">In Pipeline</p>
              <p className="text-3xl font-bold text-white mt-2">{inPipeline}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/30 group-hover:shadow-glow">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {inPipeline > 0 ? (
              <span className="text-green-400 font-medium">{inPipeline} active deals</span>
            ) : (
              <span className="text-muted-foreground">No active pipeline</span>
            )}
          </div>
        </Card>

        <Card className="glow-card p-6 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Closed This Month</p>
              <p className="text-3xl font-bold text-white mt-2">{closedThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:shadow-glow">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {closedThisMonth > 0 ? (
              <span className="text-purple-400 font-medium">{closedThisMonth} deals closed</span>
            ) : (
              <span className="text-muted-foreground">No deals closed yet</span>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="glow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-neon-purple" />
            Recent Leads
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="glow-input pl-10 w-64 bg-card/50 border-white/10 text-white placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="glow-button text-white font-semibold">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="glow-button text-white font-semibold" onClick={() => router.push("/leads")}>
              View All
            </Button>
          </div>
        </div>

        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Owner Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Funding Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredLeads.slice(0, 10).map((lead) => {
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
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-white group-hover:text-neon-purple transition-colors">
                            {lead.business_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.business_type || "Not specified"}</p>
                        </div>
                      </td>

                      {/* Owner Name */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-white">{lead.owner_name}</p>
                          <p className="text-sm text-muted-foreground">Owner</p>
                        </div>
                      </td>

                      {/* Monthly Revenue */}
                      <td className="py-3 px-4">
                        <div className="group/tooltip relative" title={`${monthlyRevenue.full} per month`}>
                          <p className="font-semibold text-white cursor-help">{monthlyRevenue.abbreviated}</p>
                          <p className="text-sm text-muted-foreground">per month</p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {monthlyRevenue.full}
                          </div>
                        </div>
                      </td>

                      {/* Funding Amount */}
                      <td className="py-3 px-4">
                        <div className="group/tooltip relative" title={`${fundingAmount.full} - ${lead.payback_time}`}>
                          <p className="font-semibold text-white cursor-help">{fundingAmount.abbreviated}</p>
                          <p className="text-sm text-muted-foreground">{lead.payback_time}</p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {fundingAmount.full}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-white">{formattedPhone}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-3 px-4">
                        <Badge className={`${getStageColor(lead.stage)} border font-medium`}>{lead.stage}</Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
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
              <Users className="w-10 h-10 text-neon-purple" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">{searchTerm ? "No leads found" : "No leads yet"}</h4>
            <p className="text-muted-foreground mb-8 text-lg">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first lead to the system."}
            </p>
            <Button onClick={() => router.push("/add-lead")} className="glow-button text-white font-semibold px-8 py-3">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Lead
            </Button>
          </div>
        )}
      </Card>

      {/* Debug Section - Show if there are issues or explicitly requested */}
      {(totalLeads === 0 || showDebug) && (
        <Card className="glow-card p-6 border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Bug className="w-5 h-5 mr-2 text-yellow-400" />
              Database Connection Diagnostics
            </h3>
            <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              {showDebug ? 'Hide' : 'Show'} Diagnostics
            </Button>
          </div>
          
          {showDebug && (
            <div>
              <p className="text-yellow-300 mb-4">
                {totalLeads === 0 
                  ? "📊 No leads found. Run diagnostics to test your Supabase connection."
                  : "🔧 Use these tools to test and debug your database connection."
                }
              </p>
              <SupabaseTestComponent />
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
