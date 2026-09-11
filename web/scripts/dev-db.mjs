/**
 * Postgres embarque pour le developpement local (aucun Docker requis).
 *
 * Demarre une instance Postgres dans web/.pg sur le port 5433 avec
 * l'utilisateur postgres / postgres et la base dgl, puis reste en vie
 * jusqu'a Ctrl+C. Correspond a DATABASE_URL du fichier .env local :
 * postgresql://postgres:postgres@localhost:5433/dgl
 *
 * Usage : pnpm dev:db
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import EmbeddedPostgres from 'embedded-postgres'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const racine = path.resolve(dirname, '..')
const databaseDir = path.join(racine, '.pg')

const PORT = 5433
const USER = 'postgres'
const PASSWORD = 'postgres'
const DATABASE = 'dgl'

const pg = new EmbeddedPostgres({
  databaseDir,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
  // Encodage UTF8 force : le cluster par defaut suivrait la locale Windows
  // (WIN1252) et tronquerait certains caracteres.
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  // Sortie du serveur relayee dans le terminal pour diagnostiquer.
  onLog: (message) => process.stdout.write(String(message)),
  onError: (message) => process.stderr.write(String(message)),
})

let arrete = false

/** Arrete proprement l'instance et sort du processus. */
async function arreter(code) {
  if (arrete) return
  arrete = true
  try {
    await pg.stop()
  } catch (error) {
    console.error('[dev:db] arret impossible :', error)
  }
  process.exit(code)
}

process.on('SIGINT', () => void arreter(0))
process.on('SIGTERM', () => void arreter(0))

async function main() {
  // initialise() echoue si le cluster existe deja : on ne l'appelle
  // que la premiere fois (presence du fichier PG_VERSION).
  const dejaInitialise = existsSync(path.join(databaseDir, 'PG_VERSION'))
  if (!dejaInitialise) {
    console.log('[dev:db] initialisation du cluster dans', databaseDir)
    await pg.initialise()
  }

  console.log('[dev:db] demarrage sur le port', PORT)
  await pg.start()

  try {
    await pg.createDatabase(DATABASE)
    console.log('[dev:db] base', DATABASE, 'creee')
  } catch {
    // La base existe deja : cas nominal aux demarrages suivants.
    console.log('[dev:db] base', DATABASE, 'deja presente')
  }

  console.log(
    `[dev:db] pret : postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DATABASE}`,
  )
  console.log('[dev:db] Ctrl+C pour arreter.')

  // Maintient le processus en vie tant que l'utilisateur ne l'arrete pas.
  setInterval(() => {}, 1 << 30)
}

main().catch(async (error) => {
  console.error('[dev:db] echec :', error)
  await arreter(1)
})
