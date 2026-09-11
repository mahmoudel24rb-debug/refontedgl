/**
 * Fiches de l'archive des prototypes.
 *
 * Metadonnees pures (aucun composant) : ce module est lisible aussi bien
 * par les pages serveur de /composant que par le registre client, qui y
 * associe les demos chargees a la demande.
 *
 * Pour ajouter un prototype :
 *   1. creer src/composant/<slug>/Demo.tsx avec un export `default`
 *   2. ajouter une fiche ci-dessous
 *   3. ajouter l'import dynamique dans registry.ts
 */

export type ComposantStatus = 'wip' | 'ready' | 'validated' | 'rejected'

export interface ComposantEntry {
  slug: string
  name: string
  status: ComposantStatus
  notes?: string
}

export const COMPOSANT_ENTRIES: ComposantEntry[] = [
  {
    slug: 'site-v2',
    name: 'Site v2 : racine du 2026-07-03 au 2026-09-08 (snapshot figé)',
    status: 'validated',
    notes:
      "Snapshot figé de la page d'accueil (hero glowy waves + composants modernisés) remplacée le 2026-09-08 par le template Productized Agency adapté à DGL.",
  },
  {
    slug: 'refonte-racine',
    name: 'Refonte racine : hero glowy waves + sections v2',
    status: 'ready',
    notes:
      "Proposition alternative de page d'accueil (brièvement promue puis retirée le 2026-07-03, Mahmoud préfère garder la composition d'origine). Hero glowy waves + sections refonte partagées (components/refonte/) : manifesto scroll-reveal, bandeau typo géant, 6 services balayage coral, méthode, réalisations chiffrées, témoignages autorotate, outils gratuits (halo curseur), FAQ (JSON-LD), CTA magnétique + footer wordmark géant.",
  },
  {
    slug: 'site-v1',
    name: 'Site v1 : snapshot figé (avant modernisation)',
    status: 'validated',
    notes:
      "Snapshot figé de la page d'accueil telle qu'elle était avant la modernisation des composants (2026-07-03) : copies locales gelées de FintechPlatform, FinanceFeatures, Testimonials, PowerOfFinance et Footer. Le site racine utilise les versions modernisées de components/.",
  },
  {
    slug: 'refontev2',
    name: 'Refonte v2 : site agence complet (7 sections)',
    status: 'ready',
    notes:
      "v2 : hero shader (Swirl + ChromaFlow + FlutedGlass + FilmGrain) + les sections refonte partagées (components/refonte/) avec le contenu réel de dgl-agency.fr : manifesto scroll-reveal, 6 services balayage coral, réalisations chiffrées, témoignages, footer wordmark géant. Sections promues sur le site principal (avec le hero glowy waves à la place du shader).",
  },
  {
    slug: 'hero3',
    name: 'Hero3 : glowy waves canvas (réactif souris)',
    status: 'ready',
    notes:
      'Canvas 2D avec 5 couches de vagues sinusoïdales qui suivent la souris. Copy DGL, palette coral + navy. Pas de dépendance shadcn (Button inline). Bouclé sur requestAnimationFrame, prefers-reduced-motion honoré.',
  },
  {
    slug: 'hero-video',
    name: 'Hero video + marquee logos',
    status: 'ready',
    notes:
      'Hero card 1400x600 avec vidéo en fond, texte animé, navbar flottante en verre et marquee de logos avec dégradé au survol.',
  },
  {
    slug: 'hero',
    name: 'Hero DGL (typewriter + orbites équipe et clients)',
    status: 'ready',
    notes:
      "Adapté du template Marketeam aux couleurs DGL. Photos Kiara, Mahmoud et Victor sur l'orbite 2, logos clients sur les orbites 3 et 4, compteur 500+ clients au centre. Promu comme hero du site principal (components/Hero.tsx). Logos clients en local dans /assets/logos/.",
  },
  {
    slug: 'exemple',
    name: 'Composant exemple',
    status: 'ready',
    notes: 'Placeholder pour valider le workflow. À supprimer.',
  },
]

/** Libelles lisibles des statuts de prototypage. */
export const STATUS_LABEL: Record<ComposantStatus, string> = {
  wip: 'En cours',
  ready: 'À tester',
  validated: 'Validé',
  rejected: 'Rejeté',
}

/** Fiche d'un prototype par son slug (undefined si inconnu). */
export function getComposant(slug: string): ComposantEntry | undefined {
  return COMPOSANT_ENTRIES.find((entry) => entry.slug === slug)
}
