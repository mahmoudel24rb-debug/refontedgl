import Hero from '@/components/Hero'
import FintechPlatform from './FintechPlatform'
import FinanceFeatures from './FinanceFeatures'
import Testimonials from './Testimonials'
import PowerOfFinance from './PowerOfFinance'
import Footer from './Footer'

/**
 * Composant site-v1 — SNAPSHOT FIGÉ de la page d'accueil d'origine
 * (avant la modernisation des composants du 2026-07-03).
 * Les 5 sections sont des copies locales gelées : les versions vivantes
 * de components/ évoluent, celles-ci ne bougent plus.
 * Seul le Hero reste partagé (inchangé visuellement).
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
