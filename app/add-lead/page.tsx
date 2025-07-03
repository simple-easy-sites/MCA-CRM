import { Header } from "@/components/header"
import { AddLeadContent } from "@/components/add-lead-content"

export default function AddLead() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <AddLeadContent />
      </main>
    </div>
  )
}
