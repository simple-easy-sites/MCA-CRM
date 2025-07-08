// Timezone utility functions for the MCA CRM

export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (New York)', abbr: 'ET' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)', abbr: 'CT' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)', abbr: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)', abbr: 'PT' },
  { value: 'America/Phoenix', label: 'Arizona Time (Phoenix)', abbr: 'AZ' },
  { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)', abbr: 'AK' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)', abbr: 'HI' },
]

export const getTimezoneAbbr = (timezone: string): string => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone)
  return option?.abbr || 'ET'
}

export const getTimezoneLabel = (timezone: string): string => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezone)
  return option?.label || 'Eastern Time (New York)'
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
