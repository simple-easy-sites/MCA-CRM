"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Phone, Mail, Calendar, DollarSign, Star, Clock, Download } from "lucide-react"
import Link from "next/link"
import { useLeads } from "@/contexts/lead-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency, formatPhoneNumber } from "@/lib/format-utils"

interface LeadDetailContentProps {
  leadId: string
}

export function LeadDetailContent({ leadId }: LeadDetailContentProps) {
  const { getLeadById, updateLead } = useLeads()
  const router = useRouter()
  const { toast } = useToast()

  const lead = getLeadById(leadId)

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleDateString()
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prospect":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
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

  const totalOriginal = lead.current_positions.reduce((sum, pos) => sum + pos.original_amount, 0)
  const totalRemaining = lead.current_positions.reduce((sum, pos) => sum + pos.current_balance, 0)
  const formattedPhone = formatPhoneNumber(lead.phone)

  const exportToPDF = () => {
    // Create a simple HTML content for PDF export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lead Report - ${lead.business_name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lead Report</h1>
          <h2>${lead.business_name}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h3>Business Information</h3>
          <div class="grid">
            <div class="field">
              <div class="label">Business Name:</div>
              <div class="value">${lead.business_name}</div>
            </div>
            <div class="field">
              <div class="label">Owner Name:</div>
              <div class="value">${lead.owner_name}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${formattedPhone}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${lead.email || "Not provided"}</div>
            </div>
            <div class="field">
              <div class="label">Business Type:</div>
              <div class="value">${lead.business_type || "Not specified"}</div>
            </div>
            <div class="field">
              <div class="label">Business Details:</div>
              <div class="value">${lead.business_type_details || "Not specified"}</div>
            </div>
            <div class="field">
              <div class="label">Credit Score:</div>
              <div class="value">${lead.credit_score || "Not provided"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Funding Requirements</h3>
          <div class="grid">
            <div class="field">
              <div class="label">Funding Amount:</div>
              <div class="value">${formatCurrency(lead.funding_amount)}</div>
            </div>
            <div class="field">
              <div class="label">Monthly Revenue:</div>
              <div class="value">${formatCurrency(lead.monthly_revenue)}</div>
            </div>
            <div class="field">
              <div class="label">Payback Time:</div>
              <div class="value">${lead.payback_time || "Not specified"}</div>
            </div>
            <div class="field">
              <div class="label">Purpose:</div>
              <div class="value">${lead.funding_purpose || "Not specified"}</div>
            </div>
          </div>
        </div>

        ${
          lead.current_positions.length > 0
            ? `
        <div class="section">
          <h3>Current Positions</h3>
          <table>
            <thead>
              <tr>
                <th>Lender Name</th>
                <th>Original Amount</th>
                <th>Current Balance</th>
                <th>Payment Frequency</th>
              </tr>
            </thead>
            <tbody>
              ${lead.current_positions
                .map(
                  (pos) => `
                <tr>
                  <td>${pos.lender_name}</td>
                  <td>${formatCurrency(pos.original_amount)}</td>
                  <td>${formatCurrency(pos.current_balance)}</td>
                  <td>${pos.payment_frequency}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <p><strong>Summary:</strong> ${lead.current_positions.length} positions totaling ${formatCurrency(totalOriginal)} original / ${formatCurrency(totalRemaining)} remaining</p>
        </div>
        `
            : ""
        }

        <div class="section">
          <h3>Lead Status</h3>
          <div class="grid">
            <div class="field">
              <div class="label">Current Stage:</div>
              <div class="value">${lead.stage}</div>
            </div>
            <div class="field">
              <div class="label">Next Follow-up:</div>
              <div class="value">${formatDate(lead.next_followup)}</div>
            </div>
            <div class="field">
              <div class="label">Created:</div>
              <div class="value">${new Date(lead.created_at).toLocaleDateString()}</div>
            </div>
            <div class="field">
              <div class="label">Last Updated:</div>
              <div class="value">${new Date(lead.updated_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>MCA History</h3>
          <div class="field">
            <div class="label">Previous MCA Experience:</div>
            <div class="value">${lead.has_mca_history ? "Yes" : "No"}</div>
          </div>
          ${
            lead.has_mca_history
              ? `
          <div class="field">
            <div class="label">Has Defaults:</div>
            <div class="value">${lead.has_defaults ? "Yes" : "No"}</div>
          </div>
          `
              : ""
          }
          ${
            lead.has_defaults && lead.default_details
              ? `
          <div class="field">
            <div class="label">Default Details:</div>
            <div class="value">${lead.default_details}</div>
          </div>
          `
              : ""
          }
        </div>

        ${
          lead.internal_notes
            ? `
        <div class="section">
          <h3>Internal Notes</h3>
          <div class="value">${lead.internal_notes.replace(/\n/g, "<br>")}</div>
        </div>
        `
            : ""
        }
      </body>
      </html>
    `

    // Create a new window and print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }

    toast({
      title: "PDF Export",
      description: "Lead report opened in new window for printing/saving as PDF",
    })
  }

  const handleEmail = () => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`)
      toast({
        title: "Email opened",
        description: `Opening email to ${lead.email}`,
      })
    }
  }

  const markHighPriority = () => {
    const updatedLead = {
      ...lead,
      internal_notes: lead.internal_notes
        ? `${lead.internal_notes}\n\n[${new Date().toLocaleDateString()}] Marked as HIGH PRIORITY lead`
        : `[${new Date().toLocaleDateString()}] Marked as HIGH PRIORITY lead`,
      updated_at: new Date().toISOString(),
    }
    updateLead(updatedLead)
    toast({
      title: "Lead Updated",
      description: "Lead marked as high priority",
    })
  }

  const updateStage = (newStage: string) => {
    const updatedLead = {
      ...lead,
      stage: newStage,
      internal_notes: lead.internal_notes
        ? `${lead.internal_notes}\n\n[${new Date().toLocaleDateString()}] Stage updated to: ${newStage}`
        : `[${new Date().toLocaleDateString()}] Stage updated to: ${newStage}`,
      updated_at: new Date().toISOString(),
    }
    updateLead(updatedLead)
    toast({
      title: "Stage Updated",
      description: `Lead stage updated to ${newStage}`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/leads">
            <Button className="glow-button text-white font-semibold" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leads
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              <span className="gradient-text">{lead.business_name}</span>
            </h2>
            <p className="text-muted-foreground mt-1">Lead details and information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="glow-button text-white font-semibold" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="glow-button text-white font-semibold" onClick={() => router.push(`/leads/${leadId}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button
            className="glow-button text-white font-semibold"
            onClick={() => router.push(`/leads/${leadId}/schedule-followup`)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                <p className="text-white font-medium mt-1">{lead.business_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Owner Name</label>
                <p className="text-white font-medium mt-1">{lead.owner_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 text-muted-foreground mr-2" />
                  <p className="text-white">{formattedPhone}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                  <p className="text-white">{lead.email || "Not provided"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                <p className="text-white font-medium mt-1">{lead.business_type || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Details</label>
                <p className="text-white font-medium mt-1">{lead.business_type_details || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Credit Score</label>
                <p className="text-white font-medium mt-1">{lead.credit_score || "Not provided"}</p>
              </div>
            </div>
          </Card>

          {/* Funding Requirements */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Funding Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Funding Amount Needed</label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                  <p className="text-white font-medium">{formatCurrency(lead.funding_amount)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monthly Revenue</label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                  <p className="text-white font-medium">{formatCurrency(lead.monthly_revenue)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payback Time</label>
                <p className="text-white font-medium mt-1">{lead.payback_time || "Not specified"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Purpose of Funding</label>
                <p className="text-white mt-1">{lead.funding_purpose || "Not specified"}</p>
              </div>
            </div>
          </Card>

          {/* Current Positions */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Positions</h3>

            {lead.current_positions.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-sm font-medium text-muted-foreground pb-2">Lender Name</th>
                        <th className="text-left text-sm font-medium text-muted-foreground pb-2">Original Amount</th>
                        <th className="text-left text-sm font-medium text-muted-foreground pb-2">Current Balance</th>
                        <th className="text-left text-sm font-medium text-muted-foreground pb-2">Payment Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lead.current_positions.map((position) => (
                        <tr key={position.id} className="border-b border-white/5">
                          <td className="py-3 text-white font-medium">{position.lender_name}</td>
                          <td className="py-3 text-white">{formatCurrency(position.original_amount)}</td>
                          <td className="py-3 text-white">{formatCurrency(position.current_balance)}</td>
                          <td className="py-3 text-white">{position.payment_frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-sm text-blue-300">
                    <strong>Summary:</strong> {lead.current_positions.length} positions totaling{" "}
                    <span className="font-medium">{formatCurrency(totalOriginal)}</span> original /{" "}
                    <span className="font-medium">{formatCurrency(totalRemaining)}</span> remaining
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No current positions recorded</p>
              </div>
            )}
          </Card>

          {/* MCA History */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">MCA History</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Previous MCA Experience</label>
                <p className="text-white font-medium mt-1">{lead.has_mca_history ? "Yes" : "No"}</p>
              </div>
              {lead.has_mca_history && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Has Defaults</label>
                  <p className="text-white font-medium mt-1">{lead.has_defaults ? "Yes" : "No"}</p>
                </div>
              )}
              {lead.has_mca_history && lead.has_defaults && lead.default_details && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Default Details</label>
                  <p className="text-white mt-1">{lead.default_details}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Internal Notes */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Internal Notes</h3>
            {lead.internal_notes ? (
              <p className="text-white whitespace-pre-wrap">{lead.internal_notes}</p>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">No notes added yet</p>
                <Button className="mt-3 glow-button text-white font-semibold">Add Note</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Status */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Lead Status</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Stage</label>
                <div className="mt-2">
                  <Badge className={`${getStageColor(lead.stage)} border font-medium`}>{lead.stage}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Follow-up</label>
                <p className="text-white font-medium mt-1">{formatDate(lead.next_followup)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Lead Created</label>
                <p className="text-muted-foreground text-sm mt-1">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-muted-foreground text-sm mt-1">{new Date(lead.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start glow-button text-white font-semibold"
                onClick={() => router.push(`/leads/${leadId}/schedule-followup`)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Set Follow-Up
              </Button>
              <Button className="w-full justify-start glow-button text-white font-semibold" onClick={markHighPriority}>
                <Star className="w-4 h-4 mr-2" />
                Mark as High Priority
              </Button>
              <Button
                className="w-full justify-start glow-button text-white font-semibold"
                onClick={handleEmail}
                disabled={!lead.email}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button
                className="w-full justify-start glow-button text-white font-semibold"
                onClick={() => router.push(`/leads/${leadId}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Lead
              </Button>
            </div>
          </Card>

          {/* Stage Updates */}
          <Card className="glow-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Update Stage</h3>
            <div className="space-y-2">
              {[
                "Prospect",
                "Initial Contact",
                "Email Sent",
                "Bank Statements Received",
                "Submitted to Underwriting",
                "Offer Presented",
                "Closed",
              ].map((stage) => (
                <Button
                  key={stage}
                  variant="outline"
                  className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10 text-sm"
                  onClick={() => updateStage(stage)}
                  disabled={lead.stage === stage}
                >
                  <Clock className="w-3 h-3 mr-2" />
                  {stage}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
