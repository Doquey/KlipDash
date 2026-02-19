'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useOnboarding } from '@/hooks/useOnboarding'
import { StepShopInfo } from './StepShopInfo'
import { StepBarbers } from './StepBarbers'
import { StepServices } from './StepServices'
import { StepIndicator } from './StepIndicator'
import { completeOnboarding } from '@/lib/actions/onboarding'
import { useState } from 'react'

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

export function OnboardingWizard() {
  const wizard = useOnboarding()
  const { state, totalSteps } = wizard
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFinish() {
    setSubmitting(true)
    setError(null)
    try {
      await completeOnboarding({
        shopName: state.shopName,
        slug: state.slug,
        barbers: state.barbers.filter((b) => b.name.trim()),
        services: state.services.filter((s) => s.name.trim()),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const steps = [
    <StepShopInfo key="shop" wizard={wizard} />,
    <StepBarbers key="barbers" wizard={wizard} />,
    <StepServices
      key="services"
      wizard={wizard}
      onFinish={handleFinish}
      submitting={submitting}
      error={error}
    />,
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {state.currentStep === 0 && "Let's set up your shop"}
          {state.currentStep === 1 && 'Add your team'}
          {state.currentStep === 2 && 'Add your services'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Step {state.currentStep + 1} of {totalSteps}
        </p>
      </div>

      <StepIndicator currentStep={state.currentStep} totalSteps={totalSteps} />

      {/* Step content with Framer Motion slide */}
      <div className="relative flex-1 overflow-hidden px-6 pt-6">
        <AnimatePresence mode="wait" custom={state.direction}>
          <motion.div
            key={state.currentStep}
            custom={state.direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {steps[state.currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
