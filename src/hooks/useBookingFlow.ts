'use client'

import { useState } from 'react'

export type BookingStep =
  | 'service'
  | 'barber'
  | 'date'
  | 'time'
  | 'customer'
  | 'confirm'

const STEP_ORDER: BookingStep[] = [
  'service',
  'barber',
  'date',
  'time',
  'customer',
  'confirm',
]

export interface BookingState {
  step: BookingStep
  direction: 1 | -1
  serviceId: string | null
  barberId: string | null  // null = "any barber"
  date: string | null      // YYYY-MM-DD
  slotStart: string | null // ISO timestamptz
  slotEnd: string | null
  customerName: string
  customerPhone: string
}

export function useBookingFlow() {
  const [state, setState] = useState<BookingState>({
    step: 'service',
    direction: 1,
    serviceId: null,
    barberId: null,
    date: null,
    slotStart: null,
    slotEnd: null,
    customerName: '',
    customerPhone: '',
  })

  function goToStep(step: BookingStep) {
    const currentIndex = STEP_ORDER.indexOf(state.step)
    const nextIndex = STEP_ORDER.indexOf(step)
    setState((prev) => ({
      ...prev,
      step,
      direction: nextIndex > currentIndex ? 1 : -1,
    }))
  }

  function selectService(serviceId: string) {
    setState((prev) => ({ ...prev, serviceId, direction: 1, step: 'barber' }))
  }

  function selectBarber(barberId: string | null) {
    setState((prev) => ({ ...prev, barberId, direction: 1, step: 'date' }))
  }

  function selectDate(date: string) {
    setState((prev) => ({ ...prev, date, direction: 1, step: 'time' }))
  }

  function selectSlot(slotStart: string, slotEnd: string) {
    setState((prev) => ({
      ...prev,
      slotStart,
      slotEnd,
      direction: 1,
      step: 'customer',
    }))
  }

  function setCustomerName(customerName: string) {
    setState((prev) => ({ ...prev, customerName }))
  }

  function setCustomerPhone(customerPhone: string) {
    setState((prev) => ({ ...prev, customerPhone }))
  }

  function goToConfirm() {
    setState((prev) => ({ ...prev, direction: 1, step: 'confirm' }))
  }

  function goBack() {
    const currentIndex = STEP_ORDER.indexOf(state.step)
    if (currentIndex > 0) {
      goToStep(STEP_ORDER[currentIndex - 1])
    }
  }

  return {
    state,
    goToStep,
    selectService,
    selectBarber,
    selectDate,
    selectSlot,
    setCustomerName,
    setCustomerPhone,
    goToConfirm,
    goBack,
  }
}
