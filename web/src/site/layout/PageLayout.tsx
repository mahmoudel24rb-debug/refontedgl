import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Coquille commune des pages du site racine : navbar absolue, contenu,
 * footer. Composant serveur : le theme clair est pose une fois pour
 * toutes sur <body class="site-theme"> par le layout du groupe (site), et
 * les metadonnees passent par `metadata` / `generateMetadata`.
 * `tone` = fond de la premiere section (hero navy = dark, page claire = light).
 * `mainClassName` remplace (et non complete) les classes par defaut du
 * <main> : utile quand la premiere section porte un filigrane et demande un
 * autre retrait sous la navbar.
 */
export default function PageLayout({
  tone = 'light',
  mainClassName,
  children,
}: {
  tone?: 'dark' | 'light'
  mainClassName?: string
  children: ReactNode
}) {
  return (
    <div className="bg-page text-ink relative min-h-screen w-full overflow-x-hidden">
      <Navbar tone={tone} />
      <main
        className={
          mainClassName ?? (tone === 'light' ? 'pt-28 md:pt-36' : undefined)
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
