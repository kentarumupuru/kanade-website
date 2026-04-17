import { useEffect } from 'react'

const BASE_URL = 'https://wolfie0420.github.io/kanade-website'
const DEFAULT_IMAGE = `${BASE_URL}/logos/logo.png`

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

export function useSEO({ title, description, image = DEFAULT_IMAGE, url }: SEOProps) {
  const fullTitle = title.includes('KANADE') ? title : `${title} — KANADE`
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL

  useEffect(() => {
    document.title = fullTitle

    const set = (sel: string, attr: string, val: string) => {
      const el = document.querySelector(sel)
      if (el) el.setAttribute(attr, val)
    }

    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', fullTitle)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:image"]', 'content', image)
    set('meta[property="og:url"]', 'content', fullUrl)
    set('meta[name="twitter:title"]', 'content', fullTitle)
    set('meta[name="twitter:description"]', 'content', description)
    set('meta[name="twitter:image"]', 'content', image)
  }, [fullTitle, description, image, fullUrl])
}
