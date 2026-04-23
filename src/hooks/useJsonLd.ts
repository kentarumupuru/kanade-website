import { useEffect } from 'react'

/**
 * Upserts a <script type="application/ld+json" id={id}> into document.head.
 * Pass `null` to skip injection (lets callers use the hook before conditional returns).
 * Removes the script on unmount.
 */
export function useJsonLd(data: unknown | null, id: string) {
  useEffect(() => {
    if (data === null || data === undefined) return
    let el = document.head.querySelector<HTMLScriptElement>(`script#${CSS.escape(id)}`)
    let created = false
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
      created = true
    }
    el.textContent = JSON.stringify(data)
    return () => {
      if (created) el?.parentNode?.removeChild(el)
    }
  }, [data, id])
}
