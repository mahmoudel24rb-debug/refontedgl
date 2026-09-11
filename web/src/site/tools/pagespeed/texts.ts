import type { RichSegment } from '../shared/rich-text'
import type { ToolFaqItem } from '../shared/FaqAccordion'

/**
 * Tous les textes visibles du test PageSpeed, repris mot pour mot de la
 * page WordPress (php.php et js.js). Aucun texte n'est ecrit dans les
 * composants.
 */

/** Liens sortants cites dans les contenus SEO. */
const ARTICLE_AUDIT = 'https://dgl-agency.fr/article/audit-performance-site-internet/'
const SERVICE_AUDIT = 'https://dgl-agency.fr/nos-services/audit-performance-web/'
const AUDIT_GRATUIT = 'https://dgl-agency.fr/audit-gratuit/'

/* -------------------------------------------------------------------------- */
/* Hero et outil                                                              */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_HERO = {
  pill: { tag: 'Gratuit', text: 'Test de vitesse gratuit, sans inscription' },
  title: 'Test de Vitesse et de Performance de votre Site Web',
  titleHighlight: 'Vitesse & Core Web Vitals en 30 secondes',
  subtitle:
    'Testez la vitesse et la rapidité de chargement de votre site, exactement comme Google.',
  subtitleStrong:
    'Score sur 100, Core Web Vitals, diagnostics et recommandations, en 30 secondes.',
  hint: 'Entrez votre adresse, nous mesurons mobile et ordinateur.',
} as const

export const PAGESPEED_FORM = {
  label: 'URL de votre site web',
  placeholder: "Entrez l'URL de votre site web (ex: https://example.com)",
  submit: 'Analyser',
  submitLoading: 'Analyse en cours...',
} as const

export const PAGESPEED_ERRORS = {
  urlManquante: 'Veuillez entrer une URL à analyser.',
  urlInvalide: "L'URL entrée n'est pas valide. Exemple : https://example.com",
  analyse: "Erreur lors de l'analyse : ",
  generique: 'Une erreur est survenue. Réessayez dans quelques instants.',
} as const

/** Paliers de la barre de progression : 3 secondes chacun. */
export const PAGESPEED_LOADING = {
  titre: 'Analyse en cours...',
  steps: [
    { pct: 15, text: 'Connexion à Google Lighthouse...' },
    { pct: 30, text: 'Analyse mobile en cours...' },
    { pct: 50, text: 'Calcul des métriques de performance...' },
    { pct: 65, text: 'Analyse desktop en cours...' },
    { pct: 80, text: 'Récupération des données terrain...' },
    { pct: 92, text: 'Génération des recommandations...' },
  ],
} as const

export const PAGESPEED_TABS = {
  mobile: 'Mobile',
  desktop: 'Ordinateur',
  /** Prefixe de la ligne rappelant l'adresse analysee. */
  analysedPrefix: 'Résultats pour : ',
} as const

export const PAGESPEED_SCORE = {
  tag: 'Performance',
  title: 'Score Global',
  legend: [
    { label: '0-49 : Mauvais', color: '#ff4e42' },
    { label: '50-89 : À améliorer', color: '#ffa400' },
    { label: '90-100 : Bon', color: '#0cce6b' },
  ],
  /** Verdict construit sur le pire des deux scores. */
  verdict: {
    bon: 'votre site est rapide. Le rapport complet vous dit comment le maintenir à ce niveau.',
    moyen:
      'votre site peut faire mieux. Le rapport complet liste précisément ce qui le ralentit.',
    mauvais:
      'votre site est lent et cela vous coûte des visiteurs. Le rapport complet identifie les corrections prioritaires.',
    mobile: 'Mobile',
    desktop: 'Ordinateur',
    sur: '/100',
  },
} as const

export const PAGESPEED_REPORT = {
  metrics: {
    tag: 'Métriques',
    titleBefore: 'Core Web Vitals & ',
    titleHighlight: 'Métriques de Performance',
    desc: 'Données de laboratoire simulées par Lighthouse.',
  },
  field: {
    tag: 'Données Terrain',
    titleBefore: 'Expérience des ',
    titleHighlight: 'Vrais Utilisateurs',
    desc: 'Données collectées auprès des utilisateurs Chrome (CrUX) sur les 28 derniers jours.',
    percentile: '(75e percentile)',
    bon: 'Bon',
    moyen: 'Moyen',
    lent: 'Lent',
  },
  opportunities: {
    tag: 'Recommandations',
    titleBefore: 'Opportunités ',
    titleHighlight: "d'Amélioration",
    desc: "Ces optimisations ont l'impact le plus direct sur votre vitesse de chargement.",
  },
  diagnostics: {
    tag: 'Diagnostics',
    titleBefore: 'Problèmes ',
    titleHighlight: 'Détectés',
    desc: 'Ces éléments ne modifient pas directement le score mais signalent des bonnes pratiques.',
  },
  passed: {
    label: 'Audits réussis',
  },
  vide: 'Aucun élément à afficher.',
  autresElements: '... et {n} autres éléments',
} as const

/* -------------------------------------------------------------------------- */
/* Carte de deblocage                                                         */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_UNLOCK = {
  title: 'Débloquez votre rapport complet',
  text: 'Recevez le détail de vos Core Web Vitals, les données de vos vrais utilisateurs et la liste complète des problèmes détectés sur votre site.',
  submit: 'Voir mon rapport complet',
  submitLoading: 'Déblocage en cours...',
  privacy: '100% gratuit. Vos données ne seront jamais partagées.',
} as const

/* -------------------------------------------------------------------------- */
/* Contenus SEO                                                               */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_INTRO = {
  tag: 'Outil gratuit',
  titleBefore: "Qu'est-ce qu'un ",
  titleHighlight: 'test de performance de site web',
  titleAfter: ' ?',
  paragraphs: [
    "Notre outil mesure la performance de votre site web exactement comme le fait Google : vitesse de chargement, réactivité aux clics et stabilité visuelle. En quelques secondes, vous obtenez un rapport complet incluant un score de performance sur 100, les Core Web Vitals, et une liste de diagnostics détaillés.",
    "L'analyse est effectuée par l'intelligence artificielle de Google, la même technologie utilisée en interne par le moteur de recherche. Vous obtenez donc un test de performance fiable et précis, avec un diagnostic séparé pour mobile et ordinateur.",
  ],
} as const

export const PAGESPEED_WHY = {
  tag: "Pourquoi c'est crucial",
  titleBefore: 'La performance de votre site web ',
  titleHighlight: 'impacte directement',
  titleAfter: ' votre business',
  desc: 'Un site lent fait fuir vos visiteurs et pénalise votre référencement Google.',
  stats: [
    {
      number: '+53 %',
      title: 'Référencement Google',
      text: 'Depuis 2021, les Core Web Vitals sont un facteur de classement officiel de Google. Un site rapide est mieux positionné dans les résultats de recherche.',
    },
    {
      number: '-32 %',
      title: 'Taux de rebond',
      text: 'Un site qui charge en moins de 3 secondes réduit drastiquement son taux de rebond. Au-delà de 5 secondes, la probabilité de rebond augmente de 90 %.',
    },
    {
      number: '+7 %',
      title: 'Taux de conversion',
      text: "Chaque seconde de chargement en moins augmente le taux de conversion de 7 % en moyenne. Amazon a calculé qu'1 seconde de latence = 1,6 milliard $ de perte annuelle.",
    },
  ],
} as const

export const PAGESPEED_METRICS_SEO = {
  tag: 'Core Web Vitals',
  titleBefore: 'Les métriques que ',
  titleHighlight: 'nous analysons',
  desc: "Voici les indicateurs clés relevés par notre test de performance pour évaluer l'expérience utilisateur de votre site.",
  cards: [
    {
      abbr: 'LCP',
      color: '#0cce6b',
      title: 'Largest Contentful Paint',
      text: 'Mesure le temps nécessaire pour afficher le plus grand élément visible de la page (image, texte). Un bon LCP est inférieur à 2,5 secondes.',
    },
    {
      abbr: 'INP',
      color: '#ffa400',
      title: 'Interaction to Next Paint',
      text: 'Évalue la réactivité de votre site aux clics, touches et interactions. Un bon INP est inférieur à 200 millisecondes.',
    },
    {
      abbr: 'CLS',
      color: '#fe5752',
      title: 'Cumulative Layout Shift',
      text: "Mesure la stabilité visuelle de la page. Les décalages inattendus de contenu dégradent l'expérience. Un bon CLS est inférieur à 0,1.",
    },
    {
      abbr: 'FCP',
      color: '#0cce6b',
      title: 'First Contentful Paint',
      text: "Temps nécessaire pour afficher le premier élément de contenu (texte ou image). Il donne une indication de la vitesse perçue par l'utilisateur. Idéal : sous 1,8 seconde.",
    },
    {
      abbr: 'TBT',
      color: '#ffa400',
      title: 'Total Blocking Time',
      text: "Temps total pendant lequel le thread principal est bloqué et empêche l'utilisateur d'interagir avec la page. Un bon TBT est inférieur à 200 millisecondes.",
    },
    {
      abbr: 'SI',
      color: '#fe5752',
      title: 'Speed Index',
      text: "Mesure la rapidité d'affichage progressif du contenu visible. Plus le Speed Index est bas, plus le site semble charger vite. Idéal : sous 3,4 secondes.",
    },
  ],
} as const

export const PAGESPEED_INTERPRET: {
  tag: string
  titleBefore: string
  titleHighlight: string
  titleAfter: string
  paragraphs: RichSegment[][]
} = {
  tag: 'Interpréter vos résultats',
  titleBefore: 'Comment interpréter ',
  titleHighlight: 'vos scores',
  titleAfter: ' ?',
  paragraphs: [
    [
      "Il est normal d'obtenir un score mobile nettement inférieur au score ordinateur : ce sont deux tests distincts. Un écart de 20 à 40 points entre les deux est fréquent, même sur un site bien construit. C'est le score mobile qu'il faut regarder en priorité, car c'est celui que Google retient pour évaluer la performance de votre site web.",
    ],
    [
      "Le test mobile est plus sévère parce qu'il simule un smartphone d'entrée de gamme sur un réseau 4G lent, avec une puissance de calcul volontairement bridée. Les mêmes images, les mêmes scripts et les mêmes polices coûtent donc beaucoup plus cher à charger que sur un ordinateur de bureau raccordé à la fibre.",
    ],
    [
      "Le score sur 100 est une donnée de laboratoire : une mesure ponctuelle, réalisée dans un environnement standardisé, utile pour diagnostiquer et comparer. Les données terrain proviennent au contraire des visites réelles des utilisateurs de Chrome sur les 28 derniers jours. Un écart entre les deux n'est pas une anomalie : le laboratoire révèle le potentiel de la page, le terrain montre ce que vivent réellement vos visiteurs.",
    ],
    [
      "Concrètement : au-delà de 90, votre site est déjà rapide. Entre 50 et 89, quelques optimisations ciblées suffisent le plus souvent. En dessous de 50 sur mobile, ou si vos Core Web Vitals sont au rouge en données terrain, le problème est structurel : mieux vaut alors un ",
      { text: 'audit de performance web', href: ARTICLE_AUDIT },
      " complet que des correctifs isolés. C'est précisément l'objet de ",
      { text: "notre prestation d'audit de performance web", href: SERVICE_AUDIT },
      ' : identifier les causes réelles du ralentissement et vous livrer un plan d\'action priorisé.',
    ],
  ],
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_FAQ_HEADING = {
  tag: 'Questions fréquentes',
  titleBefore: 'Tout savoir sur le ',
  titleHighlight: 'test de vitesse de site',
} as const

export const PAGESPEED_FAQ: ToolFaqItem[] = [
  {
    question: 'Comment tester la vitesse de mon site web ?',
    reponse: [
      "Il vous suffit de coller l'adresse de votre site dans la barre ci-dessus et de cliquer sur Analyser. Notre outil mesure gratuitement la vitesse de chargement de votre page sur mobile et sur ordinateur, avec les mêmes données que Google, et vous renvoie un score sur 100 ainsi que les points à corriger.",
    ],
  },
  {
    question: 'Le test de vitesse est-il vraiment gratuit ?',
    reponse: [
      "Oui, l'analyse est entièrement gratuite et sans inscription : vous obtenez immédiatement votre score de performance sur mobile et sur ordinateur, autant de fois que vous le souhaitez. Pour débloquer le rapport détaillé (Core Web Vitals, données terrain et recommandations), il vous suffit de laisser vos coordonnées, sans aucun engagement.",
    ],
  },
  {
    question: "Qu'est-ce qu'un bon score de performance ?",
    reponse: [
      "Un score compris entre 90 et 100 est considéré comme bon, entre 50 et 89 il y a des améliorations à apporter, et en dessous de 50 le site est lent. L'objectif est aussi d'obtenir de bons Core Web Vitals (LCP sous 2,5 s, CLS sous 0,1, INP sous 200 ms).",
    ],
  },
  {
    question: 'Quelle différence entre les données de laboratoire et les données terrain ?',
    reponse: [
      'Les données de laboratoire sont simulées dans un environnement contrôlé pour reproduire le test. Les données terrain (CrUX) proviennent des vrais utilisateurs de Chrome sur les 28 derniers jours. Pour en savoir plus, consultez notre ',
      { text: "guide de l'audit de performance", href: ARTICLE_AUDIT },
      '.',
    ],
  },
  {
    question: 'Comment améliorer la vitesse de chargement de mon site ?',
    reponse: [
      "Les leviers principaux sont l'optimisation des images, la mise en cache, la réduction du JavaScript et un bon hébergement. Nous détaillons tout dans notre article sur les ",
      { text: 'leviers pour un site rapide', href: ARTICLE_AUDIT },
      ", et notre équipe peut s'en charger pour vous.",
    ],
  },
  {
    question: "Quelle est la différence entre un test de performance et un audit de performance ?",
    reponse: [
      "Le test de performance est une mesure instantanée et gratuite, celle que vous obtenez sur cette page : il vous dit où en est votre site, sur mobile comme sur ordinateur. L'audit de performance va bien plus loin : c'est une analyse humaine complète qui identifie les causes réelles des ralentissements, hiérarchise les corrections et vous livre un plan d'action chiffré. ",
      { text: 'Demandez votre audit gratuit', href: AUDIT_GRATUIT },
      ' pour passer de la mesure à la correction.',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* CTA de bas de page                                                         */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_CTA = {
  titleBefore: "Besoin d'aide pour ",
  titleHighlight: 'améliorer votre score',
  titleAfter: ' ?',
  desc: 'Nos experts optimisent votre site pour atteindre les meilleurs scores de performance, le tout financé par votre budget FAF.',
  card: {
    title: 'Demandez votre audit de performance gratuit',
    subtitle: 'Réponse sous 24h - Sans engagement - 100% gratuit',
  },
  submit: 'Demander mon audit gratuit',
  privacy: 'Vos données sont 100% sécurisées et ne seront jamais partagées.',
  success: {
    title: 'Merci !',
    text: "Votre demande a bien été envoyée. Un conseiller DGL Agency vous contactera sous 24h pour analyser votre site et vous proposer un plan d'optimisation.",
  },
} as const

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

export const PAGESPEED_APP_SCHEMA = {
  name: 'Outil de Test de Vitesse de Site Web - DGL Agency',
  description:
    'Outil gratuit pour tester la vitesse et la performance de votre site web (score, Core Web Vitals, diagnostics), basé sur Google Lighthouse.',
  category: 'DeveloperApplication',
} as const
