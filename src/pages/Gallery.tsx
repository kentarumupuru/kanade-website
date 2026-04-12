import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

export interface GalleryImage {
  id: number
  src: string
  thumbnail: string
  alt: string
  caption?: string
  captionJa?: string
  category: 'performance' | 'venue' | 'group' | 'behind-the-scenes'
}

// Placeholder gallery data — replace src/thumbnail with real image paths in public/gallery/
export const galleryImages: GalleryImage[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `${import.meta.env.BASE_URL}gallery/image-${i + 1}.jpg`,
  thumbnail: `${import.meta.env.BASE_URL}gallery/thumb-${i + 1}.jpg`,
  alt: `KANADE performance photo ${i + 1}`,
  caption: [
    'Spring Bloom Concert — Shirogane',
    'Moonlit Serenade rehearsal',
    'Housing setup by Kokoro & Mio',
    'Cherry Blossom Opening night',
    'Behind the curtain',
    'Backstage preparations',
    'Group gathering at the Goblet',
    'Mana & Himawari duet',
    'Lavender Beds venue',
    'Pre-show lineup',
    'Audience view from the stage',
    'Post-show celebration',
  ][i],
  captionJa: [
    'スプリングブルームコンサート — 白銀',
    '月光セレナーデ リハーサル',
    'こころ＆みおによるハウジングセットアップ',
    'さくら開幕ナイト',
    '舞台裏にて',
    '開演前の準備',
    'ゴブレットでのグループ集合',
    'マナ＆ひまわりのデュエット',
    'ラベンダーベッズ会場',
    '開演前の整列',
    'ステージからの客席',
    '公演後のお祝い',
  ][i],
  category: (['performance', 'venue', 'group', 'behind-the-scenes'] as const)[i % 4],
}))

function PlaceholderTile({ image }: { image: GalleryImage }) {
  const gradients = [
    'from-kanade-blush/30 to-kanade-lavender/30',
    'from-kanade-lavender/30 to-kanade-mist/30',
    'from-kanade-gold/20 to-kanade-blush/20',
    'from-kanade-mist/30 to-kanade-lavender/20',
    'from-kanade-rose/20 to-kanade-gold/20',
    'from-kanade-lilac/20 to-kanade-blush/20',
  ]
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradients[image.id % gradients.length]}
                     flex items-center justify-center`}>
      <ImageIcon size={32} className="text-kanade-cream/20" />
    </div>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const { t, lang } = useLang()
  const image = images[index]
  const caption = lang === 'ja' ? (image.captionJa ?? image.caption) : image.caption

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
        aria-label={t('閉じる', 'Close')}
      >
        <X size={28} />
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 md:left-10 text-white/60 hover:text-white transition-colors
                   glass rounded-full p-3"
        aria-label={t('前の画像', 'Previous image')}
      >
        <ChevronLeft size={24} />
      </button>

      <div
        className="relative max-w-4xl max-h-[80vh] mx-16"
        onClick={e => e.stopPropagation()}
      >
        {/* Real image with fallback */}
        <img
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
          onError={e => {
            const el = e.currentTarget
            el.style.display = 'none'
            el.nextElementSibling?.classList.remove('hidden')
          }}
        />
        {/* Fallback placeholder */}
        {/* hidden until JS removes the class; flex is the revealed layout — intentional pattern */}
        {/* tailwind-disable-next-line cssConflict */}
        <div className="hidden w-[600px] h-[400px] rounded-xl bg-gradient-to-br from-kanade-blush/20 to-kanade-lavender/20 items-center justify-center">
          <ImageIcon size={48} className="text-kanade-cream/20" />
        </div>

        {caption && (
          <p className="text-center text-kanade-sand/60 text-sm mt-4 tracking-wide">{caption}</p>
        )}

        <p className="text-center text-kanade-sand/30 text-xs mt-2">
          {index + 1} / {images.length}
        </p>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 md:right-10 text-white/60 hover:text-white transition-colors
                   glass rounded-full p-3"
        aria-label={t('次の画像', 'Next image')}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryImage['category'] | 'all'>('all')
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null)
  const { t, lang } = useLang()

  const categoryLabels: Record<GalleryImage['category'] | 'all', string> = {
    all:                 t('すべて',       'All'),
    performance:         t('パフォーマンス', 'Performances'),
    venue:               t('会場',         'Venues'),
    group:               t('グループ',      'Group'),
    'behind-the-scenes': t('舞台裏',        'Behind the Scenes'),
  }

  const filtered = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory)

  const openLightbox  = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null)

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6 text-center">
        <p className="text-kanade-lavender/60 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
          {t('思い出', 'Memories')}
        </p>
        <h1 className="section-title">{t('ギャラリー', 'Gallery')}</h1>
        <div className="section-divider" />
        <p className="text-kanade-sand/50 max-w-xl mx-auto text-sm leading-relaxed">
          {t(
            'KANADEの歩みを彩るスクリーンショット、パフォーマンスの瞬間、舞台裏の一幕をお届けします。',
            'Screenshots, performance moments, and behind-the-scenes glimpses from KANADE\'s journey.'
          )}
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(Object.keys(categoryLabels) as (GalleryImage['category'] | 'all')[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-kanade-rose to-kanade-lavender text-white shadow-lg shadow-kanade-rose/20'
                  : 'glass text-kanade-sand/50 hover:text-kanade-sand/80'}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((image, i) => {
            const caption = lang === 'ja' ? (image.captionJa ?? image.caption) : image.caption
            return (
              <div
                key={image.id}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer
                           group relative aspect-square glass hover:ring-1 hover:ring-kanade-lavender/30
                           transition-all duration-300 hover:shadow-lg hover:shadow-kanade-lavender/10"
                style={{ aspectRatio: i % 5 === 0 ? '1/1.3' : i % 3 === 0 ? '1/0.8' : '1/1' }}
                onClick={() => openLightbox(i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openLightbox(i)}
                aria-label={t(`${caption}を表示`, `View ${image.alt}`)}
              >
                {/* Try real image, fall back to placeholder */}
                <img
                  src={image.thumbnail}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    el.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full">
                  <PlaceholderTile image={image} />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-kanade-deep/60 opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 flex items-end p-3">
                  {caption && (
                    <p className="text-kanade-cream/80 text-xs leading-snug">{caption}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Upload note */}
        <div className="card text-center mt-12 py-10">
          <ImageIcon size={36} className="mx-auto text-kanade-lavender/30 mb-4" />
          <p className="text-kanade-sand/40 text-sm mb-2">
            {t(
              'スクリーンショットやイベント写真はここに表示されます。',
              'Screenshots and event photos will appear here.'
            )}
          </p>
          <p className="text-kanade-sand/25 text-xs">
            {t('画像は ', 'Place images in ')}<code className="text-kanade-lavender/40">public/gallery/</code>
            {t(' に配置してください。', ' following the naming convention above.')}
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
