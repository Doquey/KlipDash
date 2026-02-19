'use client'

import type { Service } from '@/lib/types/database'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServicePickerProps {
  services: Service[]
  selectedId: string | null
  onSelect: (serviceId: string) => void
}

export function ServicePicker({ services, selectedId, onSelect }: ServicePickerProps) {
  return (
    <div className="space-y-2">
      {services.map((service) => {
        const isSelected = service.id === selectedId
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all active:scale-[0.98]',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            <div>
              <p className="font-medium text-base">{service.name}</p>
              <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration_minutes} min</span>
              </div>
            </div>
            <span className="text-lg font-semibold tabular-nums">
              ${service.price.toFixed(0)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
