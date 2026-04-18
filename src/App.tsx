import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'
import Home        from './pages/Home'
import Events      from './pages/Events'
import EventDetail from './pages/events/EventPage'
import Members     from './pages/Members'
import Gallery     from './pages/Gallery'
import Contact     from './pages/Contact'

export default function App() {
  return (
    <HelmetProvider>
    <LanguageProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
    </BrowserRouter>
    </LanguageProvider>
    </HelmetProvider>
  )
}
