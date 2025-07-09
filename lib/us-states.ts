// US States with their timezones
export const US_STATES = [
  { code: "AL", name: "Alabama", timezone: "America/Chicago" },
  { code: "AK", name: "Alaska", timezone: "America/Anchorage" },
  { code: "AZ", name: "Arizona", timezone: "America/Phoenix" },
  { code: "AR", name: "Arkansas", timezone: "America/Chicago" },
  { code: "CA", name: "California", timezone: "America/Los_Angeles" },
  { code: "CO", name: "Colorado", timezone: "America/Denver" },
  { code: "CT", name: "Connecticut", timezone: "America/New_York" },
  { code: "DE", name: "Delaware", timezone: "America/New_York" },
  { code: "FL", name: "Florida", timezone: "America/New_York" },
  { code: "GA", name: "Georgia", timezone: "America/New_York" },
  { code: "HI", name: "Hawaii", timezone: "Pacific/Honolulu" },
  { code: "ID", name: "Idaho", timezone: "America/Boise" },
  { code: "IL", name: "Illinois", timezone: "America/Chicago" },
  { code: "IN", name: "Indiana", timezone: "America/New_York" },
  { code: "IA", name: "Iowa", timezone: "America/Chicago" },
  { code: "KS", name: "Kansas", timezone: "America/Chicago" },
  { code: "KY", name: "Kentucky", timezone: "America/New_York" },
  { code: "LA", name: "Louisiana", timezone: "America/Chicago" },
  { code: "ME", name: "Maine", timezone: "America/New_York" },
  { code: "MD", name: "Maryland", timezone: "America/New_York" },
  { code: "MA", name: "Massachusetts", timezone: "America/New_York" },
  { code: "MI", name: "Michigan", timezone: "America/New_York" },
  { code: "MN", name: "Minnesota", timezone: "America/Chicago" },
  { code: "MS", name: "Mississippi", timezone: "America/Chicago" },
  { code: "MO", name: "Missouri", timezone: "America/Chicago" },
  { code: "MT", name: "Montana", timezone: "America/Denver" },
  { code: "NE", name: "Nebraska", timezone: "America/Chicago" },
  { code: "NV", name: "Nevada", timezone: "America/Los_Angeles" },
  { code: "NH", name: "New Hampshire", timezone: "America/New_York" },
  { code: "NJ", name: "New Jersey", timezone: "America/New_York" },
  { code: "NM", name: "New Mexico", timezone: "America/Denver" },
  { code: "NY", name: "New York", timezone: "America/New_York" },
  { code: "NC", name: "North Carolina", timezone: "America/New_York" },
  { code: "ND", name: "North Dakota", timezone: "America/Chicago" },
  { code: "OH", name: "Ohio", timezone: "America/New_York" },
  { code: "OK", name: "Oklahoma", timezone: "America/Chicago" },
  { code: "OR", name: "Oregon", timezone: "America/Los_Angeles" },
  { code: "PA", name: "Pennsylvania", timezone: "America/New_York" },
  { code: "RI", name: "Rhode Island", timezone: "America/New_York" },
  { code: "SC", name: "South Carolina", timezone: "America/New_York" },
  { code: "SD", name: "South Dakota", timezone: "America/Chicago" },
  { code: "TN", name: "Tennessee", timezone: "America/Chicago" },
  { code: "TX", name: "Texas", timezone: "America/Chicago" },
  { code: "UT", name: "Utah", timezone: "America/Denver" },
  { code: "VT", name: "Vermont", timezone: "America/New_York" },
  { code: "VA", name: "Virginia", timezone: "America/New_York" },
  { code: "WA", name: "Washington", timezone: "America/Los_Angeles" },
  { code: "WV", name: "West Virginia", timezone: "America/New_York" },
  { code: "WI", name: "Wisconsin", timezone: "America/Chicago" },
  { code: "WY", name: "Wyoming", timezone: "America/Denver" }
] as const

export type USState = typeof US_STATES[number]

// Helper function to get timezone by state code
export function getTimezoneByState(stateCode: string): string {
  const state = US_STATES.find(s => s.code === stateCode)
  return state?.timezone || "America/New_York"
}

// Helper function to get state name by code
export function getStateNameByCode(stateCode: string): string {
  const state = US_STATES.find(s => s.code === stateCode)
  return state?.name || ""
}

// Group states by timezone for easy reference
export const STATES_BY_TIMEZONE = {
  "Eastern": US_STATES.filter(s => s.timezone === "America/New_York"),
  "Central": US_STATES.filter(s => s.timezone === "America/Chicago"), 
  "Mountain": US_STATES.filter(s => s.timezone === "America/Denver"),
  "Pacific": US_STATES.filter(s => s.timezone === "America/Los_Angeles"),
  "Alaska": US_STATES.filter(s => s.timezone === "America/Anchorage"),
  "Hawaii": US_STATES.filter(s => s.timezone === "Pacific/Honolulu"),
  "Arizona": US_STATES.filter(s => s.timezone === "America/Phoenix"),
  "Idaho": US_STATES.filter(s => s.timezone === "America/Boise")
}
