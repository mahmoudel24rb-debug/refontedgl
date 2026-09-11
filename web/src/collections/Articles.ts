import type { CollectionConfig } from 'payload'

import { slugify, stripTags } from '@/lib/html'

import { redaction } from './access'

/**
 * Vitesse de lecture retenue pour estimer la duree d'un article.
 *
 * Meme formule que scripts/fetch-blog.mjs (220 mots par minute, plancher a
 * 2 minutes) : les articles importes gardent la duree affichee sur l'ancien
 * site et les articles rediges dans Payload suivent la meme regle.
 */
const MOTS_PAR_MINUTE = 220

/** Duree minimale affichee, en minutes. */
const MINUTES_MINIMUM = 2

/** Noeud Lexical serialise, reduit aux proprietes utiles ici. */
interface NoeudLexical {
  text?: unknown
  children?: unknown
}

/** Concatene recursivement le texte d'un arbre Lexical serialise. */
function texteLexical(noeud: unknown): string {
  if (!noeud || typeof noeud !== 'object') return ''
  const courant = noeud as NoeudLexical
  let texte = typeof courant.text === 'string' ? `${courant.text} ` : ''
  if (Array.isArray(courant.children)) {
    for (const enfant of courant.children) {
      texte += texteLexical(enfant)
    }
  }
  return texte
}

/** Compte les mots d'un texte brut. */
function compterMots(texte: string): number {
  const propre = texte.trim()
  return propre === '' ? 0 : propre.split(/\s+/).length
}

/** Articles du blog, importes de WordPress puis rediges dans Payload. */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status'],
    group: 'Contenu',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
    create: redaction,
    update: redaction,
    delete: redaction,
    readVersions: redaction,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // Slug derive du titre quand il n'est pas saisi.
        const slugPropose = typeof data.slug === 'string' ? data.slug.trim() : ''
        if (slugPropose === '') {
          const titre = typeof data.title === 'string' ? data.title : ''
          if (titre) data.slug = slugify(titre)
        } else {
          data.slug = slugify(slugPropose)
        }

        // Duree de lecture estimee a partir du contenu reellement rendu.
        const source =
          data.renderMode === 'legacy'
            ? stripTags(typeof data.legacyHtml === 'string' ? data.legacyHtml : '')
            : texteLexical(
                (data.content as { root?: unknown } | null | undefined)?.root ?? null,
              )
        const mots = compterMots(source)
        if (mots > 0) {
          data.readingMinutes = Math.max(
            MINUTES_MINIMUM,
            Math.round(mots / MOTS_PAR_MINUTE),
          )
        }

        return data
      },
    ],
    afterChange: [
      async () => {
        // Invalide le cache du blog. Encapsule : les scripts hors
        // contexte Next (import d'articles) n'ont pas d'API de cache.
        try {
          const { revalidateTag, revalidatePath } = await import('next/cache')
          revalidateTag('articles', 'max')
          revalidatePath('/blog')
        } catch (erreur) {
          // Cas normal pendant pnpm import:articles : pas de contexte Next.
          const message = erreur instanceof Error ? erreur.message : String(erreur)
          console.warn(`[articles] revalidation ignoree hors contexte Next : ${message}`)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Généré depuis le titre quand il est laissé vide.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Chapeau',
      admin: {
        description: 'Résumé affiché sur les cartes du blog.',
      },
    },
    {
      name: 'renderMode',
      type: 'select',
      label: 'Mode de rendu',
      required: true,
      defaultValue: 'lexical',
      options: [
        { label: 'Éditeur Lexical', value: 'lexical' },
        { label: 'HTML importé (legacy)', value: 'legacy' },
      ],
      admin: {
        position: 'sidebar',
        description:
          "Les articles importes de WordPress restent en legacy tant qu'ils n'ont pas ete repris dans l'editeur.",
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenu',
      admin: {
        condition: (data) => data?.renderMode !== 'legacy',
      },
    },
    {
      name: 'legacyHtml',
      type: 'textarea',
      label: 'HTML importé',
      admin: {
        condition: (data) => data?.renderMode === 'legacy',
        description: 'HTML WordPress rendu tel quel par BlogProse.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Catégories',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Date de publication',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'readingMinutes',
      type: 'number',
      label: 'Durée de lecture (minutes)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculée automatiquement à 220 mots par minute.',
      },
    },
    {
      name: 'wpId',
      type: 'number',
      label: 'Identifiant WordPress',
      index: true,
      admin: {
        position: 'sidebar',
        description: "Sert a l'import idempotent des articles.",
      },
    },
  ],
}
