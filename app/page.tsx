import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <DashboardContent />
      </main>
    </div>
  )
}
