import { Header } from "@/components/header"
import { LeadDetailContent } from "@/components/lead-detail-content"

export default function LeadDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <LeadDetailContent leadId={params.id} />
      </main>
    </div>
  )
}
