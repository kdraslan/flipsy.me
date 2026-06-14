import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { ACCEPTED_INPUT } from '@/constants/app'
import { getImageDimensions, readFileAsDataUrl } from '@/services/fileService'
import type { ImageItem } from '@/types/image'
import { generateId } from '@/utils/format'

export const useImages = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedImage = images.find((image) => image.id === selectedId) ?? null

  const addFiles = async (files: File[]) => {
    const added = await Promise.all(
      files.map(async (file) => {
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

  const dropzone = useDropzone({
    accept: ACCEPTED_INPUT,
    noClick: true,
    noKeyboard: true,
    onDrop: addFiles,
  })

  return {
    addFiles,
    clearImages,
    dropzone,
    images,
    removeImage,
    selectedImage,
    selectImage: setSelectedId,
  }
}
