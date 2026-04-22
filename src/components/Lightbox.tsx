import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

interface LightboxProps {
  images: string[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const { t } = useLang()

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
        aria-label={t('閉じる', 'Close')}
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 md:left-10 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
          aria-label={t('前の画像', 'Previous image')}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <img
        src={images[index]}
        alt={`${index + 1} / ${images.length}`}
        role="presentation"
        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
        onClick={e => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 md:right-10 glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
          aria-label={t('次の画像', 'Next image')}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {images.length > 1 && (
        <div role="presentation" className="absolute bottom-4 flex gap-2" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === index ? 'bg-kanade-blush scale-125' : 'bg-kanade-sand/40 hover:bg-kanade-sand/70'
              }`}
              aria-label={`${t('画像', 'Image')} ${i + 1}`}
            />
          ))}
        </div>
      )}

      <p className="absolute bottom-4 right-4 text-white/30 text-xs">
        {index + 1} / {images.length}
      </p>
    </div>
  )
}
