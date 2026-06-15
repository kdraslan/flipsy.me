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

export const DEFAULT_FORMAT = 'image/jpeg'
export const DEFAULT_QUALITY = 0.9
export const JPEG_BACKGROUND = '#ffffff'
export const ZIP_FILENAME = 'flipsy-images.zip'
export const THEME_STORAGE_KEY = 'flipsy-theme'
