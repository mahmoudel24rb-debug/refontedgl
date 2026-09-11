import { DM_Mono, Inter_Tight } from 'next/font/google'

/**
 * Polices du site, partagees par les layouts racines et la 404 racine
 * (qui fournit son propre <html>).
 */

/** Police principale : Inter Tight, graisses 300 a 700. */
export const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter-tight',
})

/** Police monospace des libelles et chiffres : DM Mono. */
export const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
})
