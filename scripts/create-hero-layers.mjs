import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const publicDir = path.join(projectDir, 'public')
const source = path.join(publicDir, 'hero-mountain-fountain-zine-v7.png')
const background = path.join(publicDir, 'hero-cover-background-v7.webp')
const foreground = path.join(publicDir, 'hero-cover-foreground-v7.webp')

const { width = 1672, height = 941 } = await sharp(source).metadata()

// The mask follows the visible mountain ridge, then includes the fountain and
// pool below it. Keeping the source pixels in both layers makes the seam
// invisible while allowing copy to travel between them.
const mask = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 1672 941" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="soft-edge" x="-4%" y="-4%" width="108%" height="108%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
    <g fill="white" filter="url(#soft-edge)">
      <path d="M418 876
        C514 850 594 818 682 776
        C738 749 784 728 834 726
        C888 724 936 744 996 778
        C1080 824 1164 852 1254 874
        L1254 925 L418 925 Z" />
      <rect x="811" y="823" width="50" height="88" rx="24" />
      <ellipse cx="836" cy="898" rx="116" ry="22" />
    </g>
  </svg>
`)

await sharp(source)
  .webp({ quality: 90, smartSubsample: true })
  .toFile(background)

await sharp(source)
  .ensureAlpha()
  .composite([{ input: mask, blend: 'dest-in' }])
  .webp({ quality: 92, alphaQuality: 100, smartSubsample: true })
  .toFile(foreground)

console.log(`Created ${path.relative(projectDir, background)}`)
console.log(`Created ${path.relative(projectDir, foreground)}`)
