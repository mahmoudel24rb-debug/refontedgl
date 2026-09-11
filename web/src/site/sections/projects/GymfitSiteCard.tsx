'use client'

import { motion } from 'framer-motion'
import { useEnter, VIEWPORT } from '../services/shared'
import { ProjectCard } from './shared'

/**
 * Carte navy « GYMFIT, refonte du site » : fenetre navigateur qui monte, puis
 * le hero du site en cascade (logo, accroche, boutons) et enfin le badge
 * « 8 semaines ». Meme sequence que le mockup du bento services.
 */

/* Rouge de la charte GYMFIT, hors palette DGL : garde sa valeur en dur. */
const GYMFIT_RED = '#E11D2A'

export default function GymfitSiteCard() {
  const { from } = useEnter()

  return (
    <ProjectCard slug="gymfit-site" tone="dark">
      <motion.div
        className="absolute inset-x-0 top-0 flex h-full flex-col overflow-hidden rounded-xl bg-[#E6E6E6] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]"
        initial={from({ opacity: 0, y: 26 }, { opacity: 1, y: 0 })}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <motion.span
            className="flex items-center gap-1"
            initial={from({ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 })}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="block size-1.5 rounded-full bg-[#F45B4F]" />
            <span className="block size-1.5 rounded-full bg-[#F5BE3F]" />
            <span className="block size-1.5 rounded-full bg-[#4FBF5F]" />
          </motion.span>
          <motion.span
            className="ml-1 flex h-4 flex-1 items-center rounded-full bg-white/90 px-2 text-[9px] text-neutral-500"
            initial={from({ opacity: 0, scaleX: 0.6 }, { opacity: 1, scaleX: 1 })}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ transformOrigin: 'left center' }}
          >
            gym-fit.fr
          </motion.span>
        </div>

        <div className="flex flex-1 flex-col justify-center bg-[#0B0D0E] px-4 pt-5 pb-6">
          <motion.p
            className="text-[30px] leading-none font-semibold tracking-tight"
            initial={from({ opacity: 0, y: 10 }, { opacity: 1, y: 0 })}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            <span className="text-white">GYM</span>
            <span style={{ color: GYMFIT_RED }}>FIT</span>
          </motion.p>

          <div className="mt-3 space-y-1.5">
            {['85%', '58%'].map((width, index) => (
              <motion.span
                key={width}
                className="block h-1.5 rounded-full bg-white/20"
                style={{ width, transformOrigin: 'left center' }}
                initial={from({ opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1 })}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: 0.55 + index * 0.1 }}
              />
            ))}
          </div>

          <motion.div
            className="mt-4 flex items-center gap-2"
            initial={from({ opacity: 0, y: 8 }, { opacity: 1, y: 0 })}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <span className="rounded-md bg-white px-2.5 py-1.5 text-[10px] leading-none font-semibold text-[#0B0D0E]">
              Je m&apos;inscris
            </span>
            <span
              className="rounded-md px-2.5 py-1.5 text-[10px] leading-none font-semibold text-white"
              style={{ backgroundColor: GYMFIT_RED }}
            >
              Nos clubs
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.span
        className="bg-page text-ink absolute top-2 right-0 rounded-full px-3 py-1.5 text-[11px] leading-none font-semibold shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)]"
        initial={from({ opacity: 0, y: -8, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 })}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay: 0.95, ease: 'easeOut' }}
      >
        8 semaines
      </motion.span>
    </ProjectCard>
  )
}
