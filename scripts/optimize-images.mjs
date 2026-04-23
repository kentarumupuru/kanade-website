import { readFile, stat } from 'node:fs/promises'
import { resolve, dirname, join, basename, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLIC = join(ROOT, 'public')

const TARGETS = [
  { pattern: 'backgrounds/*.jpg',        maxWidth: 1920, quality: 80 },
  { pattern: 'members/**/*.{jpg,jfif.jpg}', maxWidth: 1200, quality: 82 },
  { pattern: 'events/**/*.jpg',          maxWidth: 1600, quality: 82 },
]

const fmtKB = (bytes) => `${(bytes / 1024).toFixed(0)}K`

async function convert(srcAbs, maxWidth, quality) {
  const ext = extname(srcAbs)
  const dstAbs = srcAbs.slice(0, -ext.length) + '.webp'
  const srcStat = await stat(srcAbs)
  const input = await readFile(srcAbs)
  const image = sharp(input)
  const meta = await image.metadata()
  const pipeline = image.rotate()
  if (meta.width && meta.width > maxWidth) {
    pipeline.resize({ width: maxWidth, withoutEnlargement: true })
  }
  await pipeline.webp({ quality, effort: 6 }).toFile(dstAbs)
  const dstStat = await stat(dstAbs)
  const rel = relative(PUBLIC, srcAbs).replaceAll('\\', '/')
  const savings = ((1 - dstStat.size / srcStat.size) * 100).toFixed(0)
  console.log(`  ${rel}  ${fmtKB(srcStat.size)} → ${basename(dstAbs)} ${fmtKB(dstStat.size)}  (-${savings}%)`)
}

async function main() {
  console.log(`Optimizing images in ${relative(ROOT, PUBLIC)}/\n`)
  let total = 0
  for (const { pattern, maxWidth, quality } of TARGETS) {
    const files = await glob(pattern, { cwd: PUBLIC, absolute: true, nodir: true })
    if (files.length === 0) {
      console.log(`[skip] ${pattern} — no matches`)
      continue
    }
    console.log(`[${pattern}]  (${files.length} files, maxW=${maxWidth}, q=${quality})`)
    for (const f of files) {
      try {
        await convert(f, maxWidth, quality)
        total++
      } catch (e) {
        console.warn(`  ! ${relative(PUBLIC, f)} — ${e.message}`)
      }
    }
    console.log()
  }
  console.log(`Done. Converted ${total} file(s) to .webp alongside originals.`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
