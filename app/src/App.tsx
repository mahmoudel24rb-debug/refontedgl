import { Suspense, lazy, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster as Sonner } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import NotFound from '@/pages/NotFound'
import ComposantIndex from '@/pages/ComposantIndex'
import ComposantView from '@/pages/ComposantView'
import Home from '@/site/pages/Home'

const Realisations = lazy(() => import('@/site/pages/Realisations'))
const Outils = lazy(() => import('@/site/pages/Outils'))
const Tarifs = lazy(() => import('@/site/pages/Tarifs'))
const Blog = lazy(() => import('@/site/pages/Blog'))
const BlogPost = lazy(() => import('@/site/pages/BlogPost'))

const queryClient = new QueryClient()

/** Remonte en haut a chaque changement de route, sauf ancre explicite. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/realisations" element={<Realisations />} />
              <Route path="/outils" element={<Outils />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/composant" element={<ComposantIndex />} />
              <Route path="/composant/:slug" element={<ComposantView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
