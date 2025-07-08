// Timezone utility functions for the MCA CRM

export interface TimezoneOption {
  value: string
  label: string
  abbr: string
  cities: string[]
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { 
    value: 'America/New_York', 
    label: 'Eastern Time', 
    abbr: 'ET',
    cities: ['New York, NY', 'Miami, FL', 'Atlanta, GA', 'Boston, MA', 'Albany, NY', 'Detroit, MI', 'Charlotte, NC', 'Philadelphia, PA']
  },
  { 
    value: 'America/Chicago', 
    label: 'Central Time', 
    abbr: 'CT',
    cities: ['Chicago, IL', 'Dallas, TX', 'Houston, TX', 'New Orleans, LA', 'Minneapolis, MN', 'Kansas City, MO', 'Toledo, OH', 'Nashville, TN']
  },
  { 
    value: 'America/Denver', 
    label: 'Mountain Time', 
    abbr: 'MT',
    cities: ['Denver, CO', 'Salt Lake City, UT', 'Albuquerque, NM', 'Boise, ID', 'Billings, MT', 'Cheyenne, WY']
  },
  { 
    value: 'America/Los_Angeles', 
    label: 'Pacific Time', 
    abbr: 'PT',
    cities: ['Los Angeles, CA', 'San Francisco, CA', 'Seattle, WA', 'Portland, OR', 'Las Vegas, NV', 'Pasadena, CA', 'San Diego, CA', 'Sacramento, CA']
  },
  { 
    value: 'America/Phoenix', 
    label: 'Arizona Time', 
    abbr: 'AZ',
    cities: ['Phoenix, AZ', 'Tucson, AZ', 'Mesa, AZ', 'Scottsdale, AZ', 'Tempe, AZ', 'Chandler, AZ']
  },
  { 
    value: 'America/Anchorage', 
    label: 'Alaska Time', 
    abbr: 'AK',
    cities: ['Anchorage, AK', 'Fairbanks, AK', 'Juneau, AK']
  },
  { 
    value: 'Pacific/Honolulu', 
    label: 'Hawaii Time', 
    abbr: 'HI',
    cities: ['Honolulu, HI', 'Hilo, HI', 'Kailua-Kona, HI']
  },
]

export const getTimezoneAbbr = (timezone: string): string => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone)
  return option?.abbr || 'ET'
}

export const getTimezoneLabel = (timezone: string): string => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone)
  return option?.label || 'Eastern Time'
}

export const getTimezoneCities = (timezone: string): string[] => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone)
  return option?.cities || []
}

export const formatDateTimeInTimezone = (dateTimeString: string, clientTimezone: string = 'America/New_York'): {
  date: string
  time: string
  clientTime: string
  clientTimezone: string
  timezoneAbbr: string
} => {
  if (!dateTimeString) {
    return {
      date: 'Not scheduled',
      time: '',
      clientTime: '',
      clientTimezone: '',
      timezoneAbbr: ''
    }
  }

  try {
    // Parse the ISO string directly to avoid timezone conversion
    const isoString = dateTimeString.includes('T') ? dateTimeString : dateTimeString + 'T00:00:00.000Z'
    const datePart = isoString.split('T')[0] // Gets YYYY-MM-DD
    const timePart = isoString.split('T')[1].split('.')[0] // Gets HH:MM:SS
    
    // Format date as MM/DD/YYYY
    const [year, month, day] = datePart.split('-')
    const formattedDate = `${month}/${day}/${year}`
    
    // Create a Date object for timezone conversion
    const utcDate = new Date(isoString)
    
    // Format in client's timezone
    const clientTimeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: clientTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    const clientDateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: clientTimezone,
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
    
    const clientTime = clientTimeFormatter.format(utcDate)
    const clientDate = clientDateFormatter.format(utcDate)
    const timezoneAbbr = getTimezoneAbbr(clientTimezone)
    
    // Original time (what was stored)
    const [hours, minutes] = timePart.split(':')
    const hour24 = parseInt(hours)
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    const originalTime = `${hour12}:${minutes} ${ampm}`
    
    return {
      date: formattedDate,
      time: originalTime,
      clientTime: `${clientTime} ${timezoneAbbr}`,
      clientTimezone: getTimezoneLabel(clientTimezone),
      timezoneAbbr
    }
  } catch (error) {
    console.error('Error formatting datetime with timezone:', error, 'Input:', dateTimeString)
    return {
      date: 'Invalid date',
      time: '',
      clientTime: '',
      clientTimezone: '',
      timezoneAbbr: ''
    }
  }
}

export const getCurrentTimeInTimezone = (timezone: string = 'America/New_York'): string => {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    const timezoneAbbr = getTimezoneAbbr(timezone)
    return `${formatter.format(now)} ${timezoneAbbr}`
  } catch (error) {
    console.error('Error getting current time in timezone:', error)
    return 'Unknown time'
  }
}

// Check if it's appropriate business hours (8 AM to 6 PM)
export const isBusinessHours = (timezone: string): boolean => {
  try {
    const now = new Date()
    const currentHour = new Date(now.toLocaleString("en-US", {timeZone: timezone})).getHours()
    return currentHour >= 8 && currentHour <= 18
  } catch (error) {
    console.error('Error checking business hours:', error)
    return true
  }
}

// Get business hours status
export const getBusinessHoursStatus = (timezone: string): { 
  isOpen: boolean
  message: string
  currentTime: string 
} => {
  const currentTime = getCurrentTimeInTimezone(timezone)
  const isOpen = isBusinessHours(timezone)
  
  return {
    isOpen,
    message: isOpen ? 'Business Hours' : 'After Hours',
    currentTime
  }
}

// Format time with timezone for display
export const formatTimeWithTimezone = (date: Date | string, timezone: string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    const timeStr = formatter.format(dateObj)
    const abbr = getTimezoneAbbr(timezone)
    return `${timeStr} ${abbr}`
  } catch (error) {
    console.error('Error formatting time with timezone:', error)
    return date.toString()
  }
}