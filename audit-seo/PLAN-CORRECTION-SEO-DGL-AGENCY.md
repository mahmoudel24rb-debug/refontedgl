# Plan de correction SEO — dgl-agency.fr

> **À toi, Claude (connecté via MCP WordPress)**
>
> Ce document décrit l'audit SEO complet de https://dgl-agency.fr et la liste exhaustive des corrections à appliquer. Tu as accès au site WordPress via l'MCP `wordpress` configuré dans Claude Desktop. Tu disposes de tous les outils `wp_*` nécessaires pour lire, modifier et créer du contenu.
>
> **Procède sprint par sprint, dans l'ordre. Avant CHAQUE modification, montre-moi ce que tu vas faire et attends ma validation.** Après chaque batch, fais un récap des changements effectués.

---

## 0. Contexte du site

- **URL** : https://dgl-agency.fr
- **Stack** : WordPress + Oxygen 4.9.1 (avec Kadence 1.3.6 actif aussi — à investiguer plus tard)
- **Plugins SEO** : Yoast SEO, Redirection, Schema & Structured Data, Site Kit Google
- **CMS Marketing** : Jetpack CRM, Brevo, CF7, WPCode Lite
- **Volume** : 118 URLs indexables (56 pages + 62 articles)
- **Cible** : TPE/PME françaises, focus géographique Indre-et-Loire (Tours) + Loir-et-Cher (Blois)

## 0.1 Outils MCP disponibles (rappel)

Lecture :
- `wp_pages_search`, `wp_get_page`, `wp_posts_search`, `wp_get_post`, `wp_cpt_search`, `wp_get_cpt`
- `wp_list_categories`, `wp_list_tags`, `wp_list_media`, `wp_get_media`, `wp_search_media`
- `wp_get_current_user`, `get_site_info`, `wp_get_general_settings`

Écriture :
- `wp_update_page`, `wp_update_post`, `wp_update_cpt`
- `wp_add_page`, `wp_add_post`, `wp_add_cpt`
- `wp_update_media`, `wp_upload_media`
- `wp_add_category`, `wp_update_category`, `wp_add_tag`, `wp_update_tag`

## 0.2 Règles d'or — À LIRE AVANT D'AGIR

1. **JAMAIS sans validation préalable** : avant chaque update, expose la diff (ancien → nouveau) et demande confirmation.
2. **JAMAIS de suppression** : les outils `delete` sont désactivés. Tu ne dois rien supprimer.
3. **Reporting par batch** : après 5 modifications, fais un récap.
4. **Doute → on stoppe** : si une réponse de l'API te paraît étrange, arrête et signale-moi.
5. **Préserve le contenu existant** : ne réécris jamais une page entière sauf instruction explicite. Modifie uniquement le champ concerné (title Yoast, meta, H1, etc.).
6. **Yoast SEO** : pour modifier les titles et metas SEO, utilise les meta fields Yoast :
   - `_yoast_wpseo_title` (title SEO)
   - `_yoast_wpseo_metadesc` (meta description)
   Si tu ne sais pas comment passer ces métadonnées via wp_update_page/wp_update_post, dis-le moi avant.

---

# 🚨 SPRINT 1 — Critique (à faire maintenant)

## 1.1 Doublons articles → DÉJÀ FAIT

| Article canonique | Article supprimé (301) | Statut |
|---|---|---|
| `/article/agence-web-tours/` | `/article/choisir-agence-web-tours/` | ✅ Fait |
| `/article/veille-strategique/` | `/article/veille-strategique-larme-secrete-pour-dominer-votre-marche/` | ✅ Fait |

**Action pour toi** : vérifie via le plugin Redirection (s'il expose une API) que les 301 sont bien actives, et confirme que les URLs sources ne renvoient plus 200. Si tu ne peux pas vérifier le plugin Redirection, teste juste que les URLs sources redirigent bien.

## 1.2 H1 multiples sur 3 pages — CRITIQUE

### Page 1 : Homepage (slug `/`)

**Problème** : 4 balises `<h1>` détectées, dont 3 sont les noms de témoignages (Hakim, Samuel, Marion) qui devraient être en `<h3>`.

**Action** :
1. Récupère le contenu de la page d'accueil (probablement page ID à identifier via `wp_pages_search` avec un filtre `front_page` ou via `wp_get_general_settings`).
2. Identifie les 4 `<h1>` dans le contenu.
3. Modifie le contenu pour qu'il ne reste **qu'UN SEUL `<h1>`** (le titre principal en haut de page).
4. Les 3 noms de témoignages doivent passer en `<h3>`.
5. Avant de pousser : montre-moi la diff exacte (les 3 lignes à changer).

⚠️ **Cas spécial Oxygen** : si la homepage est construite avec Oxygen Builder, le contenu n'est pas dans `post_content` classique mais dans des meta fields Oxygen (`ct_builder_shortcodes`, `_ct_builder_shortcodes_tree`). Si c'est le cas, signale-le moi et on verra l'approche.

### Page 2 : `/mentions-legales/`

**Problème** : 10 balises `<h1>` (chaque section juridique).

**Action** : passe les 9 H1 secondaires en `<h2>`. Garde uniquement le H1 principal "Mentions légales" en haut.

### Page 3 : `/conditions-generales-de-vente/`

**Problème** : 16 balises `<h1>` (chaque article du CGV).

**Action** : passe les 15 H1 secondaires en `<h2>`. Garde uniquement le H1 principal "Conditions Générales de Vente" en haut.

## 1.3 Meta descriptions manquantes (2 pages)

### `/cahier-de-charges/`

**Action** : récupère la page via `wp_pages_search`, regarde le contenu pour comprendre le sujet. Puis propose une meta description de **145-155 caractères** orientée conversion. Modèle :

> "Générez votre cahier des charges projet en quelques minutes avec notre outil IA. Brief clair pour vos prestataires, gratuit. 100% gratuit."

À toi de l'adapter selon le contenu réel de la page.

### `/machine-a-leads-automatisee/`

**Action** : même méthode. Modèle :

> "Construisez une machine à leads automatisée pour votre entreprise. Stratégie + outils + workflow clé en main par DGL Agency. Audit gratuit."

À adapter selon le contenu réel.

## 1.4 BreadcrumbList Schema absent (54/55 pages)

**Problème** : seule `/blog/` a un schema BreadcrumbList. Les 54 autres pages n'en ont pas → Google n'affiche pas le fil d'Ariane en SERP.

**Action** : ce n'est pas modifiable via le MCP WordPress directement, c'est un réglage Yoast. **Signale-moi cette ligne** :

> "Pour activer BreadcrumbList sur tout le site, va sur WP Admin → Yoast SEO → Réglages → Avancé → Fils d'Ariane → Active. Ça doit être fait manuellement par toi (Mahmoud)."

## 1.5 Note résiduelle `[1]` dans la meta de `/pagespeed-tool/`

**Problème** : la meta description de `/pagespeed-tool/` contient `[1]` (note de bas de page non nettoyée), exemple : `"...Google Lighthouse).[1] Découvrez..."`.

**Action** :
1. Récupère la meta actuelle (`_yoast_wpseo_metadesc`).
2. Retire le `[1]`.
3. Vérifie que la longueur est <= 160 caractères, sinon raccourcis.
4. Update via Yoast.

---

# ⚠️ SPRINT 2 — Important (sous 30 jours)

## 2.1 Titles trop longs (>60 caractères)

**Règle** : viser **55-60 caractères max**, mot-clé principal en début, marque "DGL" en fin si possible.

**Méthode** :
1. Liste toutes les pages et articles via `wp_pages_search` et `wp_posts_search`.
2. Pour chacun, récupère le title Yoast (`_yoast_wpseo_title`).
3. Si > 60 caractères → propose un nouveau title qui respecte les règles.
4. Montre-moi la liste complète des propositions sous forme de tableau (ancien → nouveau → longueur).
5. Attends ma validation avant de pousser en batch.

**Cas prioritaires identifiés dans l'audit (à traiter d'abord)** :

| URL | Title actuel (longueur) | Title proposé (max 60) |
|---|---|---|
| `/article/visibilite-en-ligne/` | (103 car) | À reformuler — propose 3 options |
| `/article/veille-marketing-guide-complet/` | (89 car) | "Veille marketing : guide complet 2026 \| DGL Agency" (50) |
| `/carrieres/` | (83 car) | "Recrutement Agence Digitale Tours \| DGL Agency" (49) |
| `/pagespeed-tool/` | (81 car) | "Test PageSpeed : Audit Performance Gratuit \| DGL" (51) |
| `/agence-digitale-tours/` | (80 car) | "Agence Digitale Tours (37) \| SEO & Ads — DGL Agency" (53) |
| `/kap-numerik/` | (80 car) | À reformuler — propose 3 options |
| `/article/accompagnement-transformation-digitale/` | (78 car) | "Transformation Digitale : Accompagnement \| DGL Agency" (53) |
| `/simulateur-de-roi/` | (76 car) | "Simulateur ROI Marketing : Calcul Gratuit \| DGL Agency" (54) |
| `/mentions-legales/` | (74 car) | "Mentions légales \| DGL Agency" (29) |

**Note importante** :
- Garde toujours le mot-clé principal en début.
- Pour les pages de service / local landing, ajoute la marque "DGL Agency" en fin.
- Pour les articles, "DGL" en fin suffit pour gagner des caractères.
- Évite les caractères encodés (`&amp;`, `&#039;`) → utilise les vrais caractères.

## 2.2 Meta descriptions trop longues (>160 caractères)

**Règle** : viser **145-155 caractères max**, contenir un CTA explicite ("Découvrez", "Testez", "Audit gratuit", "Réservez").

**Méthode** : pareil que pour les titles. Liste tout, propose les nouvelles versions, je valide, puis tu pushes.

**Cas extrêmes prioritaires** :

| URL | Meta longueur actuelle |
|---|---|
| `/pagespeed-tool/` | 215 car (+ contient `[1]` à nettoyer — voir Sprint 1.5) |
| `/audit-landing-page/` | 208 |
| `/article/visibilite-en-ligne/` | 190 |
| `/article/skills-claude-guide-marketing-digital/` | 189 |

## 2.3 Caractères encodés en SERP

**Problème** : plusieurs titles / metas contiennent `&amp;`, `&#039;`, `&quot;` au lieu des vrais caractères.

**Action** : pendant que tu traites les Sprints 2.1 et 2.2, **systématiquement remplace** ces encodages par les vrais caractères :
- `&amp;` → `&`
- `&#039;` → `'`
- `&quot;` → `"`
- `&nbsp;` → ` ` (espace simple)

## 2.4 Images sans `alt` sur les 6 pages de service

**Pages concernées** :
- `/nos-services/automatisation-marketing/`
- `/nos-services/generation-de-leads/`
- `/nos-services/landing-pages/`
- `/nos-services/publicite-digitale/`
- `/nos-services/referencement-naturel-seo/`
- `/nos-services/strategie-digitale/`

**Action** : pour chaque page :
1. Liste les images via `wp_search_media` ou en analysant le contenu.
2. Pour chaque image sans alt → propose un alt descriptif lié au contexte (et non au nom de fichier).
3. Update via `wp_update_media`.

---

# 💡 SPRINT 3 — Stratégique (1 mois)

## 3.1 Enrichir les pages services (de 600-700 mots vers 1500+)

| Page | Mots actuels | Cible |
|---|---|---|
| `/nos-services/` | 569 | 1500+ |
| `/nos-services/publicite-digitale/` | 663 | 1500+ |
| `/nos-services/automatisation-marketing/` | 676 | 1500+ |
| `/nos-services/landing-pages/` | 684 | 1500+ |
| `/nos-services/referencement-naturel-seo/` | 707 | 1500+ |
| `/nos-services/generation-de-leads/` | 716 | 1500+ |
| `/nos-services/strategie-digitale/` | 718 | 1500+ |

**Problème** : les articles `/article/agence-X-tours/` font 1900-2300 mots, mais les pages services correspondantes font 600-700. **Rupture d'expérience SEO + cannibalisation**.

**Action pour chaque page service** :
1. Récupère le contenu actuel.
2. Analyse-le et identifie ce qui manque pour passer à 1500+ mots :
   - **Section "Qu'est-ce que [service]"** (300 mots) — définition, enjeu pour la cible
   - **Section "Notre méthode"** (300 mots) — 4-5 étapes concrètes
   - **Section "Cas client" ou "Exemple concret"** (200 mots) — basé sur Syllabis, Gymfit, etc.
   - **FAQ** 4-5 questions (300 mots) — questions fréquentes du métier
   - **CTA + maillage interne** vers articles longs et lead magnets pertinents
3. Propose-moi le brouillon complet avant de pusher.

**Ne fais qu'une page à la fois** — c'est du travail éditorial qui demande validation point par point.

## 3.2 Résoudre la cannibalisation "agence Tours"

**Problème** : 11 pages se positionnent toutes sur "agence... Tours" :
- `/agence-digitale-tours/` (local landing principale)
- `/agence-web-tours/` (local landing)
- `/article/agence-seo-tours/`
- `/article/agence-ecommerce-tours/`
- `/article/agence-marketing-tours/`
- `/article/agence-de-communication-tours-propulsez-votre-entreprise-en-indre-et-loire/`
- `/article/choisir-agence-digitale-tours/`
- `/article/referencement-a-tours-strategies-tendances-et-bonnes-pratiques-locales/`
- `/article/audit-seo-tours-strategie-optimisation-locale/`
- `/article/agence-web-tours/`
- `/agence-web-tours/`

**Action** :

1. **Définis avec moi** quelle page est la "pilier" pour chaque requête :
   - "agence digitale Tours" → `/agence-digitale-tours/` (local landing)
   - "agence web Tours" → `/agence-web-tours/` (local landing)
   - "agence SEO Tours" → `/article/agence-seo-tours/` (article pilier)
   - "agence e-commerce Tours" → `/article/agence-ecommerce-tours/`
   - etc.

2. **Pour chaque article qui n'est PAS pilier** sur sa requête principale, modifie-le pour :
   - Cibler une **longue traîne différente** (ex: "comment choisir une agence X à Tours", "combien coûte une agence X")
   - Inclure un bloc en intro : "Pour l'offre commerciale, consultez notre [page pilier](URL)" avec ancre exact match
   - Modifier la meta description pour refléter la nouvelle intention

3. Avant de tout modifier, **soumets-moi le plan de réassignation** en tableau (URL / requête actuelle ciblée / requête nouvelle ciblée).

## 3.3 BreadcrumbList sur toutes les pages

**Note** : déjà mentionné dans Sprint 1.4, à activer manuellement via Yoast (pas de MCP pour ça).

---

# 🌟 SPRINT 4 — Opportunités (backlog, 2-3 mois)

## 4.1 Créer des pages locales manquantes

LocalBusiness mentionne `areaServed` Orléans mais 0 page locale → opportunité.

**À créer** :
- `/agence-digitale-orleans/` (sur le modèle de `/agence-digitale-tours/`)
- `/article/agence-seo-orleans/` (sur le modèle de `/article/agence-seo-tours/`)
- Idem pour d'autres villes du périmètre (Joué-lès-Tours, Saint-Cyr, Chambray-lès-Tours)

**Action** : pour chaque nouvelle page, propose-moi un brief (titre, structure, mots-clés ciblés) avant de la créer en brouillon.

## 4.2 Cluster "Tarifs / Coûts agence digitale"

**Mot-clé cible** : "combien coûte une agence digitale", "tarif agence SEO Tours"

**Action** : créer un article pilier `/article/combien-coute-agence-digitale-tours/` avec fourchettes de prix réelles 2026, exemples chiffrés.

## 4.3 Cluster "SEO IA / GEO (Generative Engine Optimization)"

1 seul article existe (`skills-claude-guide-marketing-digital`). Opportunité pour un cluster :
- "ChatGPT search : comment apparaître"
- "Google AI Overviews : optimiser sa présence"
- "Citations LLM : être référencé par Claude/ChatGPT/Gemini"
- "Ranking IA vs SEO classique : différences"

## 4.4 Cluster "Comparatifs outils"

Volumes élevés, faible concurrence. Idées :
- "Make vs Zapier vs n8n : comparatif 2026"
- "HubSpot vs Brevo : lequel choisir"
- "Yoast vs RankMath : meilleur plugin SEO"
- "WordPress vs Webflow : pour quelle entreprise"

## 4.5 Reformater les 4 cas clients en case studies long-form

**Cas existants** : Gymfit, Epicure, Oceades, Parcbeauregard.

**Action** : pour chaque cas, étoffer à 1500+ mots avec :
- Problème de départ (200 mots)
- Méthode appliquée (400 mots)
- Résultats chiffrés (200 mots)
- Verbatim client si disponible
- Schema `CaseStudy`

## 4.6 Mailler le glossaire en cocon sémantique

25+ définitions existent (`/glossaire/definition-X/`) mais sans liens entre elles.

**Action** : pour chaque définition, ajouter une section "Termes liés" avec 3 liens vers d'autres définitions du glossaire (ex: CPC ↔ CPA ↔ ROAS ↔ ROI).

## 4.7 Plan de site HTML

Créer `/plan-du-site/` (page HTML listant toutes les pages) en plus du sitemap XML. Améliore le maillage et l'UX SEO.

## 4.8 Schema Service sur les pages /nos-services/

Ajouter un schema `Service` ou `Product` sur les 6 pages `/nos-services/X/` avec :
- `provider` : Organization DGL Agency
- `serviceType` : nom du service
- `areaServed` : Tours, Indre-et-Loire, Centre-Val de Loire

---

# 📋 Format de reporting attendu

Après chaque sprint complet ou batch important, fournis-moi un rapport au format suivant :

## Récap Sprint X

**Fait** :
- ✅ [Action 1] sur [URL] — diff appliquée
- ✅ [Action 2] sur [URL] — diff appliquée

**Skippé / Bloqué** :
- ⚠️ [Action X] sur [URL] — raison : [pourquoi]

**À valider manuellement par Mahmoud** :
- 🔧 [Action] dans Yoast Admin — instruction : [comment faire]

**Erreurs rencontrées** :
- ❌ [Erreur] sur [URL] — détail technique

**Prochaine étape suggérée** :
- ➡️ [Action suivante]

---

# 🛡️ Garde-fous

Si tu rencontres une de ces situations, **arrête-toi et signale-le-moi** :

1. **Page introuvable** : l'URL ne renvoie aucune page via `wp_pages_search`.
2. **Contenu Oxygen** : le contenu est dans des meta `ct_builder_*` plutôt que `post_content` standard.
3. **Yoast incompatible** : tu n'arrives pas à modifier `_yoast_wpseo_title` ou `_yoast_wpseo_metadesc` via `wp_update_page`/`wp_update_post`.
4. **Plugin tiers** : modification bloquée par un autre plugin (RankMath actif en parallèle ? Cache ?).
5. **Réponse API étrange** : erreur 500, timeout, ou réponse non-JSON.

Dans tous ces cas, **ne tente pas de contourner** — décris-moi le problème et attends que je te dise comment procéder.

---

# 🎯 Priorité d'exécution recommandée

**Aujourd'hui (30-60 min)** :
- Sprint 1.2 : H1 multiples sur homepage + mentions + CGV
- Sprint 1.3 : 2 metas manquantes
- Sprint 1.5 : nettoyer `[1]` dans meta `/pagespeed-tool/`
- Me rappeler de faire le Sprint 1.4 (Breadcrumb Yoast) manuellement

**Cette semaine (2-3h)** :
- Sprint 2.1 : raccourcir les 34 titles (par batch de 10)
- Sprint 2.2 : raccourcir les 30 metas (par batch de 10)
- Sprint 2.3 : nettoyer les caractères encodés en même temps
- Sprint 2.4 : ajouter les alt aux images des pages services

**Sous 30 jours (1-3 jours de travail)** :
- Sprint 3.1 : enrichir les 7 pages services
- Sprint 3.2 : résoudre la cannibalisation "agence Tours"

**Backlog (2-3 mois)** :
- Sprint 4 entier

---

**Commence par le Sprint 1.2 (H1 homepage)**. Récupère d'abord la structure de la page d'accueil, montre-moi ce que tu trouves, et on décide ensemble de la prochaine étape.
