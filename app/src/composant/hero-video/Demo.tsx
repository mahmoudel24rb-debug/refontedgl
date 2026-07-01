import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

/**
 * Composant Hero Video + Marquee — prototype isolé.
 * Cf. composant/hero-video/prompt.md pour la source du brief.
 *
 * Le prompt demandait le package "motion" (nouveau nom).
 * On utilise notre framer-motion@12 existant, API identique.
 */

interface Logo {
  name: string
  src: string
  gradient: [string, string]
}

const LOGOS: Logo[] = [
  {
    name: 'Procure',
    src: 'https://svgl.app/library/procure.svg',
    gradient: ['#3b82f6', '#1e40af'],
  },
  {
    name: 'Shopify',
    src: 'https://svgl.app/library/shopify.svg',
    gradient: ['#fbbf24', '#f59e0b'],
  },
  {
    name: 'Blender',
    src: 'https://svgl.app/library/blender.svg',
    gradient: ['#60a5fa', '#2563eb'],
  },
  {
    name: 'Figma',
    src: 'https://svgl.app/library/figma.svg',
    gradient: ['#a78bfa', '#6d28d9'],
  },
  {
    name: 'Spotify',
    src: 'https://svgl.app/library/spotify.svg',
    gradient: ['#f472b6', '#dc2626'],
  },
  {
    name: 'Lottielab',
    src: 'https://svgl.app/library/lottielab.svg',
    gradient: ['#facc15', '#22c55e'],
  },
  {
    name: 'Google Cloud',
    src: 'https://svgl.app/library/google-cloud.svg',
    gradient: ['#93c5fd', '#60a5fa'],
  },
  {
    name: 'Bing',
    src: 'https://svgl.app/library/bing.svg',
    gradient: ['#22d3ee', '#0891b2'],
  },
]

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4'

export default function Demo() {
  return (
    <>
      {/* Fonts + keyframes locaux au composant */}
      <style>{STYLES}</style>

      <div
        style={{
          minHeight: 'calc(100vh - 48px)',
          background: '#f9fafb',
          padding: '2.5rem 1.5rem 4rem',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* HERO */}
        <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
          {/* Video background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
              src={VIDEO_URL}
            />
          </div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start"
            style={{ position: 'relative' }}
          >
            <h1
              className="text-[42px] md:text-[56px] font-medium tracking-tight"
              style={{
                fontFamily: '"Outfit", sans-serif',
                color: '#0a1b33',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              Foundation of the
              <br />
              new digital epoch
            </h1>

            <p
              className="mt-6 text-[14px] md:text-[15px] max-w-[520px]"
              style={{
                fontFamily: '"Inter", sans-serif',
                color: '#64748b',
                lineHeight: 1.6,
              }}
            >
              Designing products, powering ecosystems and laying the foundation
              of a decentralized web for enterprises, builders and communities
              alike.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="mt-8 rounded-full text-white text-[13px] font-semibold"
              style={{
                background: '#0a152d',
                padding: '12px 24px',
                fontFamily: '"Inter", sans-serif',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Contact Us
            </motion.button>
          </motion.div>

          {/* Floating bottom navbar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
            >
              {/* Logo circle */}
              <div
                className="w-9 h-9 bg-white shadow-sm rounded-full flex items-center justify-center"
                style={{
                  border: '1px solid #f1f5f9',
                  color: '#0a1b33',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                ✦
              </div>

              {/* Text buttons */}
              <button
                className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33]"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 18px',
                  height: 36,
                  transition: 'color 200ms',
                }}
              >
                Products
              </button>
              <button
                className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33]"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 18px',
                  height: 36,
                  transition: 'color 200ms',
                }}
              >
                Docs
              </button>

              {/* Get in touch */}
              <button
                className="bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex items-center gap-1"
                style={{ cursor: 'pointer' }}
              >
                Get in touch
                <ChevronRight size={14} />
              </button>
            </motion.nav>
          </div>
        </div>

        {/* MARQUEE */}
        <div
          className="mt-10 relative w-full max-w-[1400px] mx-auto overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)',
          }}
        >
          <div className="hv-marquee-track flex gap-4 w-max">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <LogoCard key={i} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div className="hv-card group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
      {/* Gradient blob : scale(1.5) opacity(0) -> scale(1) opacity(1) on hover */}
      <div
        className="hv-card-gradient absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${logo.gradient[0]} 0%, ${logo.gradient[1]} 100%)`,
        }}
        aria-hidden
      />

      <img
        src={logo.src}
        alt={logo.name}
        className="relative z-10 max-h-8 max-w-[70%] object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
      />
    </div>
  )
}

/* -----------------------
   Styles
------------------------*/
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap');

@keyframes hvMarquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.hv-marquee-track {
  animation: hvMarquee 30s linear infinite;
  will-change: transform;
}
.hv-marquee-track:hover {
  animation-play-state: paused;
}

/* Gradient blob : starts scaled 1.5x with opacity 0,
   drops to scale 1 + opacity 1 on card hover. */
.hv-card-gradient {
  opacity: 0;
  transform: scale(1.5);
  transition: opacity 500ms cubic-bezier(0.22,1,0.36,1),
              transform 500ms cubic-bezier(0.22,1,0.36,1);
}
.hv-card:hover .hv-card-gradient {
  opacity: 1;
  transform: scale(1);
}
`
