import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import { CTA, NAV } from '../content'
import { LOGO_DGL, LOGO_FILTER_INK, LOGO_FILTER_WHITE } from '../tokens'

/** Ouverture du panneau mobile en cercle depuis le bouton hamburger. */
const CLIP_CLOSED = 'circle(0% at calc(100% - 2.5rem) 2.5rem)'
const CLIP_OPEN = 'circle(150% at calc(100% - 2.5rem) 2.5rem)'

/**
 * Navigation absolue du template : logo a gauche, liens centres, CTA a
 * droite, panneau plein ecran en mobile.
 * `tone` suit le fond de la page (hero navy = dark, pages claires = light).
 */
export default function Navbar({ tone = 'light' }: { tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const linkBase = 'px-3 py-2 text-sm font-medium transition-colors duration-200'
  const linkTone =
    tone === 'dark'
      ? 'text-white/80 hover:text-white'
      : 'text-ink/80 hover:text-ink'
  const activeTone = tone === 'dark' ? 'text-white' : 'text-ink'

  return (
    <>
      <nav className="absolute inset-x-0 top-4 z-50 mx-auto w-full lg:top-4 lg:max-w-[calc(100%-4rem)]">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex shrink-0 items-center gap-2 lg:min-w-45">
              <Link to="/" aria-label="DGL Agency, accueil">
                <img
                  src={LOGO_DGL}
                  alt="DGL Agency"
                  width={40}
                  height={40}
                  className="h-9 w-auto object-contain md:h-10"
                  style={{
                    filter:
                      tone === 'dark' ? LOGO_FILTER_WHITE : LOGO_FILTER_INK,
                  }}
                />
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="flex items-baseline space-x-8">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${linkBase} ${
                      pathname === item.to ? activeTone : linkTone
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:block lg:min-w-45 lg:text-right">
              <DotButton label={CTA.label} href={CTA.href} />
            </div>

            <div className="md:hidden">
              <button
                type="button"
                aria-expanded={open}
                aria-controls="dgl-mobile-menu"
                aria-label="Ouvrir le menu"
                onClick={() => setOpen(true)}
                className={`cursor-pointer p-2 ${
                  tone === 'dark'
                    ? 'text-white/80 hover:text-white'
                    : 'text-ink/80 hover:text-ink'
                }`}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="dgl-mobile-menu"
            initial={{ clipPath: CLIP_CLOSED }}
            animate={{ clipPath: CLIP_OPEN }}
            exit={{ clipPath: CLIP_CLOSED }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="bg-ink fixed inset-0 z-[60] flex flex-col md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6 pt-4">
              <Link to="/" aria-label="DGL Agency, accueil" onClick={() => setOpen(false)}>
                <img
                  src={LOGO_DGL}
                  alt="DGL Agency"
                  width={40}
                  height={40}
                  className="h-9 w-auto object-contain md:h-10"
                  style={{ filter: LOGO_FILTER_WHITE }}
                />
              </Link>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                className="cursor-pointer p-2 text-white/80 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-7 pt-10">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                <DotButton
                  label={CTA.label}
                  href={CTA.href}
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
