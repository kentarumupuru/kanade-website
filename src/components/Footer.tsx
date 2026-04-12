import { Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { NAV_ITEMS } from '../data/navItems'

// Replace with real Twitter/X URL once available
const TWITTER_URL = 'https://x.com/FF14_Kanade2020'

export default function Footer() {
  const { t } = useLang()

  const navItems = NAV_ITEMS.map(item => ({ label: t(item.labelJa, item.labelEn), to: item.to }))

  return (
    <footer className="relative z-10 border-t border-white/5 py-10 px-6 mt-20 pb-28">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <img src={`${import.meta.env.BASE_URL}titlelogo.png`} alt="KANADE" className="h-9 w-auto" />
          <p className="text-kanade-sand/40 text-xs tracking-widest mt-1 uppercase">
            {t('パフォーミンググループ・ファイナルファンタジーXIV', 'Performing Group · Final Fantasy XIV')}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs tracking-wide uppercase text-kanade-sand/50 md:gap-x-6 md:tracking-widest">
          {navItems.map(({ label, to }) => (
            <Link key={to} to={to} className="hover:text-kanade-blush transition-colors whitespace-nowrap">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-full p-2.5 text-kanade-sand/50 hover:text-kanade-blush
                       hover:border-kanade-blush/30 transition-all duration-200"
            aria-label={t('KANADEをX/Twitterでフォロー', 'Follow KANADE on X / Twitter')}
          >
            <Twitter size={18} />
          </a>
        </div>
      </div>

      <p className="text-center text-kanade-sand/25 text-xs mt-8 tracking-widest">
        © {new Date().getFullYear()} KANADE Performing Group.{' '}
        {t('全著作権所有。', 'All rights reserved.')}
      </p>
    </footer>
  )
}
