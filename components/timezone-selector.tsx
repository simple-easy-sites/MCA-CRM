"use client"

import React, { useState } from 'react'
import { ChevronDown, Clock, MapPin, Search } from 'lucide-react'
import { TIMEZONE_OPTIONS, getCurrentTimeInTimezone, getTimezoneAbbr } from '@/lib/timezone-utils'
import { cn } from '@/lib/utils'

interface TimezoneSelectorProps {
  value: string
  onChange: (timezone: string) => void
  label?: string
  required?: boolean
  placeholder?: string
}

export function TimezoneSelector({
  value,
  onChange,
  label = "Client Location",
  required = false,
  placeholder = "Select location..."
}: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedTimezone = TIMEZONE_OPTIONS.find(tz => tz.value === value)
  
  // Filter options based on search term
  const filteredOptions = TIMEZONE_OPTIONS.filter(tz => 
    tz.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tz.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelect = (timezone: string) => {
    onChange(timezone)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 glass-panel border border-white/10 rounded-lg",
          "text-left focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/30",
          "transition-all duration-200 hover:border-white/20"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className={cn(
              "text-sm",
              selectedTimezone ? "text-white" : "text-muted-foreground"
            )}>
              {selectedTimezone ? selectedTimezone.label : placeholder}
            </span>
            {selectedTimezone && (
              <span className="text-xs text-muted-foreground px-2 py-1 glass-panel rounded">
                {getTimezoneAbbr(value)}
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </button>

      {/* Current Time Display */}
      {selectedTimezone && (
        <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Current time: {getCurrentTimeInTimezone(value)}</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full glass-panel border border-white/10 rounded-lg shadow-xl max-h-80 overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by city or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-panel border border-white/10 rounded-lg text-sm text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/30"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-white/5 focus:outline-none focus:bg-white/5 transition-colors",
                  value === option.value && "bg-neon-purple/10 border-l-2 border-neon-purple"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium text-sm",
                      value === option.value ? "text-neon-purple" : "text-white"
                    )}>
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.cities.slice(0, 3).join(', ')}
                      {option.cities.length > 3 && ` +${option.cities.length - 3} more`}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-white">
                      {getCurrentTimeInTimezone(option.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {option.abbr}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredOptions.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No locations found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}