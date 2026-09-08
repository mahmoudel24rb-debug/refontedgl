import Container from '../ui/Container'
import Marquee from '../ui/Marquee'
import { LinkedInIcon } from '../ui/Icons'
import { FOUNDER, TESTIMONIALS, type Testimonial } from '../content'

/**
 * « Le bureau du fondateur » : bandeau navy profond plein largeur, quadrille
 * fin masque vers le bas, photo a gauche, mot du fondateur a droite et
 * defilement de mini-avis clients en bas.
 */

/** Longueur d'une citation dans les mini-cartes du defilement. */
const QUOTE_MAX = 70

function shorten(text: string) {
  if (text.length <= QUOTE_MAX) return text
  const cut = text.slice(0, QUOTE_MAX)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

function Grid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage:
          'linear-gradient(to bottom, black 0%, black 40%, transparent 92%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 40%, transparent 92%)',
      }}
    />
  )
}

function ReviewChip({ item }: { item: Testimonial }) {
  return (
    <figure className="mr-3 flex min-w-[280px] max-w-[320px] flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <figcaption className="min-w-0 text-sm whitespace-nowrap">
          <span className="text-white">{item.name}</span>
          <span className="text-white/50">{`, ${item.role}`}</span>
        </figcaption>
        <img
          src={item.logo}
          alt={item.company}
          loading="lazy"
          className="ml-auto h-5 w-auto shrink-0 object-contain opacity-80"
        />
      </div>
      <blockquote className="mt-2 text-sm font-bold text-white">
        {shorten(item.quote)}
      </blockquote>
    </figure>
  )
}

export default function Founder() {
  const [firstParagraph, ...restParagraphs] = FOUNDER.paragraphs
  const intro = FOUNDER.intro

  return (
    <section className="bg-ink-deep relative w-full overflow-hidden rounded-none py-20 text-white md:py-28">
      <Grid />
      <Container className="relative z-10">
        <h2 className="-tracking-xl text-5xl leading-[1.05] font-medium text-balance md:text-7xl">
          {FOUNDER.heading}
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[480px_1fr]">
          <div className="w-full max-w-[480px]">
            <img
              src={FOUNDER.photo}
              alt={`${FOUNDER.name}, ${FOUNDER.role}`}
              loading="lazy"
              width={480}
              height={600}
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex justify-start lg:justify-end">
              <a
                href={FOUNDER.linkedin}
                target="_blank"
                rel="noopener"
                aria-label={`LinkedIn de ${FOUNDER.name}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                <LinkedInIcon size={20} />
              </a>
            </div>

            <div className="mt-6 flex flex-col gap-6 text-lg leading-relaxed font-medium text-white/90 md:text-xl">
              <p>
                {intro ? (
                  <>
                    {`${intro.greeting} `}
                    <a
                      href={FOUNDER.linkedin}
                      target="_blank"
                      rel="noopener"
                      className="text-white underline underline-offset-4 hover:opacity-80"
                    >
                      {FOUNDER.name}
                    </a>
                    {`${intro.after} `}
                  </>
                ) : null}
                {firstParagraph}
              </p>
              {restParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 lg:mt-auto lg:pt-12">
              <Marquee duration={25} pauseOnHover>
                {TESTIMONIALS.map((item) => (
                  <ReviewChip key={item.name} item={item} />
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
