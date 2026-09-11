import Container from '../ui/Container'
import SectionHeader from '../ui/SectionHeader'
import CtaButton from '../ui/CtaButton'
import { PROJECTS_SECTION } from '../content'
import GymfitSiteCard from './projects/GymfitSiteCard'
import GymfitAdsCard from './projects/GymfitAdsCard'
import OceadesNoelCard from './projects/OceadesNoelCard'
import OceadesSeoCard from './projects/OceadesSeoCard'
import BeauregardCard from './projects/BeauregardCard'
import EpicureCard from './projects/EpicureCard'

/**
 * Bento des realisations sur la home, dans l'esprit du bento services : six
 * cartes de meme hauteur, chacune avec une mini interface dessinee en CSS et
 * SVG (aucune image) qui joue sa sequence en entrant dans le viewport. Chaque
 * carte mene a la fiche cas client correspondante.
 */
export default function ProjectsBento() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader
          title={PROJECTS_SECTION.heading}
          right={
            <CtaButton
              label={PROJECTS_SECTION.all}
              href="/realisations"
              size="sm"
            />
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          <GymfitSiteCard />
          <GymfitAdsCard />
          <OceadesNoelCard />
          <OceadesSeoCard />
          <BeauregardCard />
          <EpicureCard />
        </div>
      </Container>
    </section>
  )
}
