import { getAvailableSlots } from '@/lib/actions/booking'

interface TimePickerProps {
  barberId: string
  serviceId: string
  date: string
  timezone: string
  onSelect: (slotStart: string, slotEnd: string) => void
}

// This is a Server Component — runs on the server, fetches slots, then renders.
// The parent wraps it in <Suspense> for the loading skeleton.
export async function TimePicker({
  barberId,
  serviceId,
  date,
  timezone,
  onSelect,
}: TimePickerProps) {
  const slots = await getAvailableSlots(barberId, serviceId, date)

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No available slots for this day.
      </p>
    )
  }

  return (
    <TimeSlotGrid slots={slots} timezone={timezone} onSelect={onSelect} />
  )
}

// Client sub-component for interactivity
import { TimeSlotGrid } from './TimeSlotGrid'
