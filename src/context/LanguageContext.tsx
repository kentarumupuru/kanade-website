import { createContext, useContext, useState, useCallback, useMemo } from 'react'

export type Lang = 'ja' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (ja: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'kanade-lang'

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'ja' || stored === 'en') return stored
  } catch { /* localStorage unavailable (private browsing) */ }
  return 'ja'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang)

  const toggle = useCallback(() => setLang(l => {
    const next = l === 'ja' ? 'en' : 'ja'
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* intentional */ }
    return next
  }), [])
  const t = useCallback((ja: string, en: string) => (lang === 'ja' ? ja : en), [lang])
  const value = useMemo(() => ({ lang, toggle, t }), [lang, toggle, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
