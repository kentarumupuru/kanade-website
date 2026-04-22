export type MemberRole = 'Performer' | 'Housing' | 'Manager' | 'MC' | 'Streamer' | 'Representative'

export interface Member {
  id: number
  name: string
  nameJa: string
  roles: MemberRole[]
  job: string
  twitterHandle?: string
  world: string
  bio: string
  bioJa: string
  color: string
  link?: string
  eventIds?: number[]
  image?: string
  imagePosition?: string
}

export const members: Member[] = [
  // Representative
  {
    id: 1,
    name: 'Shia Crawford',
    nameJa: 'シア・クロフォード',
    roles: ['Representative', 'Manager', 'MC'],
    job: 'Dancer',
    twitterHandle: 'FF14_shia',
    world: 'Tonberry',
    bio: 'The heart and soul of KANADE. As founding Representative, Shia guides the group with vision, passion, and an unwavering dedication to every performance.',
    bioJa: 'KANADEの創設者であり団長。確かなビジョンと情熱で仲間を束ね、すべての舞台に全力を注ぐ。',
    color: 'from-kanade-rose/30 to-kanade-gold/20',
    link: '/',
  },
  // Manager
  {
    id: 14,
    name: 'Willens Loire',
    nameJa: 'ウィレンス・ロワール',
    roles: ['Manager'],
    job: 'Group Manager',
    twitterHandle: 'Willens_Loire',
    world: 'Tonberry',
    bio: 'The steady hand behind the scenes. Willens keeps KANADE running smoothly, coordinating events, schedules, and partnerships with calm efficiency.',
    bioJa: '舞台裏の要。イベント調整からスケジュール管理まで、KANADEの活動を支える冷静な司令塔。',
    color: 'from-kanade-deep/50 to-kanade-gold/20',
  },
  // Housing
  {
    id: 12,
    name: 'Aska Shinonome',
    nameJa: 'アスカ・シノノメ',
    roles: ['Housing', 'Performer'],
    job: 'Interior Designer',
    world: 'Tonberry',
    bio: 'Aska brings artistry to every space KANADE inhabits, sculpting stunning venues while also gracing the stage with a compelling presence.',
    bioJa: 'KANADEが立つ空間を芸術として捉え、美しい会場を生み出しつつステージでも輝く。',
    color: 'from-kanade-sand/20 to-kanade-lavender/20',
  },
  {
    id: 9,
    name: 'Mary Roze',
    nameJa: 'メアリー・ローズ',
    roles: ['Housing', 'Performer'],
    job: 'Pictomancer',
    world: 'Tonberry',
    bio: 'Mary paints the world of KANADE — both on stage with vivid magical performances and behind the scenes, crafting breathtaking venue designs.',
    bioJa: 'ステージでも舞台裏でも才能を発揮。鮮やかな魔法演技と会場デザインでKANADEを彩る。',
    color: 'from-kanade-rose/20 to-kanade-sand/20',
  },
  {
    id: 2,
    name: 'Miya Shikhu',
    nameJa: 'ミヤ・シクフ',
    roles: ['Housing', 'Performer'],
    job: 'Bard',
    twitterHandle: 'MShikhu',
    world: 'Tonberry',
    bio: 'A talented performer who also shapes the spaces KANADE calls home. Miya crafts immersive venues and delivers captivating on-stage moments with equal skill.',
    bioJa: '演奏とハウジングの二刀流。ステージでの表現力と会場づくりの両方で才能を発揮する。',
    color: 'from-kanade-lavender/20 to-kanade-blush/20',
    image: '/members/Miya Shikhu/Miya Shikhu.jpg',
    imagePosition: '50% 20%',
  },
  // Performers (alphabetical)
  {
    id: 10,
    name: 'Elna Elmeria',
    nameJa: 'エルナ・エルメリア',
    roles: ['Performer'],
    job: 'Bard',
    world: 'Tonberry',
    bio: 'Elna\'s melodies carry listeners to distant horizons. Her musicianship adds a lyrical, soul-stirring dimension to every KANADE show.',
    bioJa: '心に響く旋律で観客を遠い地平線へと誘う。その音楽性がKANADEの公演に深みを与える。',
    color: 'from-kanade-gold/20 to-kanade-mist/20',
  },
  {
    id: 11,
    name: "F'elis Rhul",
    nameJa: 'フェリス・ルル',
    roles: ['Performer'],
    job: 'Dancer',
    world: 'Tonberry',
    bio: 'Fluid and expressive, F\'elis moves with a natural grace that makes every performance feel effortless yet profound.',
    bioJa: 'しなやかで豊かな表現力。自然体でありながらも深みのあるパフォーマンスを届ける。',
    color: 'from-kanade-mist/20 to-kanade-cream/10',
  },
  {
    id: 5,
    name: 'Meiria Forester',
    nameJa: 'メイリア・フォレスター',
    roles: ['Performer'],
    job: 'Red Mage',
    world: 'Tonberry',
    bio: 'With theatrical flair and precise movement, Meiria transforms every performance into a vivid story told through dance and magic.',
    bioJa: '劇的な表現と精緻な動きで、舞台を鮮やかな物語へと昇華させる。',
    color: 'from-kanade-rose/20 to-kanade-lavender/20',
  },
  {
    id: 4,
    name: 'Mirka Flory',
    nameJa: 'ミルカ・フロリー',
    roles: ['MC', 'Performer'],
    job: 'White Mage',
    twitterHandle: 'FloryMirka',
    world: 'Tonberry',
    bio: 'Mirka is equally at home commanding the mic between acts or dazzling the crowd with a performance. Her wit and warmth tie every show together.',
    bioJa: 'MCとパフォーマーを兼任。軽妙なトークとステージでの輝きで、公演全体を華やかに彩る。',
    color: 'from-kanade-mist/20 to-kanade-lavender/20',
  },
  {
    id: 13,
    name: 'Ram Minakaze',
    nameJa: 'ラム・ミナカゼ',
    roles: ['Performer'],
    job: 'Dancer',
    twitterHandle: 'RMinakaze',
    world: 'Tonberry',
    bio: 'Swift and spirited, Ram channels the energy of a fresh wind across the stage — uplifting and impossible to look away from.',
    bioJa: '舞台に新鮮な風を吹き込む躍動感あふれるパフォーマー。その勢いから目が離せない。',
    color: 'from-kanade-blush/20 to-kanade-mist/20',
  },
  {
    id: 3,
    name: 'Rate Pino',
    nameJa: 'レイト・ピノ',
    roles: ['Performer'],
    job: 'Dancer',
    twitterHandle: 'ratepino_FF14',
    world: 'Tonberry',
    bio: 'Rate brings an infectious joy to every stage. Their expressive performances light up the audience and keep the energy soaring.',
    bioJa: '舞台に喜びをもたらすパフォーマー。表情豊かな演技で観客を魅了する。',
    color: 'from-kanade-blush/20 to-kanade-mist/20',
  },
  {
    id: 7,
    name: 'Riribell Kiregstanz',
    nameJa: 'リリベル・キレグスタンツ',
    roles: ['Performer'],
    job: 'Summoner',
    world: 'Tonberry',
    bio: 'Graceful and ethereal, Riribell weaves an otherworldly presence into every act, leaving audiences spellbound long after the curtain falls.',
    bioJa: '幽玄な存在感を舞台に漂わせ、幕が下りた後も観客の心に残り続ける。',
    color: 'from-kanade-lavender/25 to-kanade-mist/20',
  },
  {
    id: 8,
    name: 'Shia Connor',
    nameJa: 'シア・コナー',
    roles: ['Performer'],
    job: 'Dancer',
    world: 'Tonberry',
    bio: 'Passionate and precise, Shia Connor pours heart into every routine, moving with a conviction that resonates deeply with every crowd.',
    bioJa: '情熱と精密さを兼ね備え、心を込めたパフォーマンスで観客の共感を呼ぶ。',
    color: 'from-kanade-blush/25 to-kanade-gold/15',
  },
  {
    id: 6,
    name: 'The MaSin',
    nameJa: 'ザ・マシン',
    roles: ['Performer'],
    job: 'Ninja',
    twitterHandle: 'the_masin',
    world: 'Tonberry',
    bio: 'Sharp, dynamic, and always surprising — The MaSin brings an electrifying edge to the stage that keeps audiences on their feet.',
    bioJa: 'シャープでダイナミック、常に予想を超えるパフォーマンスで観客を興奮させる。',
    color: 'from-kanade-deep/40 to-kanade-rose/20',
  },
  // Streamer
  {
    id: 15,
    name: 'Usshi Ohalala',
    nameJa: 'ウッシ・オハラーラ',
    roles: ['Streamer'],
    job: 'Streamer',
    world: 'Tonberry',
    bio: 'Usshi brings KANADE to a wider audience through live streams and recorded content, sharing the magic of every event beyond the venue walls.',
    bioJa: 'ライブ配信や録画コンテンツを通じてKANADEの魅力を世界へ届けるストリーマー。',
    color: 'from-kanade-lavender/20 to-kanade-gold/15',
  },
]

export const roleColors: Record<MemberRole, string> = {
  Performer:      'text-kanade-blush border-kanade-blush/40 bg-kanade-blush/10',
  Housing:        'text-kanade-lavender border-kanade-lavender/40 bg-kanade-lavender/10',
  Manager:        'text-kanade-gold border-kanade-gold/40 bg-kanade-gold/10',
  MC:             'text-kanade-mist border-kanade-mist/40 bg-kanade-mist/10',
  Streamer:       'text-kanade-mist border-kanade-mist/60 bg-kanade-mist/15',
  Representative: 'text-kanade-gold border-kanade-gold/60 bg-kanade-gold/15',
}
