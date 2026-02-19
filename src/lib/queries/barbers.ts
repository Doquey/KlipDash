import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Barber } from '@/lib/types/database'

export async function getBarbersByShop(shopId: string): Promise<Barber[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('barbers')
    .select('*')
    .eq('shop_id', shopId)
    .eq('active', true)
    .order('display_order', { ascending: true })
  return data ?? []
}
