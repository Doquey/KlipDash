'use client'

import { formatTimeSlot } from '@/lib/utils/time'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Slot {
  slot_start: string
  slot_end: string
}

interface TimeSlotGridProps {
  slots: Slot[]
  timezone: string
  onSelect: (slotStart: string, slotEnd: string) => void
}

export function TimeSlotGrid({ slots, timezone, onSelect }: TimeSlotGridProps) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(slot: Slot) {
    setSelected(slot.slot_start)
    onSelect(slot.slot_start, slot.slot_end)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => {
        const isSelected = slot.slot_start === selected
        return (
          <button
            key={slot.slot_start}
            type="button"
            onClick={() => handleSelect(slot)}
            className={cn(
              'h-11 rounded-lg text-sm font-medium transition-all active:scale-95 border',
              isSelected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border hover:border-primary/50'
            )}
          >
            {formatTimeSlot(slot.slot_start, timezone)}
          </button>
        )
      })}
    </div>
  )
}
