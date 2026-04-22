import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'

const Home        = lazy(() => import('./pages/Home'))
const Events      = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/events/EventPage'))
const Members     = lazy(() => import('./pages/Members'))
const Gallery     = lazy(() => import('./pages/Gallery'))
const Contact     = lazy(() => import('./pages/Contact'))

function PageFallback() {
  return <div className="min-h-screen bg-kanade-charcoal" />
}

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index                      element={<Home />}        />
            <Route path="events"              element={<Events />}      />
            <Route path="events/:slug"        element={<EventDetail />} />
            <Route path="members"             element={<Members />}     />
            <Route path="gallery"             element={<Gallery />}     />
            <Route path="contact"             element={<Contact />}     />
            <Route path="*"                   element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </LanguageProvider>
  )
}
