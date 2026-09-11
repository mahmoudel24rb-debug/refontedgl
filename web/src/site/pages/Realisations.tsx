import PageLayout from '../layout/PageLayout'
import Projects from '../sections/Projects'
import ServicesBento from '../sections/ServicesBento'
import TestimonialsLight from '../sections/TestimonialsLight'
import Faq from '../sections/Faq'

/**
 * Page realisations (equivalent /work du template) : filigrane « Realisations »
 * cale sous la navbar, masonry des 6 cas clients, puis services, temoignages
 * et FAQ.
 * Composant serveur : les metadonnees sont posees par la page App Router.
 */
export default function Realisations() {
  return (
    <PageLayout tone="light" mainClassName="pt-32 md:pt-40">
      <Projects variant="page" />
      <ServicesBento />
      <TestimonialsLight />
      <Faq />
    </PageLayout>
  )
}
