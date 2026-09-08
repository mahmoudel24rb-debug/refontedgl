import PageLayout from '../layout/PageLayout'
import PageWatermark from '../ui/PageWatermark'
import Pricing from '../sections/Pricing'
import LogoCloud from '../sections/LogoCloud'
import VsTable from '../sections/VsTable'
import Features3 from '../sections/Features3'
import TestimonialsDark from '../sections/TestimonialsDark'
import Faq from '../sections/Faq'
import { SITE_META } from '../content'

/**
 * Hauteur utile du filigrane : les cartes tarifs le recouvrent de 14 %,
 * comme la grille des realisations (meme valeur que Projects).
 */
const WATERMARK_OFFSET = 'calc(clamp(96px, 16vw, 220px) * 0.86)'

/**
 * Page tarifs (equivalent /pricing du template) : filigrane « Tarifs » cale
 * sous la navbar, cartes tarifs sans en-tete, logos clients, comparatif,
 * engagements, temoignages sombres et FAQ.
 */
export default function Tarifs() {
  const meta = SITE_META['/tarifs']
  return (
    <PageLayout
      tone="light"
      title={meta.title}
      description={meta.description}
      mainClassName="pt-32 md:pt-40"
    >
      {/* `flow-root` : sans contexte de formatage, le retrait negatif du bloc
          tarifs s'echapperait par fusion des marges et remonterait le
          filigrane sous la navbar. */}
      <section className="relative w-full flow-root">
        <PageWatermark text="Tarifs" />
        {/* Le retrait negatif annule le padding haut de Pricing : les cartes
            demarrent exactement a 86 % de la hauteur du filigrane. */}
        <div
          className="relative z-10 -mt-16 md:-mt-24"
          style={{ paddingTop: WATERMARK_OFFSET }}
        >
          <Pricing showHeader={false} />
        </div>
      </section>
      <LogoCloud />
      <VsTable />
      <Features3 />
      <TestimonialsDark />
      <Faq />
    </PageLayout>
  )
}
