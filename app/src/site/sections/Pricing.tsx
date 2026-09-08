import Container from '../ui/Container'
import DotButton from '../ui/DotButton'
import SectionHeader from '../ui/SectionHeader'
import { GoogleGIcon } from '../ui/Icons'
import { PRICING, type BadgeTone, type PricingPlan } from '../content'

/**
 * Section tarifs du template : deux cartes cote a cote (une claire, une
 * navy) puis une carte large sur toute la largeur. Chaque carte est une
 * coque `p-2` qui contient un bloc superieur arrondi (nom, badge, titre,
 * prix, CTA, mini-avis) et, en dessous, la liste des prestations.
 */

const BADGE_LIGHT: Record<BadgeTone, string> = {
  neutral: 'bg-ink/5 text-ink',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-500',
}

const BADGE_DARK: Record<BadgeTone, string> = {
  neutral: 'bg-white/10 text-white',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-500',
}

/* Voile clair en haut a gauche de la carte navy. */
const DARK_SHEEN =
  'radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 70%)'

function Badge({ plan }: { plan: PricingPlan }) {
  const skin = plan.dark ? BADGE_DARK : BADGE_LIGHT
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm leading-5 ${skin[plan.badge.tone]}`}
    >
      {plan.badge.label}
    </span>
  )
}

function PlanTitle({ plan }: { plan: PricingPlan }) {
  return (
    <p className="mt-6 text-2xl leading-8 font-medium">
      <span className="block">{plan.title}</span>
      <span className={`block ${plan.dark ? 'text-white/50' : 'text-muted'}`}>
        {plan.subtitle}
      </span>
    </p>
  )
}

function PlanPrice({ plan }: { plan: PricingPlan }) {
  return (
    <p className="flex items-baseline gap-1">
      <span className={`text-sm ${plan.dark ? 'text-white/60' : 'text-muted'}`}>
        {plan.prefix}
      </span>
      <span className="text-4xl leading-10 font-medium">{plan.price}</span>
      <span className="text-xl leading-7">
        {PRICING.currency ? `${PRICING.currency}${plan.period}` : plan.period}
      </span>
    </p>
  )
}

function ReviewCard({ plan }: { plan: PricingPlan }) {
  if (!plan.review) return null
  const review = plan.review
  return (
    <div
      className={`w-full max-w-xs rounded-xl border p-4 shadow-sm ${
        plan.dark ? 'border-white/10 bg-white/5' : 'border-ink/10 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <span className="min-w-0 text-sm">
          <span className={plan.dark ? 'text-white' : 'text-ink'}>
            {review.name}
          </span>
          <span className={plan.dark ? 'text-white/50' : 'text-muted'}>
            {`, ${review.role}`}
          </span>
        </span>
        <GoogleGIcon size={20} className="ml-auto shrink-0" />
      </div>
      <p className="mt-3 text-sm font-semibold">{review.text}</p>
    </div>
  )
}

function FeatureList({
  items,
  dark,
  className = '',
}: {
  items: string[]
  dark: boolean
  className?: string
}) {
  return (
    <ul
      className={`grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2${
        className ? ` ${className}` : ''
      }`}
    >
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-2 ${dark ? 'text-white/60' : 'text-muted'}`}
        >
          <span
            aria-hidden="true"
            className={`mt-1.5 size-2 shrink-0 rounded-full ${
              dark ? 'bg-white/25' : 'bg-ink/20'
            }`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function OptionsLine({
  options,
  dark,
  className = '',
}: {
  options: string[]
  dark: boolean
  className?: string
}) {
  if (options.length === 0) return null
  return (
    <p
      className={`text-xs leading-5 ${dark ? 'text-white/45' : 'text-muted'}${
        className ? ` ${className}` : ''
      }`}
    >
      {PRICING.optionsLabel ? (
        <span className="font-medium">{`${PRICING.optionsLabel} `}</span>
      ) : null}
      {options.join(' · ')}
    </p>
  )
}

/** Carte standard (colonne de gauche ou de droite). */
function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`flex flex-col rounded-3xl p-2 ${
        plan.dark ? 'bg-ink text-white' : 'text-ink bg-white'
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl p-6 ${
          plan.dark ? 'bg-white/5' : 'bg-page/80'
        }`}
      >
        {plan.dark ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: DARK_SHEEN }}
          />
        ) : null}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg leading-7 font-medium">{plan.name}</span>
            <Badge plan={plan} />
          </div>
          <PlanTitle plan={plan} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <PlanPrice plan={plan} />
              <div className="mt-4">
                <DotButton
                  label={plan.cta.label}
                  href={plan.cta.href}
                  tone={plan.dark ? 'light' : 'dark'}
                />
              </div>
            </div>
            <ReviewCard plan={plan} />
          </div>
        </div>
      </div>
      <FeatureList
        items={plan.features}
        dark={plan.dark}
        className="px-6 py-6"
      />
      <OptionsLine
        options={plan.options}
        dark={plan.dark}
        className="mt-auto px-6 pb-6"
      />
    </div>
  )
}

/** Carte large : prix a gauche, prestations dans un bloc a droite. */
function WidePlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`rounded-3xl p-2 ${plan.dark ? 'bg-ink text-white' : 'text-ink bg-white'}`}
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg leading-7 font-medium">{plan.name}</span>
            <Badge plan={plan} />
          </div>
          <PlanTitle plan={plan} />
          <div className="mt-8 lg:mt-auto lg:pt-10">
            <PlanPrice plan={plan} />
            <div className="mt-4">
              <DotButton
                label={plan.cta.label}
                href={plan.cta.href}
                tone={plan.dark ? 'light' : 'dark'}
              />
            </div>
          </div>
        </div>
        <div
          className={`rounded-2xl p-6 ${plan.dark ? 'bg-white/5' : 'bg-page'}`}
        >
          <FeatureList items={plan.features} dark={plan.dark} />
          <OptionsLine
            options={plan.options}
            dark={plan.dark}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  )
}

/** Ligne « Une question ? Ecrivez a … ou nous contacter » a droite du titre. */
function Doubts() {
  const { text, writeTo, email, or, contactLabel, contactHref } = PRICING.doubts
  const link = 'text-primary underline underline-offset-4 hover:opacity-80'
  return (
    <p className="text-ink text-sm leading-6">
      {writeTo ? `${text} ${writeTo} ` : `${text} `}
      <a className={link} href={`mailto:${email}`}>
        {email}
      </a>
      {or ? ` ${or} ` : ' '}
      <a className={link} href={contactHref} target="_blank" rel="noopener">
        {contactLabel}
      </a>
    </p>
  )
}

export default function Pricing({
  showHeader = true,
}: {
  showHeader?: boolean
}) {
  const columns = PRICING.plans.filter((plan) => !plan.wide)
  const wide = PRICING.plans.filter((plan) => plan.wide)

  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        {showHeader ? (
          <SectionHeader title={PRICING.heading} right={<Doubts />} />
        ) : null}

        <div
          className={`grid gap-3 lg:grid-cols-2 ${showHeader ? 'mt-12' : ''}`}
        >
          {columns.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {wide.map((plan) => (
          <div key={plan.id} className="mt-3">
            <WidePlanCard plan={plan} />
          </div>
        ))}

        <p className="text-muted mt-8 text-center text-sm">{PRICING.note}</p>
      </Container>
    </section>
  )
}
