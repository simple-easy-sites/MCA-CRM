import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, TrendingUp, Users, Clock } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-600 mt-1">Overview of your merchant cash advance pipeline</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Leads</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">0</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">Start adding leads to see metrics</span>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Follow-ups Due</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">0</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">No follow-ups scheduled</span>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">In Pipeline</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">0</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">No active pipeline</span>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Closed This Month</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">0</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-500">No deals closed yet</span>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Leads</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search leads..." className="pl-10 w-64 bg-white/80 border-slate-200/60" />
            </div>
            <Button variant="outline" className="border-slate-200/60 bg-white/80">
              View All
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200/60 text-sm font-medium text-slate-600">
          <div className="col-span-2">Business Name</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Monthly Revenue</div>
          <div className="col-span-2">Funding Amount</div>
          <div className="col-span-2">Stage</div>
          <div className="col-span-1">Positions</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Empty State */}
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-slate-900 mb-2">No leads yet</h4>
          <p className="text-slate-600 mb-6">Get started by adding your first lead to the system.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Lead
          </Button>
        </div>
      </Card>
    </div>
  )
}
