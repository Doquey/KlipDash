'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string // YYYY-MM-DD
): Promise<Array<{ slot_start: string; slot_end: string }>> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.rpc('get_available_slots', {
    p_barber_id: barberId,
    p_service_id: serviceId,
    p_date: date,
  })

  if (error) throw error
  return data ?? []
}

interface CreateAppointmentInput {
  shopId: string
  barberId: string
  serviceId: string
  customerName: string
  customerPhone: string
  startTime: string // ISO timestamptz
  endTime: string   // ISO timestamptz
}

export async function createAppointment(input: CreateAppointmentInput) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      shop_id: input.shopId,
      barber_id: input.barberId,
      service_id: input.serviceId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      start_time: input.startTime,
      end_time: input.endTime,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('This time slot was just taken. Please choose another.')
    }
    throw error
  }

  return data
}
