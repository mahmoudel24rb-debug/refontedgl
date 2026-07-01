# Prompt : Hero Video + Marquee Logos

Build a modern, high-performance landing page section using React, TypeScript, Tailwind CSS v4, and Motion. The application should match the following exact specifications:

## 1. Dependencies & Setup

- Libraries: Install `lucide-react`, `motion`, `clsx`, and `tailwind-merge`.
- Fonts & CSS: In `index.css`, import Inter and Outfit from Google Fonts:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600&display=swap');
  ```
- Configure Tailwind theme to use Inter as `--font-sans` and Outfit as `--font-display`.
- Global body background : `#f9fafb`.

## 2. Main Hero Container & Video Background

- Hero container classes : `relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col`
- Underlying video layer : `absolute inset-0 pointer-events-none z-0 overflow-hidden select-none`
- Video URL : `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4`
- Video attrs : autoPlay loop muted playsInline, classes `w-full h-full object-cover scale-105 transition-transform duration-1000`. No overlays.

## 3. Hero Text Content

- Wrapper : `z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start`
- `motion.div` to animate fade in + slide up.
- Headline : "Foundation of the<br />new digital epoch" — font-display, `text-[42px] md:text-[56px]`, medium, tight tracking, `#0a1b33`.
- Subheadline : "Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike." — font-sans, `text-[14px] md:text-[15px]`, `#64748b`.
- Contact button : "Contact Us", `bg-[#0a152d]`, white, `rounded-full`, hover scale via `motion.button`.

## 4. Floating Bottom Navbar

- Wrapper : `absolute bottom-10 left-1/2 -translate-x-1/2 z-30`
- Nav : `motion.nav` fade in + slide up delayed, classes `flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40`
- Elements :
  - Circular logo left `w-9 h-9 bg-white border-slate-100 shadow-sm` avec "✦"
  - 2 text buttons : "Products" et "Docs" (`text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33]`)
  - "Get in touch" button + ChevronRight, style identique aux cards du marquee : `bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all`

## 5. Seamless Marquee Logo Scroller

- Sous le hero container (`mt-10`).
- Pure CSS `@keyframes` : `translateX(0)` → `translateX(-50%)`, infinite, pause on hover.
- Masking gradient gauche/droit (`maskImage linear-gradient` fading to transparent).
- Pas de titre au-dessus.
- 8 logos depuis svgl.app :
  1. Procure (procure.svg, blue gradient)
  2. Shopify (shopify.svg, yellow gradient)
  3. Blender (blender.svg, blue gradient)
  4. Figma (figma.svg, purple gradient)
  5. Spotify (spotify.svg, pink/red gradient)
  6. Lottielab (lottielab.svg, yellow/green)
  7. Google Cloud (google-cloud.svg, light blue)
  8. Bing (bing.svg, cyan/teal)
- Render 2× pour boucle seamless.
- Card classes exactes : `group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden`
- Div absolu avec gradient specific, scale 1.5 opacity 0 → scale 1 opacity 100 sur `group-hover`.
- Image : `group-hover:brightness-0 group-hover:invert`.
