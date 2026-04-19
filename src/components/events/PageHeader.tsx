import { useLang } from '../../context/LanguageContext'
import { useInView } from '../../hooks/useInView'

export default function EventsPageHeader() {
  const { t } = useLang()
  const { ref, inView } = useInView()
  return (
    <section className="pt-32 pb-12 px-6 text-center">
      <div ref={ref} className={`reveal-up${inView ? ' is-visible' : ''}`}>
        <p className="text-kanade-lavender/80 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
          {t('スケジュール', 'Schedule')}
        </p>
        <h1 className="section-title">{t('イベント', 'Events')}</h1>
        <div className="section-divider" />
        <p className="text-kanade-sand/70 max-w-xl mx-auto text-sm leading-relaxed">
          {t(
            'エオルゼア各地でのライブパフォーマンス、コンサート、特別公演にぜひご参加ください。特に記載がない限り、すべてのイベントはTonberryサーバーのゲーム内で開催されます。',
            'Join us for live performances, concerts, and special occasions across Eorzea. All events are held in-game on the Tonberry server unless otherwise noted.'
          )}
        </p>
      </div>
    </section>
  )
}
