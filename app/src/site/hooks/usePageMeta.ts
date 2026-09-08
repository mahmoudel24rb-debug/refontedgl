import { useEffect } from 'react'

/**
 * Pose le titre du document et la meta description de la route courante
 * (la balise est creee si elle n'existe pas encore).
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title

    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
  }, [title, description])
}

export default usePageMeta
