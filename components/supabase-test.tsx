"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { leadService } from '@/lib/supabase-service'

export function SupabaseTestComponent() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runTests = async () => {
    setTesting(true)
    setTestResults([])

    try {
      // Test 1: Environment Variables
      addLog("🔧 Testing environment variables...")
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        addLog("❌ Environment variables missing!")
        addLog(`URL: ${url ? 'Found' : 'Missing'}`)
        addLog(`Key: ${key ? 'Found' : 'Missing'}`)
        return
      }
      addLog("✅ Environment variables found")

      // Test 2: Basic Supabase Connection
      addLog("🔗 Testing basic Supabase connection...")
      try {
        const { data, error } = await supabase.from('leads').select('count').limit(1)
        if (error) {
          addLog(`❌ Connection error: ${error.message}`)
          return
        }
        addLog("✅ Basic connection successful")
      } catch (error) {
        addLog(`❌ Connection failed: ${error}`)
        return
      }

      // Test 3: Database Schema Check
      addLog("🗄️ Testing database schema...")
      try {
        const { data, error } = await supabase.from('leads').select('*').limit(1)
        if (error) {
          if (error.message.includes('relation "leads" does not exist')) {
            addLog("❌ Database schema not created! Run the SQL schema in Supabase first.")
            return
          }
          addLog(`❌ Schema error: ${error.message}`)
          return
        }
        addLog("✅ Database schema exists")
      } catch (error) {
        addLog(`❌ Schema check failed: ${error}`)
        return
      }

      // Test 4: Create Test Lead
      addLog("📝 Testing lead creation...")
      try {
        const testLead = {
          business_name: "Test Business " + Date.now(),
          owner_name: "Test Owner",
          phone: "(555) 123-4567",
          email: "test@test.com",
          business_type: "Restaurant",
          business_type_details: "Pizza Shop",
          credit_score: 650,
          funding_amount: 50000,
          monthly_revenue: 25000,
          funding_purpose: "Equipment",
          payback_time: "12-months",
          has_mca_history: false,
          has_defaults: false,
          default_details: "",
          stage: "Prospect",
          next_followup: "",
          internal_notes: "Test lead from diagnostic",
          current_positions: []
        }

        const newLead = await leadService.createLead(testLead)
        addLog(`✅ Test lead created successfully! ID: ${newLead.id}`)

        // Test 5: Verify Lead was Saved
        addLog("🔍 Verifying lead was saved...")
        const savedLead = await leadService.getLeadById(newLead.id)
        if (savedLead) {
          addLog("✅ Lead verified in database")
        } else {
          addLog("❌ Lead not found in database")
        }

        // Test 6: Clean up
        addLog("🧹 Cleaning up test lead...")
        await leadService.deleteLead(newLead.id)
        addLog("✅ Test lead deleted")

        addLog("🎉 ALL TESTS PASSED! Your Supabase connection is working!")

      } catch (error) {
        addLog(`❌ Lead creation failed: ${error}`)
      }

    } catch (error) {
      addLog(`❌ Unexpected error: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">🧪 Supabase Connection Test</h2>
      
      <Button 
        onClick={runTests} 
        disabled={testing}
        className="mb-4"
      >
        {testing ? "Running Tests..." : "Run Diagnostic Tests"}
      </Button>

      <div className="space-y-2 max-h-96 overflow-y-auto bg-black/20 p-4 rounded">
        {testResults.length === 0 ? (
          <p className="text-gray-400">Click "Run Diagnostic Tests" to test your Supabase connection</p>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="text-sm font-mono text-white">
              {result}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}