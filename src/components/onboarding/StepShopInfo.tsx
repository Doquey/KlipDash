'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { checkSlugAvailability } from '@/lib/actions/onboarding'
import { generateSlug, isValidSlug } from '@/lib/utils/slug'
import type { useOnboarding } from '@/hooks/useOnboarding'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface StepShopInfoProps {
  wizard: ReturnType<typeof useOnboarding>
}

export function StepShopInfo({ wizard }: StepShopInfoProps) {
  const { state, setShopName, setSlug, nextStep } = wizard
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Debounce slug availability check
  useEffect(() => {
    if (!state.slug || !isValidSlug(state.slug)) {
      setSlugStatus('idle')
      return
    }
    setSlugStatus('checking')
    const timer = setTimeout(async () => {
      const available = await checkSlugAvailability(state.slug)
      setSlugStatus(available ? 'available' : 'taken')
    }, 500)
    return () => clearTimeout(timer)
  }, [state.slug])

  const canContinue =
    state.shopName.trim().length >= 2 &&
    isValidSlug(state.slug) &&
    slugStatus === 'available'

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Barbershop name</label>
        <Input
          placeholder="Joe's Barbershop"
          value={state.shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="h-12 text-base"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your booking URL</label>
        <div className="relative">
          <div className="flex items-center rounded-md border border-input bg-background px-3 py-2 h-12 focus-within:ring-2 focus-within:ring-ring">
            <span className="text-sm text-muted-foreground shrink-0">barberbook.com/</span>
            <input
              type="text"
              value={state.slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="flex-1 bg-transparent text-base outline-none min-w-0"
              placeholder="joes-barbershop"
            />
            <span className="ml-2 shrink-0">
              {slugStatus === 'checking' && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {slugStatus === 'available' && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {slugStatus === 'taken' && (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
            </span>
          </div>
        </div>
        {slugStatus === 'taken' && (
          <p className="text-xs text-destructive">This URL is already taken</p>
        )}
        {slugStatus === 'available' && (
          <p className="text-xs text-green-600">This URL is available!</p>
        )}
      </div>

      <Button
        onClick={nextStep}
        disabled={!canContinue}
        className="w-full h-12 text-base mt-4"
      >
        Continue
      </Button>
    </div>
  )
}
