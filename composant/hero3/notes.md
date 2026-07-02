# Notes — Hero3 (Glowy waves canvas)

## Statut

🧪 **À tester** — `/composant/hero3`

## Ce que fait le composant

Canvas 2D fullscreen qui dessine 5 couches de vagues sinusoïdales avec glow (shadowBlur). La position de la souris déforme localement les vagues via une fonction d'influence par distance (radius 320px). Interpolation lissée (smoothing 0.1) pour éviter le jitter.

Au-dessus du canvas : contenu centré avec entrance staggered (framer-motion) — badge + h1 avec gradient text + p + 2 CTA + pills + card stats (3 colonnes).

## Adaptations depuis le prompt d'origine

Le prompt supposait un projet shadcn complet :

| Prompt d'origine | Ce qu'on a fait |
|---|---|
| `Button` from `@/components/ui/button` | Bouton inline (`PrimaryButton` + `GhostButton`) |
| CSS vars `--primary`, `--background`, `--foreground`, `--muted`, `--accent`, `--secondary` | Hardcode palette DGL (`#002329` + `#fe5752`) |
| Détection theme via `MutationObserver` sur `<html>` | Supprimé (pas de dark/light switch dans le projet) |
| Copy en anglais générique | Copy DGL en français |
| Stats "320+ installations / 8ms latency / 120+ teams" | "500+ clients / 10 ans / 120+ campagnes" |
| Pills "Immersive visuals / Responsive motion / GPU friendly" | "ROAS mesurable / Setup 15j / Reporting mensuel" |
| Bouton "Launch Studio / Explore stories" | "Audit gratuit / Voir nos réalisations" |

## Choix libres

- **Canvas fill parent** (pas `window`) — pour cohabiter avec la topbar 48px de `/composant/[slug]`
- **Palette wave** : coral principal → coral soft → cream → white transparent → coral bas. Ordre choisi pour créer une profondeur visuelle
- **Halo gradients** : 3 disques flous (140/120/150px blur) placés top-center / bottom-right / mid-left pour renforcer la sensation de profondeur
- **CTA primaire** : coral solide + shadow coral 35% (au lieu du outline shadcn) — plus punchy
- **CTA secondaire** : ghost avec border coral 40% + backdrop-blur (glass effect discret)

## Perf

- 60fps sur desktop moderne. La boucle est en `requestAnimationFrame`, chaque frame draw 5 waves × (canvas.width / 4) points, soit ~2500 points par frame en 1920px.
- `prefers-reduced-motion` honoré : `mouseInfluence` divisé par 7, `smoothing` divisé par 2.5

## À prévoir avant intégration DGL

- [ ] Décider si on remplace le hero1 (orbites équipe) par ce hero3, ou si on l'utilise sur une autre page
- [ ] Si intégré : remplacer `min-h-[calc(100vh-48px)]` par `100vh`
- [ ] Vérifier le contraste texte sur les vagues (opacité waves déjà max 0.45, texte reste lisible)
- [ ] Ajouter le tracking sur les 2 CTA
- [ ] Peut-être remplacer les stats par des vrais nombres du CRM
