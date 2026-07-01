# Composants isolés — workflow de test

Ce dossier sert à **prototyper des composants isolément** avant de décider de les intégrer au site principal.

## Structure

Chaque composant a son propre sous-dossier :

```
composant/
├── README.md                       ← Ce fichier
├── [nom-du-composant]/
│   ├── prompt.md                   ← Le prompt source (fourni par Mahmoud)
│   ├── notes.md                    ← Notes de développement / statut
│   └── (les fichiers de code vivent dans app/src/composant/[nom]/)
```

Les **fichiers de code** (`.tsx`, `.css`) sont placés dans `../app/src/composant/[nom-du-composant]/` pour être visibles/testables dans le dev server Vite.

## Workflow

1. **Mahmoud envoie un prompt** de composant.
2. **Claude crée le sous-dossier** `composant/[nom]/` avec le `prompt.md`.
3. **Claude code le composant** dans `app/src/composant/[nom]/Component.tsx`.
4. **Ajout d'une route de démo** : `/composant/[nom]` dans le routeur React → affiche le composant isolé sur fond DGL.
5. **Mahmoud teste** en local (`pnpm dev`) via l'URL `http://localhost:5173/composant/[nom]`.
6. **Si validé** → on **promeut** le composant dans `app/src/components/` et on l'ajoute à `pages/Index.tsx` au bon endroit.
7. **Si rejeté** → on laisse dans `composant/` pour référence future, ou on supprime.

## Statuts possibles (dans `notes.md`)

| Statut | Signification |
|--------|---------------|
| 🔨 En cours | Composant en développement |
| 🧪 À tester | Prêt à être testé par Mahmoud |
| ✅ Validé | Prêt à être promu vers `app/src/components/` |
| 🚀 Intégré | Déjà déplacé dans le site principal |
| ❌ Rejeté | Ne sera pas utilisé (mais gardé pour référence) |

## Index de démo

Pour lister tous les composants isolés en un seul endroit, la route `/composant` (sans nom) affiche un index des composants disponibles.

## Guidelines pour Claude

Quand tu crées un composant isolé :
- Suis les tokens de couleur DGL : `--dgl-dark: #002329`, `--dgl-coral: #fe5752`, etc.
- Utilise Inter Tight comme font par défaut
- Le composant doit être **self-contained** (pas de dépendance à d'autres sections du site)
- Utilise l'helper `asset()` de `@/lib/utils` pour les images
- Import motion depuis `framer-motion`, icons depuis `lucide-react`
- Le composant doit exporter un component principal + optionnellement une `Demo` wrapper qui l'affiche sur fond DGL
