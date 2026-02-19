'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useBookingFlow } from '@/hooks/useBookingFlow'
import { ServicePicker } from './ServicePicker'
import { BarberPicker } from './BarberPicker'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'
import { CustomerForm } from './CustomerForm'
import { BookingConfirmDrawer } from './BookingConfirmDrawer'
import type { Shop, Barber, Service } from '@/lib/types/database'
import { ChevronLeft } from 'lucide-react'
import { Suspense } from 'react'

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

interface BookingFlowProps {
  shop: Shop
  barbers: Barber[]
  services: Service[]
}

const STEP_LABELS: Record<string, string> = {
  service: 'Choose a service',
  barber: 'Choose a barber',
  date: 'Choose a date',
  time: 'Choose a time',
  customer: 'Your details',
  confirm: 'Confirm',
}

export function BookingFlow({ shop, barbers, services }: BookingFlowProps) {
  const flow = useBookingFlow()
  const { state } = flow

  const selectedService = services.find((s) => s.id === state.serviceId)
  const selectedBarber = barbers.find((b) => b.id === state.barberId)

  const showBack = state.step !== 'service'

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
        <h2 className="text-base font-semibold">
          {STEP_LABELS[state.step]}
        </h2>
      </div>

      {/* Animated step content */}
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
              <DatePicker
                selectedDate={state.date}
                onSelect={flow.selectDate}
              />
            )}

            {state.step === 'time' && state.serviceId && state.date && (
              <Suspense
                fallback={
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 rounded-lg bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                }
              >
                <TimePicker
                  barberId={state.barberId ?? barbers[0]?.id ?? ''}
                  serviceId={state.serviceId}
                  date={state.date}
                  timezone={(shop.settings as { timezone: string }).timezone}
                  onSelect={flow.selectSlot}
                />
              </Suspense>
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

            {state.step === 'confirm' && selectedService && state.slotStart && state.slotEnd && (
              <BookingConfirmDrawer
                shop={shop}
                service={selectedService}
                barber={selectedBarber ?? null}
                slotStart={state.slotStart}
                slotEnd={state.slotEnd}
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
