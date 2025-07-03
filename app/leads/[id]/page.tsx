import { Header } from "@/components/header"
import { LeadDetailContent } from "@/components/lead-detail-content"

export default function LeadDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <LeadDetailContent leadId={params.id} />
      </main>
    </div>
  )
}
