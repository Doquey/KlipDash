'use client'

import type { Barber } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { Scissors } from 'lucide-react'

interface BarberPickerProps {
  barbers: Barber[]
  selectedId: string | null
  onSelect: (barberId: string | null) => void
}

export function BarberPicker({ barbers, selectedId, onSelect }: BarberPickerProps) {
  const anySelected = selectedId === null

  return (
    <div className="space-y-2">
      {/* "Any barber" option */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all active:scale-[0.98]',
          anySelected
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/40'
        )}
      >
        <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center shrink-0">
          <Scissors className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-base">Any available barber</p>
          <p className="text-sm text-muted-foreground">First available slot</p>
        </div>
      </button>

      {barbers.map((barber) => {
        const isSelected = barber.id === selectedId
        return (
          <button
            key={barber.id}
            type="button"
            onClick={() => onSelect(barber.id)}
            className={cn(
              'w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all active:scale-[0.98]',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            {barber.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={barber.avatar_url}
                alt={barber.name}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-semibold text-lg">
                  {barber.name[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-base">{barber.name}</p>
              {barber.bio && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {barber.bio}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
