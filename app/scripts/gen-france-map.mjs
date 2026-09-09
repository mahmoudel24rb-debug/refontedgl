/**
 * Genere `src/site/data/france-map.ts` : la carte de France en points et la
 * position projetee des villes utilisees par la carte du bento services.
 *
 * Le fichier produit est commite : `dotted-map` reste une dependance de
 * developpement, rien n'est calcule au runtime.
 *
 * Usage : node scripts/gen-france-map.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import DottedMap from 'dotted-map'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src', 'site', 'data', 'france-map.ts')

/** Villes projetees sur la carte (latitude / longitude). */
const CITIES = {
  Tours: { lat: 47.394, lng: 0.684 },
  'Le Mans': { lat: 48.006, lng: 0.2 },
  Strasbourg: { lat: 48.573, lng: 7.752 },
  Paris: { lat: 48.857, lng: 2.352 },
  'Orléans': { lat: 47.902, lng: 1.909 },
  Bourges: { lat: 47.081, lng: 2.399 },
  Chartres: { lat: 48.447, lng: 1.489 },
  'Châteauroux': { lat: 46.811, lng: 1.691 },
  Angers: { lat: 47.478, lng: -0.563 },
  Nantes: { lat: 47.218, lng: -1.553 },
  Lyon: { lat: 45.764, lng: 4.836 },
  Bordeaux: { lat: 44.838, lng: -0.579 },
}

const round = (value) => Math.round(value * 100) / 100

const map = new DottedMap({ height: 60, grid: 'diagonal', countries: ['FRA'] })
const points = map.getPoints()

if (points.length === 0) {
  throw new Error('dotted-map n a renvoye aucun point pour FRA')
}

/* Boite englobante reelle des points : la carte est recadree sur la France. */
const xs = points.map((point) => point.x)
const ys = points.map((point) => point.y)
const minX = Math.min(...xs)
const maxX = Math.max(...xs)
const minY = Math.min(...ys)
const maxY = Math.max(...ys)
const PAD = 1

const width = round(maxX - minX + 2 * PAD)
const height = round(maxY - minY + 2 * PAD)
const shiftX = (value) => round(value - minX + PAD)
const shiftY = (value) => round(value - minY + PAD)

const dots = points.map((point) => [shiftX(point.x), shiftY(point.y)])

const pins = {}
for (const [city, coords] of Object.entries(CITIES)) {
  const pin = map.getPin(coords)
  if (!pin) throw new Error(`Ville hors carte : ${city}`)
  pins[city] = { x: shiftX(pin.x), y: shiftY(pin.y) }
}

const body = `/* Fichier genere par scripts/gen-france-map.mjs. Ne pas editer a la main. */

export interface FranceMapPin {
  x: number
  y: number
}

export interface FranceMap {
  /** Largeur du repere SVG (unites dotted-map). */
  width: number
  /** Hauteur du repere SVG. */
  height: number
  /** Points de la France, en coordonnees [x, y]. */
  dots: [number, number][]
  /** Position projetee des villes. */
  pins: Record<string, FranceMapPin>
}

export const FRANCE_MAP: FranceMap = {
  width: ${width},
  height: ${height},
  dots: [
${dots.map(([x, y]) => `    [${x}, ${y}],`).join('\n')}
  ],
  pins: {
${Object.entries(pins)
  .map(([city, pin]) => `    ${JSON.stringify(city)}: { x: ${pin.x}, y: ${pin.y} },`)
  .join('\n')}
  },
}
`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, body, 'utf8')

console.log(
  `france-map.ts : ${dots.length} points, ${Object.keys(pins).length} villes, ${width}x${height}`,
)
