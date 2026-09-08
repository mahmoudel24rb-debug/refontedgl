/**
 * Snapshot des articles du blog WordPress (dgl-agency.fr) vers
 * `app/src/data/blog.json`. Le site racine ne fait AUCUNE requete vers
 * dgl-agency.fr au runtime : tout le contenu est fige dans ce JSON.
 *
 * Usage : node scripts/fetch-blog.mjs
 * Si le TLS bloque : NODE_OPTIONS=--use-system-ca node scripts/fetch-blog.mjs
 *
 * Le script est idempotent : relance = regeneration complete du fichier.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = resolve(ROOT, 'src/data/blog.json')

const API = 'https://dgl-agency.fr/wp-json/wp/v2'
const POST_FIELDS =
  'id,slug,date,modified,title,excerpt,content,categories,yoast_head_json'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/** Nombre maximal d'articles conserves (garde le poids du JSON sous controle). */
const MAX_POSTS = 40

/**
 * Budget de poids du snapshot. Au-dela, les articles les plus anciens sont
 * retires un a un (jamais en dessous de MIN_POSTS) : le chunk `posts` du
 * bundle reste raisonnable.
 */
const MAX_BYTES = 440_000
const MIN_POSTS = 20

/* -------------------------------------------------------------------------- */
/* Utilitaires texte                                                          */
/* -------------------------------------------------------------------------- */

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  laquo: '«',
  raquo: '»',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  eacute: 'é',
  egrave: 'è',
  ecirc: 'ê',
  agrave: 'à',
  acirc: 'â',
  ccedil: 'ç',
  ugrave: 'ù',
  ucirc: 'û',
  icirc: 'î',
  iuml: 'ï',
  ocirc: 'ô',
  euro: '€',
  deg: '°',
  times: '×',
  bull: '•',
  middot: '·',
  shy: '',
  reg: '®',
  copy: '©',
  trade: '™',
}

/** Decode les entites HTML (nommees + numeriques) d'une chaine. */
function decodeEntities(input) {
  return String(input).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, code) => {
    if (code[0] === '#') {
      const num =
        code[1] === 'x' || code[1] === 'X'
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10)
      return Number.isFinite(num) ? String.fromCodePoint(num) : m
    }
    const named = NAMED_ENTITIES[code]
    return named === undefined ? m : named
  })
}

/** Retire les balises et normalise les blancs. */
function stripTags(html) {
  return decodeEntities(
    String(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim()
}

/** Slug ASCII a partir d'un texte francais (accents retires). */
function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u201c\u201d]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

/** « 2026-09-02T14:22:56 » -> « 2 septembre 2026 ». */
function frenchDate(iso) {
  const d = new Date(iso)
  const day = d.getUTCDate()
  return `${day === 1 ? '1er' : day} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/* -------------------------------------------------------------------------- */
/* Nettoyage du HTML WordPress                                                */
/* -------------------------------------------------------------------------- */

/** Balises de bloc : les blancs qui les entourent ne portent aucun sens. */
const BLOCK_TAGS =
  'p|h1|h2|h3|h4|h5|h6|ul|ol|li|div|aside|section|article|blockquote|figure|figcaption|table|thead|tbody|tfoot|tr|td|th|details|summary|hr|br'

/** `blockRe('<(?:BLOCK)>')` : BLOCK est remplace par la liste ci-dessus. */
function blockRe(pattern, flags = 'gi') {
  return new RegExp(pattern.replace(/BLOCK/g, BLOCK_TAGS), flags)
}

/**
 * Retire (ou remplace) un bloc `<div class="…nom…">…</div>` en comptant les
 * div imbriquees. `wrap` = ['<aside>', '</aside>'] pour convertir au lieu de
 * supprimer, `transformInner` pour retoucher le contenu conserve.
 */
function replaceDivBlock(html, className, wrap, transformInner) {
  const open = new RegExp(`<div[^>]*class="[^"]*${className}[^"]*"[^>]*>`, 'i')
  let out = html
  for (let guard = 0; guard < 50; guard += 1) {
    const match = open.exec(out)
    if (!match) break
    const start = match.index
    const innerStart = start + match[0].length
    let innerEnd = out.length
    let end = out.length
    let depth = 1
    const tag = /<\/?div\b[^>]*>/gi
    tag.lastIndex = innerStart
    let hit
    while ((hit = tag.exec(out))) {
      depth += hit[0][1] === '/' ? -1 : 1
      if (depth === 0) {
        innerEnd = hit.index
        end = tag.lastIndex
        break
      }
    }
    const raw = out.slice(innerStart, innerEnd)
    const inner = transformInner ? transformInner(raw) : raw
    const replacement = wrap ? `${wrap[0]}${inner}${wrap[1]}` : ''
    out = out.slice(0, start) + replacement + out.slice(end)
  }
  return out
}

/**
 * Retire la pastille des encadres WordPress : le premier `<div>` enfant dont
 * le contenu textuel vaut exactement « i » (sans lui, un « i » orphelin reste
 * dans le rendu une fois les attributs de presentation supprimes).
 */
function dropInfoBadge(inner) {
  return inner.replace(/<div\b[^>]*>\s*(?:<[^>]+>\s*)*i\s*(?:<\/[^>]+>\s*)*<\/div\s*>/i, '')
}

/** Vrai si le href sort du site (http/https absolu). */
function isExternalHref(href) {
  return /^https?:\/\//i.test(href)
}

/**
 * Nettoie le HTML d'un article WordPress : scripts/styles, attributs de
 * presentation, CTA WordPress, images distantes, liens externes.
 * Retourne { html, toc }.
 */
function cleanContent(rawHtml) {
  let html = String(rawHtml)

  // 1. Scripts, styles, noscript, commentaires HTML.
  html = html
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  // 2. CTA WordPress supprimes, encarts « L'essentiel en 30 secondes » gardes
  //    sous forme d'aside simple.
  html = replaceDivBlock(html, 'dgl-cta-box', null)
  html = replaceDivBlock(html, 'dgl-tldr-geo', ['<aside>', '</aside>'])
  html = replaceDivBlock(
    html,
    'info-hover-box',
    ['<aside data-kind="info">', '</aside>'],
    dropInfoBadge,
  )

  // 3. Images distantes retirees (aucune requete vers dgl-agency.fr).
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\ssrc\s*=\s*["']([^"']*)["']/i.exec(tag)
    return src && !isExternalHref(src[1]) ? tag : ''
  })

  // 4. Attributs de presentation : style / class / id.
  html = html.replace(
    /\s(?:style|class|id)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    '',
  )

  // 5. Enveloppes vides laissees par les suppressions + pastilles « i »
  //    residuelles des encadres non typees par une classe connue.
  html = html.replace(/<div\s*>\s*i\s*<\/div\s*>/gi, '')
  for (let i = 0; i < 4; i += 1) {
    html = html
      .replace(/<figure\s*>\s*<\/figure\s*>/gi, '')
      .replace(/<div\s*>\s*<\/div\s*>/gi, '')
      .replace(/<p\s*>\s*<\/p\s*>/gi, '')
  }

  // 6. Liens : externes en nouvel onglet, ancres internes intactes.
  html = html.replace(/<a\b([^>]*)>/gi, (tag, attrs) => {
    const href = /\shref\s*=\s*["']([^"']*)["']/i.exec(attrs)
    if (!href) return '<a>'
    const url = href[1]
    if (!isExternalHref(url)) return `<a href="${url}">`
    return `<a href="${url}" target="_blank" rel="noopener">`
  })

  // 7. Phrase de CTA finale : les liens vers /audit-gratuit des derniers blocs
  //    sont deballes (le CTA du site racine prend le relais).
  const blocks = [...html.matchAll(/<(p|h2|h3|ul|ol|blockquote|aside)\b[\s\S]*?<\/\1\s*>/gi)]
  const tail = blocks.slice(-3)
  for (const block of tail) {
    if (!/dgl-agency\.fr\/audit-gratuit/i.test(block[0])) continue
    const unwrapped = block[0].replace(
      /<a\b[^>]*href="[^"]*dgl-agency\.fr\/audit-gratuit[^"]*"[^>]*>([\s\S]*?)<\/a\s*>/gi,
      '$1',
    )
    html = html.replace(block[0], () => unwrapped)
  }

  // 8. Minification : retours et espaces multiples entre balises de bloc,
  //    blancs colles a l'interieur des balises de bloc, attributs vides.
  //    Les blancs entre balises INLINE (<a>, <strong>, <em>...) sont
  //    conserves : ils separent des mots.
  html = html
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+[a-zA-Z_:][-\w:.]*=(?:""|'')/g, '')
    .replace(blockRe(String.raw`(<(?:BLOCK)(?:\s[^>]*)?>)\s+`), '$1')
    .replace(blockRe(String.raw`\s+(</(?:BLOCK)\s*>)`), '$1')
    .replace(blockRe(String.raw`(</(?:BLOCK)\s*>)\s+(?=<)`), '$1')
    .replace(blockRe(String.raw`\s+(<(?:BLOCK)[\s>])`), '$1')
    .trim()

  // 9. Identifiants des H2 (ancres du sommaire) + sommaire.
  const toc = []
  const used = new Set()
  html = html.replace(/<h2\s*>([\s\S]*?)<\/h2\s*>/gi, (full, inner, offset) => {
    const text = stripTags(inner)
    if (!text) return full
    let id = slugify(text) || `section-${toc.length + 1}`
    let n = 2
    while (used.has(id)) {
      id = `${slugify(text)}-${n}`
      n += 1
    }
    used.add(id)
    // Les H2 des encarts (aside) ne sont pas des sections de l'article.
    const before = html.slice(0, offset)
    const inAside =
      before.lastIndexOf('<aside') > before.lastIndexOf('</aside>')
    if (!inAside) toc.push({ id, text })
    return `<h2 id="${id}">${inner}</h2>`
  })

  return { html, toc }
}

/* -------------------------------------------------------------------------- */
/* Recuperation                                                               */
/* -------------------------------------------------------------------------- */

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} sur ${url}`)
  return res.json()
}

async function fetchAllPosts() {
  const all = []
  for (let page = 1; page <= 20; page += 1) {
    const url = `${API}/posts?per_page=50&page=${page}&_fields=${POST_FIELDS}`
    let batch
    try {
      batch = await getJson(url)
    } catch (err) {
      // WordPress renvoie 400 quand la page demandee depasse le total.
      if (page > 1 && /\b400\b/.test(String(err.message))) break
      throw err
    }
    if (!Array.isArray(batch) || batch.length === 0) break
    all.push(...batch)
    if (batch.length < 50) break
  }
  return all
}

/* -------------------------------------------------------------------------- */

async function main() {
  const [posts, categories] = await Promise.all([
    fetchAllPosts(),
    getJson(`${API}/categories?per_page=100&_fields=id,name,slug`),
  ])

  const catName = new Map(categories.map((c) => [c.id, decodeEntities(c.name)]))

  const entries = posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, MAX_POSTS)
    .map((post) => {
      const title = decodeEntities(stripTags(post.title?.rendered ?? ''))
      const { html, toc } = cleanContent(post.content?.rendered ?? '')

      let excerpt = stripTags(post.excerpt?.rendered ?? '')
        .replace(/\[(?:…|\.\.\.|&hellip;)\]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      if (excerpt.length > 160) {
        const cut = excerpt.slice(0, 159)
        const stop = cut.lastIndexOf(' ')
        excerpt = `${(stop > 100 ? cut.slice(0, stop) : cut).replace(/[\s,;:.]+$/, '')}…`
      }

      const words = stripTags(html).split(/\s+/).filter(Boolean).length
      const readingMinutes = Math.max(2, Math.round(words / 220))

      const yoast = post.yoast_head_json ?? {}

      return {
        id: post.id,
        slug: post.slug,
        title,
        excerpt,
        date: post.date,
        dateLabel: frenchDate(post.date),
        readingMinutes,
        categories: (post.categories ?? [])
          .map((id) => catName.get(id))
          .filter((name) => name && name !== 'Uncategorized'),
        seoTitle: decodeEntities(yoast.title || title),
        seoDescription: decodeEntities(yoast.description || excerpt),
        toc,
        contentHtml: html,
      }
    })

  // Budget de poids : on retire les plus anciens tant que le JSON depasse
  // MAX_BYTES, sans jamais descendre sous MIN_POSTS articles.
  const kept = entries.slice()
  const weight = () => Buffer.byteLength(JSON.stringify(kept))
  const dropped = []
  while (kept.length > MIN_POSTS && weight() > MAX_BYTES) {
    dropped.push(kept.pop())
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, `${JSON.stringify(kept, null, 0)}\n`, 'utf8')

  console.log(
    `blog.json : ${kept.length} articles ecrits (${(weight() / 1000).toFixed(0)} ko) -> ${OUT_FILE}`,
  )
  if (dropped.length > 0) {
    console.log(
      `  ${dropped.length} article(s) plus anciens ecartes (budget ${(MAX_BYTES / 1000).toFixed(0)} ko) : ${dropped
        .map((p) => p.slug)
        .join(', ')}`,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
