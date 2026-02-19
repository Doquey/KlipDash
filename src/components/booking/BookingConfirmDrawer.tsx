'use client'

import { useState } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { createAppointment } from '@/lib/actions/booking'
import { formatTimeSlot, formatDayLabel } from '@/lib/utils/time'
import type { Shop, Service, Barber } from '@/lib/types/database'
import { Loader2, CheckCircle2, Calendar, User, Scissors, Phone } from 'lucide-react'

interface BookingConfirmDrawerProps {
  shop: Shop
  service: Service
  barber: Barber | null
  slotStart: string
  slotEnd: string
  customerName: string
  customerPhone: string
}

export function BookingConfirmDrawer({
  shop,
  service,
  barber,
  slotStart,
  slotEnd,
  customerName,
  customerPhone,
}: BookingConfirmDrawerProps) {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const timezone = (shop.settings as { timezone: string }).timezone
  const date = new Date(slotStart)

  async function handleConfirm() {
    setStatus('loading')
    setErrorMsg(null)
    try {
      await createAppointment({
        shopId: shop.id,
        barberId: barber?.id ?? '',
        serviceId: service.id,
        customerName,
        customerPhone,
        startTime: slotStart,
        endTime: slotEnd,
      })
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Booking failed. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">You&apos;re booked!</h2>
        <p className="text-muted-foreground">
          See you {formatDayLabel(date)} at{' '}
          <strong>{formatTimeSlot(slotStart, timezone)}</strong>
        </p>
      </div>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader>
            <DrawerTitle>Confirm your booking</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 space-y-3">
            {/* Summary rows */}
            <div className="rounded-xl border bg-card divide-y">
              <SummaryRow
                icon={<Scissors className="w-4 h-4" />}
                label="Service"
                value={`${service.name} · $${service.price.toFixed(0)}`}
              />
              <SummaryRow
                icon={<User className="w-4 h-4" />}
                label="Barber"
                value={barber?.name ?? 'Any available'}
              />
              <SummaryRow
                icon={<Calendar className="w-4 h-4" />}
                label="Date & time"
                value={`${formatDayLabel(date)} · ${formatTimeSlot(slotStart, timezone)}`}
              />
              <SummaryRow
                icon={<Phone className="w-4 h-4" />}
                label="Contact"
                value={`${customerName} · ${customerPhone}`}
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <Button
              onClick={handleConfirm}
              disabled={status === 'loading'}
              className="w-full h-12 text-base mt-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm booking'
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  )
}
