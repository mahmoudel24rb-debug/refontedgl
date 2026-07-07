import Hero from '@/components/Hero'
import FintechPlatform from '@/components/FintechPlatform'
import FinanceFeatures from '@/components/FinanceFeatures'
import Testimonials from '@/components/Testimonials'
import PowerOfFinance from '@/components/PowerOfFinance'
import Footer from '@/components/Footer'

/**
 * Site principal DGL Agency — composition d'origine, composants
 * modernisés en profondeur le 2026-07-03 (version pré-modernisation
 * figée sur /composant/site-v1).
 * La refonte alternative (sections components/refonte/) reste
 * consultable sur /composant/refonte-racine et /composant/refontev2.
 */
export default function Index() {
  return (
    <main
      style={{
        background: '#002329',
        minHeight: '100vh',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <Hero />
      <FintechPlatform />
      <FinanceFeatures />
      <Testimonials />
      <PowerOfFinance />
      <Footer />
    </main>
  )
}
