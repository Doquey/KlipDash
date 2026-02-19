import type { AppointmentWithDetails } from '@/lib/types/database'
import { AppointmentCard } from './AppointmentCard'
import { CalendarDays } from 'lucide-react'

interface AgendaViewProps {
  appointments: AppointmentWithDetails[]
  timezone: string
}

export function AgendaView({ appointments, timezone }: AgendaViewProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarDays className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="font-medium text-muted-foreground">No appointments today</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Enjoy the day off!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          timezone={timezone}
        />
      ))}
    </div>
  )
}
