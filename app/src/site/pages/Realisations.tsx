import PageLayout from '../layout/PageLayout'
import Projects from '../sections/Projects'
import ServicesBento from '../sections/ServicesBento'
import TestimonialsLight from '../sections/TestimonialsLight'
import Faq from '../sections/Faq'
import { SITE_META } from '../content'

/**
 * Page realisations (equivalent /work du template) : filigrane « Realisations »
 * cale sous la navbar, masonry des 6 cas clients, puis services, temoignages
 * et FAQ.
 */
export default function Realisations() {
  const meta = SITE_META['/realisations']
  return (
    <PageLayout
      tone="light"
      title={meta.title}
      description={meta.description}
      mainClassName="pt-32 md:pt-40"
    >
      <Projects variant="page" />
      <ServicesBento />
      <TestimonialsLight />
      <Faq />
    </PageLayout>
  )
}
