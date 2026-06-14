import { FORMAT_LABELS } from '@/constants/app'

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const getFormatLabel = (mimeType: string): string =>
  FORMAT_LABELS[mimeType] ?? mimeType.split('/')[1]?.toUpperCase() ?? mimeType // Returns a display label for a MIME type.

export const generateId = (): string => // Generates a short, collision-resistant image id.
  Date.now().toString(36) + Math.random().toString(36).slice(2)
