/**
 * Verification du lot 6 (test de visibilite IA) cote base de donnees.
 *
 * Usage : base demarree (pnpm dev:db), puis
 *   pnpm exec tsx scripts/test-lot6.ts            inspecte scans, runs et leads
 *   pnpm exec tsx scripts/test-lot6.ts --reset    remet les quotas geo a zero
 *   pnpm exec tsx scripts/test-lot6.ts --stale    cree un scan bloque et son run
 *
 * Le mode --stale reproduit un scan interrompu (statut running, plus
 * aucune progression depuis 200 s) pour verifier le garde-fou de la
 * route status.
 */
import 'dotenv/config'

import { getPayloadClient } from '../src/lib/payload'

/** Remet a zero les compteurs de quota du scan de visibilite. */
async function reinitialiserQuotas(): Promise<void> {
  const payload = await getPayloadClient()
  const quotas = await payload.find({
    collection: 'rate-limits',
    where: { key: { like: 'geo:' } },
    limit: 100,
    depth: 0,
  })
  for (const quota of quotas.docs) {
    await payload.delete({ collection: 'rate-limits', id: quota.id })
    console.log(`quota supprime : ${quota.key}`)
  }
  if (quotas.docs.length === 0) console.log('aucun quota geo a supprimer')
}

/** Cree un scan bloque depuis plus de trois minutes et son run. */
async function creerScanBloque(): Promise<void> {
  const payload = await getPayloadClient()
  const maintenant = Date.now()

  const scan = await payload.create({
    collection: 'scans',
    data: {
      metier: 'stale',
      ville: 'stale',
      metierNorm: `stale${maintenant}`,
      villeNorm: `stale${maintenant}`,
      status: 'running',
      attempts: 0,
      coutCents: 0,
      expiresAt: new Date(maintenant + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    depth: 0,
  })

  // Payload repose updatedAt a chaque ecriture : on force la valeur en SQL.
  const { sql } = await import('@payloadcms/db-postgres')
  await payload.db.drizzle.execute(
    sql`UPDATE "scans" SET "updated_at" = now() - interval '200 seconds' WHERE "id" = ${scan.id}`,
  )

  const run = await payload.create({
    collection: 'tool-runs',
    data: {
      tool: 'geoscan',
      statut: 'anonyme',
      entreprise: 'Entreprise Bloquee',
      scan: scan.id,
      ip: 'script',
    },
    depth: 0,
  })

  const relu = await payload.findByID({ collection: 'scans', id: scan.id, depth: 0 })
  console.log(
    JSON.stringify(
      { scanId: scan.id, runId: run.id, status: relu.status, updatedAt: relu.updatedAt },
      null,
      2,
    ),
  )
}

/** Affiche les derniers scans, runs et leads du scan de visibilite. */
async function inspecter(): Promise<void> {
  const payload = await getPayloadClient()

  const scans = await payload.find({
    collection: 'scans',
    sort: '-createdAt',
    limit: 10,
    depth: 0,
  })
  console.log(`\n### scans (${scans.totalDocs} au total)`)
  for (const scan of scans.docs) {
    const resultats = scan.results as { reponses?: unknown[] } | null
    console.log(
      JSON.stringify({
        id: scan.id,
        metier: scan.metier,
        ville: scan.ville,
        status: scan.status,
        attempts: scan.attempts,
        coutCents: scan.coutCents,
        reponses: Array.isArray(resultats?.reponses) ? resultats.reponses.length : 0,
        error: scan.error,
        updatedAt: scan.updatedAt,
      }),
    )
  }

  const runs = await payload.find({
    collection: 'tool-runs',
    where: { tool: { equals: 'geoscan' } },
    sort: '-createdAt',
    limit: 10,
    depth: 0,
  })
  console.log(`\n### runs geoscan (${runs.totalDocs} au total)`)
  for (const run of runs.docs) {
    console.log(
      JSON.stringify({
        id: run.id,
        statut: run.statut,
        entreprise: run.entreprise,
        scan: run.scan,
        score: run.score,
        cited: run.cited,
        total: run.total,
        lead: run.lead,
      }),
    )
  }

  const leads = await payload.find({
    collection: 'leads',
    where: { source: { equals: 'geoscan' } },
    sort: '-createdAt',
    limit: 5,
    depth: 0,
  })
  console.log(`\n### leads geoscan (${leads.totalDocs} au total)`)
  for (const lead of leads.docs) {
    console.log(
      JSON.stringify(
        {
          id: lead.id,
          prenom: lead.prenom,
          email: lead.email,
          telephone: lead.telephone,
          entreprise: lead.entreprise,
          source: lead.source,
          statut: lead.statut,
          tags: lead.tags,
          rappelSous2h: lead.rappelSous2h,
          consentement: lead.consentement,
          consentementDate: lead.consentementDate,
          donnees: lead.donnees,
          journal: lead.journal,
          ip: lead.ip,
          pageUrl: lead.pageUrl,
        },
        null,
        2,
      ),
    )
  }
}

async function main(): Promise<void> {
  if (process.argv.includes('--reset')) {
    await reinitialiserQuotas()
    process.exit(0)
  }
  if (process.argv.includes('--stale')) {
    await creerScanBloque()
    process.exit(0)
  }
  await inspecter()
  process.exit(0)
}

void main()
