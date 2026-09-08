import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Container from '../ui/Container'
import { CLIENT_LOGOS, LOGO_CLOUD_EYEBROW } from '../content'
import { LOGO_FILTER_INK } from '../tokens'

/**
 * Bandeau de logos clients. Les webp sont livres en blanc : sur fond clair
 * ils passent en navy monochrome, sur fond sombre ils restent tels quels.
 * Comme le module LogoCloud du template, deux positions sont echangees toutes
 * les 2 s : le logo sortant monte, le logo entrant arrive par le bas.
 */

const SWAP_MS = 2000

export default function LogoCloud({
  tone = 'light',
}: {
  tone?: 'light' | 'dark'
}) {
  const reduced = useReducedMotion()
  const [order, setOrder] = useState(() => CLIENT_LOGOS.map((_, index) => index))

  useEffect(() => {
    if (reduced || CLIENT_LOGOS.length < 2) return
    const id = window.setInterval(() => {
      setOrder((previous) => {
        const next = [...previous]
        const first = Math.floor(Math.random() * next.length)
        let second = Math.floor(Math.random() * (next.length - 1))
        if (second >= first) second += 1
        const a = next[first]
        const b = next[second]
        if (a === undefined || b === undefined) return previous
        next[first] = b
        next[second] = a
        return next
      })
    }, SWAP_MS)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <Container className="max-w-7xl py-20">
      <h2
        className={`-tracking-xs text-center font-mono text-sm leading-4 font-normal uppercase ${
          tone === 'dark' ? 'text-white/60' : 'text-muted'
        }`}
      >
        {LOGO_CLOUD_EYEBROW}
      </h2>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-4 md:gap-x-20 md:gap-y-14">
        {order.map((logoIndex, position) => {
          const logo = CLIENT_LOGOS[logoIndex]
          if (!logo) return null
          return (
            <motion.div
              key={position}
              style={{ perspective: 800 }}
              className="relative h-6 w-[7.5rem] transition-all duration-300"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={logo.src}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    draggable={false}
                    className="h-6 max-w-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 md:h-8"
                    style={
                      tone === 'dark' ? undefined : { filter: LOGO_FILTER_INK }
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </Container>
  )
}
