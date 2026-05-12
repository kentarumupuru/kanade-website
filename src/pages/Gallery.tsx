import { useEffect, useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { revealDelayClass } from '../utils/animations'
import { ImageIcon } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useInView } from '../hooks/useInView'
import Lightbox from '../components/Lightbox'
import { galleryImages, type GalleryImage } from '../data/gallery'
import { TILE_GRADIENTS } from '../data/constants'
import { FilterButton } from '../components/FilterButton'

function PlaceholderTile({ image }: { image: GalleryImage }) {
  return (
    <div className={`w-full h-full bg-gradient-to-br ${TILE_GRADIENTS[image.id % TILE_GRADIENTS.length]}
                     flex items-center justify-center`}>
      <ImageIcon size={32} className="text-kanade-cream/20" />
    </div>
  )
}

const TILE_INVIEW_OPTS = { threshold: 0.08 }

function GalleryTile({
  image,
  index,
  caption,
  onClick,
}: {
  image: GalleryImage
  index: number
  caption: string | undefined
  onClick: () => void
}) {
  const { t } = useLang()
  const { ref, inView } = useInView(TILE_INVIEW_OPTS)
  const delayClass = revealDelayClass(index)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      ref={ref}
      className={`break-inside-avoid rounded-xl overflow-hidden cursor-pointer
                 group relative glass hover:ring-1 hover:ring-kanade-lavender/30
                 transition-all duration-300 hover:shadow-lg hover:shadow-kanade-lavender/10
                 reveal-scale ${delayClass}${inView ? ' is-visible' : ''}`}
      style={{ aspectRatio: index % 5 === 0 ? '1/1.3' : index % 3 === 0 ? '1/0.8' : '1/1' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={t(`${caption}を表示`, `View ${image.alt}`)}
    >
      {imgError
        ? <PlaceholderTile image={image} />
        : (
          <img
            src={image.thumbnail}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )
      }

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-kanade-deep/60 opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 flex items-end p-3">
        {caption && (
          <p className="text-kanade-cream/80 text-xs leading-snug">{caption}</p>
        )}
      </div>
    </div>
  )
}

export default function Gallery() {
  useSEO({ title: 'Gallery — KANADE', description: 'Screenshots from our events', url: '/gallery' })
  const [activeCategory, setActiveCategory] = useState<GalleryImage['category'] | 'all'>('all')
  const [lightboxIndex,  setLightboxIndex]  = useState<number | null>(null)
  const { t, lang } = useLang()
  const { ref: headerRef,  inView: headerInView  } = useInView()
  const { ref: filtersRef, inView: filtersInView } = useInView()

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

  // Close lightbox when category changes to prevent out-of-bounds index.
  useEffect(() => {
    setLightboxIndex(null)
  }, [activeCategory])

  const closeLightbox = () => setLightboxIndex(null)

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div ref={headerRef} className={`reveal-up${headerInView ? ' is-visible' : ''}`}>
          <p className="text-kanade-lavender/80 tracking-[0.4em] text-xs uppercase mb-4 font-sans">
            {t('思い出', 'Memories')}
          </p>
          <h1 className="section-title">{t('ギャラリー', 'Gallery')}</h1>
          <div className="section-divider" />
          <p className="text-kanade-sand/70 max-w-xl mx-auto text-sm leading-relaxed">
            {t(
              'KANADEの歩みを彩るスクリーンショット、パフォーマンスの瞬間、舞台裏の一幕をお届けします。',
              'Screenshots, performance moments, and behind-the-scenes glimpses from KANADE\'s journey.'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Category filters */}
        <div
          ref={filtersRef}
          className={`flex flex-wrap justify-center gap-2 mb-10 reveal-fade${filtersInView ? ' is-visible' : ''}`}
        >
          {(Object.keys(categoryLabels) as (GalleryImage['category'] | 'all')[]).map(cat => (
            <FilterButton
              key={cat}
              value={cat}
              label={categoryLabels[cat]}
              isActive={activeCategory === cat}
              onClick={v => setActiveCategory(v as GalleryImage['category'] | 'all')}
            />
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((image, i) => {
            const caption = lang === 'ja' ? (image.captionJa ?? image.caption) : image.caption
            return (
              <GalleryTile
                key={image.id}
                image={image}
                index={i}
                caption={caption}
                onClick={() => setLightboxIndex(i)}
              />
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

      {lightboxIndex !== null && lightboxIndex < filtered.length && (
        <Lightbox
          images={filtered.map(img => img.src)}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
