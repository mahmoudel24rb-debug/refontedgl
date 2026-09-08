import Container from '../ui/Container'
import SectionHeader from '../ui/SectionHeader'
import { SERVICES_BENTO } from '../content'
import MainCard from './services/MainCard'
import ReportingCard from './services/ReportingCard'
import AdsCard from './services/AdsCard'
import GoogleCard from './services/GoogleCard'
import RestCard from './services/RestCard'

/**
 * Bento services « Remplacez votre equipe marketing » : grille 19 colonnes,
 * une carte navy (mockup navigateur) et quatre cartes illustrees a droite.
 * Les mockups sont dessines en CSS/SVG, aucune image externe ; chaque carte
 * joue sa sequence d'animation en entrant dans le viewport (voir
 * `sections/services/`).
 */
export default function ServicesBento() {
  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <SectionHeader title={SERVICES_BENTO.heading} />
        <div className="mt-10 grid grid-cols-19 gap-3 md:mt-14">
          <MainCard />
          <div className="col-span-19 grid grid-cols-1 gap-3 [--box-min-height:314px] md:grid-cols-2 lg:col-span-13 lg:grid-cols-5">
            <ReportingCard />
            <AdsCard />
            <GoogleCard />
            <RestCard />
          </div>
        </div>
      </Container>
    </section>
  )
}
