import { useEffect } from 'react'
import { SITE_URL } from '../data/config'

const DEFAULT_IMAGE = `${SITE_URL}/logos/logo.png`

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

export function useSEO({ title, description, image = DEFAULT_IMAGE, url }: SEOProps) {
  const fullTitle = title.includes('KANADE') ? title : `${title} — KANADE`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  useEffect(() => {
    document.title = fullTitle

    const set = (sel: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(sel)
      if (!el) {
        el = document.createElement('meta')
        const match = sel.match(/\[(\w+[:\w]*)="([^"]+)"\]/)
        if (match) el.setAttribute(match[1], match[2])
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    set('meta[name="description"]', description)
    set('meta[property="og:title"]', fullTitle)
    set('meta[property="og:description"]', description)
    set('meta[property="og:image"]', image)
    set('meta[property="og:url"]', fullUrl)
    set('meta[name="twitter:title"]', fullTitle)
    set('meta[name="twitter:description"]', description)
    set('meta[name="twitter:image"]', image)
  }, [fullTitle, description, image, fullUrl])
}
