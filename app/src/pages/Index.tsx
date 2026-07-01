import HeroNavbar from '@/components/HeroNavbar'
import Hero from '@/components/Hero'
import FintechPlatform from '@/components/FintechPlatform'
import FinanceFeatures from '@/components/FinanceFeatures'
import Testimonials from '@/components/Testimonials'
import PowerOfFinance from '@/components/PowerOfFinance'
import Footer from '@/components/Footer'

export default function Index() {
  return (
    <main
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        fontFamily: '"Inter Tight", sans-serif',
      }}
    >
      <HeroNavbar />
      <Hero />
      <FintechPlatform />
      <FinanceFeatures />
      <Testimonials />
      <PowerOfFinance />
      <Footer />
    </main>
  )
}
