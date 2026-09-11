/**
 * Import des articles WordPress dans la collection articles.
 *
 * Source : src/data/blog.json, snapshot produit par scripts/fetch-blog.mjs.
 * Le rapprochement se fait sur wpId : relancer le script met a jour les
 * articles deja presents sans jamais en creer de doublon.
 *
 * Les articles sont importes en renderMode legacy (le HTML WordPress est
 * rendu tel quel par BlogProse). La conversion Lexical est tentee en plus
 * pour que l'editeur puisse basculer un article dans l'editeur ; un echec
 * de conversion laisse simplement le champ content vide.
 *
 * Usage : pnpm import:articles
 */
import 'dotenv/config'

import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

import config from '@payload-config'

import { slugify } from '@/lib/html'
import type { Article } from '@/payload-types'

/** Entree du snapshot blog.json. */
interface ArticleSource {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  dateLabel: string
  readingMinutes: number
  categories: string[]
  seoTitle: string
  seoDescription: string
  toc: { id: string; text: string }[]
  contentHtml: string
}

/** Arbre Lexical serialise tel que la collection articles l'attend. */
type ContenuLexical = NonNullable<Article['content']>

/**
 * Constructeur DOM attendu par convertHTMLToLexical.
 *
 * Les types de jsdom 28 exposent un DOMWindow plus large que la signature
 * declaree par Payload : l'objet est compatible a l'execution, seule la
 * declaration doit etre reduite.
 */
type ConstructeurDom = new (html: string) => { window: { document: Document } }

const DomLeger = JSDOM as unknown as ConstructeurDom

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FICHIER_SOURCE = resolve(RACINE, 'src/data/blog.json')

/** Message court d'une erreur, pour un journal lisible. */
function messageErreur(erreur: unknown): string {
  return erreur instanceof Error ? erreur.message : String(erreur)
}

/**
 * Date WordPress vers date ISO absolue.
 *
 * Les dates du snapshot sont sans fuseau (« 2026-09-02T14:22:56 ») : elles
 * sont lues comme de l'UTC pour que le libelle affiche reste identique quel
 * que soit le fuseau du serveur qui execute l'import.
 */
function dateAbsolue(date: string): string {
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(date) ? date : `${date}Z`
}

async function main(): Promise<void> {
  const sources = JSON.parse(await readFile(FICHIER_SOURCE, 'utf8')) as ArticleSource[]
  console.log(`Source : ${sources.length} articles dans src/data/blog.json`)

  const payload = await getPayload({ config })

  /* ------------------------------------------------------------------ */
  /* Categories                                                          */
  /* ------------------------------------------------------------------ */

  const noms = [...new Set(sources.flatMap((source) => source.categories))].sort()
  const idParNom = new Map<string, string>()
  let categoriesCreees = 0

  for (const nom of noms) {
    const slug = slugify(nom)
    const existantes = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const trouvee = existantes.docs[0]
    if (trouvee) {
      idParNom.set(nom, trouvee.id)
      continue
    }

    const creee = await payload.create({
      collection: 'categories',
      data: { name: nom, slug },
    })
    idParNom.set(nom, creee.id)
    categoriesCreees += 1
    console.log(`  + categorie : ${nom} (${slug})`)
  }

  console.log(
    `Categories : ${categoriesCreees} creees, ${noms.length - categoriesCreees} deja presentes`,
  )

  /* ------------------------------------------------------------------ */
  /* Articles                                                            */
  /* ------------------------------------------------------------------ */

  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  let crees = 0
  let misAJour = 0
  const echecsLexical: string[] = []

  for (const source of sources) {
    // Conversion Lexical optionnelle : le rendu s'appuie sur legacyHtml.
    let contenu: ContenuLexical | null = null
    try {
      contenu = convertHTMLToLexical({
        editorConfig,
        html: source.contentHtml,
        JSDOM: DomLeger,
      }) as unknown as ContenuLexical
    } catch (erreur) {
      echecsLexical.push(source.slug)
      console.warn(`  ! Lexical ignore pour ${source.slug} : ${messageErreur(erreur)}`)
    }

    const categories = source.categories
      .map((nom) => idParNom.get(nom))
      .filter((id): id is string => typeof id === 'string')

    const donnees = {
      title: source.title,
      slug: source.slug,
      excerpt: source.excerpt,
      content: contenu,
      legacyHtml: source.contentHtml,
      renderMode: 'legacy' as const,
      categories,
      publishedAt: dateAbsolue(source.date),
      readingMinutes: source.readingMinutes,
      wpId: source.id,
      meta: {
        title: source.seoTitle,
        description: source.seoDescription,
      },
      _status: 'published' as const,
    }

    const existants = await payload.find({
      collection: 'articles',
      where: { wpId: { equals: source.id } },
      limit: 1,
    })

    const existant = existants.docs[0]
    if (existant) {
      await payload.update({ collection: 'articles', id: existant.id, data: donnees })
      misAJour += 1
      console.log(`  = ${source.slug}`)
    } else {
      await payload.create({ collection: 'articles', data: donnees })
      crees += 1
      console.log(`  + ${source.slug}`)
    }
  }

  console.log(
    `\nArticles : ${crees} crees, ${misAJour} mis a jour, ${echecsLexical.length} echecs de conversion Lexical`,
  )
  if (echecsLexical.length > 0) {
    console.log(`Conversions Lexical en echec : ${echecsLexical.join(', ')}`)
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((erreur: unknown) => {
    console.error("Echec de l'import des articles :", erreur)
    process.exit(1)
  })
