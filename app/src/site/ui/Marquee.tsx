import type { ReactNode } from 'react'

const CSS = `
.dgl-mq{position:relative;overflow:hidden}
.dgl-mq-track{display:flex;width:max-content;flex-shrink:0;align-items:center;
  animation-name:dgl-marquee;animation-timing-function:linear;animation-iteration-count:infinite}
.dgl-mq-track[data-reverse="true"]{animation-name:dgl-marquee-reverse}
.dgl-mq[data-pause="true"]:hover .dgl-mq-track{animation-play-state:paused}
@media (prefers-reduced-motion: reduce){
  .dgl-mq-track{animation:none}
}
`

/**
 * Defilement horizontal infini : le contenu est duplique et la piste
 * translate de -50 %.
 */
export default function Marquee({
  children,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
  className = '',
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
}) {
  return (
    <div
      className={`dgl-mq${className ? ` ${className}` : ''}`}
      data-pause={pauseOnHover ? 'true' : 'false'}
    >
      <style>{CSS}</style>
      <div
        className="dgl-mq-track"
        data-reverse={reverse ? 'true' : 'false'}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
