import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import DotButton, { ArrowButton } from '../ui/DotButton'
import { InstagramIcon, LinkedInIcon, XIcon } from '../ui/Icons'
import { CTA, FOOTER } from '../content'
import { LOGO_DGL, LOGO_FILTER_WHITE } from '../tokens'

const SOCIAL_ICONS: Record<string, typeof LinkedInIcon> = {
  LinkedIn: LinkedInIcon,
  Instagram: InstagramIcon,
  X: XIcon,
}

export default function Footer() {
  return (
    <footer className="bg-ink-deep relative overflow-hidden text-white">
      <Container className="py-8 md:py-10">
        {/* Carte CTA + wordmark geant coupe par le bas */}
        <div
          className="relative flex min-h-[420px] flex-col justify-start overflow-hidden rounded-3xl p-6 md:p-12"
          style={{
            backgroundImage:
              'linear-gradient(165deg, #063b43 0%, #002329 45%, #001519 100%)',
          }}
        >
          <div className="relative z-10 flex items-start justify-between gap-6">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              {FOOTER.cta.title}
            </h2>
            <ArrowButton
              href={FOOTER.cta.href}
              label="Réserver un audit gratuit"
              className="shrink-0"
            />
          </div>
          <span
            aria-hidden="true"
            className="-tracking-xl pointer-events-none absolute left-6 -bottom-[0.16em] block bg-linear-to-r from-white/10 to-white/0 bg-clip-text font-semibold whitespace-nowrap text-transparent select-none md:left-12"
            style={{ fontSize: 'clamp(96px, 18vw, 260px)', lineHeight: 1 }}
          >
            {FOOTER.wordmark}
          </span>
        </div>

        {/* Logo + tagline + colonnes de liens */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="flex flex-col items-start gap-5">
            <Link to="/" aria-label="DGL Agency, accueil">
              <img
                src={LOGO_DGL}
                alt="DGL Agency"
                width={112}
                height={28}
                className="h-10 w-auto object-contain"
                style={{ filter: LOGO_FILTER_WHITE }}
              />
            </Link>
            <p className="max-w-xs text-sm text-white/60">{FOOTER.tagline}</p>
            <DotButton label={CTA.label} href={CTA.href} tone="dark" />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {FOOTER.columns.map((column) => (
              <div key={column.title}>
                <h3 className="-tracking-sm font-mono text-xs leading-5 font-medium tracking-wide text-white/50 uppercase">
                  {column.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="-tracking-sm text-sm leading-5 font-medium text-white hover:underline"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="-tracking-sm text-sm leading-5 font-medium text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 text-sm text-white/50 sm:flex-row sm:items-center sm:gap-6">
            <span>{FOOTER.legal}</span>
            <a href={FOOTER.phoneHref} className="hover:text-white">
              {FOOTER.phone}
            </a>
            <a href={`mailto:${FOOTER.email}`} className="hover:text-white">
              {FOOTER.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {FOOTER.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.name] ?? LinkedInIcon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={social.name}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <Icon size={18} />
                </a>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}
