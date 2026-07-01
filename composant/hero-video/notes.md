# Notes — Hero Video + Marquee

## Statut

🧪 **À tester** — `/composant/hero-video`

## Choix d'implémentation

- **Motion** : le prompt disait "install motion". On utilise `framer-motion@12` qu'on a déjà (API identique — `motion` est juste le nouveau nom du package). Aucune dépendance ajoutée.
- **Fonts** : `Inter` + `Outfit` chargées via `@import` inline dans le composant (isolé). Le prompt suggérait de configurer le theme Tailwind globalement, mais tant qu'on n'a pas validé le composant, on ne touche pas à `index.css`.
- **Gradient hover** des cards logos : `.hv-card-gradient` scale(1.5) opacity(0) → scale(1) opacity(1) en 500ms cubic-bezier sur `:hover` de la card parente
- **Marquee** : pure CSS `@keyframes` translateX(0 → -50%), 30s linear infinite, pause on hover, mask edges fade
- **Video** : URL cloudfront directement — pas de fallback

## Choix libres (le prompt était générique)

Le prompt disait "hex gradient objects" sans donner les hex. J'ai choisi :

| Logo | Gradient (from → to) |
|------|----------------------|
| Procure | `#3b82f6` → `#1e40af` (blue) |
| Shopify | `#fbbf24` → `#f59e0b` (yellow) |
| Blender | `#60a5fa` → `#2563eb` (blue) |
| Figma | `#a78bfa` → `#6d28d9` (purple) |
| Spotify | `#f472b6` → `#dc2626` (pink/red) |
| Lottielab | `#facc15` → `#22c55e` (yellow/green) |
| Google Cloud | `#93c5fd` → `#60a5fa` (light blue) |
| Bing | `#22d3ee` → `#0891b2` (cyan/teal) |

À ajuster si tu veux d'autres nuances.

## Assets externes

- **Video** : `d8j0ntlcm91z4.cloudfront.net/...mp4` — dépend du CDN cloudfront
- **Logos** : `svgl.app/library/[nom].svg` — CDN svgl.app

Si validé → télécharger en local avec les 20 autres assets Bancuip.

## À prévoir avant intégration DGL

- [ ] Remplacer la video par un visuel DGL (ou vidéo)
- [ ] Adapter le headline "Foundation of the new digital epoch" → texte DGL
- [ ] Adapter le subheadline
- [ ] Remplacer les 8 logos par les logos clients DGL
- [ ] "Contact Us" → "Audit gratuit" ou "Nous contacter"
- [ ] Nav "Products / Docs / Get in touch" → nav DGL

## Compatibilité

- Video autoplay : OK sur tous les navigateurs modernes grâce à `muted`
- `backdrop-blur-2xl` : supporté partout sauf Firefox < 103 (petit fallback texte visible)
- Marquee 60fps : `will-change: transform` + `animation-play-state` sur hover
