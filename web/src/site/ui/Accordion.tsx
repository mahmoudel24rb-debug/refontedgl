'use client'

import { useId, useState, type ReactNode } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

/**
 * Accordeon du template (FAQ, comparatif en mobile) : un seul volet ouvert,
 * animation `grid-template-rows` de 0fr a 1fr, chevron qui pivote.
 */
export default function Accordion({
  items,
  defaultOpenId = null,
  className = '',
}: {
  items: AccordionItem[]
  defaultOpenId?: string | null
  className?: string
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId)
  const uid = useId()

  return (
    <div className={`w-full${className ? ` ${className}` : ''}`}>
      {items.map((item) => {
        const open = openId === item.id
        const panelId = `${uid}-${item.id}-panel`
        const buttonId = `${uid}-${item.id}-button`
        return (
          <div key={item.id} className="border-ink/10 border-b">
            <h3 className="flex">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="text-ink flex flex-1 cursor-pointer items-start justify-between gap-4 py-5 text-left text-base font-medium transition-colors hover:opacity-80"
              >
                <span>{item.title}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 transition-transform duration-300 ${
                    open ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="text-muted pb-5 text-base leading-7">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
