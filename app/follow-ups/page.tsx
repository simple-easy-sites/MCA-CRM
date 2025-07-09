import { Header } from "@/components/header"
import { FollowUpsContent } from "@/components/follow-ups-content"

export default function FollowUpsPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <FollowUpsContent />
      </main>
    </div>
  )
}