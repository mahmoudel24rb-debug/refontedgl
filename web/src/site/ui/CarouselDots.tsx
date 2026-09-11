'use client'

/** Pastilles de carrousel : pill blanche ombree, point actif en navy. */
export default function CarouselDots({
  count,
  active,
  onSelect,
  className = '',
  label = 'Navigation du carrousel',
}: {
  count: number
  active: number
  onSelect: (index: number) => void
  className?: string
  label?: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_2px_6px_0_rgba(0,0,0,0.12)]${
        className ? ` ${className}` : ''
      }`}
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === active}
          aria-label={`Aller au groupe ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`size-2 cursor-pointer rounded-full transition-all duration-300 ${
            index === active ? 'bg-ink' : 'bg-ink/15 hover:bg-ink/30'
          }`}
        />
      ))}
    </div>
  )
}
