'use client'

import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <motion.div
          key={i}
          layoutId={`step-dot-${i}`}
          animate={{
            width: i === currentStep ? 24 : 8,
            backgroundColor: i <= currentStep ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}
