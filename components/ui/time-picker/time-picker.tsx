"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Clock, Check, X } from "lucide-react"

interface TimePickerProps {
  value?: string // Format: "HH:MM"
  onChange: (time: string) => void
  onCancel?: () => void
  className?: string
  placeholder?: string
}

export function TimePicker({ value, onChange, onCancel, className, placeholder = "Select time" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM')
  
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const periodRef = useRef<HTMLDivElement>(null)

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number)
      if (hours >= 1 && hours <= 12) {
        setSelectedHour(hours)
        setSelectedPeriod(hours === 12 || (hours >= 1 && hours <= 11) ? 'PM' : 'AM')
      } else if (hours === 0) {
        setSelectedHour(12)
        setSelectedPeriod('AM')
      } else if (hours > 12) {
        setSelectedHour(hours - 12)
        setSelectedPeriod('PM')
      }
      setSelectedMinute(minutes)
    }
  }, [value])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleSelect = () => {
    let hour24 = selectedHour
    if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0
    } else if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 = selectedHour + 12
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
    onChange(timeString)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel?.()
  }

  const formatDisplayTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  const currentDisplayTime = value 
    ? (() => {
        const [hours, minutes] = value.split(':').map(Number)
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        const period = hours >= 12 ? 'PM' : 'AM'
        return formatDisplayTime(hour12, minutes, period)
      })()
    : placeholder

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal glow-input border-white/20 bg-white/5 text-white hover:bg-white/10",
          !value && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Clock className="mr-2 h-4 w-4" />
        {currentDisplayTime}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <Card className="glow-card border-white/20 p-4">
            <div className="flex items-center space-x-4">
              {/* Hours */}
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-2 text-center">Hour</p>
                <div 
                  ref={hourRef}
                  className="h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
                >
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      className={cn(
                        "w-full py-2 px-3 text-center rounded transition-colors",
                        selectedHour === hour
                          ? "bg-neon-purple/30 text-white font-semibold border border-neon-purple/50"
                          : "text-muted-foreground hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-2 text-center">Minute</p>
                <div 
                  ref={minuteRef}
                  className="h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
                >
                  {minutes.filter(m => m % 5 === 0).map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      className={cn(
                        "w-full py-2 px-3 text-center rounded transition-colors",
                        selectedMinute === minute
                          ? "bg-neon-purple/30 text-white font-semibold border border-neon-purple/50"
                          : "text-muted-foreground hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => setSelectedMinute(minute)}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM */}
              <div className="flex-1">
                <p className="text-sm font-medium text-white mb-2 text-center">Period</p>
                <div className="space-y-2">
                  {['AM', 'PM'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={cn(
                        "w-full py-2 px-3 text-center rounded transition-colors",
                        selectedPeriod === period
                          ? "bg-neon-purple/30 text-white font-semibold border border-neon-purple/50"
                          : "text-muted-foreground hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => setSelectedPeriod(period as 'AM' | 'PM')}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-2 bg-white/5 rounded text-center">
              <p className="text-sm text-muted-foreground">Selected Time</p>
              <p className="text-lg font-semibold text-white">
                {formatDisplayTime(selectedHour, selectedMinute, selectedPeriod)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 glow-button text-white font-semibold"
                onClick={handleSelect}
              >
                <Check className="w-4 h-4 mr-1" />
                Select
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Quick time suggestions component
export function TimePickerQuick({ value, onChange, className }: TimePickerProps) {
  const quickTimes = [
    { label: '9:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '1:00 PM', value: '13:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '3:00 PM', value: '15:00' },
    { label: '4:00 PM', value: '16:00' },
    { label: '5:00 PM', value: '17:00' },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-white">Quick Times</p>
      <div className="grid grid-cols-3 gap-2">
        {quickTimes.map((time) => (
          <Button
            key={time.value}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs",
              value === time.value && "bg-neon-purple/30 border-neon-purple/50"
            )}
            onClick={() => onChange(time.value)}
          >
            {time.label}
          </Button>
        ))}
      </div>
    </div>
  )
}