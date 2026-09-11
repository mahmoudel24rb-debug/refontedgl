/**
 * Tests unitaires du moteur de visibilite IA (lot 6).
 *
 * Ni base de donnees ni reseau : normalisation, rapprochement de noms,
 * score, podium, rapport et un scan complet avec les moteurs factices.
 *
 * Usage : pnpm exec tsx scripts/test-geoscan.ts
 */

import {
  namesMatch,
  normalize,
  normalizeName,
  sourcesMatch,
  STOPWORDS,
} from '../src/lib/geoscan/normalize'
import { evaluate, rankWeight, type ScanResults } from '../src/lib/geoscan/scoring'
import { buildPrompts, NB_PROMPTS, PROMPT_TEMPLATES } from '../src/lib/geoscan/prompts'
import { buildReport, podiumTexte } from '../src/lib/geoscan/report'
import { collectResponses } from '../src/lib/geoscan/engine'
import { createFakeClients, getFakeCallCount } from '../src/lib/geoscan/fake-clients'

let reussites = 0
let echecs = 0

/** Verifie une condition et journalise le resultat. */
function verifier(titre: string, condition: boolean, detail?: unknown): void {
  if (condition) {
    reussites += 1
    console.log(`  ok   ${titre}`)
    return
  }
  echecs += 1
  console.error(`  ECHEC ${titre}${detail === undefined ? '' : ` : ${JSON.stringify(detail)}`}`)
}

/** Compare deux valeurs et journalise l'ecart. */
function egal(titre: string, obtenu: unknown, attendu: unknown): void {
  verifier(titre, JSON.stringify(obtenu) === JSON.stringify(attendu), {
    obtenu,
    attendu,
  })
}

/** Fabrique une reponse de scan. */
function reponse(
  moteur: string,
  entreprises: { nom: string; rang: number }[],
  sources: string[] = [],
): ScanResults['reponses'][number] {
  return { moteur, prompt: 'question', texte: 'texte', sources, entreprises }
}

async function main(): Promise<void> {
  // Les moteurs factices simulent la duree d'un appel reseau : inutile ici.
  process.env.GEOSCAN_FAKE_DELAY_MS = '0'

  /* ---------------------------------------------------------------- */
  console.log('\n1. Normalisation')
  egal('accents et ponctuation', normalize('Éts. Dupont & Fils'), 'ets dupont fils')
  egal('espaces multiples', normalize('  LA   Mie   Dorée  '), 'la mie doree')
  egal('dix neuf mots vides', STOPWORDS.length, 19)
  egal('formes juridiques retirees', normalizeName('SARL Dupont'), 'dupont')
  egal('article retire', normalizeName('Le Fournil des Halles'), 'fournil halles')
  egal('nom entierement vide', normalizeName('SARL'), '')

  /* ---------------------------------------------------------------- */
  console.log('\n2. Rapprochement de noms')
  verifier('SARL Dupont correspond a dupont cite', namesMatch('SARL Dupont', 'dupont'))
  verifier(
    'accents et casse ignores',
    namesMatch('Boulangerie Doré', 'BOULANGERIE DORE'),
  )
  verifier(
    'espaces ignores',
    namesMatch('Chez Jean Pierre', 'chezjeanpierre'),
  )
  verifier(
    'containment sous cinq caracteres refuse',
    !namesMatch('Toto', 'Toto Pizza Tours'),
    { a: normalizeName('Toto'), b: normalizeName('Toto Pizza Tours') },
  )
  verifier(
    'nom vide apres mots vides : jamais de correspondance',
    !namesMatch('SARL', 'SAS'),
  )
  // Le PHP accepte ce rapprochement : martin fait six caracteres, donc
  // le containment s'applique (DGLGS_Scoring::names_match).
  verifier(
    'Boulangerie Martin correspond a Martin (containment >= 5)',
    namesMatch('Boulangerie Martin', 'Martin'),
  )
  verifier(
    'deux enseignes distinctes ne correspondent pas',
    !namesMatch('Boulangerie Martin', 'Boulangerie Dupont'),
  )

  /* ---------------------------------------------------------------- */
  console.log('\n3. Sources')
  verifier(
    'domaine de l entreprise reconnu',
    sourcesMatch('Boulangerie Martin', [
      'https://www.pagesjaunes.fr/annuaire/tours/boulanger',
      'https://www.boulangerie-martin-tours.fr/contact',
    ]),
  )
  verifier(
    'aucune source correspondante',
    !sourcesMatch('Boulangerie Martin', ['https://www.google.com/maps/search/boulanger']),
  )
  verifier('nom trop court : refus', !sourcesMatch('AB', ['https://ab.fr/']))
  verifier('url illisible ignoree', !sourcesMatch('Boulangerie Martin', ['pas-une-url']))

  /* ---------------------------------------------------------------- */
  console.log('\n4. Poids de rang')
  egal('rang 1', rankWeight(1), 1)
  egal('rang 2', rankWeight(2), 0.75)
  egal('rang 3', rankWeight(3), 0.55)
  egal('rang 4', rankWeight(4), 0.4)
  egal('rang 9', rankWeight(9), 0.3)

  /* ---------------------------------------------------------------- */
  console.log('\n5. Score')
  const parfait: ScanResults = {
    reponses: [
      reponse('gemini', [{ nom: 'Boulangerie Martin', rang: 1 }], [
        'https://www.boulangerie-martin-tours.fr/',
      ]),
      reponse('perplexity', [{ nom: 'Boulangerie Martin', rang: 1 }]),
    ],
  }
  const scoreParfait = evaluate(parfait, 'Boulangerie Martin')
  egal('score maximal', scoreParfait.score, 100)
  egal('presence a 100', scoreParfait.presence, 100)
  egal('sources reconnues', scoreParfait.sourcesOk, true)

  const absent: ScanResults = {
    reponses: [
      reponse('gemini', [{ nom: 'Boulangerie Dupont', rang: 1 }]),
      reponse('perplexity', [{ nom: 'Boulangerie Dupont', rang: 1 }]),
    ],
  }
  const scoreAbsent = evaluate(absent, 'Boulangerie Leroy')
  egal('score minimal', scoreAbsent.score, 0)
  egal('aucune citation', scoreAbsent.citedCount, 0)
  egal('un concurrent devant', scoreAbsent.devant, 1)

  // 50 * 0,5 + 30 * 0,75 + 0 = 47,5 arrondi a 48.
  const partiel: ScanResults = {
    reponses: [
      reponse('gemini', [
        { nom: 'Boulangerie Dupont', rang: 1 },
        { nom: 'Boulangerie Leroy', rang: 2 },
      ]),
      reponse('perplexity', [{ nom: 'Boulangerie Dupont', rang: 1 }]),
    ],
  }
  const scorePartiel = evaluate(partiel, 'Boulangerie Leroy')
  egal('score intermediaire', scorePartiel.score, 48)
  egal('presence a 50', scorePartiel.presence, 50)
  egal('poids de rang moyen a 75', scorePartiel.rankAvg, 75)

  egal('scan vide : score nul', evaluate({ reponses: [] }, 'Test').score, 0)
  egal('scan vide : total nul', evaluate({ reponses: [] }, 'Test').total, 0)
  egal('resultats absents', evaluate(null, 'Test').score, 0)

  /* ---------------------------------------------------------------- */
  console.log('\n6. Podium et concurrents')
  const concurrence: ScanResults = {
    reponses: [
      reponse('gemini', [
        { nom: 'Boulangerie Dupont', rang: 1 },
        { nom: 'Boulangerie Leroy', rang: 2 },
        { nom: 'Maison Bernard', rang: 3 },
      ]),
      reponse('gemini', [
        { nom: 'Boulangerie Leroy', rang: 1 },
        { nom: 'Boulangerie Dupont', rang: 2 },
      ]),
      reponse('perplexity', [
        { nom: 'Boulangerie Dupont', rang: 2 },
        { nom: 'Boulangerie Martin', rang: 3 },
      ]),
    ],
  }
  const evaluation = evaluate(concurrence, 'Boulangerie Martin')
  egal(
    'podium trie par citations puis rang',
    evaluation.podium.map((concurrent) => concurrent.nom),
    ['Boulangerie Dupont', 'Boulangerie Leroy', 'Maison Bernard'],
  )
  egal('meilleur rang conserve', evaluation.podium[0]?.bestRang, 1)
  egal(
    'moteurs dedoublonnes',
    evaluation.podium[0]?.moteurs,
    ['gemini', 'perplexity'],
  )
  egal('citations de l entreprise', evaluation.citedCount, 1)
  egal('concurrents devant', evaluation.devant, 2)
  egal(
    'entreprise inconnue : quatre concurrents',
    evaluate(concurrence, 'Enseigne Inconnue').podium.length,
    4,
  )
  const foule: ScanResults = {
    reponses: [
      reponse(
        'gemini',
        ['Alpha Tours', 'Beta Tours', 'Gamma Tours', 'Delta Tours', 'Epsilon Tours', 'Zeta Tours', 'Eta Tours'].map(
          (nom, index) => ({ nom, rang: index + 1 }),
        ),
      ),
    ],
  }
  egal(
    'podium limite a cinq',
    evaluate(foule, 'Enseigne Inconnue').podium.length,
    5,
  )

  /* ---------------------------------------------------------------- */
  console.log('\n7. Questions localisees')
  egal('huit gabarits', PROMPT_TEMPLATES.length, 8)
  const questions = buildPrompts('boulanger', 'Tours')
  egal('quatre questions par defaut', questions.length, NB_PROMPTS)
  egal(
    'premiere question',
    questions[0],
    'Quel est le meilleur boulanger à Tours ?',
  )
  egal('minimum de trois questions', buildPrompts('x', 'y', 1).length, 3)
  egal('maximum de huit questions', buildPrompts('x', 'y', 50).length, 8)

  /* ---------------------------------------------------------------- */
  console.log('\n8. Rapport complet')
  const rapport = buildReport(concurrence, evaluation, 'Boulangerie Martin')
  egal('statut du rapport', rapport.status, 'unlocked')
  egal('detail moteur n°1', rapport.moteurs.gemini, { total: 2, cited: 0 })
  egal('detail moteur n°2', rapport.moteurs.perplexity, { total: 1, cited: 1 })
  verifier('plan d action non vide', rapport.recos.length > 0)
  verifier(
    'recommandation sources presente',
    rapport.recos.some((reco) => reco.includes('citabilité')),
  )
  verifier('podium texte numerote', podiumTexte(rapport.podium).startsWith('1. '))

  const bon = evaluate(parfait, 'Boulangerie Martin')
  egal(
    'une seule recommandation quand tout va bien',
    buildReport(parfait, bon, 'Boulangerie Martin').recos.length,
    1,
  )

  /* ---------------------------------------------------------------- */
  console.log('\n9. Scan complet avec les moteurs factices')
  const clients = createFakeClients()
  const etapes: string[] = []
  const collecte = await collectResponses('boulanger', 'Tours', clients, (progress) => {
    etapes.push(progress.label)
  })

  // 4 questions x (2 repetitions moteur n°2 + 1 moteur n°1) = 12 reponses.
  egal('douze reponses collectees', collecte.reponses.length, 12)
  verifier('cout estime positif', collecte.coutCents > 0, collecte.coutCents)
  verifier('progression ecrite entre les lots', etapes.length >= 4, etapes)
  verifier(
    'aucun libelle ne nomme un fournisseur',
    !etapes.some((label) => /gemini|perplexity/i.test(label)),
    etapes,
  )
  verifier(
    'chaque reponse porte des entreprises',
    collecte.reponses.every((item) => (item.entreprises ?? []).length >= 3),
  )
  verifier('appels factices comptes', getFakeCallCount() >= 13, getFakeCallCount())

  const resultats: ScanResults = { reponses: collecte.reponses }
  const verdict = evaluate(resultats, 'Boulangerie Martin')
  verifier('score coherent', verdict.score >= 0 && verdict.score <= 100, verdict.score)
  verifier('entreprise citee au moins une fois', verdict.citedCount > 0, verdict.citedCount)
  egal('total egal au nombre de reponses', verdict.total, 12)
  verifier('podium non vide', verdict.podium.length > 0)
  verifier(
    'podium sans l entreprise testee',
    verdict.podium.every((concurrent) => !concurrent.nom.includes('Martin')),
    verdict.podium.map((concurrent) => concurrent.nom),
  )

  const rapportFactice = buildReport(resultats, verdict, 'Boulangerie Martin')
  egal(
    'deux moteurs dans le rapport',
    Object.keys(rapportFactice.moteurs).sort(),
    ['gemini', 'perplexity'],
  )
  console.log(
    `  info score ${verdict.score}/100, cite ${verdict.citedCount}/${verdict.total}, ` +
      `sources ${verdict.sourcesOk ? 'oui' : 'non'}, devant ${verdict.devant}`,
  )

  /* ---------------------------------------------------------------- */
  console.log(`\n${reussites} succes, ${echecs} echec(s)`)
  process.exit(echecs === 0 ? 0 : 1)
}

void main()
