import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar + mobile bottom nav */}
      <DashboardNav />

      {/* Main content */}
      <main className="md:pl-64 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
