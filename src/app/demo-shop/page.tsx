import type { Metadata } from 'next'
import Link from 'next/link'
import { Scissors } from 'lucide-react'
import type { Shop, Barber, Service } from '@/lib/types/database'
import { DemoBookingFlow } from '@/components/booking/DemoBookingFlow'

export const metadata: Metadata = {
  title: 'Demo Booking — BarberBook',
  description: 'Try the BarberBook booking experience. No real booking will be made.',
}

// ─── Mock data — zero DB calls ────────────────────────────────────────────────

const DEMO_SHOP: Shop = {
  id: 'demo',
  owner_id: 'demo',
  name: "Mike's Classic Cuts",
  slug: 'demo-shop',
  logo_url: null,
  settings: {
    timezone: 'America/New_York',
    open_time: '09:00',
    close_time: '18:00',
    slot_duration_minutes: 15,
    days_open: [1, 2, 3, 4, 5, 6],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const DEMO_BARBERS: Barber[] = [
  {
    id: 'b1',
    shop_id: 'demo',
    name: 'Marcus T.',
    bio: 'Master of fades and lineups. 8+ years of experience.',
    avatar_url: null,
    active: true,
    display_order: 0,
    created_at: '',
  },
  {
    id: 'b2',
    shop_id: 'demo',
    name: 'Diego R.',
    bio: 'Classic cuts and beard sculpting specialist.',
    avatar_url: null,
    active: true,
    display_order: 1,
    created_at: '',
  },
]

const DEMO_SERVICES: Service[] = [
  { id: 's1', shop_id: 'demo', name: 'Fade + Lineup', duration_minutes: 45, price: 40, active: true, display_order: 0, created_at: '' },
  { id: 's2', shop_id: 'demo', name: 'Classic Cut', duration_minutes: 30, price: 30, active: true, display_order: 1, created_at: '' },
  { id: 's3', shop_id: 'demo', name: 'Beard Trim', duration_minutes: 20, price: 20, active: true, display_order: 2, created_at: '' },
  { id: 's4', shop_id: 'demo', name: 'Cut + Beard Combo', duration_minutes: 60, price: 55, active: true, display_order: 3, created_at: '' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DemoShopPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Demo banner */}
      <div className="bg-[#D4A843] text-black text-xs font-semibold text-center py-2 px-4">
        ✦ Demo mode — no real bookings will be made ·{' '}
        <Link href="/login" className="underline underline-offset-2 hover:opacity-80">
          Sign up free to go live
        </Link>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Shop header */}
        <header className="px-6 pt-8 pb-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{DEMO_SHOP.name}</h1>
            <p className="text-xs text-muted-foreground">Book an appointment</p>
          </div>
        </header>

        {/* Booking flow (demo — no DB calls) */}
        <DemoBookingFlow
          shop={DEMO_SHOP}
          barbers={DEMO_BARBERS}
          services={DEMO_SERVICES}
        />
      </div>
    </div>
  )
}
