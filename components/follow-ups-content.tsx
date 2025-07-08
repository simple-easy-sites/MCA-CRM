"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimePicker, TimePickerQuick } from "@/components/ui/time-picker"
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Plus,
  ArrowLeft,
  Search,
  TrendingUp,
  Users,
  Star,
  CalendarDays,
  SortAsc,
  SortDesc,
  Flame,
  Target
} from "lucide-react"
import { useLeads } from "@/contexts/lead-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatPhoneNumber } from "@/lib/format-utils"
import Link from "next/link"

interface FollowUp {
  id: string
  lead_id: string
  scheduled_for: string
  follow_up_type: string
  subject: string
  notes: string
  priority: "low" | "medium" | "high" | "urgent"
  completed: boolean
  lead: {
    business_name: string
    owner_name: string
    phone: string
    email: string
    stage: string
  }
}

export function FollowUpsContent() {
  const { leads, updateLead } = useLeads()
  const router = useRouter()
  const { toast } = useToast()
  const [filter, setFilter] = useState("all") // all, due, upcoming, completed
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date") // date, priority, alphabetical
  const [sortOrder, setSortOrder] = useState("asc") // asc, desc
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState({
    scheduled_date: "",
    scheduled_time: "09:00",
    follow_up_type: "call",
    subject: "",
    notes: "",
    priority: "medium"
  })

  // Convert leads with follow-ups to follow-up objects
  const followUps: FollowUp[] = leads
    .filter(lead => lead.next_followup && lead.next_followup.trim() !== '')
    .map(lead => {
      // Extract follow-up type from internal notes or default to 'call'
      let followUpType = 'call'
      if (lead.internal_notes && lead.internal_notes.includes('scheduled')) {
        if (lead.internal_notes.toLowerCase().includes('email')) followUpType = 'email'
        if (lead.internal_notes.toLowerCase().includes('text')) followUpType = 'text'
      }
      
      return {
        id: `lead-${lead.id}`,
        lead_id: lead.id,
        scheduled_for: lead.next_followup,
        follow_up_type: followUpType,
        subject: `Follow up with ${lead.business_name}`,
        notes: lead.followup_notes || '',
        priority: (lead.followup_priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        completed: false,
        lead: {
          business_name: lead.business_name,
          owner_name: lead.owner_name,
          phone: lead.phone,
          email: lead.email || '',
          stage: lead.stage
        }
      }
    })

  // Filter follow-ups
  const filteredFollowUps = followUps.filter(followUp => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      followUp.lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.lead.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.subject.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    // Priority filter
    if (priorityFilter !== "all" && followUp.priority !== priorityFilter) return false

    // Month filter
    if (monthFilter !== "all") {
      const followUpMonth = new Date(followUp.scheduled_for).getMonth()
      const filterMonth = parseInt(monthFilter)
      if (followUpMonth !== filterMonth) return false
    }

    // Status filter
    const now = new Date()
    const followUpDate = new Date(followUp.scheduled_for)

    switch (filter) {
      case "due":
        return followUpDate <= now && !followUp.completed
      case "upcoming":
        return followUpDate > now && !followUp.completed
      case "completed":
        return followUp.completed
      case "all":
      default:
        return true
    }
  })

  // Sort follow-ups
  const sortedFollowUps = [...filteredFollowUps].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
        break
      case "alphabetical":
        comparison = a.lead.business_name.localeCompare(b.lead.business_name)
        break
      case "date":
      default:
        comparison = new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
        break
    }

    return sortOrder === "desc" ? -comparison : comparison
  })

  const handleCompleteFollowUp = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId)
      if (!lead) return

      const updatedLead = {
        ...lead,
        next_followup: "",
        followup_priority: "medium" as "low" | "medium" | "high" | "urgent",
        followup_notes: "",
        internal_notes: lead.internal_notes + `\\n\\n[${new Date().toLocaleString()}] Follow-up completed.`
      }

      await updateLead(updatedLead)
      toast({
        title: "Follow-up Completed",
        description: "Follow-up has been marked as completed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow-up.",
        variant: "destructive",
      })
    }
  }

  const handleScheduleFollowUp = async () => {
    if (!selectedLead || !newFollowUp.scheduled_date) return

    try {
      const dateTimeString = `${newFollowUp.scheduled_date}T${newFollowUp.scheduled_time}:00`
      
      const updatedLead = {
        ...selectedLead,
        next_followup: dateTimeString,
        followup_priority: newFollowUp.priority as "low" | "medium" | "high" | "urgent",
        followup_notes: newFollowUp.notes,
        internal_notes: selectedLead.internal_notes + 
          `\\n\\n[${new Date().toLocaleString()}] Scheduled ${newFollowUp.follow_up_type}: ${newFollowUp.subject} (${newFollowUp.priority} priority)`
      }

      await updateLead(updatedLead)
      
      setShowAddDialog(false)
      setSelectedLead(null)
      setNewFollowUp({
        scheduled_date: "",
        scheduled_time: "09:00",
        follow_up_type: "call",
        subject: "",
        notes: "",
        priority: "medium"
      })

      toast({
        title: "Follow-up Scheduled",
        description: "New follow-up has been scheduled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule follow-up.",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "medium":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "low":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Flame className="w-3 h-3" />
      case "high":
        return <TrendingUp className="w-3 h-3" />
      case "medium":
        return <Target className="w-3 h-3" />
      case "low":
        return <Users className="w-3 h-3" />
      default:
        return <Target className="w-3 h-3" />
    }
  }

  const getStatusColor = (followUp: FollowUp) => {
    if (followUp.completed) return "bg-green-500/20 text-green-300 border-green-500/30"
    
    const now = new Date()
    const followUpDate = new Date(followUp.scheduled_for)
    
    if (followUpDate <= now) return "bg-red-500/20 text-red-300 border-red-500/30"
    
    const hoursUntil = (followUpDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursUntil <= 24) return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    
    return "bg-blue-500/20 text-blue-300 border-blue-500/30"
  }

  const getStatusText = (followUp: FollowUp) => {
    if (followUp.completed) return "Completed"
    
    const now = new Date()
    const followUpDate = new Date(followUp.scheduled_for)
    
    if (followUpDate <= now) return "Overdue"
    
    const hoursUntil = (followUpDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursUntil <= 24) return "Due Soon"
    
    return "Upcoming"
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let dateLabel = date.toLocaleDateString()
    if (date.toDateString() === today.toDateString()) {
      dateLabel = "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Tomorrow"
    }
    
    return {
      date: dateLabel,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
    }
  }

  const stats = {
    total: followUps.length,
    due: followUps.filter(f => new Date(f.scheduled_for) <= new Date() && !f.completed).length,
    upcoming: followUps.filter(f => new Date(f.scheduled_for) > new Date() && !f.completed).length,
    completed: followUps.filter(f => f.completed).length,
    urgent: followUps.filter(f => f.priority === "urgent" && !f.completed).length,
    high: followUps.filter(f => f.priority === "high" && !f.completed).length
  }

  const months = [
    { value: "0", label: "January" }, { value: "1", label: "February" }, { value: "2", label: "March" },
    { value: "3", label: "April" }, { value: "4", label: "May" }, { value: "5", label: "June" },
    { value: "6", label: "July" }, { value: "7", label: "August" }, { value: "8", label: "September" },
    { value: "9", label: "October" }, { value: "10", label: "November" }, { value: "11", label: "December" }
  ]

  return (
    <div className="space-y-8 slide-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Follow-up <span className="gradient-text">Center</span>
            </h2>
            <p className="text-muted-foreground mt-1 text-lg">Manage and organize all your scheduled follow-ups</p>
          </div>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="glow-button text-white font-semibold px-6">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="glow-card border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Schedule New Follow-up</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Select Lead</Label>
                <Select 
                  value={selectedLead?.id || ""} 
                  onValueChange={(leadId) => {
                    const lead = leads.find(l => l.id === leadId)
                    setSelectedLead(lead)
                    setNewFollowUp(prev => ({
                      ...prev,
                      subject: lead ? `Follow up with ${lead.business_name}` : ""
                    }))
                  }}
                >
                  <SelectTrigger className="glow-input">
                    <SelectValue placeholder="Choose a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.business_name} - {lead.owner_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Date</Label>
                  <Input
                    type="date"
                    className="glow-input"
                    value={newFollowUp.scheduled_date}
                    onChange={(e) => setNewFollowUp(prev => ({ ...prev, scheduled_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Time</Label>
                  <TimePicker
                    value={newFollowUp.scheduled_time}
                    onChange={(time) => setNewFollowUp(prev => ({ ...prev, scheduled_time: time }))}
                    placeholder="Select time"
                  />
                </div>
              </div>

              <TimePickerQuick
                value={newFollowUp.scheduled_time}
                onChange={(time) => setNewFollowUp(prev => ({ ...prev, scheduled_time: time }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Type</Label>
                  <Select 
                    value={newFollowUp.follow_up_type} 
                    onValueChange={(value) => setNewFollowUp(prev => ({ ...prev, follow_up_type: value }))}
                  >
                    <SelectTrigger className="glow-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Priority</Label>
                  <Select 
                    value={newFollowUp.priority} 
                    onValueChange={(value) => setNewFollowUp(prev => ({ ...prev, priority: value }))}
                  >
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

              <div className="space-y-2">
                <Label className="text-white">Subject</Label>
                <Input
                  className="glow-input"
                  value={newFollowUp.subject}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of follow-up"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Notes</Label>
                <Textarea
                  className="glow-input min-h-[80px]"
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or details"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={handleScheduleFollowUp}
                  className="glow-button text-white flex-1"
                  disabled={!selectedLead || !newFollowUp.scheduled_date}
                >
                  Schedule Follow-up
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total</p>
              <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
        </Card>

        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Due Now</p>
              <p className="text-xl font-bold text-red-400 mt-1">{stats.due}</p>
            </div>
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        </Card>

        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Upcoming</p>
              <p className="text-xl font-bold text-orange-400 mt-1">{stats.upcoming}</p>
            </div>
            <Clock className="w-6 h-6 text-orange-400" />
          </div>
        </Card>

        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Completed</p>
              <p className="text-xl font-bold text-green-400 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
        </Card>

        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Urgent</p>
              <p className="text-xl font-bold text-red-300 mt-1">{stats.urgent}</p>
            </div>
            <Flame className="w-6 h-6 text-red-300" />
          </div>
        </Card>

        <Card className="glow-card p-4 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">High Priority</p>
              <p className="text-xl font-bold text-orange-300 mt-1">{stats.high}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-300" />
          </div>
        </Card>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card className="glow-card p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Filter & Sort Follow-ups</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search follow-ups..."
                className="glow-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="glow-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Follow-ups</SelectItem>
                <SelectItem value="due">Due Now</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="glow-input">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="glow-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="alphabetical">Sort A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                setFilter("all")
                setPriorityFilter("all")
                setMonthFilter("all")
                setSearchTerm("")
                setSortBy("date")
                setSortOrder("asc")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {sortedFollowUps.length > 0 ? (
          sortedFollowUps.map((followUp) => {
            const dateTime = formatDateTime(followUp.scheduled_for)
            const statusColor = getStatusColor(followUp)
            const statusText = getStatusText(followUp)
            const priorityColor = getPriorityColor(followUp.priority)

            return (
              <Card key={followUp.id} className="glow-card border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="p-6">
                  {/* Header with prominent date/time and priority */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="bg-neon-purple/20 border border-neon-purple/50 rounded-lg p-3 min-w-[80px]">
                          <p className="text-sm font-medium text-neon-purple">{dateTime.dayName}</p>
                          <p className="text-lg font-bold text-white">{dateTime.date}</p>
                          <p className="text-sm text-muted-foreground">{dateTime.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-white text-xl">{followUp.subject}</h3>
                          <Badge className={`${priorityColor} border font-medium flex items-center space-x-1`}>
                            {getPriorityIcon(followUp.priority)}
                            <span className="capitalize">{followUp.priority}</span>
                          </Badge>
                          <Badge className={`${statusColor} border font-medium`}>
                            {statusText}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 border font-medium capitalize">
                            {followUp.follow_up_type === 'call' ? '📞 Phone Call' : 
                             followUp.follow_up_type === 'email' ? '📧 Email' : 
                             followUp.follow_up_type === 'text' ? '💬 Text' : 
                             followUp.follow_up_type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span className="capitalize">{followUp.follow_up_type}</span>
                          </div>
                          {followUp.notes && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">•</span>
                              <span className="truncate max-w-[200px]">{followUp.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!followUp.completed && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteFollowUp(followUp.lead_id)}
                          className="glow-button text-white font-semibold"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/leads/${followUp.lead_id}`)}
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                      >
                        View Lead
                      </Button>
                    </div>
                  </div>
                  
                  {/* Lead information */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Business</p>
                        <p className="text-white font-semibold">{followUp.lead.business_name}</p>
                        <p className="text-sm text-muted-foreground">{followUp.lead.owner_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <div className="flex items-center space-x-2 text-white">
                          <Phone className="w-3 h-3" />
                          <span className="text-sm">{formatPhoneNumber(followUp.lead.phone)}</span>
                        </div>
                        {followUp.lead.email && (
                          <div className="flex items-center space-x-2 text-white">
                            <Mail className="w-3 h-3" />
                            <span className="text-sm">{followUp.lead.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stage</p>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {followUp.lead.stage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filter !== "all" || priorityFilter !== "all" || monthFilter !== "all" 
                ? "No follow-ups match your filters" 
                : "No follow-ups scheduled"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filter !== "all" || priorityFilter !== "all" || monthFilter !== "all"
                ? "Try adjusting your search terms or filters" 
                : "Schedule your first follow-up to get started"
              }
            </p>
            {(!searchTerm && filter === "all" && priorityFilter === "all" && monthFilter === "all") && (
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="glow-button text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
