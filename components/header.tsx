"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Leads", href: "/leads" },
  { name: "Follow-ups", href: "/follow-ups" },
  { name: "Add Lead", href: "/add-lead" },
]

// Function to get current page info and breadcrumb
const getCurrentPageInfo = (pathname: string) => {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      breadcrumb: 'Dashboard'
    }
  }
  
  if (pathname === '/leads') {
    return {
      title: 'Leads',
      breadcrumb: 'Dashboard › Leads'
    }
  }
  
  if (pathname === '/add-lead') {
    return {
      title: 'Add Lead',
      breadcrumb: 'Dashboard › Leads › Add Lead'
    }
  }
  
  if (pathname.startsWith('/leads/') && pathname.includes('/edit')) {
    return {
      title: 'Edit Lead',
      breadcrumb: 'Dashboard › Leads › Edit Lead'
    }
  }
  
  if (pathname.startsWith('/leads/') && pathname.includes('/schedule-followup')) {
    return {
      title: 'Schedule Follow-up',
      breadcrumb: 'Dashboard › Leads › Schedule Follow-up'
    }
  }
  
  if (pathname.startsWith('/leads/') && !pathname.includes('/edit') && !pathname.includes('/schedule-followup')) {
    return {
      title: 'Lead Details',
      breadcrumb: 'Dashboard › Leads › Lead Details'
    }
  }
  
  if (pathname === '/follow-ups') {
    return {
      title: 'Follow-ups',
      breadcrumb: 'Dashboard › Follow-ups'
    }
  }
  
  // Default fallback
  return {
    title: 'MCA CRM',
    breadcrumb: 'Dashboard'
  }
}

export function Header() {
  const pathname = usePathname()
  const pageInfo = getCurrentPageInfo(pathname)

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink opacity-50 blur-sm"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                MCA CRM <span className="gradient-text">Lead Management Platform</span>
              </h1>
              <div className="text-xs text-muted-foreground font-medium">{pageInfo.breadcrumb}</div>
            </div>
          </div>

          {/* Current Page Title */}
          <div className="hidden md:flex items-center">
            <div className="text-lg font-semibold text-white">
              {pageInfo.title}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 group",
                  pathname === item.href
                    ? "text-white bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 shadow-glow"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 blur-sm"></div>
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/0 to-neon-pink/0 group-hover:from-neon-purple/5 group-hover:to-neon-pink/5 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}