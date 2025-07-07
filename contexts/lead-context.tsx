"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Lead } from "@/types/lead"
import { leadService } from "@/lib/supabase-service"

interface LeadState {
  leads: Lead[]
  loading: boolean
  error: string | null
  initialized: boolean
}

type LeadAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_LEAD"; payload: Lead }
  | { type: "UPDATE_LEAD"; payload: Lead }
  | { type: "DELETE_LEAD"; payload: string }
  | { type: "LOAD_LEADS"; payload: Lead[] }
  | { type: "SET_INITIALIZED"; payload: boolean }

const initialState: LeadState = {
  leads: [],
  loading: false,
  error: null,
  initialized: false
}

function leadReducer(state: LeadState, action: LeadAction): LeadState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "ADD_LEAD":
      return { 
        ...state, 
        leads: [action.payload, ...state.leads],
        loading: false,
        error: null
      }
    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((lead) => (lead.id === action.payload.id ? action.payload : lead)),
        loading: false,
        error: null
      }
    case "DELETE_LEAD":
      return { 
        ...state, 
        leads: state.leads.filter((lead) => lead.id !== action.payload),
        loading: false,
        error: null
      }
    case "LOAD_LEADS":
      return { 
        ...state, 
        leads: action.payload,
        loading: false,
        error: null
      }
    case "SET_INITIALIZED":
      return { ...state, initialized: action.payload }
    default:
      return state
  }
}

interface LeadContextType extends LeadState {
  addLead: (lead: Omit<Lead, "id" | "created_at" | "updated_at">) => Promise<void>
  updateLead: (lead: Lead) => Promise<void>
  deleteLead: (id: string) => Promise<void>
  getLeadById: (id: string) => Lead | undefined
  refreshLeads: () => Promise<void>
  searchLeads: (searchTerm: string) => Promise<Lead[]>
}

const LeadContext = createContext<LeadContextType | undefined>(undefined)

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(leadReducer, initialState)

  // Load leads from Supabase on mount
  const loadLeads = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      
      const leads = await leadService.getAllLeads()
      dispatch({ type: "LOAD_LEADS", payload: leads })
    } catch (error) {
      console.error("Error loading leads:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load leads" })
    } finally {
      dispatch({ type: "SET_INITIALIZED", payload: true })
    }
  }

  // Initialize on mount
  useEffect(() => {
    loadLeads()
  }, [])

  const addLead = async (leadData: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      
      const newLead = await leadService.createLead(leadData)
      dispatch({ type: "ADD_LEAD", payload: newLead })
    } catch (error) {
      console.error("Error adding lead:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to add lead" })
      throw error
    }
  }

  const updateLead = async (lead: Lead) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      
      const updatedLead = await leadService.updateLead(lead)
      dispatch({ type: "UPDATE_LEAD", payload: updatedLead })
    } catch (error) {
      console.error("Error updating lead:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to update lead" })
      throw error
    }
  }

  const deleteLead = async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })
      
      await leadService.deleteLead(id)
      dispatch({ type: "DELETE_LEAD", payload: id })
    } catch (error) {
      console.error("Error deleting lead:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to delete lead" })
      throw error
    }
  }

  const getLeadById = (id: string) => {
    return state.leads.find((lead) => lead.id === id)
  }

  const refreshLeads = async () => {
    await loadLeads()
  }

  const searchLeads = async (searchTerm: string): Promise<Lead[]> => {
    try {
      if (!searchTerm.trim()) {
        return state.leads
      }
      
      return await leadService.searchLeads(searchTerm)
    } catch (error) {
      console.error("Error searching leads:", error)
      throw error
    }
  }

  return (
    <LeadContext.Provider
      value={{
        ...state,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
        refreshLeads,
        searchLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  )
}

export function useLeads() {
  const context = useContext(LeadContext)
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadProvider")
  }
  return context
}