import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Phone, Mail, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

interface LeadDetailContentProps {
  leadId: string
}

export function LeadDetailContent({ leadId }: LeadDetailContentProps) {
  // This would normally fetch lead data based on leadId
  // For now, showing the structure with placeholder data

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
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Lead Details</h2>
            <p className="text-slate-600 mt-1">Complete information for this lead</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-200/60 bg-white/80">
            <Edit className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-600">Business Name</label>
                <p className="text-slate-900 font-medium mt-1">No data available</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Owner Name</label>
                <p className="text-slate-900 font-medium mt-1">No data available</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Phone Number</label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 text-slate-400 mr-2" />
                  <p className="text-slate-900">No data available</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email Address</label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 text-slate-400 mr-2" />
                  <p className="text-slate-900">No data available</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Business Type</label>
                <p className="text-slate-900 font-medium mt-1">No data available</p>
              </div>
            </div>
          </Card>

          {/* Funding Requirements */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Funding Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-600">Funding Amount Needed</label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                  <p className="text-slate-900 font-medium">No data available</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Monthly Revenue</label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-slate-400 mr-1" />
                  <p className="text-slate-900 font-medium">No data available</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Payback Time</label>
                <p className="text-slate-900 font-medium mt-1">No data available</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Purpose of Funding</label>
                <p className="text-slate-900 mt-1">No data available</p>
              </div>
            </div>
          </Card>

          {/* Current Positions */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Positions</h3>

            {/* Empty State for Positions */}
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm">No current positions recorded</p>
            </div>
          </Card>

          {/* MCA History */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">MCA History</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Previous MCA Experience</label>
                <p className="text-slate-900 font-medium mt-1">No data available</p>
              </div>
            </div>
          </Card>

          {/* Activity Timeline */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h3>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm">No activities recorded yet</p>
              <Button variant="outline" className="mt-3 border-slate-200/60 bg-white/80">
                Add First Activity
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Status */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Status</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Current Stage</label>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    Initial Contact
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Next Follow-up</label>
                <p className="text-slate-900 font-medium mt-1">Not scheduled</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Lead Created</label>
                <p className="text-slate-600 text-sm mt-1">No data available</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                <Phone className="w-4 h-4 mr-2" />
                Call Lead
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-200/60 bg-white/80">
                <Edit className="w-4 h-4 mr-2" />
                Update Stage
              </Button>
            </div>
          </Card>

          {/* Internal Notes */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Internal Notes</h3>
            <div className="text-center py-4">
              <p className="text-slate-600 text-sm">No notes added yet</p>
              <Button variant="outline" className="mt-3 border-slate-200/60 bg-white/80">
                Add Note
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
