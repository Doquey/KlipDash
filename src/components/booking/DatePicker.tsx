'use client'

import { getNextNDays, toISODateString, formatDatePickerDay } from '@/lib/utils/time'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface DatePickerProps {
  selectedDate: string | null
  onSelect: (date: string) => void
}

export function DatePicker({ selectedDate, onSelect }: DatePickerProps) {
  const days = getNextNDays(21)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll selected day into view
  useEffect(() => {
    if (!scrollRef.current || !selectedDate) return
    const selected = scrollRef.current.querySelector('[data-selected="true"]')
    if (selected) {
      selected.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [selectedDate])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {days.map((date) => {
        const iso = toISODateString(date)
        const isSelected = iso === selectedDate
        const isToday = iso === toISODateString(new Date())
        const { weekday, day } = formatDatePickerDay(date)

        return (
          <button
            key={iso}
            type="button"
            data-selected={isSelected}
            onClick={() => onSelect(iso)}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-3 rounded-xl min-w-[56px] transition-all active:scale-95',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:border-primary/40',
              isToday && !isSelected && 'border-primary/50'
            )}
          >
            <span className="text-xs font-medium uppercase tracking-wide">
              {weekday}
            </span>
            <span className={cn('text-xl font-bold', isToday && !isSelected && 'text-primary')}>
              {day}
            </span>
          </button>
        )
      })}
    </div>
  )
}
