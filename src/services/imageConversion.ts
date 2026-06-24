import JSZip from 'jszip'

import {
  DEFAULT_SVG_SIZE,
  JPEG_BACKGROUND,
  LOSSY_FORMATS,
  MAX_OUTPUT_DIMENSION,
  SVG_MIME,
} from '@/constants/app'
import type { ConvertOptions, ImageItem } from '@/types/image'

const scaledDimensions = (width: number, height: number, max: number) => {
  if (max <= 0 || Math.max(width, height) <= max) return { height, width }
  const scale = max / Math.max(width, height)
  return { height: Math.round(height * scale), width: Math.round(width * scale) }
}

export const outputDimensions = (format: string, width: number, height: number, max: number) => {
  if (format !== SVG_MIME) return scaledDimensions(width, height, max)
  const longest = Math.max(width, height) || 1
  const target = Math.min(max > 0 ? max : DEFAULT_SVG_SIZE, MAX_OUTPUT_DIMENSION) // Vector scales both ways.
  const scale = target / longest
  return { height: Math.round(height * scale), width: Math.round(width * scale) }
}

export const isLossyFormat = (format: string): boolean => LOSSY_FORMATS.includes(format)

const loadImage = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = dataUrl
  })

const decodeSvg = (dataUrl: string): string => {
  const bytes = Uint8Array.from(atob(dataUrl.split(',')[1]), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const resizeSvg = (markup: string, width: number, height: number): string => {
  const svg = new DOMParser().parseFromString(markup, SVG_MIME).documentElement
  if (!svg.hasAttribute('viewBox')) {
    const w = parseFloat(svg.getAttribute('width') ?? '')
    const h = parseFloat(svg.getAttribute('height') ?? '')
    if (w && h) svg.setAttribute('viewBox', `0 0 ${w} ${h}`) // Keep coords when forcing a new pixel size.
  }
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  return `data:${SVG_MIME};charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`
}

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, body] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1]
  if (!mime) throw new Error('Invalid data URL')
  const binary = atob(body)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export const convertImage = async (
  image: ImageItem,
  options: ConvertOptions,
): Promise<{ blob: Blob; filename: string }> => {
  const img = await loadImage(image.dataUrl)
  const { height, width } = outputDimensions(
    image.originalFormat,
    img.width,
    img.height,
    options.maxDimension,
  )
  const source =
    image.originalFormat === SVG_MIME
      ? await loadImage(resizeSvg(decodeSvg(image.dataUrl), width, height)) // Rasterize at target, not the tiny intrinsic size.
      : img

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  if (options.format === 'image/jpeg') {
    ctx.fillStyle = JPEG_BACKGROUND // JPEG has no alpha, so paint a base to avoid black fills.
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(source, 0, 0, width, height)

  const encoded = canvas.toDataURL(options.format, options.quality)
  const blob = dataUrlToBlob(encoded)
  const extension = blob.type.split('/')[1] || 'png' // Trust the bytes, not the requested format.
  return { blob, filename: `${image.name.split('.')[0]}.${extension}` }
}

export const convertImagesToZip = async (
  images: ImageItem[],
  options: ConvertOptions,
): Promise<Blob> => {
  const zip = new JSZip()
  const usedNames = new Map<string, number>()

  for (const image of images) {
    const { blob, filename } = await convertImage(image, options)
    const count = usedNames.get(filename) ?? 0
    usedNames.set(filename, count + 1)
    const entry = count === 0 ? filename : filename.replace(/(\.[^.]+)$/, `-${count}$1`)
    zip.file(entry, blob)
  }

  return zip.generateAsync({ type: 'blob' })
}
