import { saveAs } from 'file-saver'

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })

export const getImageDimensions = (dataUrl: string): Promise<{ height: number; width: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ height: img.naturalHeight, width: img.naturalWidth })
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = dataUrl
  })

export const downloadBlob = (blob: Blob, filename: string): void => saveAs(blob, filename)
