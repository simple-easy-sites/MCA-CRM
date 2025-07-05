import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LeadProvider } from "@/contexts/lead-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCA CRM",
  description: "Merchant Cash Advance Customer Relationship Management System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LeadProvider>
          {children}
          <Toaster />
        </LeadProvider>
      </body>
    </html>
  )
}
