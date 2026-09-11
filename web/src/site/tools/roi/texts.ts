import type { ToolFaqItem } from '../shared/FaqAccordion'
import type { RichSegment } from '../shared/rich-text'

import { formatCpc, formatCurrency, formatPercent } from './format'

/**
 * Tous les textes visibles du simulateur de ROI, repris mot pour mot de
 * `roi-calculator.html` et `roi-calculator.js`. Aucun texte n'est ecrit
 * dans les composants ni dans les routes.
 */

/** Liens sortants vers le glossaire WordPress, non porte a ce stade. */
const GLOSSAIRE_ROI = 'https://dgl-agency.fr/glossaire/definition-roi/'
const GLOSSAIRE_ROAS = 'https://dgl-agency.fr/glossaire/definition-roas/'

/* -------------------------------------------------------------------------- */
/* Hero et formulaire de simulation                                           */
/* -------------------------------------------------------------------------- */

export const ROI_HERO = {
  pill: { tag: 'Gratuit', text: 'Simulateur gratuit, sans inscription' },
  title: 'Simulez le Retour sur Investissement de vos Campagnes Publicitaires',
  titleHighlight: 'Google Ads et Meta Ads, secteur par secteur',
  subtitle:
    'Découvrez combien vos campagnes Google Ads et Meta Ads pourraient vous rapporter.',
  subtitleStrong: 'Estimation personnalisée en quelques clics.',
  hint: 'Renseignez vos données pour obtenir une estimation personnalisée.',
} as const

export const ROI_FORM = {
  titre: 'Configurez votre simulation',
  sousTitre: 'Renseignez vos données pour obtenir une estimation personnalisée',
  plateforme: 'Plateforme publicitaire',
  secteur: "Votre secteur d'activité",
  secteurPlaceholder: '-- Sélectionnez votre secteur --',
  budget: 'Budget publicitaire mensuel',
  budgetPlaceholder: '1000',
  budgetSuffixe: '€ / mois',
  presetsLabel: 'Budgets courants',
  ticket: "Votre ticket moyen (panier moyen ou valeur d'un client)",
  ticketPlaceholder: '150',
  ticketSuffixe: '€',
  recurrence: 'Type de vente',
  submit: 'Calculer mon ROI',
  submitRecalcul: 'Recalculer',
  sources: 'Sources : WordStream 2025, LocaliQ et données moyennes agence.',
} as const

/** Messages de validation du calculateur (calculate() du JS WordPress). */
export const ROI_ERRORS = {
  secteurManquant: "Veuillez sélectionner votre secteur d'activité.",
  budgetManquant: "Veuillez entrer un budget mensuel d'au moins 100 €.",
  ticketManquant: 'Veuillez entrer votre ticket moyen.',
  retentionManquante: 'Veuillez indiquer la durée de rétention ou la fréquence.',
  retentionMensuel: 'La durée de rétention ne peut pas dépasser 60 mois.',
  retentionAnnuel: 'Le nombre de renouvellements ne peut pas dépasser 10 ans.',
  retentionVisite: 'La fréquence ne peut pas dépasser 100 visites par an.',
  secteurInconnu: 'Secteur non reconnu.',
} as const

/* -------------------------------------------------------------------------- */
/* Resultats : double colonne et detail verrouille                            */
/* -------------------------------------------------------------------------- */

export const ROI_RESULTS = {
  tag: 'Résultat de votre simulation',
  titleBefore: 'Votre Retour sur ',
  titleHighlight: 'Investissement Estimé',
  brut: {
    tag: 'Moyennes du marché',
    roi: 'ROI estimé',
    ca: 'CA estimé',
    clients: 'Nouveaux clients',
  },
  optimise: {
    tag: 'Optimisé par DGL Agency',
    roi: 'ROI estimé',
    ca: 'CA estimé',
    clients: 'Nouveaux clients',
    note: 'Basé sur les résultats moyens de nos clients',
    cta: 'Lancer avec nous',
  },
  disclaimer:
    '* Estimation basée sur les optimisations moyennes constatées chez nos clients (réduction CPC -30%, amélioration CVR +40%, ciblage +20%). Résultats non garantis.',
} as const

export const ROI_DETAIL = {
  tag: 'Rapport détaillé',
  titleBefore: 'Détail Complet de ',
  titleHighlight: 'votre Simulation',
  desc: "Nombre de clics, coût par clic, taux de conversion, coût d'acquisition client et bien plus.",
  cards: {
    clics: 'Clics mensuels estimés',
    cpc: 'Coût par clic moyen',
    cvr: 'Taux de conversion estimé',
    ltv: 'Valeur vie client',
    leads: 'Leads / demandes générés',
    cac: "Coût d'acquisition client",
    profit: 'Bénéfice net estimé',
  },
} as const

export const ROI_UNLOCK = {
  title: 'Débloquez votre rapport complet',
  text: 'Remplissez le formulaire ci-dessous pour accéder à toutes les métriques détaillées de votre simulation.',
  submit: 'Recevoir mon rapport détaillé',
  submitLoading: 'Envoi en cours...',
  privacy: 'Vos données sont 100% sécurisées et ne seront jamais partagées.',
  success: {
    title: 'Merci !',
    text: 'Votre simulation a bien été enregistrée. Un conseiller DGL Agency vous contactera sous 24h avec votre rapport détaillé et des recommandations personnalisées.',
  },
} as const

/* -------------------------------------------------------------------------- */
/* Diagnostic de ROI negatif                                                  */
/* -------------------------------------------------------------------------- */

/** Fragment du texte d'un diagnostic : simple, ou mis en valeur. */
export type DiagSegment = string | { strong: string }

/** Pictogramme d'une carte de diagnostic (equivalent des SVG WordPress). */
export type DiagIcon =
  | 'tendance'
  | 'monnaie'
  | 'barres'
  | 'conversion'
  | 'bouclier'
  | 'ampoule'

/** Carte de diagnostic affichee sous les deux colonnes de resultats. */
export interface DiagnosticReason {
  icon: DiagIcon
  title: string
  text: DiagSegment[]
}

/** En-tete commun du bloc diagnostic. */
export const ROI_DIAGNOSTIC_CTA = {
  text: 'Un expert peut identifier les leviers pour rendre vos campagnes rentables, même dans votre secteur.',
  bouton: 'Parler à un expert gratuitement',
} as const

/** Titres et sous-titres des deux cas de diagnostic. */
export const ROI_DIAGNOSTIC_HEADINGS = {
  redressable: {
    title: 'Bonne nouvelle : vos campagnes peuvent devenir rentables',
    subtitle:
      "Sans optimisation, le ROI est négatif. Mais avec un accompagnement professionnel, vos campagnes deviennent rentables.",
  },
  negatif: {
    title: 'Pourquoi votre ROI est négatif',
    subtitle:
      "Votre configuration actuelle rend la publicité difficile à rentabiliser, même avec optimisation. Voici pourquoi et les alternatives.",
  },
} as const

/**
 * Fabriques des cartes de diagnostic.
 *
 * Chaque fonction reproduit une des branches conditionnelles de
 * `showDiagnostic()` : memes conditions, memes titres, memes phrases,
 * les portions en gras du HTML WordPress devenant des fragments strong.
 */
export const ROI_DIAGNOSTIC_REASONS = {
  /** Cas « brut negatif, optimise positif ». */
  leviers(roiBrut: number, roiOptimise: number): DiagnosticReason {
    return {
      icon: 'tendance',
      title: "Les leviers d'amélioration existent",
      text: [
        'En réduisant le coût par clic (-30%), en améliorant le taux de conversion (+40%) et le ciblage (+20%), votre ROI passe de ',
        { strong: `${roiBrut}%` },
        ' à ',
        { strong: `+${roiOptimise}%` },
        ". C'est exactement ce qu'un gestionnaire de campagnes professionnel peut faire.",
      ],
    }
  },

  /** Valeur client inferieure au cout d'acquisition. */
  valeurClient(unique: boolean, valeur: number, cac: number): DiagnosticReason {
    return {
      icon: 'monnaie',
      title: unique ? 'Panier moyen trop bas' : 'Valeur vie client trop basse',
      text: [
        `${unique ? 'Votre panier moyen' : 'La valeur vie de votre client'} (${formatCurrency(valeur)}) est inférieur(e) au coût d'acquisition (${formatCurrency(cac)}). Augmentez vos prix, proposez des offres complémentaires (upsell) ou allongez la durée de rétention.`,
      ],
    }
  },

  /** Cout par clic superieur ou egal a 4 euros. */
  cpcEleve(secteur: string, cpc: number): DiagnosticReason {
    return {
      icon: 'tendance',
      title: 'Coût par clic élevé dans votre secteur',
      text: [
        `Le CPC moyen en ${secteur} est de ${formatCpc(cpc)}. Secteur compétitif : il faut un panier moyen élevé ou un excellent taux de conversion pour être rentable.`,
      ],
    }
  },

  /** Moins de 100 clics mensuels. */
  budgetFaible(budget: number, clics: number): DiagnosticReason {
    return {
      icon: 'barres',
      title: 'Budget insuffisant pour optimiser',
      text: [
        `Avec ${formatCurrency(budget)}/mois, vous générez environ ${clics} clics. En dessous de 200-300 clics/mois, les plateformes manquent de données pour cibler efficacement.`,
      ],
    }
  },

  /** Taux de conversion inferieur a 3 %. */
  conversionBasse(secteur: string, cvr: number): DiagnosticReason {
    return {
      icon: 'conversion',
      title: 'Taux de conversion bas dans votre secteur',
      text: [
        `Le taux de conversion moyen pour ${secteur} est de ${formatPercent(cvr)}. Une landing page optimisée peut doubler ce chiffre.`,
      ],
    }
  },

  /** Repli quand aucune cause precise ne ressort. */
  ratioDefavorable(ticketLTV: number, cac: number): DiagnosticReason {
    return {
      icon: 'bouclier',
      title: "Le ratio prix/coût d'acquisition est défavorable",
      text: [
        `Avec une valeur client de ${formatCurrency(ticketLTV)} et un coût d'acquisition de ${formatCurrency(cac)}, chaque client coûte trop cher. Travaillez la valeur vie client (ventes récurrentes, upsell) ou améliorez les taux de conversion.`,
      ],
    }
  },

  /** Conseil actionnable, toujours ajoute en dernier. */
  conseilUnique(minTicketLTV: number): DiagnosticReason {
    return {
      icon: 'ampoule',
      title: "Ce qu'il faudrait pour être rentable",
      text: [
        "Pour obtenir un ROI positif avec ce budget, votre panier moyen devrait être d'au moins ",
        { strong: formatCurrency(minTicketLTV) },
        '. Un accompagnement professionnel peut réduire le coût par clic de 30 à 50% et améliorer le taux de conversion.',
      ],
    }
  },

  conseilMensuel(minTicketLTV: number, retention: number, parMois: number): DiagnosticReason {
    return {
      icon: 'ampoule',
      title: "Ce qu'il faudrait pour être rentable",
      text: [
        "La valeur vie client devrait être d'au moins ",
        { strong: formatCurrency(minTicketLTV) },
        `. Avec ${retention} mois d'abonnement, cela correspond à `,
        { strong: `${formatCurrency(parMois)}/mois` },
        '.',
      ],
    }
  },

  conseilAnnuel(minTicketLTV: number, retention: number, parAn: number): DiagnosticReason {
    return {
      icon: 'ampoule',
      title: "Ce qu'il faudrait pour être rentable",
      text: [
        "La valeur vie client devrait être d'au moins ",
        { strong: formatCurrency(minTicketLTV) },
        `. Avec ${retention} ans de contrat, cela correspond à `,
        { strong: `${formatCurrency(parAn)}/an` },
        '.',
      ],
    }
  },

  conseilVisite(minTicketLTV: number, retention: number, parVisite: number): DiagnosticReason {
    return {
      icon: 'ampoule',
      title: "Ce qu'il faudrait pour être rentable",
      text: [
        "La valeur annuelle client devrait être d'au moins ",
        { strong: formatCurrency(minTicketLTV) },
        `. Avec ${retention} visites/an, cela correspond à `,
        { strong: formatCurrency(parVisite) },
        ' par visite.',
      ],
    }
  },
} as const

/**
 * Mention de la periode de reference sous les resultats.
 *
 * Le tiret cadratin du texte WordPress est remplace par un deux-points,
 * conformement aux regles de redaction du projet.
 */
export const ROI_PERIODES = {
  mensuel: (retention: number): string =>
    `ROI calculé sur la durée de vie client : ${retention} mois d'abonnement`,
  annuel: (retention: number): string =>
    `ROI calculé sur la durée de vie client : ${retention} ans de contrat`,
  visite: (retention: number, ticket: number): string =>
    `ROI calculé sur 1 an : ${retention} visites à ${formatCurrency(ticket)}`,
} as const

/* -------------------------------------------------------------------------- */
/* Contenus SEO, dans l'ordre de roi-calculator.html                          */
/* -------------------------------------------------------------------------- */

export const ROI_INTRO = {
  tag: 'Comprendre le ROI',
  titleBefore: "Qu'est-ce que le ",
  titleHighlight: 'ROI publicitaire',
  titleAfter: ' ?',
  paragraphs: [
    "Le ROI (Retour sur Investissement) publicitaire mesure la rentabilité de vos campagnes marketing. Concrètement, il répond à une question simple : pour chaque euro investi en publicité, combien d'euros récupérez-vous ?",
    'Notre simulateur utilise les données moyennes de performance par secteur d’activité en France pour vous donner une estimation réaliste du potentiel de vos campagnes Google Ads et Meta Ads (Facebook, Instagram).',
  ],
} as const

export const ROI_ROAS = {
  tag: 'ROI vs ROAS',
  titleBefore: 'ROI et ROAS : ',
  titleHighlight: 'quelle différence ?',
  desc: 'Deux indicateurs complémentaires pour mesurer la rentabilité de vos campagnes publicitaires.',
  cards: [
    {
      cle: 'roi',
      titleBefore: 'Le ',
      lien: { text: 'ROI', href: GLOSSAIRE_ROI },
      titleAfter: ' (Return On Investment)',
      paragraphe1:
        'Le ROI mesure la rentabilité nette globale en prenant en compte tous les coûts : budget publicitaire, création, outils, gestion et ressources humaines.',
      formule: 'ROI = (Gain net - Coût total) ÷ Coût total × 100',
      paragraphe2:
        "Un ROI de 150 % signifie que vous avez gagné 1,50 € net pour chaque euro investi. C'est l'indicateur stratégique pour évaluer la vraie profitabilité de votre investissement marketing.",
    },
    {
      cle: 'roas',
      titleBefore: 'Le ',
      lien: { text: 'ROAS', href: GLOSSAIRE_ROAS },
      titleAfter: ' (Return On Ad Spend)',
      paragraphe1:
        'Le ROAS mesure le chiffre d’affaires généré par euro dépensé en publicité uniquement. Il ne prend pas en compte les autres coûts (marge, gestion, etc.).',
      formule: 'ROAS = Revenu publicitaire ÷ Dépenses publicitaires',
      paragraphe2:
        "Un ROAS de 4 signifie que pour 1 € dépensé en ads, vous générez 4 € de chiffre d'affaires. C'est l'indicateur opérationnel pour piloter vos campagnes au quotidien.",
    },
  ],
  tip: [
    'En résumé : le ',
    { text: 'ROAS', href: GLOSSAIRE_ROAS },
    ' vous dit si vos campagnes publicitaires sont performantes, le ',
    { text: 'ROI', href: GLOSSAIRE_ROI },
    ' vous dit si votre business est rentable. Un ROAS de 5 peut correspondre à un ROI négatif si vos marges sont trop faibles. Notre simulateur intègre les deux pour vous donner une vision complète.',
  ] as RichSegment[],
} as const

export const ROI_WHY = {
  tag: 'Les chiffres clés',
  titleBefore: 'Pourquoi la ',
  titleHighlight: 'publicité en ligne',
  titleAfter: ' est incontournable',
  desc: 'Les entreprises qui investissent intelligemment en Ads obtiennent des résultats mesurables.',
  stats: [
    {
      number: '200%',
      title: 'ROI moyen Google Ads',
      text: 'En moyenne, les entreprises gagnent 2 € pour chaque 1 € dépensé sur Google Ads. Avec une bonne optimisation, ce chiffre peut monter à 8:1.',
    },
    {
      number: '65%',
      title: 'Des clics vont aux Ads',
      text: "65% des personnes prêtes à acheter cliquent sur une annonce Google. Être visible au bon moment, c'est capter les clients les plus qualifiés.",
    },
    {
      number: '24h',
      title: 'Résultats immédiats',
      text: 'Contrairement au SEO qui prend des mois, la publicité en ligne génère du trafic et des clients dès les premières 24 heures de diffusion.',
    },
  ],
} as const

export const ROI_HOW = {
  tag: 'Notre méthode',
  titleBefore: 'Comment fonctionne ',
  titleHighlight: 'notre simulateur',
  titleAfter: ' ?',
  desc: 'Un calcul basé sur des données réelles du marché français.',
  steps: [
    {
      numero: '1',
      title: 'Vous renseignez vos données',
      text: "Secteur d'activité, budget mensuel et ticket moyen. Ces 3 informations suffisent pour lancer la simulation.",
    },
    {
      numero: '2',
      title: 'On applique les benchmarks',
      text: 'Notre algorithme utilise les moyennes de performance par secteur : coût par clic, taux de conversion, taux de closing.',
    },
    {
      numero: '3',
      title: 'Vous recevez votre estimation',
      text: 'ROI, nombre de clients, chiffre d’affaires estimé et un rapport détaillé avec toutes les métriques clés.',
    },
  ],
} as const

export const ROI_COMPARE = {
  tag: 'Le comparatif',
  titleBefore: 'Meta Ads vs Google Ads : ',
  titleHighlight: 'quelle plateforme choisir ?',
  desc: 'Chaque plateforme a ses forces. Le choix dépend de votre activité, de votre cible et de vos objectifs.',
  cards: [
    {
      platform: 'meta' as const,
      title: 'Meta Ads',
      sub: 'Facebook & Instagram',
      points: [
        { ok: true, text: 'CPC plus bas : en moyenne 0,70 € à 3,75 € selon le secteur' },
        {
          ok: true,
          text: "Ciblage ultra-précis : par centres d'intérêt, comportements, données démographiques",
        },
        {
          ok: true,
          text: 'Idéal pour la notoriété : touchez des prospects qui ne vous cherchent pas encore',
        },
        {
          ok: true,
          text: "Formats visuels : vidéos, carrousels, stories pour capter l'attention",
        },
        {
          ok: false,
          text: "Intention d'achat plus faible (l'utilisateur ne cherche pas activement)",
        },
      ],
      best: 'Idéal pour : E-commerce, Restauration, Formation, B2C',
    },
    {
      platform: 'google' as const,
      title: 'Google Ads',
      sub: 'Search & Display',
      points: [
        {
          ok: true,
          text: "Intention d'achat forte : l'utilisateur cherche activement une solution",
        },
        {
          ok: true,
          text: 'Taux de closing élevé : les leads Google convertissent mieux en clients',
        },
        {
          ok: true,
          text: 'Visibilité immédiate : apparaissez en haut de Google dès le premier jour',
        },
        { ok: true, text: 'Mesure précise : suivi des conversions et attribution claire' },
        { ok: false, text: "CPC plus élevé (jusqu'à 7,50 € dans certains secteurs)" },
      ],
      best: 'Idéal pour : Artisans, Juridique, Santé, B2B, Services locaux',
    },
  ],
  tip: 'Notre conseil : pour maximiser votre ROI, combinez les deux plateformes. Meta Ads pour générer de la notoriété et du trafic, Google Ads pour capter les prospects prêts à acheter.',
} as const

/* -------------------------------------------------------------------------- */
/* FAQ et CTA                                                                 */
/* -------------------------------------------------------------------------- */

export const ROI_FAQ_HEADING = {
  tag: 'FAQ',
  titleBefore: 'Questions fréquentes sur le ',
  titleHighlight: 'ROI publicitaire',
} as const

export const ROI_FAQ: ToolFaqItem[] = [
  {
    question: 'Quel budget minimum faut-il pour lancer des campagnes Ads ?',
    reponse: [
      "Il n'y a pas de minimum imposé par Google ou Meta, mais nous recommandons au moins 500 € par mois pour obtenir suffisamment de données et optimiser vos campagnes. En dessous, le volume de clics est trop faible pour tirer des conclusions fiables. Pour des secteurs compétitifs (juridique, assurance), prévoyez plutôt 1 500 à 3 000 € par mois.",
    ],
  },
  {
    question: 'Les résultats de ce simulateur sont-ils garantis ?',
    reponse: [
      "Non, ce simulateur fournit une estimation basée sur les moyennes du marché français (sources : WordStream, LocaliQ). Les résultats réels dépendent de nombreux facteurs : qualité de vos annonces, page de destination, concurrence locale, saisonnalité, etc. Un accompagnement professionnel permet généralement de dépasser ces moyennes.",
    ],
  },
  {
    question: 'Combien de temps faut-il pour voir des résultats ?',
    reponse: [
      "Contrairement au SEO qui prend 3 à 6 mois, la publicité en ligne produit des résultats dès les premières 24 à 48 heures. Cependant, comptez 2 à 4 semaines d'optimisation pour atteindre les performances optimales. L'algorithme de Google et Meta a besoin de données pour affiner le ciblage et réduire le coût par acquisition.",
    ],
  },
  {
    question: 'Qu’est-ce que le coût par clic (CPC) et pourquoi varie-t-il ?',
    reponse: [
      "Le CPC est le montant que vous payez à chaque fois qu'un internaute clique sur votre annonce. Il varie selon le secteur (un clic en assurance coûte 7,50 € sur Google vs 0,68 € en restauration sur Meta), la concurrence, la qualité de votre annonce et l'heure de diffusion. Un bon gestionnaire de campagnes optimise en permanence pour réduire ce coût.",
    ],
  },
  {
    question: 'Quelle est la différence entre un lead et un client ?',
    reponse: [
      "Un lead est un prospect qui a montré de l'intérêt : il a rempli un formulaire, demandé un devis ou appelé. Un client est un lead qui a finalisé un achat ou signé un contrat. Le taux de conversion de lead à client (appelé « taux de closing ») varie de 3 % (immobilier) à 70 % (restauration sur Google). C'est pourquoi notre simulateur intègre ce taux dans le calcul.",
    ],
  },
  {
    question: 'Puis-je gérer mes campagnes moi-même ou dois-je faire appel à une agence ?',
    reponse: [
      'Vous pouvez tout à fait gérer vos campagnes vous-même, mais sachez que les erreurs courantes (mauvais ciblage, enchères non optimisées, pages de destination inadaptées) peuvent gaspiller 30 à 50 % de votre budget. Une agence spécialisée optimise vos campagnes au quotidien, teste différentes approches et maximise votre ROI. Le coût de gestion est souvent rentabilisé dès le premier mois.',
    ],
  },
  {
    question: 'Mon ROI simulé est négatif, est-ce normal ?',
    reponse: [
      "Oui, c'est possible et c'est justement l'intérêt du simulateur. Un ROI négatif signifie que votre ticket moyen est trop bas par rapport au coût d'acquisition dans votre secteur. Solutions : augmenter la valeur vie client (upsell, fidélisation), optimiser votre taux de conversion, ou revoir votre stratégie de pricing. Nos experts peuvent vous aider à trouver le bon équilibre.",
    ],
  },
]

export const ROI_CTA = {
  titleBefore: 'Obtenez votre ',
  titleHighlight: 'rapport détaillé gratuit',
  desc: 'Nos experts analysent votre marché et vous accompagnent pour maximiser votre ROI publicitaire, le tout financé par votre budget FAF.',
  card: {
    title: 'Recevez votre rapport complet',
    subtitle: 'Réponse sous 24h - Sans engagement - 100% gratuit',
  },
  submit: 'Recevoir mon rapport détaillé',
  privacy: 'Vos données sont 100% sécurisées et ne seront jamais partagées.',
  success: {
    title: 'Merci !',
    text: 'Votre simulation a bien été enregistrée. Un conseiller DGL Agency vous contactera sous 24h avec votre rapport détaillé et des recommandations personnalisées.',
  },
} as const

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

export const ROI_APP_SCHEMA = {
  name: 'Simulateur de ROI publicitaire - DGL Agency',
  description:
    "Simulateur gratuit du retour sur investissement de vos campagnes Google Ads et Meta Ads : leads, clients, chiffre d'affaires et coût d'acquisition, secteur par secteur.",
  category: 'BusinessApplication',
} as const
