/**
 * Verification du lot 4 (test PageSpeed) cote base de donnees.
 *
 * Usage : base demarree (pnpm dev:db), puis
 *   pnpm exec tsx scripts/test-lot4.ts            inspecte leads et runs
 *   pnpm exec tsx scripts/test-lot4.ts --reset    remet les quotas a zero
 *
 * Le mode --reset supprime les compteurs ps:analyze et ps:unlock pour
 * pouvoir rejouer les tests d'API sans attendre la fenetre de 15 min.
 */
import 'dotenv/config'

import { getPayloadClient } from '../src/lib/payload'

/** Emails utilises par le script de test des routes. */
const EMAILS = ['lot4@example.com', 'lot4-audit@example.com']

async function main(): Promise<void> {
  const payload = await getPayloadClient()

  if (process.argv.includes('--reset')) {
    const quotas = await payload.find({
      collection: 'rate-limits',
      where: { key: { like: 'ps:' } },
      limit: 50,
      depth: 0,
    })
    for (const quota of quotas.docs) {
      await payload.delete({ collection: 'rate-limits', id: quota.id })
      console.log(`quota supprime : ${quota.key}`)
    }
    process.exit(0)
  }

  for (const email of EMAILS) {
    const leads = await payload.find({
      collection: 'leads',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    const lead = leads.docs[0]
    if (!lead) {
      console.log(`\n### ${email} : aucun lead`)
      continue
    }
    console.log(`\n### ${email}`)
    console.log(
      JSON.stringify(
        {
          id: lead.id,
          entreprise: lead.entreprise,
          prenom: lead.prenom,
          nom: lead.nom,
          telephone: lead.telephone,
          url: lead.url,
          source: lead.source,
          statut: lead.statut,
          tags: lead.tags,
          utm: lead.utm,
          pageUrl: lead.pageUrl,
          ip: lead.ip,
          donnees: lead.donnees,
          journal: lead.journal,
        },
        null,
        2,
      ),
    )
  }

  const runs = await payload.find({
    collection: 'tool-runs',
    where: { tool: { equals: 'pagespeed' } },
    sort: '-createdAt',
    limit: 5,
    depth: 0,
  })
  console.log('\n### derniers runs pagespeed')
  for (const run of runs.docs) {
    console.log(
      JSON.stringify({
        id: run.id,
        statut: run.statut,
        url: run.url,
        scoreMobile: run.scoreMobile,
        scoreDesktop: run.scoreDesktop,
        entreprise: run.entreprise,
        lead: run.lead,
        erreur: run.erreur,
        rapport: run.rapport ? 'present' : null,
      }),
    )
  }

  process.exit(0)
}

void main()
