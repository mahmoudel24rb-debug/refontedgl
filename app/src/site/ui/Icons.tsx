import {
  ChartColumn,
  Clock,
  FileText,
  Handshake,
  MessageCircle,
  RefreshCw,
  Rocket,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { IconKey } from '../content'

/**
 * SVG inline du site racine (reseaux, etats, marques) et correspondance
 * cle de contenu vers icone lucide.
 */

interface IconProps {
  className?: string
  size?: number
}

export function LinkedInIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-3.9V9Z" />
    </svg>
  )
}

export function InstagramIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function XIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-5.9l-4.62-6.04L5.94 21H2.96l6.94-7.93L2.25 3h6.05l4.18 5.52L17.53 3Zm-1.04 16.2h1.65L7.6 4.71H5.83L16.49 19.2Z" />
    </svg>
  )
}

export function CheckCircleIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      <path
        d="m8 12.4 2.6 2.6L16 9.6"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WarningCircleIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#F59E0B" />
      <path
        d="M12 7v6"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.2" fill="#ffffff" />
    </svg>
  )
}

export function QuoteIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M9.5 5C6.46 5 4 7.6 4 10.8c0 3 2.1 5.2 4.9 5.2.5 0 1-.07 1.4-.2-.6 1.6-2 2.7-3.8 3.2l.6 1.8c3.9-1 6.6-4.4 6.6-9.3C13.7 7.5 12 5 9.5 5Zm10 0C16.46 5 14 7.6 14 10.8c0 3 2.1 5.2 4.9 5.2.5 0 1-.07 1.4-.2-.6 1.6-2 2.7-3.8 3.2l.6 1.8c3.9-1 6.6-4.4 6.6-9.3C23.7 7.5 22 5 19.5 5Z" />
    </svg>
  )
}

export function GoogleGIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7C13.42 14.62 18.27 10.75 24 10.75Z"
      />
    </svg>
  )
}

export function ArrowRightIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function ChevronDownIcon({ className = '', size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** Icones du tableau comparatif, indexees par la cle du contenu. */
export const VS_ICONS: Record<IconKey, LucideIcon> = {
  target: Target,
  chart: ChartColumn,
  chat: MessageCircle,
  report: FileText,
  refresh: RefreshCw,
  handshake: Handshake,
  rocket: Rocket,
  clock: Clock,
}

/** Meme table pour les cartes engagements. */
export const FEATURE_ICONS: Record<IconKey, LucideIcon> = VS_ICONS
