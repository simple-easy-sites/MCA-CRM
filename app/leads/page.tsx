import { Header } from "@/components/header"
import { LeadsContent } from "@/components/leads-content"

export default function Leads() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <LeadsContent />
      </main>
    </div>
  )
}
