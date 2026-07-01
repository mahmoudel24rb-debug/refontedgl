import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Base URL for global assets (Bancuip template).
 * TO REPLACE when we swap to DGL Agency assets.
 */
export const ASSET_BASE = 'https://qclay.design/lovable/bancuip/'

export function asset(path: string) {
  return `${ASSET_BASE}${path.replace(/^\//, '')}`
}
