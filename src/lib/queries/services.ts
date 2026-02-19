import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Service } from '@/lib/types/database'

export async function getServicesByShop(shopId: string): Promise<Service[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('shop_id', shopId)
    .eq('active', true)
    .order('display_order', { ascending: true })
  return data ?? []
}
