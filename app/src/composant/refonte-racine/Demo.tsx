import Hero from '@/components/Hero'
import Agence from '@/components/refonte/Agence'
import Services from '@/components/refonte/Services'
import Preuves from '@/components/refonte/Preuves'
import Fin from '@/components/refonte/Fin'
import { BASE_CSS } from '@/components/refonte/ui'

/**
 * Composant refonte-racine — la future version du site principal.
 * Hero glowy waves (le hero actuel du site, promu depuis hero3) + les
 * sections refonte partagées (components/refonte/, mêmes que refontev2) :
 * agence (blanc) → services (navy) → méthode (cream) → réalisations
 * (blanc) → témoignages (cream) → CTA + footer (navy).
 *
 * Une fois validé : monter cette composition dans pages/Index.tsx
 * (copier le JSX ci-dessous tel quel, le hero et les sections sont
 * déjà dans components/).
 */
export default function Demo() {
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
      {/* la topbar du composant view fait 48px → on la déduit pour
          que le hero tienne exactement dans le viewport */}
      <Hero minHeight="calc(100vh - 48px)" />
      <Agence />
      <Services />
      <Preuves />
      <Fin />
    </main>
  )
}
