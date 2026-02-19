'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isValidSlug } from '@/lib/utils/slug'

interface BarberInput {
  name: string
  active: boolean
}

interface ServiceInput {
  name: string
  duration_minutes: number
  price: number
}

interface CompleteOnboardingInput {
  shopName: string
  slug: string
  barbers: BarberInput[]
  services: ServiceInput[]
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false

  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('shops')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  return data === null // true = available
}

export async function completeOnboarding(input: CompleteOnboardingInput) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  if (!isValidSlug(input.slug)) {
    throw new Error('Invalid slug format')
  }

  // 1. Create the shop
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: user.id,
      name: input.shopName,
      slug: input.slug,
    })
    .select()
    .single()

  if (shopError) {
    if (shopError.code === '23505') {
      throw new Error('This URL is already taken. Please choose another.')
    }
    throw shopError
  }

  // 2. Insert barbers
  if (input.barbers.length > 0) {
    const { error: barbersError } = await supabase.from('barbers').insert(
      input.barbers.map((b, i) => ({
        shop_id: shop.id,
        name: b.name,
        active: b.active,
        display_order: i,
      }))
    )
    if (barbersError) throw barbersError
  }

  // 3. Insert services
  if (input.services.length > 0) {
    const { error: servicesError } = await supabase.from('services').insert(
      input.services.map((s, i) => ({
        shop_id: shop.id,
        name: s.name,
        duration_minutes: s.duration_minutes,
        price: s.price,
        display_order: i,
      }))
    )
    if (servicesError) throw servicesError
  }

  redirect('/dashboard/agenda')
}
