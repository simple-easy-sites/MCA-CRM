import { Header } from "@/components/header"
import { ScheduleFollowupContent } from "@/components/schedule-followup-content"

export default function ScheduleFollowup({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <ScheduleFollowupContent leadId={params.id} />
      </main>
    </div>
  )
}
