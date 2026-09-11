/**
 * Verification manuelle du socle partage (lot 1).
 *
 * Usage : pnpm dev:db dans un terminal, puis
 *   pnpm exec tsx scripts/test-lib.ts
 *
 * Controle consumeRateLimit (limite puis remise a zero apres la
 * fenetre), createOrUpdateLead (deduplication par email, union des
 * etiquettes, journal), buildNote et notifyAdmin sans cle Resend.
 */
import 'dotenv/config'

import { notifyAdmin } from '../src/lib/email'
import { buildNote, createOrUpdateLead } from '../src/lib/leads'
import { consumeRateLimit } from '../src/lib/rate-limit'

/** Affiche une ligne de resultat prefixee par OK ou KO. */
function verifier(libelle: string, condition: boolean, detail = ''): boolean {
  console.log(`${condition ? 'OK ' : 'KO '} ${libelle}${detail ? ` :: ${detail}` : ''}`)
  return condition
}

/** Attend le nombre de millisecondes demande. */
function attendre(ms: number): Promise<void> {
  return new Promise((resoudre) => setTimeout(resoudre, ms))
}

async function main(): Promise<void> {
  const echecs: string[] = []
  const enregistrer = (libelle: string, condition: boolean, detail = ''): void => {
    if (!verifier(libelle, condition, detail)) echecs.push(libelle)
  }

  /* ---------------------------------------------------------------- */
  console.log('\n--- consumeRateLimit : limite de 3 sur 60 s ---')
  const cle = `test:${Date.now()}`
  const verdicts = []
  for (let i = 0; i < 4; i += 1) {
    verdicts.push(await consumeRateLimit(cle, 3, 60))
  }
  verdicts.forEach((verdict, index) => {
    console.log(
      `  appel ${index + 1} : ok=${verdict.ok} count=${verdict.count} restant=${verdict.restant}`,
    )
  })
  enregistrer(
    'les 3 premiers appels passent',
    verdicts.slice(0, 3).every((verdict) => verdict.ok),
  )
  enregistrer('le 4e appel est refuse', verdicts[3]?.ok === false)

  /* ---------------------------------------------------------------- */
  console.log('\n--- consumeRateLimit : fenetre de 1 s puis remise a zero ---')
  const cleCourte = `test-court:${Date.now()}`
  const premier = await consumeRateLimit(cleCourte, 1, 1)
  const second = await consumeRateLimit(cleCourte, 1, 1)
  await attendre(1300)
  const troisieme = await consumeRateLimit(cleCourte, 1, 1)
  console.log(
    `  premier ok=${premier.ok} second ok=${second.ok} apres fenetre ok=${troisieme.ok} count=${troisieme.count}`,
  )
  enregistrer('premier appel accepte', premier.ok)
  enregistrer('second appel refuse dans la fenetre', !second.ok)
  enregistrer('compteur remis a 1 apres la fenetre', troisieme.ok && troisieme.count === 1)

  /* ---------------------------------------------------------------- */
  console.log('\n--- buildNote ---')
  const note = buildNote(
    'Analyse PageSpeed',
    [
      { lignes: ['URL : https://exemple.fr', 'Entreprise : Exemple SARL'] },
      { titre: 'Resultats', lignes: ['Mobile : 42/100', 'Ordinateur : 78/100'] },
    ],
    new Date('2026-03-04T09:05:00Z'),
  )
  console.log(note.split('\n').map((ligne) => `  | ${ligne}`).join('\n'))
  enregistrer('titre encadre', note.startsWith('=== ANALYSE PAGESPEED ==='))
  enregistrer('section encadree', note.includes('--- RESULTATS ---'))
  enregistrer('date au format francais', /Date : \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(note))

  /* ---------------------------------------------------------------- */
  console.log('\n--- createOrUpdateLead : creation puis deduplication ---')
  const email = `test-${Date.now()}@exemple.fr`
  const premierLead = await createOrUpdateLead({
    email: email.toUpperCase(),
    entreprise: 'Exemple SARL',
    source: 'pagespeed',
    tags: ['pagespeed-tool', 'rapport-debloque'],
    note: buildNote('Analyse PageSpeed', [{ lignes: ['URL : https://exemple.fr'] }]),
    donnees: { scoreMobile: 42 },
    ip: '203.0.113.10',
  })
  const secondLead = await createOrUpdateLead({
    email,
    prenom: 'Camille',
    telephone: '0255994094',
    source: 'roi',
    tags: ['calculateur-roi', 'budget-ads'],
    note: buildNote('Simulation ROI', [{ lignes: ['Budget : 1000 EUR'] }]),
    donnees: { budget: 1000 },
    consentement: true,
    ip: '203.0.113.10',
  })

  enregistrer('email normalise en minuscules', secondLead.lead.email === email.toLowerCase())
  enregistrer('un seul document', premierLead.lead.id === secondLead.lead.id)
  enregistrer('second appel marque comme dedoublonne', secondLead.dedoublonne)
  const tags = secondLead.lead.tags ?? []
  enregistrer(
    'etiquettes unies',
    ['pagespeed-tool', 'rapport-debloque', 'calculateur-roi', 'budget-ads'].every((tag) =>
      tags.includes(tag as (typeof tags)[number]),
    ),
    tags.join(', '),
  )
  enregistrer(
    'journal de longueur 2',
    (secondLead.lead.journal ?? []).length === 2,
    String((secondLead.lead.journal ?? []).length),
  )
  enregistrer(
    'champs completes sans ecrasement',
    secondLead.lead.entreprise === 'Exemple SARL' && secondLead.lead.prenom === 'Camille',
  )
  const donnees = (secondLead.lead.donnees ?? {}) as Record<string, unknown>
  enregistrer(
    'donnees fusionnees par outil',
    Boolean(donnees.pagespeed) && Boolean(donnees.roi),
    Object.keys(donnees).join(', '),
  )

  /* ---------------------------------------------------------------- */
  console.log('\n--- notifyAdmin sans cle Resend ---')
  const envoye = await notifyAdmin('Test socle lot 1', 'Message de verification.')
  console.log(`  notifyAdmin a retourne ${envoye}`)
  enregistrer('notifyAdmin ne leve pas d erreur', true)

  /* ---------------------------------------------------------------- */
  console.log('')
  if (echecs.length > 0) {
    console.error(`ECHECS (${echecs.length}) : ${echecs.join(' | ')}`)
    process.exit(1)
  }
  console.log('Tous les controles passent.')
  process.exit(0)
}

main().catch((erreur) => {
  console.error('Echec du script de test :', erreur)
  process.exit(1)
})
