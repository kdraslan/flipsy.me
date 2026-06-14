export interface ImageItem {
  dataUrl: string
  height: number
  id: string
  name: string
  originalFormat: string
  size: number
  width: number
}

export interface ConvertOptions {
  format: string
  maxDimension: number
  quality: number
}
