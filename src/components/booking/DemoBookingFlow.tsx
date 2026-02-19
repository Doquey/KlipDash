'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useBookingFlow } from '@/hooks/useBookingFlow'
import { ServicePicker } from './ServicePicker'
import { BarberPicker } from './BarberPicker'
import { DatePicker } from './DatePicker'
import { CustomerForm } from './CustomerForm'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { formatTimeSlot, formatDayLabel } from '@/lib/utils/time'
import type { Shop, Barber, Service } from '@/lib/types/database'
import { ChevronLeft, ArrowRight, Calendar, User, Scissors, Phone } from 'lucide-react'

// ─── Step animation ───────────────────────────────────────────────────────────
const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

const STEP_LABELS: Record<string, string> = {
  service: 'Choose a service',
  barber: 'Choose a barber',
  date: 'Choose a date',
  time: 'Choose a time',
  customer: 'Your details',
  confirm: 'Confirm',
}

// ─── Demo time picker (hardcoded slots, no DB) ────────────────────────────────
const SLOT_HOURS = [9, 9.75, 10.5, 11.25, 12, 13.5, 14.25, 15]

function DemoTimePicker({
  date,
  durationMinutes,
  timezone,
  onSelect,
}: {
  date: string
  durationMinutes: number
  timezone: string
  onSelect: (slotStart: string, slotEnd: string) => void
}) {
  const slots = SLOT_HOURS.map((hour) => {
    const start = new Date(`${date}T00:00:00`)
    start.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0)
    const end = new Date(start.getTime() + durationMinutes * 60_000)
    return { slotStart: start.toISOString(), slotEnd: end.toISOString() }
  })

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map(({ slotStart, slotEnd }) => (
        <button
          key={slotStart}
          type="button"
          onClick={() => onSelect(slotStart, slotEnd)}
          className="py-2.5 px-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95"
        >
          {formatTimeSlot(slotStart, timezone)}
        </button>
      ))}
    </div>
  )
}

// ─── Demo confirm drawer (no real booking, CTA to sign up) ────────────────────
function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function DemoConfirmDrawer({
  shop,
  service,
  barber,
  slotStart,
  customerName,
  customerPhone,
}: {
  shop: Shop
  service: Service
  barber: Barber | null
  slotStart: string
  customerName: string
  customerPhone: string
}) {
  const [open, setOpen] = useState(true)
  const timezone = (shop.settings as { timezone: string }).timezone
  const date = new Date(slotStart)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader>
            <DrawerTitle>Confirm your booking</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 space-y-3">
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

            {/* Demo notice */}
            <p className="text-xs text-center text-muted-foreground bg-muted rounded-lg px-3 py-2">
              Demo mode — no real booking will be made.
            </p>

            <Button className="w-full h-12 text-base" asChild>
              <Link href="/login">
                Sign up to enable real bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// ─── DemoBookingFlow ─────────────────────────────────────────────────────────
interface DemoBookingFlowProps {
  shop: Shop
  barbers: Barber[]
  services: Service[]
}

export function DemoBookingFlow({ shop, barbers, services }: DemoBookingFlowProps) {
  const flow = useBookingFlow()
  const { state } = flow

  const selectedService = services.find((s) => s.id === state.serviceId)
  const selectedBarber = barbers.find((b) => b.id === state.barberId)
  const showBack = state.step !== 'service'
  const timezone = (shop.settings as { timezone: string }).timezone

  return (
    <div className="px-4 pb-10">
      {/* Step header */}
      <div className="flex items-center gap-2 py-4 min-h-[52px]">
        {showBack && (
          <button
            onClick={flow.goBack}
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-semibold">{STEP_LABELS[state.step]}</h2>
      </div>

      {/* Animated steps */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={state.direction}>
          <motion.div
            key={state.step}
            custom={state.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {state.step === 'service' && (
              <ServicePicker
                services={services}
                selectedId={state.serviceId}
                onSelect={flow.selectService}
              />
            )}

            {state.step === 'barber' && (
              <BarberPicker
                barbers={barbers}
                selectedId={state.barberId}
                onSelect={flow.selectBarber}
              />
            )}

            {state.step === 'date' && (
              <DatePicker selectedDate={state.date} onSelect={flow.selectDate} />
            )}

            {state.step === 'time' && state.serviceId && state.date && (
              <DemoTimePicker
                date={state.date}
                durationMinutes={selectedService?.duration_minutes ?? 45}
                timezone={timezone}
                onSelect={flow.selectSlot}
              />
            )}

            {state.step === 'customer' && (
              <CustomerForm
                customerName={state.customerName}
                customerPhone={state.customerPhone}
                onNameChange={flow.setCustomerName}
                onPhoneChange={flow.setCustomerPhone}
                onContinue={flow.goToConfirm}
              />
            )}

            {state.step === 'confirm' && selectedService && state.slotStart && (
              <DemoConfirmDrawer
                shop={shop}
                service={selectedService}
                barber={selectedBarber ?? null}
                slotStart={state.slotStart}
                customerName={state.customerName}
                customerPhone={state.customerPhone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
