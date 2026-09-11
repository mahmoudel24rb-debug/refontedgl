import type { ToolFaqItem } from '../shared/FaqAccordion'

/**
 * Tous les textes visibles du test de visibilite IA, repris mot pour
 * mot de la landing WordPress (landing.html et landing.js). Aucun
 * texte n'est ecrit dans les composants.
 *
 * Les moteurs ne sont jamais nommes : la page parle de « moteur IA
 * n°1 » et « moteur IA n°2 », comme la fonction engineLabel du JS.
 */

/* -------------------------------------------------------------------------- */
/* Hero et formulaire                                                         */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_HERO = {
  pill: { tag: 'Nouveau', text: 'Les IA recommandent déjà des entreprises locales' },
  title: 'Quand un client demande aux IA le meilleur artisan de votre ville...',
  titleHighlight: "est-ce vous qu'elles recommandent ?",
  subtitle:
    'Testez gratuitement votre visibilité IA locale : on pose de vraies questions de clients (« meilleur [métier] à [ville] ») à des IA avec recherche web, et on vous dit si vous sortez, et qui sort à votre place.',
  hint: 'Les IA recommandent-elles votre entreprise ?',
  /** Mentions de confiance sous le formulaire. */
  trust: [
    'Gratuit, sans inscription',
    "Vraies réponses d'IA avec recherche web",
    'Résultat en 1 à 2 minutes',
  ],
} as const

export const GEOSCAN_FORM = {
  /** Trois champs, dans l'ordre de la landing. */
  entreprise: { label: 'Nom de votre entreprise', placeholder: 'Nom de votre entreprise' },
  metier: { label: 'Votre métier', placeholder: 'Votre métier (ex : plombier)' },
  ville: { label: 'Votre ville', placeholder: 'Votre ville (ex : Tours)' },
  submit: 'Tester ma visibilité IA',
  submitLoading: 'Lancement...',
  chip: 'IA avec recherche web',
} as const

export const GEOSCAN_ERRORS = {
  champsManquants: 'Merci de remplir les trois champs : entreprise, métier et ville.',
  lancement: 'Le lancement a échoué. Réessayez dans un instant.',
  scan: 'Le scan a échoué. Réessayez dans quelques minutes.',
  tropLong: 'Le scan prend plus de temps que prévu. Réessayez dans quelques minutes.',
} as const

/* -------------------------------------------------------------------------- */
/* Progression                                                                */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_PROGRESS = {
  title: 'Interrogation des IA en cours...',
  defaultLabel: 'Préparation du scan...',
  hint: 'On pose de vraies questions aux IA, avec recherche web : comptez 1 à 2 minutes. Ne fermez pas la page.',
} as const

/* -------------------------------------------------------------------------- */
/* Resultat gratuit                                                           */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_SCORE = {
  tag: 'Votre résultat',
  titleBefore: 'Votre score de ',
  titleHighlight: 'visibilité IA locale',
  /** Phrase de citations : « citée X fois sur Y réponses des IA testées. » */
  citedBefore: 'Votre entreprise est citée ',
  citedMiddle: ' fois sur ',
  citedAfter: ' réponses',
  citedEnd: ' des IA testées.',
  /** Teaser affiche quand des concurrents passent devant. */
  teaserSingulier: ' concurrent local ',
  teaserPluriel: ' concurrents locaux ',
  teaserVerbeSingulier: 'est recommandé',
  teaserVerbePluriel: 'sont recommandés',
  teaserSuite: ' plus souvent que vous par les IA. Leurs noms sont dans le rapport complet.',
  /** Teaser de repli quand l'entreprise n'est jamais citee. */
  teaserAucuneCitationAvant: 'Les IA recommandent ',
  teaserAucuneCitationFort: "d'autres entreprises",
  teaserAucuneCitationApres:
    ' de votre ville à votre place. Leurs noms sont dans le rapport complet.',
} as const

/* -------------------------------------------------------------------------- */
/* Deblocage                                                                  */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_UNLOCK = {
  title: 'Découvrez qui les IA recommandent à votre place',
  text: "Recevez le rapport complet : le podium nominatif de vos concurrents, le détail par moteur IA, et votre plan d'action.",
  submit: 'Voir mon rapport complet',
  submitLoading: 'Déblocage en cours...',
  privacy:
    '100% gratuit. Un expert vous rappelle sous 2 h ouvrées pour vous expliquer les résultats.',
  consent:
    "J'accepte que DGL Agency utilise ces informations pour me recontacter au sujet de ma visibilité en ligne. Suppression possible à tout moment : contact@dgl-agency.fr.",
} as const

/* -------------------------------------------------------------------------- */
/* Rapport complet                                                            */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_REPORT = {
  success:
    'Rapport débloqué. Un expert DGL Agency vous rappelle sous 2 h ouvrées (9h-18h) pour vous expliquer les résultats.',
  podiumTitle: 'Les concurrents que les IA recommandent à votre place',
  podiumVide:
    'Bonne nouvelle : aucun concurrent ne domine clairement les réponses des IA sur votre métier dans votre ville. La place est à prendre.',
  podiumMetaBefore: 'Cité ',
  podiumMetaMiddle: ' fois sur ',
  podiumMetaAfter: ' réponses',
  enginesTitle: 'Détail par moteur IA',
  engineCaption: 'réponses où vous êtes cité',
  sourcesOk:
    "Votre site apparaît dans les sources que les IA consultent : c'est un excellent signal.",
  sourcesKo:
    "Votre site n'apparaît pas dans les sources que les IA consultent : elles parlent de votre marché sans vous lire.",
  planTitle: "Votre plan d'action",
  cta: 'Tester une autre entreprise',
} as const

/** Libelle anonyme d'un moteur (engineLabel de landing.js). */
export function engineLabel(cle: string): string {
  if (cle === 'gemini' || cle === 'claude') return 'Moteur IA n°1 (recherche web)'
  if (cle === 'perplexity') return 'Moteur IA n°2 (recherche web)'
  return 'Moteur IA (recherche web)'
}

/* -------------------------------------------------------------------------- */
/* Contenus SEO                                                               */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_INTRO = {
  tag: 'Le nouveau référencement',
  titleBefore: "C'est quoi, la ",
  titleHighlight: 'visibilité IA',
  titleAfter: ' (GEO) ?',
  paragraphs: [
    "De plus en plus de Français ne cherchent plus un artisan, un commerce ou un cabinet sur Google, mais en posant la question à une IA : ChatGPT, Perplexity, Gemini, ou les nouveaux aperçus IA de Google, déployés en France en juillet 2026. L'IA ne renvoie pas une liste de liens : elle recommande 2 ou 3 entreprises, nommément.",
    "Le GEO (Generative Engine Optimization), c'est l'art d'être l'une de ces entreprises recommandées. Ce test mesure où vous en êtes, aujourd'hui, dans votre ville.",
  ],
} as const

export const GEOSCAN_STATS = {
  tag: 'Pourquoi maintenant',
  titleBefore: 'Vos clients demandent déjà ',
  titleHighlight: 'aux IA',
  cards: [
    {
      number: '39%',
      title: 'des Français',
      text: "utilisent déjà les IA pour faire des recherches (IPSOS, 2025). Chez les moins de 35 ans, l'IA devient un réflexe d'achat.",
    },
    {
      number: '31%',
      title: 'des moins de 35 ans',
      text: "ont demandé une recommandation de restaurant à une IA sur les 30 derniers jours (TheFork, janvier 2026). Trois fois plus qu'un an avant.",
    },
    {
      number: '2026',
      title: "Google passe à l'IA",
      text: 'Les aperçus IA de Google sont déployés en France depuis le 22 juillet 2026 : les réponses générées remplacent peu à peu les listes de liens.',
    },
  ],
  methodTitle: 'Notre méthodologie, en toute transparence :',
  methodText:
    " le test interroge les API officielles de plusieurs intelligences artificielles avec recherche web activée et localisée sur votre ville, avec plusieurs questions types d'acheteurs et des répétitions pour mesurer une fréquence. Les réponses des IA varient d'une session à l'autre : le score est une photographie fiable de tendance, pas une vérité absolue. Le score combine votre présence dans les réponses (50%), votre position quand vous êtes cité (30%) et la présence de votre site dans les sources (20%).",
} as const

export const GEOSCAN_FAQ_HEADING = {
  tag: 'Questions fréquentes',
  titleBefore: 'Tout savoir sur le ',
  titleHighlight: 'test de visibilité IA',
} as const

/** Les cinq questions affichees sur la landing. */
export const GEOSCAN_FAQ: ToolFaqItem[] = [
  {
    question: 'Comment fonctionne le test ?',
    reponse: [
      "Vous indiquez votre entreprise, votre métier et votre ville. Le test pose alors de vraies questions d'acheteurs (« meilleur [métier] à [ville] ? » et variantes) aux API officielles de plusieurs intelligences artificielles avec recherche web. On analyse ensuite quelles entreprises sont recommandées, dans quel ordre, et si la vôtre en fait partie.",
    ],
  },
  {
    question: 'Le test est-il vraiment gratuit ?',
    reponse: [
      "Oui. Le score et le nombre de fois où vous êtes cité sont gratuits et immédiats, sans inscription. Le rapport détaillé (noms de vos concurrents, détail par moteur, plan d'action) est débloqué en laissant vos coordonnées, sans aucun engagement.",
    ],
  },
  {
    question: "Pourquoi mon score peut-il varier d'un test à l'autre ?",
    reponse: [
      "Les IA ne répondent jamais deux fois exactement pareil. C'est pour cela que le test répète les questions et mesure une fréquence d'apparition plutôt qu'une réponse unique. Le score reflète une tendance fiable au moment du test.",
    ],
  },
  {
    question: 'Mon score est mauvais : que faire ?',
    reponse: [
      "La visibilité IA se travaille : fiche Google complète et active, avis clients, contenus locaux détaillés, site techniquement citable par les IA. Le rapport complet vous donne un premier plan d'action, et un expert DGL Agency vous rappelle pour l'expliquer, gratuitement et sans engagement.",
    ],
  },
  {
    question: 'Quelles IA sont testées ?',
    reponse: [
      "Le test interroge plusieurs intelligences artificielles avec recherche web, représentatives de ce que répondent les assistants IA grand public quand on leur demande un prestataire local. La liste des moteurs testés évolue régulièrement, au rythme des déploiements.",
    ],
  },
]

/** Les quatre questions du bloc FAQPage de la landing (JSON-LD). */
export const GEOSCAN_FAQ_JSONLD = [
  {
    question: 'Comment fonctionne le test de visibilité IA ?',
    reponse:
      "Vous indiquez votre entreprise, votre métier et votre ville. Le test pose de vraies questions d'acheteurs aux API officielles de plusieurs intelligences artificielles avec recherche web, puis analyse quelles entreprises sont recommandées et si la vôtre en fait partie.",
  },
  {
    question: 'Le test de visibilité IA est-il gratuit ?',
    reponse:
      'Oui, le score et le nombre de citations sont gratuits et immédiats, sans inscription. Le rapport détaillé avec les concurrents cités se débloque en laissant ses coordonnées, sans engagement.',
  },
  {
    question: 'Pourquoi le score peut-il varier ?',
    reponse:
      "Les IA ne répondent jamais deux fois pareil. Le test répète les questions et mesure une fréquence d'apparition : le score reflète une tendance fiable au moment du test.",
  },
  {
    question: 'Comment améliorer sa visibilité IA locale ?',
    reponse:
      "Fiche Google complète et active, avis clients réguliers, contenus locaux détaillés et site techniquement citable par les IA. Le rapport du test fournit un premier plan d'action personnalisé.",
  },
] as const

/* -------------------------------------------------------------------------- */
/* CTA de bas de page                                                         */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_CTA = {
  titleBefore: 'Les IA recommandent déjà ',
  titleHighlight: 'des entreprises locales',
  titleAfter: ' : est-ce vous ?',
  desc: 'Le test est gratuit, sans inscription, et le résultat tombe en 1 à 2 minutes.',
  label: 'Tester ma visibilité IA',
} as const

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

export const GEOSCAN_APP_SCHEMA = {
  name: 'Test de Visibilité IA Locale - DGL Agency',
  description:
    'Outil gratuit pour tester si les intelligences artificielles recommandent votre entreprise dans votre ville, et découvrir quels concurrents sortent à votre place.',
  category: 'BusinessApplication',
} as const
