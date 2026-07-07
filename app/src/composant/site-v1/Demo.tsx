import Hero from '@/components/Hero'
import FintechPlatform from '@/components/FintechPlatform'
import FinanceFeatures from '@/components/FinanceFeatures'
import Testimonials from '@/components/Testimonials'
import PowerOfFinance from '@/components/PowerOfFinance'
import Footer from '@/components/Footer'

/**
 * Composant site-v1 — ARCHIVE de l'ancienne page d'accueil.
 * C'était la composition de pages/Index.tsx avant la promotion de la
 * refonte (2026-07-03) : hero glowy waves + sections héritées du
 * template Bancuip adaptées à DGL. Conservée ici pour ne rien perdre.
 */
export default function Demo() {
  return (
    <main
      style={{
        background: '#002329',
        minHeight: '100vh',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <Hero minHeight="calc(100vh - 48px)" />
      <FintechPlatform />
      <FinanceFeatures />
      <Testimonials />
      <PowerOfFinance />
      <Footer />
    </main>
  )
}
