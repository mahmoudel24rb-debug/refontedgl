import { useEffect, useRef, useState, type ReactNode } from 'react'

const CSS = `
.dgl-mq{position:relative;overflow:hidden}
.dgl-mq-track{display:flex;width:max-content;flex-shrink:0;align-items:center;will-change:transform;
  animation-name:dgl-marquee;animation-timing-function:linear;animation-iteration-count:infinite}
.dgl-mq-track[data-reverse="true"]{animation-name:dgl-marquee-reverse}
.dgl-mq[data-pause="true"]:hover .dgl-mq-track{animation-play-state:paused}
@media (prefers-reduced-motion: reduce){
  .dgl-mq-track,.dgl-mq-track[data-reverse="true"]{animation:none}
}
`

/**
 * Defilement horizontal infini : le contenu est duplique et la piste
 * translate de -50 %.
 * `speed` (px/s) l'emporte sur `duration` : la duree est recalculee a partir
 * de la largeur reelle d'une moitie de piste (`ResizeObserver`).
 * `autoFill` repete le contenu autant de fois qu'il faut pour couvrir la
 * largeur du conteneur, comme l'option du meme nom de react-fast-marquee.
 */
export default function Marquee({
  children,
  duration = 30,
  speed,
  reverse = false,
  pauseOnHover = true,
  autoFill = false,
  className = '',
}: {
  children: ReactNode
  duration?: number
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  autoFill?: boolean
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(1)
  const [groupWidth, setGroupWidth] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const group = groupRef.current
    if (!wrap || !group) return

    const update = () => {
      const width = group.getBoundingClientRect().width
      setGroupWidth(width)
      if (!autoFill) {
        setCopies(1)
        return
      }
      const available = wrap.getBoundingClientRect().width
      if (width <= 0 || available <= 0) return
      setCopies(Math.max(1, Math.ceil(available / width)))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(wrap)
    observer.observe(group)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [autoFill])

  const halfWidth = groupWidth * copies
  const seconds = speed && halfWidth > 0 ? halfWidth / speed : duration

  const half = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: copies }, (_, copy) => (
        <div
          key={copy}
          ref={copy === 0 && !hidden ? groupRef : undefined}
          className="flex shrink-0 items-center"
          aria-hidden={!hidden && copy > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  )

  return (
    <div
      ref={wrapRef}
      className={`dgl-mq${className ? ` ${className}` : ''}`}
      data-pause={pauseOnHover ? 'true' : 'false'}
    >
      <style>{CSS}</style>
      <div
        className="dgl-mq-track"
        data-reverse={reverse ? 'true' : 'false'}
        style={{ animationDuration: `${seconds}s` }}
      >
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}
