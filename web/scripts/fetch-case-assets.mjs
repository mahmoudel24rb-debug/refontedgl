/**
 * Telecharge les visuels WordPress des pages cas client dans
 * `app/public/assets/cas/<slug>/`. Aucune image des pages
 * `/realisations/:slug` ne doit pointer vers dgl-agency.fr : tout est servi
 * en local.
 *
 * Usage : node scripts/fetch-case-assets.mjs
 * Si le TLS bloque : NODE_OPTIONS=--use-system-ca node scripts/fetch-case-assets.mjs
 *
 * Apres telechargement, chaque fichier est normalise en WebP de 1200 px de
 * large au maximum (sharp si present dans node_modules, sinon Python PIL).
 */
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/assets/cas')

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const MAX_WIDTH = 1200
const MIN_BYTES = 5 * 1024
const ATTEMPTS = 3

/* [chemin relatif a public/assets/cas, url source] */
const FILES = [
  [
    'gymfit-meta-ads/meta-ads-1.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/01/Image-Meta-ads-Gymfit-1.webp',
  ],
  [
    'gymfit-meta-ads/meta-ads-2.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/01/Image-Meta-ads-Gymfit-2.webp',
  ],
  [
    'oceades-noel/offre-noel-1.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Offre-de-noel-1.webp',
  ],
  [
    'oceades-noel/offre-noel-2.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Offre-de-noel-2.webp',
  ],
  [
    'oceades-noel/offre-noel-3.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Offre-de-noel-3.webp',
  ],
  [
    'oceades-noel/bilan-peau.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Image-Bilan-peau.webp',
  ],
  [
    'oceades-noel/reformer.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/02/Image-Reformer.webp',
  ],
  [
    'beauregard-kid-fitness/kid-fitness-1.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Image-Kid-Fitness-1.webp',
  ],
  [
    'beauregard-kid-fitness/kid-fitness-2.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Image-Kid-Fitness-2.webp',
  ],
  [
    'beauregard-kid-fitness/kid-fitness-3.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Image-Kid-Fitness-3.webp',
  ],
  [
    'epicure-pilates/publicite-1.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Visuel-Publicite-Epicure-1.webp',
  ],
  [
    'epicure-pilates/publicite-2.webp',
    'https://dgl-agency.fr/wp-content/uploads/2026/03/Visuel-Publicite-Epicure-2.webp',
  ],
]

/** Un essai de telechargement : le serveur coupe parfois la connexion. */
async function attempt(url) {
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
  return buf
}

async function download(rel, url) {
  const dest = resolve(OUT, rel)
  await mkdir(dirname(dest), { recursive: true })

  let last
  for (let round = 1; round <= ATTEMPTS; round += 1) {
    try {
      const buf = await attempt(url)
      await writeFile(dest, buf)
      return buf.length
    } catch (err) {
      last = err
      if (round < ATTEMPTS) {
        await new Promise((done) => setTimeout(done, 800 * round))
      }
    }
  }
  throw last
}

/** Convertit en WebP <= MAX_WIDTH px, via sharp si installe, sinon PIL. */
async function normalize(paths) {
  let sharp = null
  try {
    ;({ default: sharp } = await import('sharp'))
  } catch {
    sharp = null
  }

  if (sharp) {
    for (const file of paths) {
      const buf = await sharp(file)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer()
      await writeFile(file, buf)
    }
    console.log(`\nnormalise ${paths.length} fichier(s) avec sharp.`)
    return
  }

  const script = [
    'import sys',
    'from PIL import Image',
    'for path in sys.argv[1:]:',
    '    img = Image.open(path)',
    '    img = img.convert("RGB")',
    `    if img.width > ${MAX_WIDTH}:`,
    `        height = round(img.height * ${MAX_WIDTH} / img.width)`,
    `        img = img.resize((${MAX_WIDTH}, height), Image.LANCZOS)`,
    '    img.save(path, "WEBP", quality=82, method=6)',
    '    print("webp", path, img.width, "x", img.height)',
  ].join('\n')

  const { stdout } = await run('python', ['-c', script, ...paths])
  process.stdout.write(stdout)
  console.log(`\nnormalise ${paths.length} fichier(s) avec Python PIL.`)
}

let failures = 0
const done = []

for (const [rel, url] of FILES) {
  const dest = resolve(OUT, rel)
  try {
    const existing = await stat(dest).catch(() => null)
    if (existing && existing.size >= MIN_BYTES) {
      console.log(`skip  ${rel} (${existing.size} octets, deja present)`)
      done.push(dest)
      continue
    }
    const size = await download(rel, url)
    console.log(`ok    ${rel} (${size} octets)`)
    done.push(dest)
  } catch (err) {
    failures += 1
    console.error(`ECHEC ${rel} : ${err.message}`)
    console.error(
      `      repli : curl -sL -A "Mozilla/5.0" -o "public/assets/cas/${rel}" "${url}"`,
    )
  }
}

if (done.length > 0) {
  try {
    await normalize(done)
  } catch (err) {
    console.error(`ECHEC conversion WebP : ${err.message}`)
    failures += 1
  }
}

if (failures > 0) {
  console.error(`\n${failures} fichier(s) en echec.`)
  process.exit(1)
}

console.log(`\n${FILES.length} fichiers prets dans public/assets/cas/.`)
