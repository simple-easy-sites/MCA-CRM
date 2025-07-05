"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Lead } from "@/types/lead"

interface LeadState {
  leads: Lead[]
  loading: boolean
  error: string | null
}

type LeadAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_LEAD"; payload: Lead }
  | { type: "UPDATE_LEAD"; payload: Lead }
  | { type: "DELETE_LEAD"; payload: string }
  | { type: "LOAD_LEADS"; payload: Lead[] }

const initialState: LeadState = {
  leads: [],
  loading: false,
  error: null,
}

function leadReducer(state: LeadState, action: LeadAction): LeadState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "ADD_LEAD":
      return { ...state, leads: [...state.leads, action.payload] }
    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((lead) => (lead.id === action.payload.id ? action.payload : lead)),
      }
    case "DELETE_LEAD":
      return { ...state, leads: state.leads.filter((lead) => lead.id !== action.payload) }
    case "LOAD_LEADS":
      return { ...state, leads: action.payload }
    default:
      return state
  }
}

interface LeadContextType extends LeadState {
  addLead: (lead: Omit<Lead, "id" | "created_at" | "updated_at">) => void
  updateLead: (lead: Lead) => void
  deleteLead: (id: string) => void
  getLeadById: (id: string) => Lead | undefined
}

const LeadContext = createContext<LeadContextType | undefined>(undefined)

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(leadReducer, initialState)

  // Load leads from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem("mca-crm-leads")
    if (savedLeads) {
      try {
        const leads = JSON.parse(savedLeads)
        dispatch({ type: "LOAD_LEADS", payload: leads })
      } catch (error) {
        console.error("Error loading leads from localStorage:", error)
      }
    }
  }, [])

  // Save leads to localStorage whenever leads change
  useEffect(() => {
    localStorage.setItem("mca-crm-leads", JSON.stringify(state.leads))
  }, [state.leads])

  const addLead = (leadData: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    dispatch({ type: "ADD_LEAD", payload: newLead })
  }

  const updateLead = (lead: Lead) => {
    const updatedLead = {
      ...lead,
      updated_at: new Date().toISOString(),
    }
    dispatch({ type: "UPDATE_LEAD", payload: updatedLead })
  }

  const deleteLead = (id: string) => {
    dispatch({ type: "DELETE_LEAD", payload: id })
  }

  const getLeadById = (id: string) => {
    return state.leads.find((lead) => lead.id === id)
  }

  return (
    <LeadContext.Provider
      value={{
        ...state,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
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
