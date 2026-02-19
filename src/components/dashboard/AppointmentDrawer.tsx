'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { checkInAppointment, cancelAppointment } from '@/lib/actions/appointments'
import { formatTimeSlot, formatDayLabel } from '@/lib/utils/time'
import type { AppointmentWithDetails } from '@/lib/types/database'
import { Loader2 } from 'lucide-react'

interface AppointmentDrawerProps {
  appointment: AppointmentWithDetails
  timezone: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentDrawer({
  appointment,
  timezone,
  open,
  onOpenChange,
}: AppointmentDrawerProps) {
  const [loading, setLoading] = useState<'checkin' | 'cancel' | null>(null)

  const canCheckIn = appointment.status === 'pending' || appointment.status === 'confirmed'
  const canCancel = appointment.status !== 'cancelled' && appointment.status !== 'no_show'

  async function handleCheckIn() {
    setLoading('checkin')
    try {
      await checkInAppointment(appointment.id)
      onOpenChange(false)
    } finally {
      setLoading(null)
    }
  }

  async function handleCancel() {
    setLoading('cancel')
    try {
      await cancelAppointment(appointment.id)
      onOpenChange(false)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{appointment.customer_name}</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              {formatDayLabel(new Date(appointment.start_time))} ·{' '}
              {formatTimeSlot(appointment.start_time, timezone)}
            </p>
          </DrawerHeader>

          <div className="px-4 space-y-2">
            <DetailRow label="Service" value={appointment.services.name} />
            <DetailRow label="Duration" value={`${appointment.services.duration_minutes} min`} />
            <DetailRow label="Price" value={`$${appointment.services.price.toFixed(0)}`} />
            <DetailRow label="Barber" value={appointment.barbers.name} />
            <DetailRow label="Phone" value={appointment.customer_phone} />
            <DetailRow
              label="Status"
              value={appointment.status.replace('_', ' ')}
              className="capitalize"
            />
          </div>

          <DrawerFooter className="gap-2">
            {canCheckIn && (
              <Button
                onClick={handleCheckIn}
                disabled={loading !== null}
                className="w-full h-12"
              >
                {loading === 'checkin' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Check in
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading !== null}
                className="w-full h-12 text-destructive hover:text-destructive"
              >
                {loading === 'cancel' ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Cancel appointment
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${className ?? ''}`}>{value}</span>
    </div>
  )
}
