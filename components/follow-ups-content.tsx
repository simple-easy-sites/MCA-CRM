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
  Search
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newFollowUp, setNewFollowUp] = useState({
    scheduled_for: "",
    follow_up_type: "call",
    subject: "",
    notes: ""
  })

  // Convert leads with follow-ups to follow-up objects for easier handling
  const followUps: FollowUp[] = leads
    .filter(lead => lead.next_followup)
    .map(lead => ({
      id: `lead-${lead.id}`,
      lead_id: lead.id,
      scheduled_for: lead.next_followup,
      follow_up_type: "call",
      subject: `Follow up with ${lead.business_name}`,
      notes: lead.internal_notes || "",
      completed: false,
      lead: {
        business_name: lead.business_name,
        owner_name: lead.owner_name,
        phone: lead.phone,
        email: lead.email || "",
        stage: lead.stage
      }
    }))

  // Filter follow-ups based on current filter and search
  const filteredFollowUps = followUps.filter(followUp => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      followUp.lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.lead.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.subject.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

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

  // Sort by scheduled time
  const sortedFollowUps = filteredFollowUps.sort((a, b) => 
    new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
  )

  const handleCompleteFollowUp = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId)
      if (!lead) return

      // Update the lead to clear the follow-up
      const updatedLead = {
        ...lead,
        next_followup: "", // Clear the follow-up
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
    if (!selectedLead || !newFollowUp.scheduled_for) return

    try {
      const updatedLead = {
        ...selectedLead,
        next_followup: newFollowUp.scheduled_for,
        internal_notes: selectedLead.internal_notes + 
          `\\n\\n[${new Date().toLocaleString()}] Scheduled ${newFollowUp.follow_up_type}: ${newFollowUp.subject}`
      }

      await updateLead(updatedLead)
      
      setShowAddDialog(false)
      setSelectedLead(null)
      setNewFollowUp({
        scheduled_for: "",
        follow_up_type: "call",
        subject: "",
        notes: ""
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

  const getStatusColor = (followUp: FollowUp) => {
    if (followUp.completed) return "bg-green-500/20 text-green-300 border-green-500/30"
    
    const now = new Date()
    const followUpDate = new Date(followUp.scheduled_for)
    
    if (followUpDate <= now) return "bg-red-500/20 text-red-300 border-red-500/30" // Overdue
    
    const hoursUntil = (followUpDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursUntil <= 24) return "bg-orange-500/20 text-orange-300 border-orange-500/30" // Due soon
    
    return "bg-blue-500/20 text-blue-300 border-blue-500/30" // Upcoming
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
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString()
    }
  }

  const stats = {
    total: followUps.length,
    due: followUps.filter(f => new Date(f.scheduled_for) <= new Date() && !f.completed).length,
    upcoming: followUps.filter(f => new Date(f.scheduled_for) > new Date() && !f.completed).length,
    completed: followUps.filter(f => f.completed).length
  }

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
            <p className="text-muted-foreground mt-1 text-lg">Manage all your scheduled follow-ups</p>
          </div>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="glow-button text-white font-semibold px-6">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Follow-up
            </Button>
          </DialogTrigger>
          <DialogContent className="glow-card border-white/20">
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

              <div className="space-y-2">
                <Label className="text-white">Date & Time</Label>
                <Input
                  type="datetime-local"
                  className="glow-input"
                  value={newFollowUp.scheduled_for}
                  onChange={(e) => setNewFollowUp(prev => ({ ...prev, scheduled_for: e.target.value }))}
                />
              </div>

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
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="note">Note/Reminder</SelectItem>
                  </SelectContent>
                </Select>
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
                  disabled={!selectedLead || !newFollowUp.scheduled_for}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase">Total</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="glow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase">Due Now</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{stats.due}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>

        <Card className="glow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase">Upcoming</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">{stats.upcoming}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="glow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase">Completed</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search follow-ups..."
                className="glow-input pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="glow-input w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Follow-ups</SelectItem>
                <SelectItem value="due">Due Now</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Follow-ups List */}
        <div className="space-y-4">
          {sortedFollowUps.length > 0 ? (
            sortedFollowUps.map((followUp) => {
              const dateTime = formatDateTime(followUp.scheduled_for)
              const statusColor = getStatusColor(followUp)
              const statusText = getStatusText(followUp)

              return (
                <Card key={followUp.id} className="glow-card p-4 border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-white text-lg">{followUp.subject}</h3>
                        <Badge className={`${statusColor} border font-medium`}>
                          {statusText}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Business</p>
                          <p className="text-white font-medium">{followUp.lead.business_name}</p>
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
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{dateTime.date} at {dateTime.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="capitalize">{followUp.follow_up_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
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
                </Card>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? "No follow-ups found" : "No follow-ups scheduled"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms or filters" 
                  : "Schedule your first follow-up to get started"
                }
              </p>
              {!searchTerm && (
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
      </Card>
    </div>
  )
}