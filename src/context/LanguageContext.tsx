import { createContext, useContext, useState } from 'react'

export type Lang = 'ja' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (ja: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja')

  const toggle = () => setLang(l => (l === 'ja' ? 'en' : 'ja'))
  const t = (ja: string, en: string) => (lang === 'ja' ? ja : en)

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
