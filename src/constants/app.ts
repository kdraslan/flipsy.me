export const FORMAT_LABELS: Record<string, string> = {
  'image/bmp': 'BMP',
  'image/gif': 'GIF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/tiff': 'TIFF',
  'image/webp': 'WebP',
}

export const OUTPUT_FORMATS = ['image/jpeg', 'image/png', 'image/webp'].map((value) => ({
  label: FORMAT_LABELS[value],
  value,
}))

export const LOSSY_FORMATS = ['image/jpeg', 'image/webp']

export const FILE_ACCEPT = 'image/*'

export const SVG_MIME = 'image/svg+xml'
export const DEFAULT_SVG_SIZE = 512 // SVG is vector, so rasterize at this longest side when no max is set.
export const MAX_OUTPUT_DIMENSION = 4096 // Canvas area limits (notably iOS) make larger rasters unreliable.

export const DEFAULT_FORMAT = 'image/jpeg'
export const DEFAULT_QUALITY = 0.9
export const JPEG_BACKGROUND = '#ffffff'
export const ZIP_FILENAME = 'flipsy-images.zip'
export const THEME_STORAGE_KEY = 'flipsy-theme'
