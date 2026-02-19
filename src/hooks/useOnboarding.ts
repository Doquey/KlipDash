'use client'

import { useState } from 'react'
import { generateSlug } from '@/lib/utils/slug'

export interface BarberDraft {
  id: string // local UUID for React key
  name: string
  active: boolean
}

export interface ServiceDraft {
  id: string
  name: string
  duration_minutes: number
  price: number
}

export interface OnboardingState {
  currentStep: number
  direction: 1 | -1
  shopName: string
  slug: string
  barbers: BarberDraft[]
  services: ServiceDraft[]
}

const TOTAL_STEPS = 3

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    direction: 1,
    shopName: '',
    slug: '',
    barbers: [],
    services: [],
  })

  function goToStep(step: number) {
    setState((prev) => ({
      ...prev,
      direction: step > prev.currentStep ? 1 : -1,
      currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)),
    }))
  }

  function nextStep() {
    goToStep(state.currentStep + 1)
  }

  function prevStep() {
    goToStep(state.currentStep - 1)
  }

  function setShopName(name: string) {
    setState((prev) => ({
      ...prev,
      shopName: name,
      // Auto-generate slug from name only if slug hasn't been manually edited
      slug: prev.slug === generateSlug(prev.shopName) || prev.slug === ''
        ? generateSlug(name)
        : prev.slug,
    }))
  }

  function setSlug(slug: string) {
    setState((prev) => ({ ...prev, slug }))
  }

  function addBarber() {
    setState((prev) => ({
      ...prev,
      barbers: [
        ...prev.barbers,
        { id: crypto.randomUUID(), name: '', active: true },
      ],
    }))
  }

  function updateBarber(id: string, patch: Partial<Omit<BarberDraft, 'id'>>) {
    setState((prev) => ({
      ...prev,
      barbers: prev.barbers.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }))
  }

  function removeBarber(id: string) {
    setState((prev) => ({
      ...prev,
      barbers: prev.barbers.filter((b) => b.id !== id),
    }))
  }

  function addService() {
    setState((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { id: crypto.randomUUID(), name: '', duration_minutes: 30, price: 0 },
      ],
    }))
  }

  function updateService(
    id: string,
    patch: Partial<Omit<ServiceDraft, 'id'>>
  ) {
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }))
  }

  function removeService(id: string) {
    setState((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }))
  }

  return {
    state,
    totalSteps: TOTAL_STEPS,
    nextStep,
    prevStep,
    goToStep,
    setShopName,
    setSlug,
    addBarber,
    updateBarber,
    removeBarber,
    addService,
    updateService,
    removeService,
  }
}
