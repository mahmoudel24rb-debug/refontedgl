import PageLayout from '../layout/PageLayout'
import ToolsHero from '../sections/ToolsHero'
import ToolsGrid from '../sections/ToolsGrid'
import Faq from '../sections/Faq'
import { SITE_META } from '../content'

/**
 * Page outils gratuits (equivalent /products du template) : hero centre avec
 * le faux formulaire du test de visibilite IA, grille des outils, FAQ.
 */
export default function Outils() {
  const meta = SITE_META['/outils']
  return (
    <PageLayout tone="light" title={meta.title} description={meta.description}>
      <ToolsHero />
      <ToolsGrid />
      <Faq />
    </PageLayout>
  )
}
