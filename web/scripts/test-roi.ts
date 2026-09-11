/**
 * Verification du lot 5 : les formules du simulateur de ROI.
 *
 * Usage : pnpm exec tsx scripts/test-roi.ts
 *
 * Cinq cas calcules a la main a partir de `roi-calculator.js`, valeurs
 * attendues ecrites en dur. Le script sort en code 1 au premier ecart,
 * il ne touche ni la base ni le reseau.
 */
import {
  computeRoi,
  formatCurrency,
  formatPercent,
  validateRetention,
  type RoiInput,
} from '../src/site/tools/roi/compute'
import { ROI_ERRORS } from '../src/site/tools/roi/texts'

/** Valeurs attendues d'un cas de test. */
interface Attendu {
  clics: number
  leads: number
  clients: number
  ca: number
  roi: number
  cac: number
  profit: number
  ticketLTV: number
  optClics: number
  optLeads: number
  optClients: number
  optCa: number
  optRoi: number
  /** Titres des cartes de diagnostic, dans l'ordre ; liste vide si aucun. */
  diagnostic: string[]
}

interface Cas {
  nom: string
  input: RoiInput
  attendu: Attendu
}

/**
 * Les cinq cas.
 *
 * 1. meta / b2b, abonnement mensuel de 12 mois : verifie la valeur vie
 *    client et les deux scenarios.
 * 2. google / juridique, achat unique : ROI faible mais positif.
 * 3. google / juridique, petit budget : les deux ROI negatifs, trois
 *    causes plus le conseil.
 * 4. google / b2b : ROI brut negatif, ROI optimise positif.
 * 5. meta / restauration, visites recurrentes : plancher de clients et
 *    forts volumes.
 */
const CAS: Cas[] = [
  {
    nom: 'meta / b2b / 1 000 € / 2 000 € / mensuel 12',
    input: {
      platform: 'meta',
      secteur: 'b2b',
      budget: 1000,
      ticket: 2000,
      recurrence: 'mensuel',
      retention: 12,
    },
    attendu: {
      clics: 606,
      leads: 56,
      clients: 7,
      ca: 168000,
      roi: 16700,
      cac: 1000 / 7,
      profit: 167000,
      ticketLTV: 24000,
      optClics: 866,
      optLeads: 113,
      optClients: 16,
      optCa: 384000,
      optRoi: 38300,
      diagnostic: [],
    },
  },
  {
    nom: 'google / juridique / 2 000 € / 1 500 € / unique',
    input: {
      platform: 'google',
      secteur: 'juridique',
      budget: 2000,
      ticket: 1500,
      recurrence: 'unique',
      retention: 0,
    },
    attendu: {
      clics: 294,
      leads: 11,
      clients: 2,
      ca: 3000,
      roi: 50,
      cac: 1000,
      profit: 1000,
      ticketLTV: 1500,
      optClics: 420,
      optLeads: 22,
      optClients: 4,
      optCa: 6000,
      optRoi: 200,
      diagnostic: [],
    },
  },
  {
    nom: 'google / juridique / 200 € / 50 € / unique (ROI negatif)',
    input: {
      platform: 'google',
      secteur: 'juridique',
      budget: 200,
      ticket: 50,
      recurrence: 'unique',
      retention: 0,
    },
    attendu: {
      clics: 29,
      leads: 1,
      clients: 1,
      ca: 50,
      roi: -75,
      cac: 200,
      profit: -150,
      ticketLTV: 50,
      optClics: 42,
      optLeads: 2,
      optClients: 1,
      optCa: 50,
      optRoi: -75,
      diagnostic: [
        'Panier moyen trop bas',
        'Coût par clic élevé dans votre secteur',
        'Budget insuffisant pour optimiser',
        "Ce qu'il faudrait pour être rentable",
      ],
    },
  },
  {
    nom: 'google / b2b / 1 000 € / 400 € / unique (brut negatif, optimise positif)',
    input: {
      platform: 'google',
      secteur: 'b2b',
      budget: 1000,
      ticket: 400,
      recurrence: 'unique',
      retention: 0,
    },
    attendu: {
      clics: 238,
      leads: 11,
      clients: 2,
      ca: 800,
      roi: -20,
      cac: 500,
      profit: -200,
      ticketLTV: 400,
      optClics: 340,
      optLeads: 21,
      optClients: 5,
      optCa: 2000,
      optRoi: 100,
      diagnostic: [
        "Les leviers d'amélioration existent",
        "Ce qu'il faudrait pour être rentable",
      ],
    },
  },
  {
    nom: 'meta / restauration / 500 € / 25 € / visite 8',
    input: {
      platform: 'meta',
      secteur: 'restauration',
      budget: 500,
      ticket: 25,
      recurrence: 'visite',
      retention: 8,
    },
    attendu: {
      clics: 735,
      leads: 132,
      clients: 73,
      ca: 14600,
      roi: 2820,
      cac: 500 / 73,
      profit: 14100,
      ticketLTV: 200,
      optClics: 1050,
      optLeads: 265,
      optClients: 175,
      optCa: 35000,
      optRoi: 6900,
      diagnostic: [],
    },
  },
]

let echecs = 0

/** Compare une valeur numerique a son attendu (tolerance de 1e-9). */
function verifier(cas: string, champ: string, obtenu: number, attendu: number): void {
  const ecart = Math.abs(obtenu - attendu)
  if (ecart > 1e-9) {
    echecs += 1
    console.error(`  ECHEC ${cas} / ${champ} : obtenu ${obtenu}, attendu ${attendu}`)
  }
}

/** Compare deux listes de chaines. */
function verifierListe(
  cas: string,
  champ: string,
  obtenu: string[],
  attendu: string[],
): void {
  const memeTaille = obtenu.length === attendu.length
  const memeContenu = memeTaille && obtenu.every((valeur, i) => valeur === attendu[i])
  if (!memeContenu) {
    echecs += 1
    console.error(
      `  ECHEC ${cas} / ${champ} :\n    obtenu  ${JSON.stringify(obtenu)}\n    attendu ${JSON.stringify(attendu)}`,
    )
  }
}

for (const cas of CAS) {
  const resultat = computeRoi(cas.input)
  const { brut, optimise, diagnostic } = resultat
  const a = cas.attendu

  verifier(cas.nom, 'clics', brut.clics, a.clics)
  verifier(cas.nom, 'leads', brut.leads, a.leads)
  verifier(cas.nom, 'clients', brut.clients, a.clients)
  verifier(cas.nom, 'ca', brut.ca, a.ca)
  verifier(cas.nom, 'roi', brut.roi, a.roi)
  verifier(cas.nom, 'cac', brut.cac, a.cac)
  verifier(cas.nom, 'profit', brut.profit, a.profit)
  verifier(cas.nom, 'ticketLTV', brut.ticketLTV, a.ticketLTV)
  verifier(cas.nom, 'optimise.clics', optimise.clics, a.optClics)
  verifier(cas.nom, 'optimise.leads', optimise.leads, a.optLeads)
  verifier(cas.nom, 'optimise.clients', optimise.clients, a.optClients)
  verifier(cas.nom, 'optimise.ca', optimise.ca, a.optCa)
  verifier(cas.nom, 'optimise.roi', optimise.roi, a.optRoi)
  verifierListe(
    cas.nom,
    'diagnostic',
    (diagnostic?.reasons ?? []).map((raison) => raison.title),
    a.diagnostic,
  )

  console.log(
    `${a.diagnostic.length === 0 ? 'OK  ' : 'OK  '}${cas.nom}\n` +
      `    brut      ROI ${brut.roi}% | CA ${formatCurrency(brut.ca)} | ${brut.clients} client(s) | CAC ${formatCurrency(brut.cac)}\n` +
      `    optimise  ROI ${optimise.roi}% | CA ${formatCurrency(optimise.ca)} | ${optimise.clients} client(s)\n` +
      `    periode   ${resultat.periode ?? 'aucune'}\n` +
      `    diagnostic ${diagnostic ? diagnostic.title : 'aucun'}`,
  )
}

/* Bornes de la retention : mensuel 1-60, annuel 1-10, visite 1-100. */
const BORNES: { recurrence: 'mensuel' | 'annuel' | 'visite'; valeur: number; attendu: string | null }[] = [
  { recurrence: 'mensuel', valeur: 60, attendu: null },
  { recurrence: 'mensuel', valeur: 61, attendu: ROI_ERRORS.retentionMensuel },
  { recurrence: 'annuel', valeur: 10, attendu: null },
  { recurrence: 'annuel', valeur: 11, attendu: ROI_ERRORS.retentionAnnuel },
  { recurrence: 'visite', valeur: 100, attendu: null },
  { recurrence: 'visite', valeur: 101, attendu: ROI_ERRORS.retentionVisite },
  { recurrence: 'mensuel', valeur: 0, attendu: ROI_ERRORS.retentionManquante },
]

for (const borne of BORNES) {
  const obtenu = validateRetention(borne.recurrence, borne.valeur)
  if (obtenu !== borne.attendu) {
    echecs += 1
    console.error(
      `  ECHEC retention ${borne.recurrence} ${borne.valeur} : obtenu ${obtenu}, attendu ${borne.attendu}`,
    )
  }
}
console.log(`OK  bornes de retention (${BORNES.length} controles)`)

/* Formatage francais. */
if (formatPercent(9.3) !== '9,3 %') {
  echecs += 1
  console.error(`  ECHEC formatPercent : ${formatPercent(9.3)}`)
}
if (!formatCurrency(168000).endsWith('€')) {
  echecs += 1
  console.error(`  ECHEC formatCurrency : ${formatCurrency(168000)}`)
}
console.log(`OK  formatage (${formatCurrency(168000)}, ${formatPercent(9.3)})`)

if (echecs > 0) {
  console.error(`\n${echecs} ecart(s) detecte(s).`)
  process.exit(1)
}
console.log('\n5 cas verifies, aucun ecart.')
