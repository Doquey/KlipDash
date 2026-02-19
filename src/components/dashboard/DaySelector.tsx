'use client'

import { useCurrentDay } from '@/hooks/useCurrentDay'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'

function DaySelectorInner({ currentDate }: { currentDate: string }) {
  const { isToday, goToPreviousDay, goToNextDay, goToToday } = useCurrentDay()

  const displayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(currentDate + 'T12:00:00'))

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={goToPreviousDay} className="h-9 w-9">
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex-1 text-center">
        <button
          onClick={goToToday}
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {isToday ? 'Today' : displayDate}
        </button>
        {!isToday && (
          <p className="text-xs text-muted-foreground">{displayDate}</p>
        )}
      </div>

      <Button variant="outline" size="icon" onClick={goToNextDay} className="h-9 w-9">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function DaySelector({ currentDate }: { currentDate: string }) {
  return (
    <Suspense fallback={<div className="h-9" />}>
      <DaySelectorInner currentDate={currentDate} />
    </Suspense>
  )
}
