/**
 * Donnees des pages cas client `/realisations/:slug`.
 * Les textes reprennent les pages WordPress de dgl-agency.fr quand elles en
 * proposent ; le reste est redige dans le meme ton. Les visuels sont servis
 * en local depuis `public/assets/cas/<slug>/`.
 */

export interface CaseMetric {
  value: string
  label: string
  note?: string
}

export interface CaseBlock {
  number: string
  title: string
  text: string
}

export interface CaseResultBlock {
  kicker: string
  title: string
  text: string
  metrics: CaseMetric[]
  /** Cartes complementaires (pages du site livre, cas gymfit-site). */
  pages?: { title: string; text: string }[]
}

export interface CaseRankRow {
  label: string
  share: string
  count: string
}

export interface CaseStudy {
  /** Identique au slug de PROJECTS (content.ts). */
  slug: string
  /** Cle de l'entree PROJECTS : visuel, titre, tags, client. */
  projectSlug: string
  client: string
  headline: string
  intro: string
  sector: string
  duration: string
  services: string[]
  metrics: CaseMetric[]
  context: CaseBlock
  solution: CaseBlock
  deliverables: CaseBlock[]
  processTitle: string
  steps: { title: string; text: string }[]
  resultsTitle: string
  results: CaseResultBlock[]
  ranking?: {
    title: string
    total: string
    rows: CaseRankRow[]
    growth: string
  }
  gallery?: { src: string; alt: string }[]
  /** Doit correspondre a `company` dans TESTIMONIALS. */
  testimonialCompany?: string
  externalUrl?: { label: string; href: string }
  seoTitle: string
  seoDescription: string
}

/* Etapes reprises du cas Les Oceades, reutilisees pour les cas Meta Ads. */
const ADS_STEPS = [
  {
    title: 'Audit',
    text: 'Analyse du compte publicitaire et des performances existantes',
  },
  {
    title: 'Stratégie',
    text: 'Définition des objectifs, audiences et budget publicitaire',
  },
  {
    title: 'Création',
    text: 'Conception des visuels et rédaction des accroches',
  },
  {
    title: 'Lancement',
    text: 'Publication des campagnes sur Facebook et Instagram',
  },
  {
    title: 'Optimisation',
    text: 'Suivi des performances et ajustements en continu',
  },
]

export const CASES: CaseStudy[] = [
  {
    slug: 'gymfit-site',
    projectSlug: 'gymfit-site',
    client: 'GYMFIT',
    headline: 'Comment nous avons transformé la présence digitale de GYMFIT',
    intro:
      "GYMFIT nous a fait confiance pour repenser entièrement leur site web et créer une expérience digitale à la hauteur de leurs salles de sport premium.",
    sector: 'Fitness',
    duration: '8 semaines',
    services: ['Création de site', 'SEO local'],
    metrics: [
      { value: '8 semaines', label: 'de la maquette à la mise en ligne' },
      { value: '187', label: 'mots-clés positionnés' },
      { value: '+181 %', label: 'de trafic organique en 3 mois' },
      { value: '68 %', label: 'des mots-clés en top 10' },
    ],
    context: {
      number: '01',
      title: 'Un site peu engageant pour les prospects',
      text: "L'ancien site ne reflétait ni la qualité des équipements ni l'ambiance des clubs. Les visiteurs repartaient sans demander de séance d'essai, et la marque restait discrète sur les requêtes géolocalisées à forte intention. Chaque euro investi en acquisition arrivait donc sur des pages qui ne transformaient pas.",
    },
    solution: {
      number: '02',
      title: 'Une refonte totale en 8 semaines',
      text: "Nous avons repris le site de zéro, de l'audit à la mise en ligne : un design premium, une architecture pensée pour le référencement local et des parcours orientés conversion. Chaque page pousse vers la prise de contact et l'essai en club, avec un suivi des demandes opérationnel dès le lancement.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Site premium',
        text: "Un design qui reflète enfin la qualité de leurs équipements et l'ambiance de leurs clubs.",
      },
      {
        number: '02',
        title: 'Performance SEO locale',
        text: "Mise en place d'une stratégie de référencement local ciblée, visant à améliorer la visibilité sur les requêtes géolocalisées à forte intention.",
      },
      {
        number: '03',
        title: 'Machine à leads',
        text: "Optimisation des parcours utilisateurs afin d'améliorer la transformation et la rentabilité des actions d'acquisition.",
      },
    ],
    processTitle: '5 étapes pour un site performant',
    steps: [
      {
        title: 'Audit',
        text: "Analyse de l'existant et de la concurrence",
      },
      { title: 'Stratégie', text: 'Définition des objectifs' },
      { title: 'Design', text: 'Création des maquettes UI/UX' },
      { title: 'Développement', text: 'Intégration WordPress' },
      { title: 'Lancement', text: 'Mise en ligne' },
    ],
    resultsTitle: 'Les résultats',
    results: [
      {
        kicker: 'Le résultat',
        title: 'Un site qui convertit',
        text: "Six pages construites pour guider le prospect du concept à la prise de contact, avec un discours clair sur les clubs, les espaces et les offres.",
        metrics: [],
        pages: [
          { title: 'Concept', text: "L'ADN et les valeurs de GYMFIT" },
          {
            title: 'Nos Clubs',
            text: "Présentation de l'ensemble des clubs",
          },
          { title: 'Nos Espaces', text: 'Cardio, muscu, détente, coaching' },
          { title: 'Blog', text: 'Conseils et actualités fitness' },
          { title: 'Tarifs', text: 'Offres et abonnements' },
          { title: 'Contact', text: 'Pour contacter facilement GYMFIT' },
        ],
      },
    ],
    ranking: {
      title: 'SEO local',
      total: '187 mots-clés positionnés sur Google',
      rows: [
        { label: 'TOP 1', share: '25%', count: '47' },
        { label: 'TOP 3', share: '42%', count: '78' },
        { label: 'TOP 5', share: '52%', count: '98' },
        { label: 'TOP 10', share: '68%', count: '128' },
        { label: 'TOP 30', share: '82%', count: '153' },
      ],
      growth: '+181 % de trafic organique en 3 mois',
    },
    externalUrl: {
      label: 'Découvrir le site GYMFIT',
      href: 'https://www.gym-fit.fr/',
    },
    testimonialCompany: 'GYMFIT',
    seoTitle: 'Cas client GYMFIT | Refonte de site et SEO local, DGL Agency',
    seoDescription:
      'Refonte complète du site GYMFIT en 8 semaines : 187 mots-clés positionnés, 68 % en top 10 et +181 % de trafic organique en 3 mois.',
  },
  {
    slug: 'gymfit-meta-ads',
    projectSlug: 'gymfit-meta-ads',
    client: 'GYMFIT',
    headline:
      'Des campagnes Meta Ads locales qui remplissent les salles GYMFIT',
    intro:
      'Campagnes Facebook et Instagram ciblées dans un rayon de 15 km pour générer des inscriptions qualifiées.',
    sector: 'Fitness',
    duration: '3 mois',
    services: ['Meta Ads', 'Remarketing'],
    metrics: [
      { value: '4,2x', label: 'de retour sur investissement' },
      { value: '0,78 €', label: 'par prospect' },
      { value: '15 km', label: 'de rayon de ciblage' },
      { value: '+181 %', label: 'de trafic organique en 3 mois' },
    ],
    context: {
      number: '01',
      title: 'Des salles à remplir, quartier par quartier',
      text: "GYMFIT exploite des clubs à Strasbourg et à La Garenne-Colombes. Chaque salle a besoin d'inscriptions venues de son propre bassin de vie, pas d'une notoriété nationale. Sans ciblage géographique fin, une large part du budget publicitaire touchait des audiences qui ne franchiraient jamais la porte.",
    },
    solution: {
      number: '02',
      title: 'Des campagnes locales, club par club',
      text: "Campagnes Facebook et Instagram ciblées dans un rayon de 15 km pour générer des inscriptions qualifiées. Nous avons croisé des audiences d'intérêt fitness et le remarketing des visiteurs du nouveau site, avec des visuels et des accroches propres à chaque club.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Ciblage local',
        text: "Des audiences limitées à un rayon de 15 km autour de chaque club, pour ne payer que des impressions utiles.",
      },
      {
        number: '02',
        title: 'Créations publicitaires',
        text: 'Des visuels et des accroches déclinés par club, testés en continu pour identifier les combinaisons les plus rentables.',
      },
      {
        number: '03',
        title: 'Remarketing',
        text: "Relance des visiteurs du site qui n'ont pas laissé leurs coordonnées, avec un message centré sur la séance d'essai.",
      },
    ],
    processTitle: '5 étapes pour maximiser votre retour sur investissement',
    steps: ADS_STEPS,
    resultsTitle: 'Les résultats',
    results: [
      {
        kicker: 'Meta Ads',
        title: 'Des inscriptions à coût maîtrisé',
        text: "Un retour sur investissement de 4,2x et un coût par prospect sous la barre de l'euro, sur deux zones de chalandise distinctes.",
        metrics: [
          { value: '4,2x', label: 'de retour sur investissement' },
          { value: '0,78 €', label: 'par prospect' },
        ],
      },
    ],
    gallery: [
      {
        src: '/assets/cas/gymfit-meta-ads/meta-ads-1.webp',
        alt: 'Visuel publicitaire Meta Ads GYMFIT',
      },
      {
        src: '/assets/cas/gymfit-meta-ads/meta-ads-2.webp',
        alt: 'Second visuel publicitaire Meta Ads GYMFIT',
      },
    ],
    testimonialCompany: 'GYMFIT',
    seoTitle: 'Cas client GYMFIT | Meta Ads locales, 4,2x de ROAS',
    seoDescription:
      'Campagnes Facebook et Instagram dans un rayon de 15 km pour GYMFIT : 4,2x de retour sur investissement et 0,78 € par prospect.',
  },
  {
    slug: 'oceades-noel',
    projectSlug: 'oceades-noel',
    client: 'Les Océades',
    headline:
      'Comment nous avons boosté les ventes et la visibilité des Océades',
    intro:
      "Stratégie d'acquisition digitale multicanale pour une enseigne de bien-être et sport.",
    sector: 'Bien-être & Sport',
    duration: 'Campagne de Noël',
    services: ['Meta Ads', 'E-commerce'],
    metrics: [
      { value: '+40 %', label: 'de ventes e-commerce' },
      { value: '+75 %', label: 'de commandes' },
      { value: '+87 %', label: 'de produits vendus' },
      { value: '181', label: 'achats via Meta Ads' },
    ],
    context: {
      number: '01',
      title: 'Un potentiel digital inexploité',
      text: "La boutique en ligne et les offres de soins restaient confidentielles face au trafic en boutique. Aucune campagne structurée ne portait les temps forts commerciaux, et la période de Noël, la plus rentable de l'année, passait sans dispositif publicitaire.",
    },
    solution: {
      number: '02',
      title: 'Une campagne de Noël pensée pour convertir',
      text: "Nous avons bâti une stratégie Meta Ads sur mesure pour les fêtes : ciblage affiné, tunnels de conversion structurés, visuels aux couleurs de Noël et catalogue produit optimisé. Les campagnes ont été suivies au quotidien et ajustées en continu, sur Facebook comme sur Instagram.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Conception de la campagne',
        text: "Analyse du marché, définition des objectifs de performance et élaboration d'une stratégie Meta Ads sur mesure pour la période de Noël, avec un ciblage d'audience affiné et des tunnels de conversion structurés.",
      },
      {
        number: '02',
        title: 'Création de la campagne',
        text: "Réalisation de visuels publicitaires engageants adaptés à l'univers des fêtes, rédaction des accroches, paramétrage des audiences et mise en place du catalogue produit optimisé pour maximiser les conversions.",
      },
      {
        number: '03',
        title: 'Publication & suivi',
        text: 'Lancement des campagnes sur Facebook et Instagram, suivi quotidien des performances, optimisation continue des enchères et des audiences pour garantir un retour sur investissement optimal.',
      },
    ],
    processTitle: '5 étapes pour maximiser votre retour sur investissement',
    steps: ADS_STEPS,
    resultsTitle: 'Les résultats',
    results: [
      {
        kicker: 'E-commerce',
        title: '+40 % de ventes e-commerce pendant les fêtes',
        text: "La campagne de Noël a tiré la boutique en ligne sur les trois indicateurs suivis : chiffre d'affaires, nombre de commandes et volume de produits vendus.",
        metrics: [
          {
            value: '+40 %',
            label: 'de ventes sur la boutique e-commerce',
            note: 'vs. année précédente',
          },
          {
            value: '+75 %',
            label: 'de commandes',
            note: 'vs. année précédente',
          },
          {
            value: '+87 %',
            label: 'de produits vendus',
            note: 'vs. année précédente',
          },
          { value: '13 €', label: 'par prospect' },
        ],
      },
      {
        kicker: 'Bilan peau offert',
        title: '58 prospects en seulement 7 jours',
        text: 'Une offre de bilan peau offert, ciblée sur une audience locale intéressée par les soins du visage. Résultat : 58 prospects qualifiés en une semaine à un coût maîtrisé.',
        metrics: [
          { value: '58', label: 'prospects' },
          { value: '3,25 €', label: 'coût par prospect' },
        ],
      },
      {
        kicker: 'Pilates Reformer',
        title: '173 prospects à 3,06 € par lead',
        text: 'Campagne dédiée à la promotion des cours de Pilates Reformer. Un ciblage précis et des visuels engageants pour générer un volume élevé de prospects qualifiés.',
        metrics: [
          { value: '173', label: 'prospects' },
          { value: '3,06 €', label: 'coût par prospect' },
        ],
      },
    ],
    gallery: [
      {
        src: '/assets/cas/oceades-noel/offre-noel-1.webp',
        alt: "Visuel publicitaire de l'offre de Noël Les Océades",
      },
      {
        src: '/assets/cas/oceades-noel/offre-noel-2.webp',
        alt: 'Second visuel de la campagne de Noël Les Océades',
      },
      {
        src: '/assets/cas/oceades-noel/offre-noel-3.webp',
        alt: 'Troisième visuel de la campagne de Noël Les Océades',
      },
      {
        src: '/assets/cas/oceades-noel/bilan-peau.webp',
        alt: 'Visuel de la campagne bilan peau offert',
      },
      {
        src: '/assets/cas/oceades-noel/reformer.webp',
        alt: 'Visuel de la campagne Pilates Reformer',
      },
    ],
    testimonialCompany: 'Les Océades',
    seoTitle: 'Cas client Les Océades | +40 % de ventes e-commerce à Noël',
    seoDescription:
      'Campagne Meta Ads de Noël pour Les Océades : +40 % de ventes e-commerce, +75 % de commandes et des prospects à 3,06 € sur le Pilates Reformer.',
  },
  {
    slug: 'oceades-seo',
    projectSlug: 'oceades-seo',
    client: 'Les Océades',
    headline: '+182 % de trafic organique pour Les Océades',
    intro:
      'Référencement local et optimisation continue des campagnes Google Ads pour une enseigne de bien-être et sport du Mans.',
    sector: 'Bien-être & Sport',
    duration: 'Continu',
    services: ['SEO local', 'Google Ads'],
    metrics: [
      { value: '352', label: 'mots-clés positionnés' },
      { value: '80 %', label: 'des mots-clés en top 10' },
      { value: '+182 %', label: 'de trafic organique' },
      { value: '÷2,6', label: 'sur le coût par formulaire' },
    ],
    context: {
      number: '01',
      title: 'Un institut bien implanté mais peu visible',
      text: "Les Océades sont une référence du bien-être au Mans, mais les recherches locales sur les soins, la beauté et le sport renvoyaient d'abord vers des enseignes nationales. Le trafic organique plafonnait, et chaque formulaire obtenu via Google Ads coûtait plus de 25 €.",
    },
    solution: {
      number: '02',
      title: 'Le SEO local et Google Ads pilotés ensemble',
      text: "Stratégie de référencement naturel pour positionner Les Océades sur des mots-clés stratégiques liés à l'institut de beauté, aux soins et au bien-être. En parallèle, optimisation continue des campagnes Google Ads Search pour réduire le coût par formulaire et maximiser la rentabilité.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Référencement local',
        text: 'Pages de soins et fiches établissement optimisées sur les requêtes du Mans, avec un maillage interne qui pousse les prestations les plus rentables.',
      },
      {
        number: '02',
        title: 'Contenu',
        text: 'Articles et pages services rédigés autour des intentions de recherche réelles, pour couvrir chaque famille de soins et alimenter la notoriété locale.',
      },
      {
        number: '03',
        title: 'Google Ads Search',
        text: 'Restructuration du compte, gestion fine des enchères et des mots-clés négatifs, avec un suivi hebdomadaire du coût par formulaire.',
      },
    ],
    processTitle: '5 étapes pour installer une visibilité durable',
    steps: [
      {
        title: 'Audit',
        text: 'Analyse du positionnement actuel et de la concurrence locale',
      },
      {
        title: 'Stratégie',
        text: 'Choix des mots-clés prioritaires et des pages à travailler',
      },
      {
        title: 'Création',
        text: 'Rédaction et optimisation des pages, contenus et fiches',
      },
      {
        title: 'Lancement',
        text: 'Mise en ligne des optimisations et des campagnes Search',
      },
      {
        title: 'Optimisation',
        text: 'Suivi des positions et ajustements en continu',
      },
    ],
    resultsTitle: 'Les résultats',
    results: [
      {
        kicker: 'Google Ads',
        title: 'Coût par formulaire divisé par 2,6',
        text: "L'optimisation continue des campagnes Search a fait chuter le coût d'acquisition sur les deux campagnes principales, à volume de demandes constant.",
        metrics: [
          {
            value: '25,34 € puis 9,70 €',
            label: 'coût par formulaire',
            note: '-61,7 %',
          },
          {
            value: '7,94 € puis 4,93 €',
            label: 'coût par formulaire, seconde campagne',
            note: '-37,9 %',
          },
          { value: 'Le Mans', label: 'zone travaillée' },
        ],
      },
    ],
    ranking: {
      title: 'SEO local',
      total: '352 mots-clés positionnés sur Google',
      rows: [
        { label: 'TOP 1', share: '30%', count: '106' },
        { label: 'TOP 3', share: '56%', count: '198' },
        { label: 'TOP 5', share: '64%', count: '226' },
        { label: 'TOP 10', share: '80%', count: '281' },
        { label: 'TOP 30', share: '91%', count: '321' },
      ],
      growth: '+182 % de trafic organique',
    },
    testimonialCompany: 'Les Océades',
    seoTitle: 'Cas client Les Océades | SEO local, +182 % de trafic organique',
    seoDescription:
      '352 mots-clés positionnés pour Les Océades, 80 % en top 10, +182 % de trafic organique et un coût par formulaire Google Ads divisé par 2,6.',
  },
  {
    slug: 'beauregard-kid-fitness',
    projectSlug: 'beauregard-kid-fitness',
    client: 'Parc de Beauregard',
    headline:
      "Comment nous avons boosté l'acquisition de Kid Fitness grâce à Meta Ads",
    intro:
      'Campagnes Meta Ads locales pour remplir les stages et les événements Kid Fitness du Parc de Beauregard, avec des budgets quotidiens réduits.',
    sector: 'Sport enfant',
    duration: 'Continu',
    services: ['Meta Ads'],
    metrics: [
      {
        value: '1,23 €',
        label: 'par prospect',
        note: 'journée portes ouvertes',
      },
      { value: '182', label: 'prospects', note: 'stages de février' },
      { value: '20 €', label: 'par jour de budget' },
      { value: '81', label: 'prospects avec 5 € par jour' },
    ],
    context: {
      number: '01',
      title: 'Une visibilité insuffisante',
      text: "Kid Fitness proposait déjà des stages et des événements de qualité, mais peu de parents du secteur en connaissaient l'existence. Les inscriptions reposaient sur le bouche-à-oreille, avec des sessions difficiles à remplir et aucun canal d'acquisition prévisible.",
    },
    solution: {
      number: '02',
      title: 'Une stratégie Meta Ads ciblée et rentable',
      text: "Nous avons construit des audiences de parents dans un rayon serré autour du parc, puis déployé plusieurs campagnes en parallèle pour couvrir la notoriété, la découverte et la génération de leads. Chaque temps fort, anniversaires, stages, portes ouvertes, dispose de sa campagne et de son budget quotidien.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Ciblage parents qualifié',
        text: "Des audiences précisément construites pour toucher les parents d'enfants en âge de pratiquer, dans un rayon géographique ciblé autour du Parc Beauregard.",
      },
      {
        number: '02',
        title: 'Campagnes multi-objectifs',
        text: "Plusieurs campagnes déployées en parallèle, notoriété, découverte et génération de leads, pour couvrir l'ensemble du tunnel d'acquisition de Kid Fitness.",
      },
      {
        number: '03',
        title: 'Leads à petit budget',
        text: "Optimisation continue des campagnes pour maximiser le nombre de prospects générés, même avec des budgets réduits : jusqu'à 81 leads à 2,32 € avec seulement 5 € par jour.",
      },
    ],
    processTitle: '5 étapes pour lancer des campagnes qui convertissent',
    steps: [
      {
        title: 'Audit',
        text: 'Analyse de la cible et de la concurrence locale',
      },
      {
        title: 'Stratégie',
        text: 'Définition des audiences et des objectifs de campagne',
      },
      {
        title: 'Création',
        text: 'Conception des visuels et des ads copy',
      },
      { title: 'Lancement', text: 'Mise en ligne des campagnes Meta Ads' },
      {
        title: 'Optimisation',
        text: 'Suivi et ajustement continu des performances',
      },
    ],
    resultsTitle: 'Des campagnes qui génèrent de vrais prospects',
    results: [
      {
        kicker: 'Campagne anniversaire, janvier 2026',
        title: '81 prospects générés avec 5 € par jour',
        text: "La preuve qu'un petit budget peut générer de grands résultats quand le ciblage est bon.",
        metrics: [
          { value: '2,32 €', label: 'coût par prospect' },
          { value: '60 494', label: 'impressions' },
          { value: '15 640', label: 'personnes touchées' },
        ],
      },
      {
        kicker: 'Stages de février',
        title: '182 prospects pour les stages sportifs',
        text: 'Campagne ciblant les parents pour les stages sportifs de février. 20 € par jour de budget pour 182 leads générés.',
        metrics: [
          { value: '182', label: 'prospects' },
          { value: '4,13 €', label: 'par prospect' },
          { value: '155 959', label: 'impressions' },
          { value: '697 €', label: 'dépensés' },
        ],
      },
      {
        kicker: 'Journée portes ouvertes, mars 2026',
        title: '46 prospects à 1,23 € le prospect',
        text: 'Campagne Journée Portes Ouvertes ciblant les familles. 20 € par jour de budget pour 46 leads à 1,23 € le prospect.',
        metrics: [
          { value: '46', label: 'prospects' },
          { value: '1,23 €', label: 'par prospect' },
          { value: '16 230', label: 'impressions' },
          { value: '51 €', label: 'dépensés' },
        ],
      },
    ],
    gallery: [
      {
        src: '/assets/cas/beauregard-kid-fitness/kid-fitness-1.webp',
        alt: 'Visuel publicitaire Kid Fitness au Parc de Beauregard',
      },
      {
        src: '/assets/cas/beauregard-kid-fitness/kid-fitness-2.webp',
        alt: 'Second visuel publicitaire Kid Fitness',
      },
      {
        src: '/assets/cas/beauregard-kid-fitness/kid-fitness-3.webp',
        alt: 'Troisième visuel publicitaire Kid Fitness',
      },
    ],
    seoTitle: 'Cas client Kid Fitness | Meta Ads, prospects à 1,23 €',
    seoDescription:
      'Campagnes Meta Ads pour Kid Fitness au Parc de Beauregard : 182 prospects sur les stages de février et 46 prospects à 1,23 € pour la journée portes ouvertes.',
  },
  {
    slug: 'epicure-pilates',
    projectSlug: 'epicure-pilates',
    client: 'Epicure Social Club',
    headline: "Comment nous avons lancé l'offre Pilates Reformer d'Epicure",
    intro:
      'Stratégie de publicité Facebook ciblée sur le Pilates Reformer pour générer des leads qualifiés.',
    sector: 'Fitness',
    duration: '4 semaines',
    services: ['Meta Ads'],
    metrics: [
      { value: '56', label: 'prospects générés' },
      { value: '4 €', label: 'par prospect' },
      { value: 'x5,8', label: 'de retour sur investissement' },
      { value: '+60 %', label: 'de leads vs campagnes précédentes' },
    ],
    context: {
      number: '01',
      title: 'Des publicités qui ne convertissaient pas',
      text: "Les campagnes précédentes tournaient sans ciblage clair et renvoyaient vers des parcours trop longs. Le nouvel équipement Pilates Reformer devait pourtant se remplir vite, avec un coût par prospect compatible avec le prix des séances.",
    },
    solution: {
      number: '02',
      title: 'Une campagne Facebook Ads structurée',
      text: "Nous avons opposé deux audiences, une audience Avatar très précise et une audience Broad, sur des visuels et des accroches dédiés au Pilates Reformer. Le formulaire natif Facebook capte les prospects sans friction, et les budgets ont été arbitrés chaque jour selon le coût par lead.",
    },
    deliverables: [
      {
        number: '01',
        title: 'Stratégie & ciblage',
        text: "Analyse du marché local, définition des personas et construction de deux audiences distinctes : une audience Avatar (profil précis intéressé par le Pilates Reformer) et une audience Broad, pour maximiser la portée tout en gardant un coût par lead maîtrisé.",
      },
      {
        number: '02',
        title: 'Création des publicités',
        text: "Conception des visuels publicitaires et rédaction des accroches adaptées à l'offre Pilates Reformer d'Epicure. Mise en place d'un formulaire de génération de leads natif Facebook pour capter les prospects directement dans leur fil d'actualité, sans friction.",
      },
      {
        number: '03',
        title: 'Lancement & optimisation',
        text: 'Mise en ligne des campagnes sur Facebook, suivi quotidien des performances et optimisation en continu des audiences et des budgets. En 4 semaines, la campagne a généré 56 prospects à un coût moyen de 4 € par lead avec un ROAS de x5,8.',
      },
    ],
    processTitle:
      '5 étapes pour générer des leads qualifiés à coût maîtrisé',
    steps: [
      {
        title: 'Audit',
        text: 'Analyse des campagnes Facebook existantes et identification des freins à la conversion',
      },
      {
        title: 'Stratégie',
        text: "Définition des audiences Avatar et Broad ciblées sur l'offre Pilates Reformer",
      },
      {
        title: 'Création',
        text: 'Conception des visuels et rédaction des accroches adaptées à chaque audience',
      },
      {
        title: 'Lancement',
        text: 'Mise en ligne des campagnes avec formulaire natif Facebook pour capter les leads sans friction',
      },
      {
        title: 'Optimisation',
        text: 'Suivi quotidien des performances et ajustements pour atteindre 4 € par lead',
      },
    ],
    resultsTitle: '+60 % de leads qualifiés en 4 semaines',
    results: [
      {
        kicker: 'Génération de leads',
        title: '56 prospects générés en seulement 4 semaines',
        text: "Une campagne d'acquisition ciblée pour générer un volume de leads qualifiés tout en maîtrisant parfaitement les coûts par acquisition.",
        metrics: [
          { value: '56', label: 'prospects' },
          { value: '4 €', label: 'coût par prospect' },
        ],
      },
      {
        kicker: 'Performance',
        title: '+60 % de leads vs campagnes précédentes',
        text: "Optimisation continue des visuels et du ciblage ayant permis d'exploser le retour sur investissement des campagnes publicitaires.",
        metrics: [
          { value: 'x5,8', label: 'de retour sur investissement' },
          { value: '+60 %', label: 'vs campagnes précédentes' },
        ],
      },
    ],
    gallery: [
      {
        src: '/assets/cas/epicure-pilates/publicite-1.webp',
        alt: 'Visuel publicitaire Pilates Reformer Epicure',
      },
      {
        src: '/assets/cas/epicure-pilates/publicite-2.webp',
        alt: 'Second visuel publicitaire Pilates Reformer Epicure',
      },
    ],
    testimonialCompany: 'Epicure Social Club',
    seoTitle: 'Cas client Epicure | Meta Ads Pilates Reformer, 56 prospects',
    seoDescription:
      "Lancement de l'offre Pilates Reformer d'Epicure Social Club : 56 prospects à 4 € en 4 semaines, ROAS x5,8 et +60 % de leads.",
  },
]

/** Retrouve un cas par son slug d'URL. */
export function getCase(slug?: string): CaseStudy | undefined {
  if (!slug) return undefined
  return CASES.find((item) => item.slug === slug)
}

/** Les n cas suivants, pour la section « Autres réalisations ». */
export function getOtherCases(slug: string, n = 3): CaseStudy[] {
  const index = CASES.findIndex((item) => item.slug === slug)
  if (index < 0) return CASES.slice(0, n)
  const rotated = [...CASES.slice(index + 1), ...CASES.slice(0, index)]
  return rotated.slice(0, n)
}
