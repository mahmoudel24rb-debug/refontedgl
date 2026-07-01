import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Base URL for local assets (downloaded from Bancuip template).
 * Files live in `public/assets/` and are served at `/assets/*`.
 */
export const ASSET_BASE = '/assets/'

export function asset(path: string) {
  return `${ASSET_BASE}${path.replace(/^\//, '')}`
}
