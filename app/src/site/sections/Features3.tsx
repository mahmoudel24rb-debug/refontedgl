import Container from '../ui/Container'
import { FEATURE_ICONS } from '../ui/Icons'
import { FEATURES } from '../content'

/**
 * Trois cartes blanches centrees (engagements DGL). Elles suivent
 * immediatement le tableau comparatif : padding vertical volontairement
 * reduit pour rester collees a la section precedente, comme dans le template.
 */
export default function Features3() {
  return (
    <section className="w-full py-3">
      <Container>
        <div className="grid gap-3 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon]
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center rounded-3xl bg-white px-6 py-8 text-center"
              >
                <Icon
                  size={24}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className="text-primary"
                />
                <h3 className="text-ink mt-4 text-lg font-medium text-balance">
                  {feature.title}
                </h3>
                <p className="text-muted mt-3 max-w-sm text-base leading-6 text-balance">
                  {feature.text}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
