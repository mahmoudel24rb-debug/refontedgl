import { ImageResponse } from 'next/og'

import { DGL } from '@/site/tokens'

/**
 * Carte de partage du site, servie a l'adresse /opengraph-image.
 *
 * Le projet a trois layouts racines : un fichier de metadonnees
 * opengraph-image pose a la racine de app/ ne serait rattache qu'a un
 * seul d'entre eux, et pose dans un groupe il prend un chemin suffixe.
 * D'ou cette route explicite, referencee par OG_IMAGE dans lib/seo.ts.
 */
const TAILLE = { width: 1200, height: 630 }

/** Wordmark et baseline de la carte de partage. */
const WORDMARK = 'DGL Agency'
const BASELINE = 'Agence SEO & Ads à Tours'

/**
 * Recupere Inter Tight au format TrueType depuis Google Fonts.
 *
 * L'agent utilisateur ancien force la feuille de style historique, qui
 * pointe vers des .ttf : satori ne sait pas lire le woff2 servi aux
 * navigateurs modernes. En cas d'echec reseau, on rend l'image avec la
 * police par defaut plutot que de casser le build.
 */
async function interTight(poids: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${poids}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:1.9.2)' } },
    ).then((reponse) => reponse.text())

    const url = /src:\s*url\((https:[^)]+\.ttf)\)/.exec(css)?.[1]
    if (!url) return null

    const police = await fetch(url)
    if (!police.ok) return null
    return await police.arrayBuffer()
  } catch {
    return null
  }
}

/** Image de partage par defaut : navy, halo corail, wordmark et baseline. */
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  const [gras, moyen] = await Promise.all([interTight(700), interTight(400)])

  const fonts = [
    gras ? { name: 'Inter Tight', data: gras, weight: 700 as const, style: 'normal' as const } : null,
    moyen
      ? { name: 'Inter Tight', data: moyen, weight: 400 as const, style: 'normal' as const }
      : null,
  ].filter((police) => police !== null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: DGL.ink,
          position: 'relative',
          padding: '96px',
          fontFamily: fonts.length > 0 ? 'Inter Tight' : undefined,
        }}
      >
        {/* Halo corail dans le coin superieur droit */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            right: -200,
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${DGL.primary} 0%, rgba(254,87,82,0.28) 42%, rgba(254,87,82,0) 70%)`,
          }}
        />
        {/* Second halo, plus sourd, en bas a gauche */}
        <div
          style={{
            position: 'absolute',
            bottom: -320,
            left: -220,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(6,59,67,0.9) 0%, rgba(6,59,67,0) 68%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: DGL.primary,
              fontWeight: 400,
            }}
          >
            <div
              style={{
                width: 56,
                height: 4,
                borderRadius: 999,
                background: DGL.primary,
              }}
            />
            Tours, Centre-Val de Loire
          </div>

          <div
            style={{
              marginTop: 36,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -4,
              color: DGL.white,
              fontWeight: 700,
            }}
          >
            {WORDMARK}
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 46,
              lineHeight: 1.2,
              color: 'rgba(255,255,255,0.72)',
              fontWeight: 400,
            }}
          >
            {BASELINE}
          </div>
        </div>
      </div>
    ),
    { ...TAILLE, fonts: fonts.length > 0 ? fonts : undefined },
  )
}
