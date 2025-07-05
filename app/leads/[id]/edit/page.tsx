import { Header } from "@/components/header"
import { EditLeadContent } from "@/components/edit-lead-content"

export default function EditLead({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <EditLeadContent leadId={params.id} />
      </main>
    </div>
  )
}
