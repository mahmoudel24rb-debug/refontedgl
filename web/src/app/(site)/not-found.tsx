import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page introuvable',
  description: "La page demandee n'existe pas ou a ete deplacee.",
  robots: { index: false, follow: false },
}

/** Page 404 du site public, dans la charte cream et navy. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-xl text-primary">Erreur 404</p>
      <h1 className="text-4xl font-medium leading-tight text-ink sm:text-5xl">
        Cette page n&apos;existe pas
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Le lien est peut-être obsolète ou l&apos;adresse a été modifiée.
      </p>
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-deep"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
