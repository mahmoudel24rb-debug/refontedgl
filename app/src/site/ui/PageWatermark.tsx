import Container from './Container'

/**
 * Filigrane geant en haut de page (« Realisations », « Tarifs »).
 * Le parent doit etre `relative` : le filigrane est coupe par la premiere
 * section qui passe par-dessus.
 */
export default function PageWatermark({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden select-none${
        className ? ` ${className}` : ''
      }`}
    >
      <Container>
        <span
          className="-tracking-xl block whitespace-nowrap text-white opacity-25"
          style={{
            fontSize: 'clamp(96px, 16vw, 220px)',
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      </Container>
    </div>
  )
}
