/**
 * Contenus du site racine DGL Agency (refonte 2026).
 * Source : dgl-agency.fr (home, a-propos, faq, cas clients, outils).
 * Toutes les sections lisent leurs données ici : aucun texte en dur dans
 * les composants.
 */
import {
  AUDIT_URL,
  CONTACT_URL,
  EMAIL,
  MAHMOUD_AVATAR,
  PAGESPEED_URL,
  PHONE,
  PHONE_HREF,
  ROI_URL,
  TEST_IA_URL,
} from './tokens'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string
  href: string
}

export interface CtaContent {
  label: string
  href: string
  avatar: string
}

export interface HeroContent {
  pill: { tag: string; text: string; href: string }
  title: string
  subtitle: string
  wordmark: string
}

export interface ClientLogo {
  src: string
  alt: string
}

export interface TeamMember {
  name: string
  role: string
  photo: string
  linkedin: string
}

/**
 * Repere de la carte de France de la carte « Google Ads et Meta Ads ».
 * `city` doit exister dans `data/france-map.ts` (regenerer la carte avec
 * `node scripts/gen-france-map.mjs` pour ajouter une ville).
 */
export interface AdsPin {
  city: string
  kind: 'client' | 'zone'
  /** Nom du client (repere `client`), sert d'infobulle et de texte alternatif. */
  label?: string
  /** Logo du client, repasse en navy sur la pastille blanche. */
  logo?: string
}

export interface ServicesBentoContent {
  heading: string
  main: { title: string; text: string; cta: { label: string; to: string } }
  reporting: {
    title: string
    notifications: { label: string; text: string; avatar?: string }[]
  }
  ads: { title: string; pins: AdsPin[] }
  google: {
    title: string
    query: string
    result: { name: string; url: string; breadcrumb: string[]; title: string }
  }
  rest: { title: string }
}

export type ProjectSpan = 'wide' | 'narrow' | 'half'

export interface Project {
  slug: string
  client: string
  title: string
  desc: string
  tags: string[]
  image: string
  href: string
  span: ProjectSpan
  /** Point de recadrage CSS (object-position) si le centre coupe un element cle. */
  imagePosition?: string
}

export interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  logo: string
}

export interface GrowthContent {
  heading: string
  team: { title: string; photos: TeamMember[] }
  stats: { value: string; label: string }[]
  statsText: string
  platforms: string[]
  quote: { text: string; name: string; role: string }
  tools: { name: string }[]
}

export type IconKey =
  | 'target'
  | 'chart'
  | 'chat'
  | 'report'
  | 'refresh'
  | 'handshake'
  | 'rocket'
  | 'clock'

export interface VsRow {
  icon: IconKey
  label: string
  us: string
  them: string
}

export interface VsContent {
  heading: string
  us: string
  them: string
  rows: VsRow[]
  free: {
    label: string
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
}

export interface Feature {
  icon: IconKey
  title: string
  text: string
}

export type BadgeTone = 'neutral' | 'green' | 'red'

export interface PricingPlan {
  id: string
  name: string
  badge: { label: string; tone: BadgeTone }
  title: string
  subtitle: string
  prefix: string
  price: string
  period: string
  cta: { label: string; href: string }
  review?: { avatar: string; name: string; role: string; text: string }
  features: string[]
  options: string[]
  dark: boolean
  wide: boolean
}

export interface PricingContent {
  heading: string
  /** Symbole monetaire affiche apres le prix (optionnel). */
  currency?: string
  /** Libelle introduisant la liste des options (optionnel). */
  optionsLabel?: string
  doubts: {
    text: string
    /** Amorce avant l'adresse mail, ex. « Ecrivez a ». */
    writeTo?: string
    email: string
    /** Conjonction entre le mail et le lien de contact. */
    or?: string
    contactLabel: string
    contactHref: string
  }
  note: string
  plans: PricingPlan[]
}

export interface FounderContent {
  heading: string
  name: string
  role: string
  photo: string
  linkedin: string
  paragraphs: string[]
  /** Phrase de presentation qui encadre le nom du fondateur (optionnelle). */
  intro?: { greeting: string; after: string }
}

export interface FaqItem {
  q: string
  a: string
}

export interface FaqCtaContent {
  title: string
  text: string
  doubts: string
}

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterContent {
  cta: { title: string; href: string }
  wordmark: string
  tagline: string
  columns: FooterColumn[]
  legal: string
  phone: string
  phoneHref: string
  email: string
  socials: { name: string; href: string }[]
}

export interface ToolCard {
  name: string
  badge?: string
  desc: string
  features?: string[]
  href: string
  image?: string
  /** true quand l'outil vit dans l'application : lien interne, meme onglet. */
  internal?: boolean
}

export interface ToolsPageContent {
  pill: { tag: string; text: string }
  title: string
  form: {
    fields: string[]
    href: string
    hint: string
    /** Pastille affichee sous les champs (optionnelle). */
    chip?: string
    /** Intitule accessible du bouton d'envoi (optionnel). */
    submitLabel?: string
  }
  eyebrow: string
  ai: string[]
  heading: string
  featured: ToolCard[]
  grid: ToolCard[]
}

export type SiteRoute =
  | '/'
  | '/realisations'
  | '/outils'
  | '/tarifs'
  | '/blog'
  | '/outils/test-pagespeed'
  | '/outils/simulateur-roi'
  | '/outils/test-visibilite-ia'

export interface PageMeta {
  title: string
  description: string
}

/* -------------------------------------------------------------------------- */
/* Navigation et CTA                                                          */
/* -------------------------------------------------------------------------- */

export const NAV: NavItem[] = [
  { label: 'Réalisations', href: '/realisations' },
  { label: 'Outils', href: '/outils' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Blog', href: '/blog' },
]

export const CTA: CtaContent = {
  label: 'Audit gratuit',
  href: AUDIT_URL,
  avatar: MAHMOUD_AVATAR,
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const HERO: HeroContent = {
  pill: {
    tag: 'Nouveau',
    text: 'Test de visibilité IA gratuit',
    href: TEST_IA_URL,
  },
  title: "L'agence digitale à Tours qui transforme votre visibilité en clients.",
  subtitle:
    'SEO, Google Ads, Meta Ads et automatisation marketing pour les TPE et PME. Pas de vanity metrics. Des leads.',
  wordmark: 'DGL Agency',
}

/* -------------------------------------------------------------------------- */
/* Logos clients                                                              */
/* -------------------------------------------------------------------------- */

export const CLIENT_LOGOS: ClientLogo[] = [
  { src: '/assets/logos/oceades.webp', alt: 'Les Océades' },
  { src: '/assets/logos/gymfit.webp', alt: 'GYMFIT' },
  { src: '/assets/logos/beauregard.webp', alt: 'Parc de Beauregard' },
  { src: '/assets/logos/epicure.webp', alt: 'Epicure Social Club' },
  { src: '/assets/logos/ipms.webp', alt: 'IPMS' },
]

export const LOGO_CLOUD_EYEBROW = 'Ils nous font confiance'

/* -------------------------------------------------------------------------- */
/* Équipe                                                                     */
/* -------------------------------------------------------------------------- */

export const TEAM: TeamMember[] = [
  {
    name: 'Kiara Cescutti',
    role: 'Spécialiste Google Ads',
    photo: '/composant-hero/team/Image-Equipe-Kiara.webp',
    linkedin: 'https://www.linkedin.com/in/kiara-cescutti-3a8bb120b/',
  },
  {
    name: 'Victor Lucien-Brun',
    role: "Responsable d'agence",
    photo: '/composant-hero/team/Image-Equipe-Victor.webp',
    linkedin: 'https://www.linkedin.com/in/victor-lucien-brun-2a869719b/',
  },
  {
    name: 'Mahmoud El Rabbani',
    role: 'Spécialiste Meta Ads',
    photo: MAHMOUD_AVATAR,
    linkedin: 'https://www.linkedin.com/in/mahmoud-el-rabbani-53a629206/',
  },
]

/* -------------------------------------------------------------------------- */
/* Bento services                                                             */
/* -------------------------------------------------------------------------- */

export const SERVICES_BENTO: ServicesBentoContent = {
  heading: 'Remplacez votre équipe marketing',
  main: {
    title: 'Publicité digitale',
    text: 'Campagnes Google Ads, Meta Ads et remarketing orientées conversion : pas des impressions, des clients.',
    cta: { label: 'Voir les tarifs', to: '/tarifs' },
  },
  reporting: {
    title: 'Reporting en temps réel',
    notifications: [
      { label: 'notification', text: 'Nouveau lead qualifié' },
      { label: 'notification', text: 'Campagne optimisée' },
      {
        label: 'notification',
        text: 'Reporting mensuel envoyé',
        avatar: MAHMOUD_AVATAR,
      },
    ],
  },
  ads: {
    title: 'Google Ads et Meta Ads, pilotés chaque semaine',
    /* Repères de la carte de France : clients (pastille + logo) puis zones
       où des campagnes tournent. Les villes viennent de data/france-map.ts. */
    pins: [
      {
        city: 'Tours',
        kind: 'client',
        label: 'Epicure Social Club',
        logo: '/assets/logos/epicure.webp',
      },
      {
        city: 'Tours',
        kind: 'client',
        label: 'Parc de Beauregard',
        logo: '/assets/logos/beauregard.webp',
      },
      {
        city: 'Le Mans',
        kind: 'client',
        label: 'Les Océades',
        logo: '/assets/logos/oceades.webp',
      },
      {
        city: 'Strasbourg',
        kind: 'client',
        label: 'GYMFIT',
        logo: '/assets/logos/gymfit.webp',
      },
      {
        city: 'Paris',
        kind: 'client',
        label: 'GYMFIT La Garenne-Colombes',
        logo: '/assets/logos/gymfit.webp',
      },
      { city: 'Orléans', kind: 'zone' },
      { city: 'Bourges', kind: 'zone' },
      { city: 'Chartres', kind: 'zone' },
      { city: 'Châteauroux', kind: 'zone' },
      { city: 'Angers', kind: 'zone' },
      { city: 'Nantes', kind: 'zone' },
      { city: 'Lyon', kind: 'zone' },
      { city: 'Bordeaux', kind: 'zone' },
    ],
  },
  google: {
    title: 'Être trouvé sur Google',
    query: 'agence seo tours',
    result: {
      name: 'DGL Agency',
      url: 'dgl-agency.fr',
      breadcrumb: ['nos-services', 'seo'],
      title: 'Référencement naturel à Tours',
    },
  },
  rest: {
    title: 'Landing pages, automatisation et tout le reste',
  },
}

/* -------------------------------------------------------------------------- */
/* Réalisations                                                               */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    slug: 'gymfit-site',
    client: 'GYMFIT',
    title: 'Refonte du site en 8 semaines',
    desc: 'Site premium, SEO local et machine à leads pour une chaîne de salles de sport de 3 000 membres.',
    tags: ['Création de site', 'SEO local', 'Meta Ads'],
    image: '/assets/projets/gymfit-site.webp',
    imagePosition: 'center 15%',
    href: '/realisations/gymfit-site',
    span: 'wide',
  },
  {
    slug: 'gymfit-meta-ads',
    client: 'GYMFIT',
    title: '4,2x de ROAS',
    desc: 'Campagnes Facebook et Instagram dans un rayon de 15 km, 0,78 € par prospect, +181 % de trafic organique en 3 mois.',
    tags: ['Meta Ads', 'Acquisition locale', 'Remarketing'],
    image: '/assets/projets/gymfit-meta-ads.webp',
    href: '/realisations/gymfit-meta-ads',
    span: 'narrow',
  },
  {
    slug: 'oceades-noel',
    client: 'Les Océades',
    title: '+40 % de ventes e-commerce à Noël',
    desc: "Campagne Meta Ads de fin d'année : 58 prospects à 3,25 € et 173 prospects à 3,06 € sur les offres bilan peau et Pilates Reformer.",
    tags: ['Meta Ads', 'E-commerce', 'Offre saisonnière'],
    image: '/assets/projets/oceades-noel.webp',
    href: '/realisations/oceades-noel',
    span: 'half',
  },
  {
    slug: 'oceades-seo',
    client: 'Les Océades',
    title: '+182 % de trafic organique',
    desc: '352 mots-clés positionnés, 80 % en top 10, coût par formulaire divisé par 2,6 au Mans (25,34 € puis 9,70 €).',
    tags: ['SEO', 'Google Ads', 'Génération de leads'],
    image: '/assets/projets/oceades-seo.webp',
    href: '/realisations/oceades-seo',
    span: 'half',
  },
  {
    slug: 'beauregard-kid-fitness',
    client: 'Parc de Beauregard',
    title: '1,23 € par prospect',
    desc: '182 prospects à 4,13 € pour les stages de février, 46 prospects à 1,23 € pour la journée portes ouvertes, avec 20 € par jour.',
    tags: ['Meta Ads', 'Petit budget', 'Événementiel'],
    image: '/assets/projets/beauregard-kid-fitness.webp',
    href: '/realisations/beauregard-kid-fitness',
    span: 'narrow',
  },
  {
    slug: 'epicure-pilates',
    client: 'Epicure Social Club',
    title: '56 prospects à 4 € en 4 semaines',
    desc: "Lancement de l'offre Pilates Reformer : deux audiences testées, formulaire natif Facebook, ROAS x5,8, +60 % de leads.",
    tags: ['Meta Ads', 'Lancement offre', 'Formulaire natif'],
    image: '/assets/projets/epicure-pilates.webp',
    href: '/realisations/epicure-pilates',
    span: 'wide',
  },
]

/* -------------------------------------------------------------------------- */
/* Témoignages                                                                */
/* -------------------------------------------------------------------------- */

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Hakim',
    role: 'Directeur',
    company: 'GYMFIT',
    quote:
      'Grâce à DGL AGENCY, nos campagnes Google Ads et Meta Ads ont boosté les adhésions de notre salle. Le suivi est précis, les optimisations constantes, et les résultats clairement mesurables.',
    avatar: '/assets/avatars/hakim.webp',
    logo: '/assets/logos/gymfit.webp',
  },
  {
    name: 'Samuel',
    role: 'Directeur',
    company: 'Les Océades',
    quote:
      "L'expertise SEO et SEA de l'agence a renforcé notre positionnement haut de gamme. Notre acquisition client est bien plus stable et performante depuis leur accompagnement.",
    avatar: '/assets/avatars/samuel.webp',
    logo: '/assets/logos/oceades.webp',
  },
  {
    name: 'Marion',
    role: 'Manageuse',
    company: 'Epicure Social Club',
    quote:
      "L'équipe a parfaitement ciblé notre audience locale. Les campagnes social ads ont nettement augmenté notre visibilité dans la région, avec des leads qualifiés à coût réduit.",
    avatar: '/assets/avatars/marion.webp',
    logo: '/assets/logos/epicure.webp',
  },
]

/** Titre du carrousel de temoignages sur fond navy (home et tarifs). */
export const TESTIMONIALS_DARK_HEADING = 'Des résultats qui parlent'

/* -------------------------------------------------------------------------- */
/* Bento croissance                                                           */
/* -------------------------------------------------------------------------- */

export const GROWTH: GrowthContent = {
  heading: 'Des PME qui grandissent',
  team: {
    title: "Rencontrez l'équipe",
    photos: TEAM,
  },
  stats: [
    { value: '+300', label: 'campagnes lancées' },
    { value: '98 %', label: 'de satisfaction client' },
  ],
  statsText:
    "250 K€ et plus de revenus générés pour nos clients, avec plus de 10 ans d'expérience en acquisition.",
  platforms: [
    'Google Ads',
    'Meta Ads',
    'TikTok Ads',
    'LinkedIn Ads',
    'WordPress',
    'Make',
    'Looker Studio',
    'SE Ranking',
  ],
  quote: {
    text: "En 1 mois, on a signé 39 nouveaux clients, et je n'ai pas eu à sortir 1 € de ma poche.",
    name: 'Hakim',
    role: 'Gérant, GYMFIT',
  },
  tools: [
    { name: 'Google Ads' },
    { name: 'Meta' },
    { name: 'Looker Studio' },
    { name: 'Make' },
    { name: 'WordPress' },
    { name: 'SE Ranking' },
  ],
}

/* -------------------------------------------------------------------------- */
/* Comparatif                                                                 */
/* -------------------------------------------------------------------------- */

export const VS: VsContent = {
  heading: 'DGL Agency vs agence classique',
  us: 'DGL Agency',
  them: 'Agence classique',
  rows: [
    {
      icon: 'target',
      label: 'Stratégie',
      us: 'Sur mesure, alignée sur vos objectifs business',
      them: 'Générique, identique pour tous',
    },
    {
      icon: 'chart',
      label: 'Indicateurs',
      us: 'Leads, conversions et ROI',
      them: 'Chiffres flatteurs sans impact réel',
    },
    {
      icon: 'chat',
      label: 'Communication',
      us: 'Transparente, accompagnement dédié',
      them: 'On ne vous tient pas vraiment informé',
    },
    {
      icon: 'report',
      label: 'Reporting',
      us: 'Tableaux de bord personnalisés en temps réel',
      them: 'Copier-coller de données sans analyse',
    },
    {
      icon: 'refresh',
      label: 'Optimisation',
      us: 'Continue, avec suivi long terme',
      them: 'Aucune après le lancement',
    },
    {
      icon: 'handshake',
      label: 'Engagement',
      us: 'Packs mensuels sans engagement',
      them: 'Contrats de 12 à 24 mois',
    },
    {
      icon: 'rocket',
      label: 'Démarrage',
      us: 'Proposition concrète sous 48 h',
      them: 'Des semaines de cadrage',
    },
  ],
  free: {
    label: 'Toujours gratuit',
    primary: { label: 'Réserver un audit gratuit', href: AUDIT_URL },
    secondary: { label: 'Nous contacter', href: CONTACT_URL },
  },
}

/* -------------------------------------------------------------------------- */
/* Engagements                                                                */
/* -------------------------------------------------------------------------- */

export const FEATURES: Feature[] = [
  {
    icon: 'clock',
    title: 'Proposition sous 48 h',
    text: 'Audit ou session stratégique gratuite, puis une proposition concrète sous 48 h. Pas des semaines de cadrage.',
  },
  {
    icon: 'chart',
    title: 'Zéro vanity metric',
    text: "On ne vous parle pas d'impressions ou de portée. On vous parle de leads générés, de coût par acquisition et de clients signés.",
  },
  {
    icon: 'handshake',
    title: 'Partenaires, pas prestataires',
    text: 'Appels stratégiques réguliers, conseils proactifs, optimisations continues. Votre croissance est notre meilleure carte de visite.',
  },
]

/* -------------------------------------------------------------------------- */
/* Tarifs                                                                     */
/* -------------------------------------------------------------------------- */

export const PRICING: PricingContent = {
  heading: 'Des tarifs transparents',
  currency: '€',
  optionsLabel: 'Options :',
  doubts: {
    text: 'Une question ?',
    writeTo: 'Écrivez à',
    email: EMAIL,
    or: 'ou',
    contactLabel: 'nous contacter',
    contactHref: CONTACT_URL,
  },
  note: 'Tous nos packs sont sans engagement. Tarifs sur mesure disponibles sur devis.',
  plans: [
    {
      id: 'essentiel',
      name: 'Pack Essentiel',
      badge: { label: 'Disponible', tone: 'neutral' },
      title: 'Lancer votre acquisition',
      subtitle: 'sur une plateforme',
      prefix: 'dès',
      price: '299',
      period: '/mois',
      cta: { label: 'Démarrer maintenant', href: AUDIT_URL },
      review: {
        avatar: '/assets/avatars/hakim.webp',
        name: 'Hakim',
        role: 'Directeur, GYMFIT',
        text: 'Des résultats clairement mesurables.',
      },
      features: [
        '1 plateforme (Google ou Meta)',
        '1 campagne active',
        'Reporting en temps réel',
        'Suivi hebdomadaire des campagnes',
      ],
      options: [
        'Pack visuels dès 49 €/mois',
        'Automation basique dès 99 €',
        '4 articles SEO par mois 99 €',
      ],
      dark: false,
      wide: false,
    },
    {
      id: 'croissance',
      name: 'Pack Croissance',
      badge: { label: 'Populaire', tone: 'green' },
      title: 'Accélérer sur Google et Meta',
      subtitle: 'acquisition et remarketing',
      prefix: 'dès',
      price: '599',
      period: '/mois',
      cta: { label: 'Démarrer maintenant', href: AUDIT_URL },
      review: {
        avatar: '/assets/avatars/samuel.webp',
        name: 'Samuel',
        role: 'Directeur, Les Océades',
        text: 'Une acquisition client bien plus stable.',
      },
      features: [
        '2 plateformes (Google et Meta)',
        "Jusqu'à 3 campagnes (acquisition et remarketing)",
        'Reporting en temps réel',
        'Optimisation continue',
      ],
      options: [
        'Pack visuels dès 149 €/mois',
        'Automation intermédiaire dès 299 €',
        '3 articles SEO par semaine 299 €',
      ],
      dark: true,
      wide: false,
    },
    {
      id: 'performance',
      name: 'Pack Performance',
      badge: { label: '2 places ce mois', tone: 'red' },
      title: 'Piloter toute votre acquisition',
      subtitle: 'multi-plateformes',
      prefix: 'dès',
      price: '799',
      period: '/mois',
      cta: { label: 'Démarrer maintenant', href: AUDIT_URL },
      features: [
        'Multi-plateformes (Google, Meta, TikTok)',
        '4 campagnes et plus (acquisition, remarketing, rétention)',
        'Pack visuels inclus',
        'Reporting temps réel et suivi stratégique',
      ],
      options: [
        'Automation avancée dès 299 €',
        '3 articles SEO par semaine avec reporting 299 €',
      ],
      dark: false,
      wide: true,
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Fondateur                                                                  */
/* -------------------------------------------------------------------------- */

export const FOUNDER: FounderContent = {
  heading: 'Le bureau du fondateur',
  name: 'Victor Lucien-Brun',
  role: "Fondateur et responsable d'agence",
  photo: '/assets/avatars/victor.webp',
  linkedin: 'https://www.linkedin.com/in/victor-lucien-brun-2a869719b/',
  paragraphs: [
    "DGL Agency est née d'un constat simple : trop de TPE et PME paient pour de la visibilité sans jamais voir de clients en retour. On a décidé de faire les choses différemment.",
    "Le problème n'est pas le manque de budget ou d'outils. C'est l'absence de système : pas de tracking, pas de funnel, pas de suivi des leads. Des rapports remplis de vanity metrics, mais aucun client signé.",
    "Notre conviction : chaque euro investi doit être traçable jusqu'au client final.",
  ],
  intro: {
    greeting: 'Bonjour, je suis',
    after: ', fondateur de DGL Agency.',
  },
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/** Titre H2 de la section FAQ. */
export const FAQ_HEADING = 'Questions fréquentes'

export const FAQ: FaqItem[] = [
  {
    q: 'En quoi votre approche marketing se démarque-t-elle ?',
    a: 'Nous créons des stratégies 100 % personnalisées, basées sur vos objectifs et votre marché. Nos campagnes combinent publicité digitale, automatisation et analyse de données pour garantir des résultats mesurables.',
  },
  {
    q: 'Pourquoi vos stratégies de génération de leads sont-elles efficaces ?',
    a: "Elles s'appuient sur un ciblage précis, des funnels optimisés et des automatisations qui convertissent chaque prospect. L'IA et la data améliorent la qualité et le volume des leads.",
  },
  {
    q: "Comment mesurez-vous la performance d'une campagne ?",
    a: "Nous suivons les KPI essentiels : conversions, coût d'acquisition, ROI, engagement. Vous accédez à un reporting clair et mis à jour en temps réel.",
  },
  {
    q: 'Comment démarrer avec DGL AGENCY ?',
    a: 'Il suffit de nous contacter. Nous réalisons une session stratégique pour définir vos besoins et vous envoyons une proposition personnalisée sous 48h.',
  },
  {
    q: 'Quelles plateformes utilisez-vous pour vos campagnes ?',
    a: 'Google Ads, Meta Ads (Facebook et Instagram), LinkedIn Ads et TikTok Ads, chacune optimisée selon votre audience et vos objectifs.',
  },
  {
    q: "Vos stratégies s'adaptent-elles à chaque secteur ?",
    a: 'Oui. Quelle que soit votre activité (B2B, e-commerce, fitness), nos campagnes sont conçues sur mesure pour atteindre des résultats concrets.',
  },
  {
    q: 'Pouvez-vous gérer entièrement mes campagnes publicitaires ?',
    a: "Oui. Nous prenons en charge la création, le suivi, l'optimisation et le reporting afin de maximiser vos résultats tout en vous faisant gagner du temps.",
  },
  {
    q: 'Quel budget minimum recommandez-vous pour démarrer ?',
    a: "Un budget publicitaire de départ entre 500 € et 1 500 € est idéal selon votre marché. Nous l'adaptons ensuite en fonction des performances et de vos objectifs.",
  },
  {
    q: 'En combien de temps peut-on voir les premiers résultats ?',
    a: 'Les premières données arrivent dès les premiers jours. Les résultats significatifs apparaissent généralement entre 2 et 6 semaines selon votre audience et vos objectifs.',
  },
]

export const FAQ_CTA: FaqCtaContent = {
  title: "Besoin d'une équipe qui pilote votre acquisition ?",
  text: 'Audit SEO et Ads gratuit, proposition personnalisée sous 48 h.',
  doubts: "D'autres questions ? Écrivez-nous à",
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export const FOOTER: FooterContent = {
  cta: {
    title: 'Faites de votre site une machine à clients',
    href: AUDIT_URL,
  },
  wordmark: 'DGL Agency',
  tagline:
    'Agence digitale à Tours. SEO, Ads et automatisation pour les PME qui veulent des résultats mesurables.',
  columns: [
    {
      title: 'Services',
      links: [
        {
          label: 'Publicité digitale',
          href: 'https://dgl-agency.fr/nos-services/publicite-digitale/',
          external: true,
        },
        {
          label: 'Référencement naturel',
          href: 'https://dgl-agency.fr/nos-services/referencement-naturel-seo/',
          external: true,
        },
        {
          label: 'Génération de leads',
          href: 'https://dgl-agency.fr/nos-services/generation-de-leads/',
          external: true,
        },
        {
          label: 'Landing pages',
          href: 'https://dgl-agency.fr/nos-services/landing-pages/',
          external: true,
        },
        {
          label: 'Automatisation marketing',
          href: 'https://dgl-agency.fr/nos-services/automatisation-marketing/',
          external: true,
        },
        {
          label: 'Stratégie digitale',
          href: 'https://dgl-agency.fr/nos-services/strategie-digitale/',
          external: true,
        },
      ],
    },
    {
      title: 'Agence',
      links: [
        {
          label: 'À propos',
          href: 'https://dgl-agency.fr/a-propos/',
          external: true,
        },
        { label: 'Réalisations', href: '/realisations' },
        { label: 'Blog', href: '/blog' },
        {
          label: 'Carrières',
          href: 'https://dgl-agency.fr/carrieres/',
          external: true,
        },
        { label: 'Contact', href: CONTACT_URL, external: true },
        { label: 'FAQ', href: 'https://dgl-agency.fr/faq/', external: true },
      ],
    },
    {
      title: 'Outils gratuits',
      links: [
        { label: 'Simulateur de ROI', href: ROI_URL },
        { label: 'Test PageSpeed', href: PAGESPEED_URL },
        {
          label: 'Générateur de stratégie IA',
          href: 'https://dgl-agency.fr/generateur-strategie-marketing/',
          external: true,
        },
        {
          label: 'Cahier des charges IA',
          href: 'https://dgl-agency.fr/cahier-de-charges/',
          external: true,
        },
        { label: 'Test de visibilité IA', href: TEST_IA_URL },
        {
          label: 'Machine à leads',
          href: 'https://dgl-agency.fr/machine-a-leads-automatisee/',
          external: true,
        },
      ],
    },
    {
      title: 'Légal',
      links: [
        {
          label: 'Mentions légales',
          href: 'https://dgl-agency.fr/mentions-legales/',
          external: true,
        },
        {
          label: 'CGV',
          href: 'https://dgl-agency.fr/conditions-generales-de-vente/',
          external: true,
        },
      ],
    },
  ],
  legal: '© 2026 DGL Agency, Tours',
  phone: PHONE,
  phoneHref: PHONE_HREF,
  email: EMAIL,
  socials: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/victor-lucien-brun-2a869719b/',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* Page outils                                                                */
/* -------------------------------------------------------------------------- */

export const TOOLS_PAGE: ToolsPageContent = {
  pill: { tag: 'Nouveau', text: 'Résultat en 2 minutes' },
  title: 'Le Test de Visibilité IA est en ligne',
  form: {
    fields: [
      'Nom de votre entreprise',
      'Votre métier (ex : plombier)',
      'Votre ville (ex : Tours)',
    ],
    href: TEST_IA_URL,
    hint: 'Les IA recommandent-elles votre entreprise ?',
    chip: 'IA avec recherche web',
    submitLabel: 'Lancer le test de visibilité IA',
  },
  eyebrow: 'Les IA que nous suivons',
  ai: ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Google AI'],
  heading: "Des outils gratuits pour décider avant d'investir",
  featured: [
    {
      name: 'Simulateur de ROI',
      badge: 'Gratuit',
      desc: 'Estimez le retour sur investissement de vos campagnes avant de dépenser un euro.',
      features: [
        'Budget et coût par lead',
        'Taux de conversion réel',
        "Chiffre d'affaires projeté",
        'Résultat immédiat',
      ],
      href: ROI_URL,
      internal: true,
      image: '/assets/agence/resultats.webp',
    },
    {
      name: 'Test PageSpeed',
      badge: 'Gratuit',
      desc: 'Mesurez la vitesse réelle de votre site et son impact sur vos conversions.',
      features: [
        'Score mobile et ordinateur',
        'Core Web Vitals',
        'Rapport détaillé',
        'Recommandations concrètes',
      ],
      href: PAGESPEED_URL,
      internal: true,
      image: '/assets/agence/rdv-client.webp',
    },
  ],
  grid: [
    {
      name: 'Générateur de stratégie IA',
      desc: 'Un plan marketing 90 jours personnalisé selon votre secteur, vos objectifs et votre budget.',
      href: 'https://dgl-agency.fr/generateur-strategie-marketing/',
    },
    {
      name: 'Cahier des charges IA',
      desc: 'Générez le cahier des charges de votre projet web en quelques minutes.',
      href: 'https://dgl-agency.fr/cahier-de-charges/',
    },
    {
      name: 'Audit landing page',
      desc: 'Analysez votre page de destination et identifiez ce qui freine vos conversions.',
      href: 'https://dgl-agency.fr/audit-landing-page/',
    },
    {
      name: 'Machine à leads automatisée',
      desc: 'Le système complet pour générer, qualifier et convertir vos prospects automatiquement.',
      href: 'https://dgl-agency.fr/machine-a-leads-automatisee/',
    },
  ],
}

/** Appel a l'action des petites cartes outils. */
export const TOOLS_GRID_CTA = 'Essayer gratuitement'

/* -------------------------------------------------------------------------- */
/* Meta des pages                                                             */
/* -------------------------------------------------------------------------- */

export const SITE_META: Record<SiteRoute, PageMeta> = {
  '/': {
    title: 'DGL Agency | Agence SEO & Ads à Tours, acquisition et ROI',
    description:
      'Agence digitale à Tours : SEO, Google Ads, Meta Ads et automatisation. Des leads mesurables pour les TPE et PME. Audit gratuit sous 48 h.',
  },
  '/realisations': {
    title: 'Réalisations | Résultats clients de DGL Agency à Tours',
    description:
      'Cas clients DGL Agency : ROAS x4, leads à moins de 5 €, trafic SEO multiplié. Les chiffres réels de nos campagnes Google Ads et Meta Ads.',
  },
  '/outils': {
    title: 'Outils gratuits | ROI, PageSpeed et visibilité IA, DGL Agency',
    description:
      "Simulateur de ROI, test PageSpeed, générateur de stratégie IA et test de visibilité IA : des outils gratuits pour décider avant d'investir.",
  },
  '/tarifs': {
    title: 'Tarifs | Packs acquisition dès 299 € par mois, DGL Agency',
    description:
      'Packs Essentiel, Croissance et Performance : Google Ads, Meta Ads, reporting temps réel, sans engagement. Tarifs transparents dès 299 €.',
  },
  '/blog': {
    title: 'Blog | SEO, Ads et automatisation marketing, DGL Agency',
    description:
      'Conseils concrets en SEO, Google Ads, Meta Ads et automatisation marketing pour les TPE et PME qui veulent des résultats mesurables.',
  },
  '/outils/test-pagespeed': {
    title: 'Test PageSpeed gratuit | Vitesse et Core Web Vitals, DGL Agency',
    description:
      "Mesurez la vitesse réelle de votre site sur mobile et ordinateur : score PageSpeed, Core Web Vitals et plan d'action détaillé, gratuitement.",
  },
  '/outils/simulateur-roi': {
    title: 'Simulateur de ROI publicitaire gratuit | Google et Meta Ads',
    description:
      "Estimez leads, clients et chiffre d'affaires générés par votre budget Google Ads ou Meta Ads, secteur par secteur, avant de dépenser un euro.",
  },
  '/outils/test-visibilite-ia': {
    title: 'Test de visibilité IA gratuit | ChatGPT, Gemini, Perplexity',
    description:
      'Découvrez si les intelligences artificielles recommandent votre entreprise à vos futurs clients, et comment passer devant vos concurrents.',
  },
}

/* -------------------------------------------------------------------------- */
/* Libellés des sections de la page d'accueil                                 */
/* -------------------------------------------------------------------------- */

export interface DashboardKpi {
  label: string
  value: string
}

/** Tableau de bord factice du mockup navigateur (bento services). */
export const CAMPAIGN_DASHBOARD: {
  badge: string
  kpis: DashboardKpi[]
} = {
  badge: 'En cours',
  kpis: [
    { label: 'Leads', value: '128' },
    { label: 'CPL', value: '4,10 €' },
    { label: 'ROAS', value: 'x4,2' },
    { label: 'Budget', value: '600 €' },
  ],
}

/** Section réalisations : titre, filigrane géant et libellés des liens. */
export const PROJECTS_SECTION: {
  heading: string
  watermark: string
  cta: string
  all: string
} = {
  heading: 'Nos réalisations',
  watermark: 'Réalisations',
  cta: 'Voir le projet',
  all: 'Voir toutes les réalisations',
}

/** Titre du carrousel de témoignages clairs. */
export const TESTIMONIALS_HEADING = 'Ce que disent nos clients'

/** Libellé de la carte outils du bento croissance. */
export const GROWTH_TOOLS_LABEL = 'Nos outils'
