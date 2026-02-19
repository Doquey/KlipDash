'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatUSPhone, isValidUSPhone } from '@/lib/utils/phone'

interface CustomerFormProps {
  customerName: string
  customerPhone: string
  onNameChange: (name: string) => void
  onPhoneChange: (phone: string) => void
  onContinue: () => void
}

export function CustomerForm({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
  onContinue,
}: CustomerFormProps) {
  const canContinue =
    customerName.trim().length >= 2 && isValidUSPhone(customerPhone)

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    onPhoneChange(formatUSPhone(e.target.value))
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">Your name</label>
        <Input
          placeholder="John Smith"
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-12 text-base"
          autoComplete="name"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone number</label>
        <Input
          type="tel"
          placeholder="(555) 555-5555"
          value={customerPhone}
          onChange={handlePhoneChange}
          className="h-12 text-base"
          autoComplete="tel"
          inputMode="numeric"
        />
      </div>

      <Button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full h-12 text-base mt-4"
      >
        Review booking
      </Button>
    </div>
  )
}
