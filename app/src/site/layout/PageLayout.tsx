import { useEffect, type ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * Coquille commune des pages du site racine : thème clair sur <body>,
 * meta de page, navbar absolue, contenu, footer.
 * `tone` = fond de la premiere section (hero navy = dark, page claire = light).
 * `mainClassName` remplace (et non complete) les classes par defaut du
 * <main> : utile quand la premiere section porte un filigrane et demande un
 * autre retrait sous la navbar.
 */
export default function PageLayout({
  tone = 'light',
  title,
  description,
  mainClassName,
  children,
}: {
  tone?: 'dark' | 'light'
  title: string
  description: string
  mainClassName?: string
  children: ReactNode
}) {
  usePageMeta(title, description)

  useEffect(() => {
    document.body.classList.add('site-theme')
    return () => {
      document.body.classList.remove('site-theme')
    }
  }, [])

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
