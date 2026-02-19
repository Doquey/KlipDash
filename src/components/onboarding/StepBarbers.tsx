'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import type { useOnboarding } from '@/hooks/useOnboarding'

interface StepBarbersProps {
  wizard: ReturnType<typeof useOnboarding>
}

export function StepBarbers({ wizard }: StepBarbersProps) {
  const { state, addBarber, updateBarber, removeBarber, nextStep, prevStep } = wizard

  const canContinue = state.barbers.every((b) => b.name.trim().length >= 1)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {state.barbers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add your barbers — you can always update this later.
          </p>
        )}

        {state.barbers.map((barber) => (
          <div key={barber.id} className="flex items-center gap-3">
            <Input
              placeholder="Barber name"
              value={barber.name}
              onChange={(e) => updateBarber(barber.id, { name: e.target.value })}
              className="h-12 text-base flex-1"
            />
            <button
              type="button"
              onClick={() => updateBarber(barber.id, { active: !barber.active })}
              className="shrink-0"
            >
              <Badge variant={barber.active ? 'default' : 'secondary'}>
                {barber.active ? 'Active' : 'Off'}
              </Badge>
            </button>
            <button
              type="button"
              onClick={() => removeBarber(barber.id)}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addBarber}
        className="w-full h-11 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add barber
      </Button>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={state.barbers.length > 0 && !canContinue}
          className="flex-1 h-12 text-base"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
