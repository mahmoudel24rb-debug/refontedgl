import Hero from '@/components/Hero'
import StickyNav from '@/components/refonte/StickyNav'
import Agence from '@/components/refonte/Agence'
import MarqueeTexte from '@/components/refonte/MarqueeTexte'
import Services from '@/components/refonte/Services'
import Preuves from '@/components/refonte/Preuves'
import Outils from '@/components/refonte/Outils'
import Faq from '@/components/refonte/Faq'
import Fin from '@/components/refonte/Fin'
import { BASE_CSS } from '@/components/refonte/ui'

/**
 * Site principal DGL Agency — refonte promue le 2026-07-03 depuis
 * /composant/refonte-racine. Hero glowy waves (hero3) conservé + les
 * sections refonte partagées (components/refonte/) :
 * agence → bandeau typo → services → méthode → réalisations →
 * témoignages → outils → FAQ → CTA + footer.
 *
 * L'ancienne composition (template Bancuip) est archivée sur
 * /composant/site-v1.
 */
export default function Index() {
  return (
    <main
      className="v2-page"
      style={{
        background: '#002329',
        minHeight: '100vh',
        fontFamily: '"Inter Tight", ui-sans-serif, system-ui, sans-serif',
        color: '#002329',
      }}
    >
      <style>{BASE_CSS}</style>
      <StickyNav />
      <Hero />
      <Agence />
      <MarqueeTexte />
      <Services />
      <Preuves />
      <Outils />
      <Faq />
      <Fin />
    </main>
  )
}
