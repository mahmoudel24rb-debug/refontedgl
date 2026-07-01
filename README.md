# Refonte DGL Agency — React + Next.js

Dossier de travail pour la refonte complète du site https://dgl-agency.fr, actuellement sur WordPress + Oxygen Builder 4.0.

## Objectif

Migrer le site vers une stack **Next.js 15 + React 19 + TypeScript + Tailwind CSS**, en gardant la ligne éditoriale et les lead magnets fonctionnels, mais avec une architecture moderne, performante et maintenable.

## Motivations

- **Performance** : score Lighthouse actuel perfectible, la refonte SSR + edge caching visera >95 mobile & desktop
- **SEO** : capitaliser sur l'audit SEO en cours (voir `audit-seo/PLAN-CORRECTION-SEO-DGL-AGENCY.md`)
- **DX** : sortir d'Oxygen Builder qui limite les développeurs (Code Blocks PHP inline, pas de versioning propre)
- **Sécurité** : arrêter d'avoir des clés API en clair dans le JS front (cas actuel du tool PageSpeed)
- **Scalabilité** : préparer l'agence à multiplier les lead magnets et les cas clients sans friction

## État actuel

- ✅ Audit SEO complet du site actuel (118 URLs analysées) → voir `audit-seo/`
- ✅ Tous les fichiers du site WordPress actuel préservés dans `../site-wordpress-actuel/` comme référence
- 🚧 Architecture Next.js à définir
- 🚧 Design system à formaliser
- 🚧 Migration des lead magnets à planifier

## Stack cible

| Couche | Choix | Raison |
|--------|-------|--------|
| Framework | **Next.js 15 (App Router)** | SSR/SSG/ISR natif, edge runtime, RSC |
| Langage | **TypeScript** | Sécurité de type, maintenabilité long-terme |
| UI | **React 19** | Server Components, Actions natives |
| Styles | **Tailwind CSS v4** | Rapidité + design system cohérent |
| Composants | **shadcn/ui** | Base accessible, customisable, non-dépendante |
| CMS | **À décider** : Sanity ? Payload CMS ? Notion API ? Contentful ? Ou Markdown/MDX ? |
| Hébergement | **Vercel** (probable) | Optimal pour Next.js, edge network, analytics |
| Formulaires | **React Hook Form + Zod** | Validation typée, DX excellente |
| Emails | **Resend** ou **Brevo** | À aligner avec l'existant |
| CRM | **Jetpack CRM** (via API) ou migration | À décider selon le budget |
| Analytics | **GA4 + Plausible** | Conserver le tracking existant |

## Lead magnets à porter

Ordre de migration proposé (par simplicité/valeur) :

1. **Simulateur ROI** (calculs client-side, léger) — le plus simple à porter
2. **PageSpeed Tool** (appel API externe) — guide de portage déjà rédigé pour l'agence Maroc, réutilisable ici
3. **Landing Page Roaster** (upload image + Claude Vision)
4. **Générateur Stratégie Marketing IA** (Claude API + PDF)
5. **Générateur Cahier des Charges SaaS** (Claude API + PDF)
6. **DGL AI Menu** (plugin restaurant — cas particulier, à voir)

## Prochaines étapes

- [ ] Choisir le CMS (ou l'absence de CMS avec MDX)
- [ ] Initialiser le projet Next.js (`create-next-app`)
- [ ] Formaliser le design system (couleurs, typo, composants clés)
- [ ] Reproduire la homepage
- [ ] Attaquer la migration des lead magnets un par un

## Organisation du dossier

```
refonte-dgl/
├── README.md                    ← Ce fichier
├── audit-seo/                   ← Audit SEO à intégrer dans la refonte
│   └── PLAN-CORRECTION-SEO-DGL-AGENCY.md
└── (à venir)
    ├── docs/                    ← Décisions d'architecture, brief, specs
    ├── design-system/           ← Tokens, composants clés, wireframes
    └── app/                     ← Projet Next.js
```

---

**Référence** : le code de l'ancien site WordPress est intégralement conservé dans `../site-wordpress-actuel/` — à consulter pour la logique métier des lead magnets.
