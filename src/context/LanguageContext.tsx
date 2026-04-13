import { createContext, useContext, useState, useCallback, useMemo } from 'react'

export type Lang = 'ja' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (ja: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja')

  const toggle = useCallback(() => setLang(l => (l === 'ja' ? 'en' : 'ja')), [])
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
