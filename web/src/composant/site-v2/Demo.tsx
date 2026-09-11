'use client'

import Hero from './Hero'
import FintechPlatform from './FintechPlatform'
import FinanceFeatures from './FinanceFeatures'
import Testimonials from './Testimonials'
import PowerOfFinance from './PowerOfFinance'
import Footer from './Footer'

/**
 * Composant site-v2 : SNAPSHOT FIGÉ de la page d'accueil telle qu'elle était
 * du 2026-07-03 au 2026-09-08 (hero glowy waves + composants modernisés),
 * avant son remplacement par le template Productized Agency adapté à DGL.
 * Les 6 sections sont des copies locales gelées : les versions vivantes de
 * components/ peuvent évoluer, celles-ci ne bougent plus.
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
