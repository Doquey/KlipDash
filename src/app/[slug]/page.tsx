import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getShopBySlug } from '@/lib/queries/shops'
import { getBarbersByShop } from '@/lib/queries/barbers'
import { getServicesByShop } from '@/lib/queries/services'
import { BookingFlow } from '@/components/booking/BookingFlow'
import { Scissors } from 'lucide-react'

interface BookingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: BookingPageProps
): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShopBySlug(slug)
  if (!shop) return { title: 'Not Found' }

  return {
    title: `Book at ${shop.name}`,
    description: `Schedule your appointment at ${shop.name}`,
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)

  if (!shop) notFound()

  // Fetch barbers and services in parallel
  const [barbers, services] = await Promise.all([
    getBarbersByShop(shop.id),
    getServicesByShop(shop.id),
  ])

  return (
    <div className="max-w-lg mx-auto">
      {/* Shop header */}
      <header className="px-6 pt-8 pb-4 flex items-center gap-3">
        {shop.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shop.logo_url}
            alt={shop.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Scissors className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{shop.name}</h1>
          <p className="text-xs text-muted-foreground">Book an appointment</p>
        </div>
      </header>

      {/* Booking flow (Client Component) */}
      <BookingFlow
        shop={shop}
        barbers={barbers}
        services={services}
      />
    </div>
  )
}
