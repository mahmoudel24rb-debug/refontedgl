import PageLayout from '../layout/PageLayout'
import ToolsHero from '../sections/ToolsHero'
import ToolsGrid from '../sections/ToolsGrid'
import Faq from '../sections/Faq'

/**
 * Page outils gratuits (equivalent /products du template) : hero centre avec
 * le faux formulaire du test de visibilite IA, grille des outils, FAQ.
 * Composant serveur : les metadonnees sont posees par la page App Router.
 */
export default function Outils() {
  return (
    <PageLayout tone="light">
      <ToolsHero />
      <ToolsGrid />
      <Faq />
    </PageLayout>
  )
}
