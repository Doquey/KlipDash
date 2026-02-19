'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { useOnboarding } from '@/hooks/useOnboarding'

const DURATIONS = [15, 20, 30, 45, 60, 90]

interface StepServicesProps {
  wizard: ReturnType<typeof useOnboarding>
  onFinish: () => void
  submitting: boolean
  error: string | null
}

export function StepServices({ wizard, onFinish, submitting, error }: StepServicesProps) {
  const { state, addService, updateService, removeService, prevStep } = wizard

  const canFinish =
    state.services.length > 0 &&
    state.services.every((s) => s.name.trim().length >= 1 && s.price >= 0)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {state.services.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add your services — at least one is required.
          </p>
        )}

        {state.services.map((service) => (
          <div key={service.id} className="border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Service name (e.g. Haircut)"
                value={service.name}
                onChange={(e) =>
                  updateService(service.id, { name: e.target.value })
                }
                className="h-10 text-sm flex-1 mr-2"
              />
              <button
                type="button"
                onClick={() => removeService(service.id)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Price ($)</label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="25"
                  value={service.price === 0 ? '' : service.price}
                  onChange={(e) =>
                    updateService(service.id, {
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Duration</label>
                <select
                  value={service.duration_minutes}
                  onChange={(e) =>
                    updateService(service.id, {
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} min
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addService}
        className="w-full h-11 border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add service
      </Button>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={submitting}
          className="flex-1 h-12"
        >
          Back
        </Button>
        <Button
          onClick={onFinish}
          disabled={!canFinish || submitting}
          className="flex-1 h-12 text-base"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            'Finish setup'
          )}
        </Button>
      </div>
    </div>
  )
}
