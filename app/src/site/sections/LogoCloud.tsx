import Container from '../ui/Container'
import { CLIENT_LOGOS, LOGO_CLOUD_EYEBROW } from '../content'
import { LOGO_FILTER_INK } from '../tokens'

/**
 * Bandeau de logos clients. Les webp sont livres en blanc : sur fond clair
 * ils passent en navy monochrome, sur fond sombre ils restent tels quels.
 */
export default function LogoCloud({
  tone = 'light',
}: {
  tone?: 'light' | 'dark'
}) {
  return (
    <Container className="max-w-7xl py-20">
      <h2
        className={`-tracking-xs text-center font-mono text-sm leading-4 font-normal uppercase ${
          tone === 'dark' ? 'text-white/60' : 'text-muted'
        }`}
      >
        {LOGO_CLOUD_EYEBROW}
      </h2>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-4 md:gap-x-20 md:gap-y-14">
        {CLIENT_LOGOS.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-6 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 md:h-8"
            style={tone === 'dark' ? undefined : { filter: LOGO_FILTER_INK }}
          />
        ))}
      </div>
    </Container>
  )
}
