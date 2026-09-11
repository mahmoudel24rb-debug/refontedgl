import PageLayout from '../layout/PageLayout'
import Hero from '../sections/Hero'
import LogoCloud from '../sections/LogoCloud'
import ServicesBento from '../sections/ServicesBento'
import ProjectsBento from '../sections/ProjectsBento'
import TestimonialsLight from '../sections/TestimonialsLight'
import GrowthBento from '../sections/GrowthBento'
import VsTable from '../sections/VsTable'
import Features3 from '../sections/Features3'
import Pricing from '../sections/Pricing'
import Founder from '../sections/Founder'
import TestimonialsDark from '../sections/TestimonialsDark'
import Faq from '../sections/Faq'

/**
 * Page d'accueil du site racine (template Productized Agency adapte a DGL).
 * Ordre des sections identique au template : hero, logos, bento services,
 * realisations, temoignages clairs, bento croissance, tableau comparatif,
 * engagements, tarifs, fondateur, temoignages sombres, FAQ.
 * Composant serveur : les metadonnees sont posees par app/(site)/page.tsx.
 */
export default function Home() {
  return (
    <PageLayout tone="dark">
      <Hero />
      <LogoCloud />
      <ServicesBento />
      <ProjectsBento />
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
