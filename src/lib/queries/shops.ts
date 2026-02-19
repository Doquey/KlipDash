import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Shop } from '@/lib/types/database'

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('shops')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getShopByOwnerId(ownerId: string): Promise<Shop | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', ownerId)
    .single()
  return data
}
