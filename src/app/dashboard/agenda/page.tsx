import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getShopByOwnerId } from '@/lib/queries/shops'
import { getAppointmentsByDay } from '@/lib/queries/appointments'
import { AgendaView } from '@/components/dashboard/AgendaView'
import { DaySelector } from '@/components/dashboard/DaySelector'
import { toISODateString } from '@/lib/utils/time'

interface AgendaPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const shop = await getShopByOwnerId(user.id)
  if (!shop) redirect('/onboarding')

  const params = await searchParams
  const date = params.date ?? toISODateString(new Date())
  const appointments = await getAppointmentsByDay(shop.id, date)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-sm text-muted-foreground">{shop.name}</p>
      </div>

      <DaySelector currentDate={date} />

      <AgendaView
        appointments={appointments}
        timezone={(shop.settings as { timezone: string }).timezone}
      />
    </div>
  )
}
