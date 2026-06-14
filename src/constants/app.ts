export const OUTPUT_FORMATS = [
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'PNG', value: 'image/png' },
  { label: 'WebP', value: 'image/webp' },
] as const

export const FILE_ACCEPT = 'image/*' // accept attribute for the native file input.

export const LOSSY_FORMATS = ['image/jpeg', 'image/webp'] // Formats whose output honours quality.

export const FORMAT_LABELS: Record<string, string> = {
  'image/bmp': 'BMP',
  'image/gif': 'GIF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/tiff': 'TIFF',
  'image/webp': 'WebP',
}

export const DEFAULT_FORMAT = 'image/jpeg'
export const DEFAULT_QUALITY = 0.9
export const JPEG_BACKGROUND = '#ffffff'
export const ZIP_FILENAME = 'flipsy-images.zip'
export const THEME_STORAGE_KEY = 'flipsy-theme'
