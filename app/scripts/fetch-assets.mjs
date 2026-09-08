/**
 * Telecharge une fois pour toutes les visuels DGL (WordPress) dans
 * `app/public/assets/`. Aucune image du site racine ne doit pointer vers
 * dgl-agency.fr : tout est servi en local.
 *
 * Usage : node scripts/fetch-assets.mjs
 * Si le TLS bloque : NODE_OPTIONS=--use-system-ca node scripts/fetch-assets.mjs
 */
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/assets')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const FILES = [
  // Realisations
  [
    'projets/gymfit-site.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/01/Image-salle-de-sport-Gymfit.webp',
  ],
  [
    'projets/gymfit-meta-ads.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/01/Image-Meta-ads-Gymfit-2.webp',
  ],
  [
    'projets/oceades-noel.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Offre-de-noel-1.webp',
  ],
  [
    'projets/oceades-seo.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Image-Les-Oceades-DGL.webp',
  ],
  [
    'projets/beauregard-kid-fitness.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Image-Kid-Fitness-1.webp',
  ],
  [
    'projets/epicure-pilates.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Visuel-Publicite-Epicure-1.webp',
  ],
  // Avatars
  [
    'avatars/hakim.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Hakim.webp',
  ],
  [
    'avatars/samuel.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Samuel.webp',
  ],
  [
    'avatars/marion.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Marion-e1763559883859.webp',
  ],
  [
    'avatars/victor.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/victor.webp',
  ],
  // Agence
  [
    'agence/rdv-client.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/rdv-client.webp',
  ],
  [
    'agence/resultats.webp',
    'https://dgl-agency.fr/wp-content/uploads/2025/11/Resultats-2-e1764081017802.webp',
  ],
]

const MIN_BYTES = 5 * 1024

async function download(rel, url) {
  const dest = resolve(OUT, rel)
  await mkdir(dirname(dest), { recursive: true })

  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'image/webp,image/*,*/*;q=0.8',
      'Accept-Language': 'fr-FR,fr;q=0.9',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < MIN_BYTES) {
    throw new Error(`fichier trop petit (${buf.length} octets)`)
  }
  await writeFile(dest, buf)
  return buf.length
}

let failures = 0

for (const [rel, url] of FILES) {
  const dest = resolve(OUT, rel)
  try {
    const existing = await stat(dest).catch(() => null)
    if (existing && existing.size >= MIN_BYTES) {
      console.log(`skip  ${rel} (${existing.size} octets, deja present)`)
      continue
    }
    const size = await download(rel, url)
    console.log(`ok    ${rel} (${size} octets)`)
  } catch (err) {
    failures += 1
    console.error(`ECHEC ${rel} : ${err.message}`)
    console.error(
      `      repli : curl -sL -A "Mozilla/5.0" -o "public/assets/${rel}" "${url}"`,
    )
  }
}

if (failures > 0) {
  console.error(`\n${failures} fichier(s) en echec.`)
  process.exit(1)
}

console.log(`\n${FILES.length} fichiers prets dans public/assets/.`)
