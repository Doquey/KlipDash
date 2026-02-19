import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AppointmentWithDetails } from '@/lib/types/database'

export async function getAppointmentsByDay(
  shopId: string,
  date: string // YYYY-MM-DD
): Promise<AppointmentWithDetails[]> {
  const supabase = await createSupabaseServerClient()

  // Build day boundaries in UTC for the query
  // The frontend passes the date; Supabase will handle timezone via the DB settings
  const dayStart = `${date}T00:00:00.000Z`
  const dayEnd = `${date}T23:59:59.999Z`

  const { data } = await supabase
    .from('appointments')
    .select(`
      *,
      barbers ( id, name, avatar_url ),
      services ( id, name, duration_minutes, price )
    `)
    .eq('shop_id', shopId)
    .gte('start_time', dayStart)
    .lte('start_time', dayEnd)
    .neq('status', 'cancelled')
    .order('start_time', { ascending: true })

  return (data as AppointmentWithDetails[]) ?? []
}
