# Documentation — Refonte DGL Agency

Documentation complète du chantier de refonte du site https://dgl-agency.fr.
Cible : remplacer WordPress + Oxygen Builder 4.0 par une SPA React + Vite déployée sur Vercel.

**Dernière mise à jour** : 2026-07-02 (commit `a08aef4`)

---

## 1. Vue d'ensemble

| | |
|---|---|
| **Objectif** | Refondre le site DGL Agency de WordPress vers React |
| **Repo GitHub** | https://github.com/mahmoudel24rb-debug/refontedgl |
| **URL de prod** | https://refontedgl-kappa.vercel.app |
| **Branche prod** | `main` (auto-déploiement Vercel à chaque push) |
| **Langue de l'app** | Français |
| **Dossier de travail** | `c:\Users\dglco\Documents\performance web\refonte-dgl\` |
| **Point de départ** | Template "Bancuip" (fintech landing page) — customisé pour DGL |

### Pourquoi cette refonte

- **Perf** : Lighthouse WordPress limite, cible >95 mobile/desktop
- **SEO** : capitaliser sur l'audit fait dans `audit-seo/PLAN-CORRECTION-SEO-DGL-AGENCY.md`
- **DX** : sortir d'Oxygen Builder (PHP inline Code Blocks, pas de versioning propre)
- **Sécurité** : arrêter d'avoir des clés API en clair dans le JS front
- **Scalabilité** : préparer l'agence à multiplier les lead magnets sans friction

---

## 2. Stack technique

### Runtime

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 19.2.7 | UI |
| **Vite** | 8.1.1 | Bundler + dev server |
| **TypeScript** | 6.0.2 | Typage strict |
| **Tailwind CSS** | 4.3.2 | Utility CSS (via `@tailwindcss/vite` plugin) |
| **oxlint** | 1.71 | Linter rapide (Rust-based, remplace ESLint) |

### Bibliothèques

| Package | Rôle |
|---|---|
| **framer-motion** | Animations d'entrée, hovers, orchestration |
| **lucide-react** | Icônes (Check, ArrowRight, Search, Users, Zap, etc.) |
| **react-router-dom** v7 | Routing SPA (BrowserRouter + Route + Link) |
| **@tanstack/react-query** | Cache/état async (installé, pas encore utilisé) |
| **@radix-ui/react-tooltip** | Tooltips accessibles |
| **sonner** | Toast notifications |
| **clsx** + **tailwind-merge** | Helper `cn()` pour merger des classes conditionnelles |
| **shaders** (Paper Design) | Stack shaders WebGL pour le prototype `refontev2` (three.js sous le capot, lazy loaded) |

### Structure Vite

- Alias `@/*` → `app/src/*` (défini dans `vite.config.ts` + `tsconfig.app.json`)
- `public/` sert de racine pour les assets locaux (voir §6)
- Build : `pnpm build` (TS check strict + `vite build`)
- Dev : `pnpm dev` (port 5173)

---

## 3. Structure du repo

```
refonte-dgl/
├── README.md                      ← Vue d'ensemble marketing
├── DOCUMENTATION.md               ← Ce fichier
├── prompt complet.md              ← Le brief initial "Bancuip" (source template)
├── audit-seo/                     ← Plan de correction SEO du site WordPress
│
├── composant/                     ← DOCS des prototypes (prompts + notes)
│   ├── README.md                  ← Workflow de prototypage
│   ├── exemple/prompt.md          ← Prototype d'exemple
│   ├── hero/hero prompt.md        ← Brief Marketeam
│   ├── hero/notes.md
│   ├── hero-video/prompt.md       ← Brief hero video + marquee
│   ├── hero-video/notes.md
│   ├── hero3/notes.md             ← (pas de prompt sauvegardé)
│   └── refontev2/prompt.md        ← Brief Axion Studio (page complète 3 sections)
│
└── app/                           ← LE PROJET Vite/React
    ├── package.json
    ├── vite.config.ts
    ├── vercel.json                ← SPA rewrites Vercel
    ├── tsconfig.*.json
    ├── index.html
    ├── public/                    ← Assets servis à la racine
    │   ├── assets/
    │   │   ├── icon-1.svg … icon-6.svg   ← icônes Bancuip (plus utilisées, remplacées par lucide)
    │   │   ├── back-3-1..3.jpg, top-2.svg, section-2-title.png, ...
    │   │   ├── block-1-1.png, block-1-2.png, block-2-1.png  ← rochers déco
    │   │   ├── client-1.jpg, hero-back.jpg, arrow-l/r.svg, quote.svg
    │   │   └── logos/             ← LOGOS DGL (6 fichiers, hébergés en local)
    │   │       ├── logo-dgl-agency.webp
    │   │       ├── oceades.webp, gymfit.webp, beauregard.webp,
    │   │       ├── epicure.webp, ipms.webp
    │   └── composant-hero/team/   ← 3 photos équipe
    │       ├── Image-Equipe-Kiara.webp
    │       ├── Image-Equipe-Mahmoud.webp
    │       └── Image-Equipe-Victor.webp
    │
    └── src/
        ├── main.tsx               ← Entry point
        ├── App.tsx                ← Router avec 4 routes
        ├── index.css              ← Tailwind + @theme DGL + keyframes marquee
        ├── lib/utils.ts           ← cn(), asset() (préfixe /assets/)
        │
        ├── pages/                 ← Routes React Router
        │   ├── Index.tsx          ← / (site principal)
        │   ├── ComposantIndex.tsx ← /composant (liste prototypes)
        │   ├── ComposantView.tsx  ← /composant/:slug (proto isolé)
        │   └── NotFound.tsx       ← 404
        │
        ├── components/            ← Composants du SITE PRINCIPAL
        │   ├── Hero.tsx           ← Hero courant (glowy waves)
        │   ├── HeroNavbar.tsx     ← Navbar (plus mount ; en réserve)
        │   ├── FintechPlatform.tsx ← Section "Nos services" + 2 blocs
        │   ├── FinanceFeatures.tsx ← Section (à revoir)
        │   ├── Testimonials.tsx   ← Section (avec marquee 5 logos clients)
        │   ├── PowerOfFinance.tsx ← Section (à revoir)
        │   ├── Footer.tsx
        │   └── ui/tooltip.tsx     ← Radix wrapper
        │
        └── composant/             ← Prototypes ISOLÉS (code)
            ├── registry.ts        ← Index de tous les prototypes (slug, name, status, lazy import)
            ├── exemple/Demo.tsx
            ├── hero/Demo.tsx      ← Marketeam-adapted (orbites équipe)
            ├── hero-video/Demo.tsx ← Hero card + marquee logos
            ├── hero3/Demo.tsx     ← Glowy waves canvas
            └── refontev2/Demo.tsx ← Page landing 3 sections (shader stack)
```

---

## 4. Routes de l'application

Défini dans `app/src/App.tsx` :

| Route | Composant | Rôle |
|---|---|---|
| `/` | `pages/Index.tsx` | Le site principal (Hero + sections) |
| `/composant` | `pages/ComposantIndex.tsx` | Grille des prototypes avec badges de statut |
| `/composant/:slug` | `pages/ComposantView.tsx` | Un prototype isolé (topbar 48px + composant fullscreen) |
| `*` | `pages/NotFound.tsx` | 404 |

Chaque prototype est **lazy-loaded** via `React.lazy()` — ils n'alourdissent pas le bundle du site principal.

---

## 5. Site principal (`/`) — architecture

**`pages/Index.tsx`** monte les sections dans cet ordre :

```tsx
<main style={{ background: '#002329', minHeight: '100vh' }}>
  <Hero />
  <FintechPlatform />
  <FinanceFeatures />
  <Testimonials />
  <PowerOfFinance />
  <Footer />
</main>
```

### Détail des composants

#### `Hero.tsx` — Glowy waves
- Canvas 2D fullscreen (100vh) avec 5 couches de vagues sinusoïdales
- Vagues suivent la souris (radius d'influence 320px, smoothing 0.1)
- 3 halos flous en fond pour la profondeur
- **Header intégré** : logo DGL + `Services / Réalisations / À propos / Ressources` + `Contact` + CTA `Audit gratuit`
- Contenu centré animé (framer-motion staggered) :
  - H1 avec gradient text coral sur "que vous méritez"
  - Paragraphe SEO / Google Ads / Meta Ads / auto
  - 2 CTA : `Audit gratuit` (coral) + `Voir nos réalisations` (ghost)
  - 3 pills (ROAS mesurable / Setup 15j / Reporting mensuel)
  - Card stats : 500+ clients / 10 ans / 120+ campagnes
- `prefers-reduced-motion` honoré

#### `FintechPlatform.tsx` — Section "Nos services"
- Titre H2 : "Agence marketing digital axée sur la performance"
- **2 blocs** feature/mockup côte-à-côte (alternés) :
  - **Bloc 1** : 3 features (Publicité digitale / Génération leads / ROI) + mockup dashboard avec bar chart (une barre coral active `#fe5752`)
  - **Bloc 2** : 3 features (SEO / Automatisation / Landing pages) + mockup steps (Audit → Stratégie → Optimisation)
- Icônes = lucide-react dans des chips coral 12% (`Target`, `Users`, `TrendingUp`, `Search`, `Zap`, `LayoutTemplate`)
- Devise en **EUR** (`2 222,65 €`)
- SVG décoratif en haut avec cursor-follow spotlight coral

#### `Testimonials.tsx`
- Bloc citation client (GYMFIT en principal)
- **Marquee logos** (5 logos clients : Océades, GYMFIT, Beauregard, Epicure, IPMS) avec mask-image gradient sur les bords
- Helper `resolveImg()` local : passe-through pour les URLs `http` et pour les paths absolus `/`, sinon préfixe `/assets/`

#### `Footer.tsx`
- Wordmark DGL + colonnes de liens
- Icônes réseaux sociaux inlinées en SVG (les icônes sociales de lucide-react ne sont pas toutes exportées)

#### Composants "en réserve"
- `HeroNavbar.tsx` : ancienne navbar isolée, plus mount dans `Index.tsx` (le nouveau Hero embarque son propre header). Gardée en sync au cas où.
- `FinanceFeatures.tsx`, `PowerOfFinance.tsx` : sections héritées du template Bancuip, adaptées au brief DGL mais à revisiter (elles font "template", pas encore assez "DGL").

### Palette DGL (dans `index.css` `@theme`)

```css
--color-brand-deep: #002329       /* navy dark, fond principal */
--color-brand-bright: #fe5752     /* coral primaire */
--color-brand-hover: #e54a45      /* coral hover */
--color-cream: #f0efe9            /* cream, fond sections light */
--color-footer-green: #002329     /* alias legacy, même que deep */
--font-sans: "Inter Tight"
```

**Rule of thumb** : navy sur fond clair pour le texte, coral pour les CTA/accents, cream pour les fonds de sections claires, blanc pour le contenu overlay sur navy.

---

## 6. Assets — self-hosted

**Décision** : tous les logos et images DGL sont **en local** dans `public/assets/logos/`.

### Historique du choix

Les URLs `https://dgl-agency.fr/wp-content/uploads/...` marchaient dans certains navigateurs mais **échouaient dans d'autres réseaux** (VPN, DNS filtering, ISP). Le sandbox de dev n'y arrive même pas (`ECONNREFUSED`). Le marquee Testimonials rendait des carrés blancs.

**Fix** : téléchargement manuel des 6 webp (5 logos clients + wordmark DGL) → dépôt dans `public/assets/logos/` → commit dans le repo. Zéro dépendance externe restante côté DGL.

### Piège du helper `asset()`

`asset('foo.svg')` → `'/assets/foo.svg'` (utile pour les fichiers template au nom court).
**MAIS** appliqué à un path déjà absolu → doublait le préfixe : `/assets/assets/logos/oceades.webp` → 404.
**Solution** : `resolveImg()` dans `Testimonials.tsx` — passe-through si `startsWith('http')` OU `startsWith('/')`, sinon `asset()`.

### Assets encore présents (template Bancuip)

Certains PNG/SVG de la template sont encore utilisés :
- `top-2.svg` (SVG décoratif haut de FintechPlatform, colorisé coral via CSS mask)
- `section-2-title.png` (petite image "axée" dans H2 FintechPlatform)
- `block-1-1.png`, `block-1-2.png`, `block-2-1.png` (rochers déco au bas des mockups)
- `quote.svg`, `arrow-l.svg`, `arrow-r.svg`, `client-1.jpg` (Testimonials)
- `back-3-1..3.jpg`, `hero-back.jpg` (utilisés par FinanceFeatures / PowerOfFinance / HeroNavbar en réserve)
- `icon-1.svg` … `icon-6.svg` : **plus utilisés** (remplacés par lucide-react dans FintechPlatform), gardés en tas pour ne rien casser

---

## 7. Workflow "composant/" — prototypage isolé

**Objectif** : tester des blocs UI en isolation avant de les intégrer au site.

### Comment un prototype naît

1. Mahmoud crée un dossier `composant/[nom]/` et y dépose `prompt.md` (ou `prompt.txt`) — un brief textuel (souvent copié depuis motionsites.ai, higgs.ai, ou un builder AI similaire).
2. Claude crée `app/src/composant/[nom]/Demo.tsx` qui exporte `default` (le composant).
3. Claude ajoute une entrée dans `app/src/composant/registry.ts` :
   ```ts
   {
     slug: 'refontev2',
     name: 'Refonte v2 — page landing (3 sections)',
     status: 'ready',
     Component: lazy(() => import('./refontev2/Demo')),
     notes: "…",
   }
   ```
4. Automatiquement dispo sur `/composant/[slug]`. La topbar du composant view (fixed, 48px) permet de revenir à l'index.
5. Statuts possibles : `wip` 🔨 · `ready` 🧪 · `validated` ✅ · `rejected` ❌
6. Une fois `validated` → on **promeut** en copiant dans `app/src/components/` et en le montant dans `pages/Index.tsx`.

### Prototypes existants (dans l'ordre chronologique)

#### `exemple` — Placeholder
Composant vide pour valider que le workflow fonctionne. À supprimer.

#### `hero` — Marketeam adapté (orbites équipe + clients)
- **Source** : brief motionsites.ai "Marketeam"
- **Ce qu'il fait** : Header + H1 typewriter en 2 couleurs (coral+blanc) + 4 orbites concentriques avec avatars équipe (Kiara, Mahmoud, Victor) sur orbite 2 et logos clients sur orbites 3/4, compteur `500+ Clients satisfaits` au centre, marquee logos en bas
- **Techniques** : CSS `@property --border-angle` pour bordures conic-gradient, `mask-composite: exclude` pour bordures gradient-only, counter-rotation sur wrapper avatars pour rester debout, `useCountUp` avec easeOutCubic
- **Statut** : Ready — a été promu comme Hero principal, PUIS remplacé par `hero3` (voir plus bas)

#### `hero-video` — Carte vidéo + marquee logos
- **Source** : brief "Foundation of the new digital epoch"
- **Ce qu'il fait** : Grande carte 1400×600 arrondie 48px avec vidéo CloudFront en background + navbar glass flottante en bas + marquee de 8 logos tech (Procure, Shopify, Blender, Figma…)
- **Techniques** : hover révèle un gradient blob (scale 1.5→1, opacity 0→1) derrière chaque logo, marquee CSS `translateX(0 → -50%)` pause on hover
- **Statut** : Ready — non intégré au site

#### `hero3` — Glowy waves canvas
- **Source** : composant shadcn "Glowy Waves Hero"
- **Ce qu'il fait** : Canvas 2D fullscreen avec 5 couches de vagues sinusoïdales qui réagissent à la souris, contenu centré avec entrance staggered (badge Sparkles retiré ensuite)
- **Techniques** : `requestAnimationFrame`, `shadowBlur 35`, distance/influence pour déformer la vague sous le curseur, `prefers-reduced-motion` réduit l'intensité par 7
- **Statut** : Ready — **actuellement le Hero du site principal** (copié dans `components/Hero.tsx`)

#### `refontev2` — Page landing complète (3 sections)
- **Source** : brief motionsites.ai "Axion Studio" (agency landing)
- **Ce qu'il fait** :
  - Section 1 (Hero, 100vh) : stack shader Paper Design (Swirl + ChromaFlow + FlutedGlass + FilmGrain) + navbar pill blanche avec horloge Paris live + H1 français + CTA + badge "Partenaire Certifié Premium"
  - Section 2 (À propos, blanc) : badge "1 · L'agence DGL" + H2 + grid desktop 26/1fr/48%
  - Section 3 (Réalisations, cream) : 2 case studies vidéo (Océades, GYMFIT) avec bouton hover qui s'expand
- **Techniques** : package `shaders` (three.js), `<Shader>` root obligatoire (bug initial : nœuds sans root → contexte null → page noire, fixé avec ErrorBoundary + wrapping)
- **Statut** : Ready — non intégré, en cours de review

---

## 8. Historique des commits (résumé narratif)

```
95d3ba2 chore: initial scaffold — Vite + React 18 + TS + Tailwind + shadcn
78fb85e feat: customize template for DGL Agency
65cc876 fix: self-host assets + navbar liquid glass + remove dead slider UI
6c7e9cb feat: composant isolation workflow — /composant routes + registry
013c4a1 feat(composant): hero Marketeam prototype
f6bd912 feat(composant): hero-video with marquee logos
bca5cb2 feat(composant/hero): DGL palette + team photos + client logos
d7ed28e feat(hero): promote Marketeam-adapted hero to main site + local logo paths
8465b0d feat(hero3): add glowy waves canvas hero prototype
a2944eb fix(vercel): SPA rewrites so client routes don't 404
1aa2fc3 feat(hero): swap main site hero to glowy waves + drop hero3 badge
2f54fed refactor(assets): switch every dgl-agency.fr image ref to local /assets/logos
05d1ce7 chore(assets): add local DGL wordmark + 5 client logos
bf14b95 fix(testimonials): don't double-prefix /assets/ on already-absolute paths
8b684bb refactor(fintech-platform): swap Bancuip green + $ palette to DGL coral + €
ca03963 feat(refontev2): full 3-section landing prototype (Axion-inspired, DGL palette)
a08aef4 fix(refontev2): wrap shader nodes in <Shader> root + add error boundary
```

### Jalons clés

- **95d3ba2** : Scaffold initial à partir du brief "Bancuip" (prompt template complet)
- **78fb85e** : Passage à la ligne éditoriale DGL (couleurs, copy français, logos clients)
- **6c7e9cb** : Mise en place du workflow `/composant/*` pour prototyper isolément
- **d7ed28e → 1aa2fc3** : Le Hero principal a été swap deux fois — d'abord vers l'orbite Marketeam, puis vers glowy waves
- **2f54fed + 05d1ce7 + bf14b95** : Migration complète des assets de dgl-agency.fr → local (3 commits pour tout couvrir)
- **8b684bb** : Nettoyage du vert Bancuip dans FintechPlatform (icônes lucide, coral, euro)

---

## 9. Déploiement

### Vercel

- **Repo lié** : https://github.com/mahmoudel24rb-debug/refontedgl
- **URL prod** : https://refontedgl-kappa.vercel.app
- **Framework preset** : Vite
- **Root Directory** : `app` ← important, pas la racine du repo
- **Build Command** : `pnpm build` (auto)
- **Output Directory** : `dist` (auto)
- **Install Command** : `pnpm install`
- **Auto-deploy** : tout push sur `main` déclenche un build (~30-60s)

### `vercel.json` (dans `app/`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Pourquoi** : SPA avec React Router. Sans ce rewrite, accéder directement à `/composant/hero` (ou refresh sur cette URL) renvoyait 404 — Vercel cherchait un fichier physique qui n'existe pas. Le catch-all vers `index.html` laisse React Router prendre le relais côté client. Les fichiers physiques (JS/CSS/webp) sont servis en priorité.

### Chemin GitHub → Prod

1. Local : `pnpm build` pour vérifier
2. `git commit` + `git push origin main`
3. Vercel détecte le push, lance un build
4. En 30-60s la nouvelle version est en ligne
5. Zéro downtime (blue/green interne Vercel)

---

## 10. Décisions techniques importantes

### Pourquoi Vite et pas Next.js
Le README parle de Next.js 15 (intention initiale). En pratique on est parti sur **Vite pur** parce que :
- Pas de SSR requis pour l'instant (site marketing statique, dynamique via API plus tard)
- Dev server ~10x plus rapide
- Bundle plus petit sans les hooks du framework
- Migration Next.js reste possible en 1 jour si SSR devient nécessaire (composants React inchangés)

### Tailwind v4 (pas v3)
- Config zéro : plus de `tailwind.config.js`, tout dans `index.css` via `@theme`
- Plugin Vite officiel `@tailwindcss/vite`
- Attention : certains guides shadcn assument v3 → il faut adapter

### shadcn : semi-installé
On a `components/ui/tooltip.tsx` (Radix) mais **pas** le reste de shadcn. Les composants du site utilisent du CSS inline + Tailwind utilitaire. Décision volontaire pour éviter le bloat et garder le contrôle du style.

### Framer Motion pour tout ce qui bouge
Alternative envisagée : Motion One (plus léger). Choix framer-motion parce que l'API est plus complète et déjà maîtrisée.

### oxlint au lieu d'ESLint
Rust-based, 50-100× plus rapide, config zéro par défaut. `pnpm lint` en <1s.

### SSL / Antivirus (piège récurrent)
Windows + Avast/McAfee/Defender font de la SSL interception. Certaines opérations `pnpm/npm` échouent avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Fix : `NODE_OPTIONS="--use-system-ca"` pour utiliser le CA store Windows.

### Package `shaders` : lourd mais lazy
Le prototype `refontev2` amène `three.js` (~365 KB gzip). Comme c'est en `React.lazy()`, ça ne pénalise que ceux qui visitent `/composant/refontev2`. Si le prototype est validé pour la prod, à considérer :
- Précharger via `<link rel="modulepreload">` sur les pages qui l'utilisent
- Ou remplacer par un canvas 2D custom (comme `hero3`) pour économiser 350 KB

---

## 11. Ce qui reste à faire

### Site principal
- [ ] Refondre `FinanceFeatures.tsx` et `PowerOfFinance.tsx` pour qu'elles collent au ton DGL (actuellement trop "template Bancuip")
- [ ] Décider si on garde ou remplace les 3 PNG "rochers" (block-1-1, block-1-2, block-2-1) qui sont encore visibles au bas des mockups FintechPlatform
- [ ] Câbler le CTA "Audit gratuit" au vrai formulaire / lead magnet
- [ ] Câbler "Voir nos réalisations" à une page dédiée (à créer)
- [ ] Câbler les liens du footer

### Prototypes en attente
- [ ] Valider ou rejeter `hero-video` (jamais promu)
- [ ] Décider du sort de `refontev2` : si on garde, extraire les sections 2 et 3 pour enrichir le site principal
- [ ] Supprimer `exemple/`

### Backend / API
- [ ] Formulaires (audit gratuit, contact) → envoi vers le CRM
- [ ] Route serveur (Vercel Edge Function) pour les appels API avec clés — jamais en client

### SEO
- [ ] Meta tags dynamiques par route
- [ ] Sitemap XML généré à build

### Infra
- [ ] Domaine `dgl-agency.fr` pointé sur Vercel (aujourd'hui c'est `refontedgl-kappa.vercel.app`)
- [ ] Vercel Analytics
- [ ] Configurer un preview branch pour QA avant merge sur main

### Perf
- [ ] Code-split le chunk principal (541 KB, 169 KB gzip) — extraire les grosses libs (framer-motion, radix)
- [ ] Précharger les fonts Inter Tight / Urbanist
- [ ] Optimiser les webp (déjà petits mais on peut aller à 1-2 KB en compressant fort)

---

## 12. Commandes utiles

```bash
# Depuis app/
pnpm dev           # Dev server (port 5173)
pnpm build         # Build prod
pnpm preview       # Preview du build local
pnpm lint          # oxlint

# Depuis refonte-dgl/
git status
git log --oneline -20
git push origin main    # Déclenche le deploy Vercel

# Vérif qu'il ne reste aucune URL externe dgl-agency.fr
# (à faire à chaque grosse refonte visuelle)
# → Grep tool: pattern "dgl-agency\.fr/wp-content"
```

---

## 13. Sources / crédits

Toute la construction du projet a été faite en conversation avec Claude (Anthropic) dans Claude Code sur Windows. Les briefs sources proviennent de :
- **motionsites.ai** (prompts Marketeam, Axion Studio)
- **higgs.ai** (images de mockup)
- **Paper Design shaders** (composants WebGL)
- **shadcn/ui** (patterns Glowy Waves Hero)

Le workflow est très itératif : Mahmoud dépose un prompt dans `composant/[nom]/`, Claude code le prototype, on teste sur `/composant/[nom]`, on itère jusqu'à validation, puis on promeut.
