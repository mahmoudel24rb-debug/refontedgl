import type { Metadata } from 'next'
import React from 'react'

import { SITE_META, type SiteRoute } from '@/site/content'

/* -------------------------------------------------------------------------- */
/* URL de base                                                                */
/* -------------------------------------------------------------------------- */

/** URL publique du site, sans barre oblique finale. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dgl-agency.fr'
).replace(/\/+$/, '')

/** true quand le site doit rester hors des index (domaine provisoire). */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === '1'

/** Nom commercial et coordonnees, repris de l'ancien site. */
export const ORGANISATION = {
  nom: 'DGL Agency',
  telephone: '+33255994094',
  email: 'contact@dgl-agency.fr',
  ville: 'Tours',
  region: 'Centre-Val de Loire',
  pays: 'FR',
  linkedin: 'https://www.linkedin.com/company/dgl-agency',
} as const

/** Titre et description par defaut du site, repris de content.ts. */
export const DEFAULT_META = SITE_META['/']

/**
 * Carte de partage par defaut, servie par app/opengraph-image/route.tsx.
 *
 * L'URL est declaree explicitement : avec trois layouts racines, la
 * convention de fichier opengraph-image ne couvre pas tout le site.
 */
export const OG_IMAGE = {
  path: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'DGL Agency, agence SEO et Ads à Tours',
} as const

/** Transforme un chemin interne en URL absolue. */
export function absoluteUrl(route: string): string {
  if (/^https?:\/\//i.test(route)) return route
  const chemin = route.startsWith('/') ? route : `/${route}`
  return `${SITE_URL}${chemin === '/' ? '' : chemin}`
}

/* -------------------------------------------------------------------------- */
/* Metadonnees de page                                                        */
/* -------------------------------------------------------------------------- */

/** Titre et description d'une page, tels que definis dans content.ts. */
export interface PageMeta {
  title: string
  description: string
  /** Image de partage specifique (URL absolue ou chemin interne). */
  image?: string
}

/**
 * Construit les metadonnees Next d'une page : titre, description,
 * canonique absolue et bloc openGraph en fr_FR.
 *
 * Appelee avec une seule route connue de SITE_META, elle y lit le titre
 * et la description ; les pages dynamiques (cas clients, articles)
 * passent leurs propres valeurs en second argument.
 */
export function pageMetadata(route: SiteRoute): Metadata
export function pageMetadata(route: string, meta: PageMeta): Metadata
export function pageMetadata(route: string, meta?: PageMeta): Metadata {
  const donnees: PageMeta = meta ?? SITE_META[route as SiteRoute]
  const url = absoluteUrl(route)

  // Visuel de la page, sinon la carte de partage generique.
  const images = donnees.image
    ? [{ url: absoluteUrl(donnees.image) }]
    : [
        {
          url: absoluteUrl(OG_IMAGE.path),
          width: OG_IMAGE.width,
          height: OG_IMAGE.height,
          alt: OG_IMAGE.alt,
        },
      ]

  return {
    // absolute : les titres de SITE_META portent deja la marque, le
    // gabarit « %s | DGL Agency » du layout ne doit pas la redoubler.
    title: { absolute: donnees.title },
    description: donnees.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: ORGANISATION.nom,
      title: donnees.title,
      description: donnees.description,
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: donnees.title,
      description: donnees.description,
      images,
    },
  }
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

/** Donnees structurees quelconques (schema.org). */
export type JsonLdData = Record<string, unknown>

/**
 * Insere un bloc application/ld+json.
 *
 * Le caractere < est echappe pour qu'aucune donnee ne puisse fermer la
 * balise script prematurement.
 */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }): React.ReactElement {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: json },
  })
}

/** Fiche LocalBusiness de l'agence, reprise et enrichie de l'ancien site. */
export function localBusinessJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organisation`,
    name: ORGANISATION.nom,
    description:
      "Agence de marketing digital : SEO, Google Ads, Meta Ads, automatisation marketing et génération de leads.",
    url: SITE_URL,
    telephone: ORGANISATION.telephone,
    email: ORGANISATION.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ORGANISATION.ville,
      addressRegion: ORGANISATION.region,
      addressCountry: ORGANISATION.pays,
    },
    areaServed: ['Tours', 'Indre-et-Loire', 'Centre-Val de Loire', 'France'],
    knowsAbout: [
      'SEO',
      'Google Ads',
      'Meta Ads',
      'Automatisation marketing',
      'Génération de leads',
      'Landing pages',
    ],
    sameAs: [ORGANISATION.linkedin],
  }
}

/** Arguments de articleJsonLd. */
export interface ArticleJsonLdArgs {
  title: string
  description: string
  url: string
  image?: string
  publishedAt?: string
  updatedAt?: string
}

/** Fiche Article pour les pages du blog. */
export function articleJsonLd(args: ArticleJsonLdArgs): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(args.url) },
    image: args.image ? [absoluteUrl(args.image)] : undefined,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt ?? args.publishedAt,
    author: { '@type': 'Organization', name: ORGANISATION.nom, url: SITE_URL },
    publisher: { '@type': 'Organization', name: ORGANISATION.nom, url: SITE_URL },
  }
}

/** Question et reponse d'une FAQ. */
export interface FaqItem {
  question: string
  reponse: string
}

/** Fiche FAQPage a partir d'une liste de questions. */
export function faqJsonLd(items: FaqItem[]): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.reponse },
    })),
  }
}

/** Arguments de webApplicationJsonLd. */
export interface WebApplicationJsonLdArgs {
  name: string
  description: string
  url: string
  category?: string
}

/** Fiche WebApplication pour les outils gratuits. */
export function webApplicationJsonLd(args: WebApplicationJsonLdArgs): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.url),
    applicationCategory: args.category ?? 'BusinessApplication',
    operatingSystem: 'Tous',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    provider: { '@type': 'Organization', name: ORGANISATION.nom, url: SITE_URL },
  }
}
