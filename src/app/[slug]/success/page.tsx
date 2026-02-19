import { Scissors } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BookingSuccessPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
        <Scissors className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        You&apos;re booked!
      </h1>
      <p className="text-muted-foreground mb-8">
        Your appointment has been confirmed. See you soon!
      </p>
      <Button asChild variant="outline">
        <Link href={`/${params.slug}`}>Book another appointment</Link>
      </Button>
    </div>
  )
}
