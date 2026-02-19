'use client'

import { useState } from 'react'
import type { AppointmentWithDetails } from '@/lib/types/database'
import { AppointmentDrawer } from './AppointmentDrawer'
import { formatTimeSlot } from '@/lib/utils/time'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/lib/types/database'

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending:    'border-l-yellow-400',
  confirmed:  'border-l-blue-500',
  checked_in: 'border-l-green-500',
  cancelled:  'border-l-muted',
  no_show:    'border-l-red-400',
}

const STATUS_BADGES: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending:    'outline',
  confirmed:  'default',
  checked_in: 'default',
  cancelled:  'secondary',
  no_show:    'destructive',
}

interface AppointmentCardProps {
  appointment: AppointmentWithDetails
  timezone: string
}

export function AppointmentCard({ appointment, timezone }: AppointmentCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full flex items-center gap-4 px-4 py-4 rounded-xl border bg-card text-left transition-all active:scale-[0.99] border-l-4',
          STATUS_STYLES[appointment.status]
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">{appointment.customer_name}</p>
            <Badge variant={STATUS_BADGES[appointment.status]} className="shrink-0 text-xs capitalize">
              {appointment.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {appointment.services.name} · {appointment.barbers.name}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium tabular-nums">
            {formatTimeSlot(appointment.start_time, timezone)}
          </p>
          <p className="text-xs text-muted-foreground">
            {appointment.services.duration_minutes} min
          </p>
        </div>
      </button>

      <AppointmentDrawer
        appointment={appointment}
        timezone={timezone}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
