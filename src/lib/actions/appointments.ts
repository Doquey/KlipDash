'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkInAppointment(appointmentId: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'checked_in' })
    .eq('id', appointmentId)

  if (error) throw error
  revalidatePath('/dashboard/agenda')
}

export async function cancelAppointment(appointmentId: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)

  if (error) throw error
  revalidatePath('/dashboard/agenda')
}
