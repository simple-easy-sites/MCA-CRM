import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download } from "lucide-react"

export function LeadsContent() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">All Leads</h2>
          <p className="text-slate-600 mt-1">Manage and track all your merchant cash advance leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-200/60 bg-white/80">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by business name, owner, or email..."
                className="pl-10 w-80 bg-white/80 border-slate-200/60"
              />
            </div>
            <Button variant="outline" className="border-slate-200/60 bg-white/80">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="text-sm text-slate-600">
            Showing <span className="font-medium">0</span> of <span className="font-medium">0</span> leads
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200/60 text-sm font-medium text-slate-600">
            <div className="col-span-2">Business Name</div>
            <div className="col-span-2">Owner Name</div>
            <div className="col-span-1">Monthly Revenue</div>
            <div className="col-span-1">Funding Amount</div>
            <div className="col-span-2">Contact Info</div>
            <div className="col-span-1">Positions</div>
            <div className="col-span-1">Stage</div>
            <div className="col-span-1">Next Follow-up</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Empty State */}
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-slate-900 mb-2">No leads found</h4>
          <p className="text-slate-600 mb-6">Start building your pipeline by adding leads to track and manage.</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Lead
          </Button>
        </div>
      </Card>
    </div>
  )
}
