# DGL Agency - site Next.js + Payload

Application unique : site public (App Router) et back-office Payload 3 sur
la meme base Postgres, deployes ensemble sur Vercel.

## Commandes

| Commande | Effet |
|---|---|
| `pnpm dev:db` | Demarre un Postgres embarque dans `.pg/` (port 5433, base `dgl`). A lancer avant `pnpm dev` en local. |
| `pnpm dev` | Serveur de developpement Next (http://localhost:3000, admin sur `/admin`). |
| `pnpm build` | Build de production (`next build`). |
| `pnpm run build:vercel` | Build de deploiement : `payload migrate` puis `next build`. Commande de build Vercel. |
| `pnpm start` | Sert le build de production. |
| `pnpm lint` | ESLint (config `next/core-web-vitals`). |
| `pnpm generate:types` | Regenere `src/payload-types.ts`. A relancer apres toute modification de collection. |
| `pnpm generate:importmap` | Regenere `src/app/(payload)/admin/importMap.js`. |
| `pnpm migrate:create <nom>` | Cree une migration a partir de l'ecart entre la config et la base. |
| `pnpm import:articles` | Import des 28 articles WordPress de `src/data/blog.json` dans Payload. Idempotent par `wpId` : relancer met a jour sans creer de doublon. |

## Variables d'environnement

Modele complet dans `.env.example`. En local, un `.env` non versionne suffit :

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dgl
PAYLOAD_SECRET=<chaine aleatoire>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_NOINDEX=1
```

Comportements conditionnels :

- sans `BLOB_READ_WRITE_TOKEN`, les medias sont ecrits sur le disque local ;
- sans `RESEND_API_KEY`, Payload journalise les emails au lieu de les envoyer ;
- `NEXT_PUBLIC_NOINDEX=1` ajoute `robots: noindex` tant que le site n'est pas
  sur son domaine definitif ;
- `NEXT_PUBLIC_GTM_ID` active le conteneur Google Tag Manager.

## Flux des migrations

- **En local** : `push: true` (adaptateur Postgres en mode developpement)
  synchronise le schema a chaud. Aucune migration a ecrire pendant
  l'iteration.
- **Avant un merge** : `pnpm migrate:create <nom>` contre une base propre,
  puis versionner les fichiers produits dans `src/migrations/`.
- **En production** : la commande de build `pnpm run build:vercel` execute
  `payload migrate` avant `next build`. Aucun `push` n'est actif.

## Structure

```
src/
  payload.config.ts     collections, adaptateurs, plugins, i18n fr
  collections/          Users Media Categories Articles Leads Scans ToolRuns RateLimits
  migrations/           migrations versionnees
  lib/                  socle partage (payload, leads, email, rate-limit, seo, html, llm)
  app/
    (site)/             site public, theme clair
    (composant)/        archive des prototypes, theme sombre, hors index
    (payload)/          admin et API Payload (genere, ne pas modifier)
scripts/                dev-db.mjs, import-articles.ts, scripts de recuperation WordPress
```
