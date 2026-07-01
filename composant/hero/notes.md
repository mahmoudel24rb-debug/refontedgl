# Notes — Hero Marketeam

## Statut

🧪 **À tester** — visualiser sur `/composant/hero` en local

## Choix d'implémentation

- **Aucune lib externe** (comme demandé dans le prompt) — animations 100% CSS + JS pour typewriter et count-up
- **Fonts** : `Inter` + `Urbanist` chargées via `@import` inline dans le composant (pour ne pas polluer `index.html` tant que le composant n'est pas validé)
- **`@property --border-angle`** utilisé pour la bordure conic-gradient rotative. Requiert Chrome/Edge 85+, Safari 16.4+, Firefox 128+. Fallback : la bordure sera statique.
- **Avatars sur orbites** : counter-rotation appliquée en wrapper CSS pour que les visages restent droits pendant que l'orbite tourne
- **Compteur central** : counter-rotation aussi pour garder le texte "20k+" droit

## Interprétations à valider

1. **"David" cursor** — j'ai utilisé une icône pointer arrow simple filled avec le violet DGL. La forme exacte du curseur peut être ajustée si tu as une image spécifique
2. **Glow des avatars** — j'ai interprété les couleurs (purple/yellow/pink/blue/orange) par des `box-shadow` colorés. Peut être renforcé/atténué
3. **Background image** — c'est une URL Higgs.ai qui peut être lente à charger ou expirer. À télécharger en local si validé.
4. **Delays d'animations** — j'ai suivi le prompt à la lettre :
   - Typing démarre à 400ms
   - "Start Project" button apparaît à 3.2s
   - Curseur "David" à 3.6s
   - Avatars staggered 0.6s → 2.3s
   - Compteur "20k+" démarre à 1.2s (2s de count-up)

## Assets externes utilisés

Toutes les images pointent vers `polo-pecan-73837341.figma.site/_assets/v11/*` — donc dépendent de la disponibilité de ce site Figma. Si validé, il faudra les télécharger en local (comme pour Bancuip).

## À prévoir avant intégration

- [ ] Remplacer les avatars et logos par les vrais assets DGL (photos équipe + logos clients)
- [ ] Adapter le heading text à DGL
- [ ] Vérifier le rendu Safari (le `@property` peut avoir des surprises)
- [ ] Vérifier le rendu mobile (breakpoints déjà implémentés : xs/sm/md/lg/xl)
