import PageLayout from '../layout/PageLayout'
import Hero from '../sections/Hero'
import LogoCloud from '../sections/LogoCloud'
import ServicesBento from '../sections/ServicesBento'
import Projects from '../sections/Projects'
import TestimonialsLight from '../sections/TestimonialsLight'
import GrowthBento from '../sections/GrowthBento'
import VsTable from '../sections/VsTable'
import Features3 from '../sections/Features3'
import Pricing from '../sections/Pricing'
import Founder from '../sections/Founder'
import TestimonialsDark from '../sections/TestimonialsDark'
import Faq from '../sections/Faq'
import { SITE_META } from '../content'

/**
 * Page d'accueil du site racine (template Productized Agency adapte a DGL).
 * Ordre des sections identique au template : hero, logos, bento services,
 * realisations, temoignages clairs, bento croissance, tableau comparatif,
 * engagements, tarifs, fondateur, temoignages sombres, FAQ.
 */
export default function Home() {
  const meta = SITE_META['/']
  return (
    <PageLayout tone="dark" title={meta.title} description={meta.description}>
      <Hero />
      <LogoCloud />
      <ServicesBento />
      <Projects variant="home" />
      <TestimonialsLight />
      <GrowthBento />
      <VsTable />
      <Features3 />
      <Pricing />
      <Founder />
      <TestimonialsDark />
      <Faq />
    </PageLayout>
  )
}
