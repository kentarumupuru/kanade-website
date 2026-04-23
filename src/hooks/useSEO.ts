import { useEffect } from 'react'
import { SITE_URL } from '../data/config'

const DEFAULT_IMAGE = `${SITE_URL}/logos/logo.png`

interface SEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

type MetaField =
  | { key: 'description' | 'twitter:title' | 'twitter:description' | 'twitter:image'; attr: 'name' }
  | { key: 'og:title' | 'og:description' | 'og:image' | 'og:url'; attr: 'property' }

const META_FIELDS: readonly MetaField[] = [
  { key: 'description',         attr: 'name' },
  { key: 'og:title',            attr: 'property' },
  { key: 'og:description',      attr: 'property' },
  { key: 'og:image',            attr: 'property' },
  { key: 'og:url',              attr: 'property' },
  { key: 'twitter:title',       attr: 'name' },
  { key: 'twitter:description', attr: 'name' },
  { key: 'twitter:image',       attr: 'name' },
] as const

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useSEO({ title, description, image = DEFAULT_IMAGE, url }: SEOProps) {
  const fullTitle = title.includes('KANADE') ? title : `${title} — KANADE`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  useEffect(() => {
    document.title = fullTitle

    const values: Record<MetaField['key'], string> = {
      'description':         description,
      'og:title':            fullTitle,
      'og:description':      description,
      'og:image':            image,
      'og:url':              fullUrl,
      'twitter:title':       fullTitle,
      'twitter:description': description,
      'twitter:image':       image,
    }

    for (const { key, attr } of META_FIELDS) {
      setMeta(attr, key, values[key])
    }
  }, [fullTitle, description, image, fullUrl])
}
