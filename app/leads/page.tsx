import { Header } from "@/components/header"
import { LeadsContent } from "@/components/leads-content"

export default function Leads() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <LeadsContent />
      </main>
    </div>
  )
}
