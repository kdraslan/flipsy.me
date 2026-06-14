import { useState } from 'react'

import { getImageDimensions, readFileAsDataUrl } from '@/services/fileService'
import type { ImageItem } from '@/types/image'
import { generateId } from '@/utils/format'

export const useImages = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedImage = images.find((image) => image.id === selectedId) ?? null

  const addFiles = async (files: File[]) => {
    const accepted = files.filter((file) => file.type.startsWith('image/'))
    if (!accepted.length) return

    const added = await Promise.all(
      accepted.map(async (file) => {
        const dataUrl = await readFileAsDataUrl(file)
        const { height, width } = await getImageDimensions(dataUrl)
        return {
          dataUrl,
          height,
          id: generateId(),
          name: file.name,
          originalFormat: file.type,
          size: file.size,
          width,
        }
      }),
    )
    setImages((previous) => [...previous, ...added])
    setSelectedId((current) => current ?? added[0]?.id ?? null)
  }

  const removeImage = (id: string) => {
    setImages((previous) => previous.filter((image) => image.id !== id))
    setSelectedId((current) =>
      current === id ? (images.find((image) => image.id !== id)?.id ?? null) : current,
    )
  }

  const clearImages = () => {
    setImages([])
    setSelectedId(null)
  }

  return { addFiles, clearImages, images, removeImage, selectedImage, selectImage: setSelectedId }
}
