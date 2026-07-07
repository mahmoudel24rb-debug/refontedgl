import Hero from './Hero'
import Agence from '@/components/refonte/Agence'
import MarqueeTexte from '@/components/refonte/MarqueeTexte'
import Services from '@/components/refonte/Services'
import Preuves from '@/components/refonte/Preuves'
import Outils from '@/components/refonte/Outils'
import Faq from '@/components/refonte/Faq'
import Fin from '@/components/refonte/Fin'
import { BASE_CSS, DGL } from '@/components/refonte/ui'

/**
 * Composant refontev2 — variante "hero shader" du site agence DGL.
 *
 * Les sections 2→7 vivent dans src/components/refonte/ (elles sont
 * montées sur le site principal avec le hero glowy waves). Ici on les
 * compose avec le hero shader Paper Design du brief Axion Studio :
 *   1. Hero (shader Swirl+ChromaFlow+FlutedGlass+FilmGrain) — cream
 *   2. L'agence (marquee logos, manifesto scroll-reveal, stats, équipe) — blanc
 *   3. Services (6 lignes, balayage coral au hover) — navy
 *   4. Méthode (4 étapes numérotées) — cream
 *   5. Réalisations (GYMFIT, Océades, Beauregard, chiffres réels) — blanc
 *   6. Témoignages (Hakim/Samuel/Marion, switcher) — cream
 *   7. CTA audit gratuit + footer wordmark géant — navy
 *
 * ⚠️ Le package `shaders` (three.js) reste lazy-loadé via le registry.
 */
export default function Demo() {
  return (
    <div
      className="v2-page"
      style={{
        background: DGL.cream,
        color: DGL.navy,
        fontFamily: '"Inter Tight", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <style>{BASE_CSS}</style>
      <Hero />
      <Agence />
      <MarqueeTexte />
      <Services />
      <Preuves />
      <Outils />
      <Faq />
      <Fin />
    </div>
  )
}
