import { useMemo } from 'react'
import { NAV_ITEMS } from '../data/navItems'
import { useLang } from '../context/LanguageContext'

export interface NavItem {
  label: string
  to: string
}

export function useNavItems(): NavItem[] {
  const { t } = useLang()
  return useMemo(
    () => NAV_ITEMS.map(item => ({ label: t(item.labelJa, item.labelEn), to: item.to })),
    [t],
  )
}
