'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { toISODateString } from '@/lib/utils/time'

export function useCurrentDay() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const today = toISODateString(new Date())
  const currentDate = searchParams.get('date') ?? today

  function navigateToDate(date: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(`/dashboard/agenda?${params.toString()}`)
  }

  function goToToday() {
    navigateToDate(today)
  }

  function goToPreviousDay() {
    const d = new Date(currentDate + 'T12:00:00') // avoid timezone offset issues
    d.setDate(d.getDate() - 1)
    navigateToDate(toISODateString(d))
  }

  function goToNextDay() {
    const d = new Date(currentDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    navigateToDate(toISODateString(d))
  }

  return {
    currentDate,
    today,
    isToday: currentDate === today,
    navigateToDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,
  }
}
