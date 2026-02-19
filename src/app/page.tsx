'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  Scissors,
  Bell,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Zap,
  Clock,
} from 'lucide-react'

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Do my clients need to download an app or create an account?',
    a: "Absolutely not. Clients open your link in any browser, pick a barber, choose a time, and enter their name and phone number. That's it — no passwords, no app store, no friction.",
  },
  {
    q: 'How long does it take to set up?',
    a: 'Under 60 seconds to create your account. Add your barbers and services in another minute. Share your booking link and you\'re live.',
  },
  {
    q: 'Can I manage multiple barbers?',
    a: 'Yes. Add as many barbers as you need, each with their own schedule. Clients can choose who they want.',
  },
  {
    q: 'What does $25/month actually include?',
    a: 'Everything. Unlimited bookings, unlimited barbers, your own booking page, and the full dashboard. No per-seat fees, no percentages, no surprises.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes — cancel whenever you want with zero penalties. We'd rather earn your business every month than lock you in.",
  },
]

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#2A2A2A]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-[#FAFAFA] text-sm sm:text-base">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-[#666] flex-shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#888] text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Phone mockup ─────────────────────────────────────────────────────────────
function BookingMockup() {
  return (
    <div className="relative mx-auto w-[220px] sm:w-[260px]">
      {/* Glow effect */}
      <div className="absolute -inset-6 bg-[#D4A843]/10 rounded-[50px] blur-3xl -z-10" />

      {/* Phone shell */}
      <div className="relative bg-[#1A1A1A] border border-[#333] rounded-[36px] p-2.5 shadow-2xl shadow-black/80">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0C0C0C] rounded-full z-10" />

        {/* Screen */}
        <div className="bg-[#111] rounded-[28px] overflow-hidden min-h-[430px] flex flex-col pt-8 pb-4 px-3.5 gap-3">
          {/* Shop header */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#D4A843] flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-xs font-bold text-[#FAFAFA]">Mike&apos;s Cuts</span>
          </div>

          {/* Barber card */}
          <div className="bg-[#1C1C1C] rounded-xl p-2.5 border border-[#2A2A2A]">
            <p className="text-[9px] text-[#666] uppercase tracking-widest mb-1.5">Barber</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2A2A2A]" />
              <div>
                <p className="text-[11px] font-semibold text-[#FAFAFA]">Marcus T.</p>
                <p className="text-[9px] text-[#D4A843] font-medium">✓ Selected</p>
              </div>
            </div>
          </div>

          {/* Service card */}
          <div className="bg-[#1C1C1C] rounded-xl p-2.5 border border-[#D4A843]/40">
            <p className="text-[9px] text-[#666] uppercase tracking-widest mb-1">Service</p>
            <p className="text-[11px] font-semibold text-[#FAFAFA]">Fade + Lineup</p>
            <p className="text-[9px] text-[#888]">45 min · $40</p>
          </div>

          {/* Time slots */}
          <div>
            <p className="text-[9px] text-[#666] uppercase tracking-widest mb-2">Today · Available</p>
            <div className="grid grid-cols-3 gap-1">
              {['10:00', '10:45', '11:30', '1:00', '2:30', '4:15'].map((t, i) => (
                <div
                  key={t}
                  className={`text-[10px] text-center py-1.5 rounded-lg font-semibold ${
                    i === 2
                      ? 'bg-[#D4A843] text-black'
                      : 'bg-[#1C1C1C] text-[#AAAAAA] border border-[#2A2A2A]'
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <div className="mt-auto">
            <div className="bg-[#D4A843] text-black text-[11px] font-bold py-2.5 rounded-xl text-center">
              Confirm Booking →
            </div>
            <p className="text-[8px] text-[#444] text-center mt-2">
              No account needed · 15 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#FAFAFA] overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E1E] bg-[#0C0C0C]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Scissors className="h-5 w-5 text-[#D4A843]" />
            BarberBook
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-[#777] hover:text-[#FAFAFA] transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-[#D4A843] text-black px-4 py-2 rounded-lg hover:bg-[#E8C547] transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-24 lg:pt-24">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 bg-[#D4A843]/10 border border-[#D4A843]/25 text-[#D4A843] text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            >
              <Zap className="h-3 w-3" />
              7-day free trial · No credit card required
            </motion.div>

            <motion.h1
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5"
            >
              Stop Losing Bookings<br />
              <span className="text-[#D4A843]">to Bad Apps.</span>
            </motion.h1>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="text-[#888] text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Your clients book in{' '}
              <span className="text-[#FAFAFA] font-semibold">15 seconds</span> — no app,
              no account, no password. Flat{' '}
              <span className="text-[#FAFAFA] font-semibold">$25/month</span>. Cancel anytime.
            </motion.p>

            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4A843] text-black font-bold px-7 py-3.5 rounded-xl hover:bg-[#E8C547] transition-colors text-base"
              >
                Start 7-Day Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo-shop"
                className="text-sm text-[#777] hover:text-[#FAFAFA] transition-colors py-3.5"
              >
                See a live demo →
              </Link>
            </motion.div>

            <motion.p
              initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="mt-5 text-xs text-[#444]"
            >
              Trusted by independent barbers across the US
            </motion.p>
          </div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="flex-shrink-0"
          >
            <BookingMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Pain Section ── */}
      <section className="border-y border-[#1E1E1E] bg-[#101010]">
        <div className="max-w-5xl mx-auto px-5 py-20 text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            Tired of your clients giving up halfway through booking?
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Apps like Squire and Booksy charge per barber, take a cut, and force your
            clients to create accounts before they can book a single appointment.
            Every extra step is a lost client.
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              {
                emoji: '💸',
                title: 'High fees eating your margins',
                desc: 'Per-seat pricing and transaction cuts add up fast. You work hard — you should keep what you earn.',
              },
              {
                emoji: '🔐',
                title: 'Clients abandon at the login screen',
                desc: '"I forgot my password" is the #1 reason clients don\'t rebook. Remove the friction entirely.',
              },
              {
                emoji: '📱',
                title: 'Another app they don\'t want to learn',
                desc: 'Your clients want to pick a time and show up — not figure out yet another platform.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5"
              >
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-[#FAFAFA] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-5 py-20 text-center">
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-[#D4A843] text-xs font-bold uppercase tracking-widest mb-3"
        >
          How it works
        </motion.p>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-2xl sm:text-3xl font-bold mb-14"
        >
          Three steps. That&apos;s it.
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-10">
          {[
            {
              step: '1',
              icon: <Scissors className="h-6 w-6" />,
              title: 'Share your link',
              desc: 'Create your shop in under 60 seconds. You get a personal URL like barberbook.com/mikes-cuts. Share it anywhere.',
            },
            {
              step: '2',
              icon: <Clock className="h-6 w-6" />,
              title: 'Client books in 15 seconds',
              desc: 'They tap your link, pick a barber, a service, and a time. No app. No account. No password. Tap and done.',
            },
            {
              step: '3',
              icon: <Bell className="h-6 w-6" />,
              title: 'You get notified instantly',
              desc: 'The appointment appears on your dashboard the moment it\'s booked. Show up, cut hair, get paid.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/25 flex items-center justify-center text-[#D4A843]">
                {item.icon}
              </div>
              <div>
                <div className="text-xs text-[#D4A843] font-bold uppercase tracking-widest mb-1">
                  Step {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="bg-[#101010] border-y border-[#1E1E1E]">
        <div className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center mb-10">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-[#D4A843] text-xs font-bold uppercase tracking-widest mb-3"
            >
              Pricing
            </motion.p>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-2xl sm:text-3xl font-bold"
            >
              One plan. No surprises.
            </motion.h2>
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="max-w-sm mx-auto bg-[#161616] border border-[#D4A843]/35 rounded-2xl p-8 text-center shadow-xl shadow-black/50 relative overflow-hidden"
          >
            {/* subtle gold glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />

            <div className="text-5xl font-extrabold mb-1">$25</div>
            <div className="text-[#666] text-sm mb-7">per month · cancel anytime</div>

            <ul className="text-sm text-left space-y-3 mb-8">
              {[
                'Unlimited bookings',
                'Unlimited barbers',
                'Your own booking link',
                'Live appointment dashboard',
                'No per-barber fees',
                'No transaction cuts',
                '7-day free trial',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#D4A843] flex-shrink-0" />
                  <span className="text-[#DDDDDD]">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D4A843] text-black font-bold px-6 py-3.5 rounded-xl hover:bg-[#E8C547] transition-colors"
            >
              Start 7-Day Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold"
          >
            Questions? Answered.
          </motion.h2>
        </div>
        <div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="bg-[#D4A843]">
        <div className="max-w-3xl mx-auto px-5 py-16 text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-2xl sm:text-3xl font-extrabold text-black mb-3"
          >
            Ready to fill your chair?
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-black/65 mb-8 max-w-md mx-auto"
          >
            Set up in 60 seconds. No credit card. Cancel anytime.
          </motion.p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-[#111] transition-colors text-base"
          >
            Create Your Free Shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E1E1E]">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#444]">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-[#D4A843]" />
            <span className="font-semibold text-[#666]">BarberBook</span>
          </div>
          <p>© {new Date().getFullYear()} BarberBook · Built for independent barbers.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#FAFAFA] transition-colors">Log in</Link>
            <Link href="/login" className="hover:text-[#FAFAFA] transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
