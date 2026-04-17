export interface GalleryImage {
  id: number
  src: string
  thumbnail: string
  alt: string
  caption?: string
  captionJa?: string
  category: 'performance' | 'venue' | 'group' | 'behind-the-scenes'
}

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
