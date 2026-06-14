import { useState } from 'react'

import Logo from '@/components/Logo/Logo'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import {
  Badge,
  CustomButton,
  CustomInput,
  CustomSelect,
  CustomSlider,
  Headline,
  Icon,
  Panel,
} from '@/components/ui'
import {
  DEFAULT_FORMAT,
  DEFAULT_QUALITY,
  FILE_ACCEPT,
  OUTPUT_FORMATS,
  ZIP_FILENAME,
} from '@/constants/app'
import { trackButtonClick, trackError } from '@/firebase/tracking'
import { useImages } from '@/hooks/useImages'
import { useTheme } from '@/hooks/useTheme'
import { downloadBlob } from '@/services/fileService'
import {
  convertImage,
  convertImagesToZip,
  isLossyFormat,
  scaledDimensions,
} from '@/services/imageConversion'
import { formatFileSize, getFormatLabel } from '@/utils/format'

import styles from './Home.module.css'

const Home = () => {
  const { theme, toggleTheme } = useTheme()
  const { addFiles, clearImages, dropzone, images, removeImage, selectImage, selectedImage } =
    useImages()
  const [format, setFormat] = useState(DEFAULT_FORMAT)
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [maxDimension, setMaxDimension] = useState(0)
  const [isConverting, setIsConverting] = useState(false)

  const { getRootProps, isDragActive } = dropzone
  const options = { format, maxDimension, quality }
  const output = selectedImage
    ? scaledDimensions(selectedImage.width, selectedImage.height, maxDimension)
    : null

  const handleConvert = async () => {
    if (!selectedImage) return
    trackButtonClick('convert_image')
    setIsConverting(true)
    try {
      const { blob, filename } = await convertImage(selectedImage, options)
      downloadBlob(blob, filename)
    } catch {
      trackError('Image conversion failed', 'handleConvert')
      window.alert('Could not convert the image. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleConvertAll = async () => {
    if (!images.length) return
    trackButtonClick('convert_all_images')
    setIsConverting(true)
    try {
      const archive = await convertImagesToZip(images, options)
      downloadBlob(archive, ZIP_FILENAME)
    } catch {
      trackError('Batch conversion failed', 'handleConvertAll')
      window.alert('Could not convert the images. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const handleClear = () => {
    trackButtonClick('clear_all_images')
    clearImages()
  }

  return (
    <div className={styles.app}>
      <ThemeToggle
        theme={theme}
        onToggle={toggleTheme}
      />

      <header className={styles.header}>
        <Logo compact={images.length > 0} />
        <p className={styles.tagline}>
          Convert images right in your browser. Fast, free, and private.
        </p>
      </header>

      <main className={styles.main}>
        <div
          {...getRootProps({
            className: `${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`,
          })}
        >
          <input
            type="file"
            accept={FILE_ACCEPT}
            multiple
            className={styles.fileInput}
            onChange={(event) => {
              const input = event.currentTarget
              void addFiles(Array.from(input.files ?? []))
              input.value = ''
            }}
          />
          <span className={styles.dropzoneIcon}>
            <Icon name="upload" />
          </span>
          {isDragActive ? (
            <p className={styles.dropzoneTitle}>Drop your images here</p>
          ) : (
            <>
              <p className={styles.dropzoneTitle}>Drag & drop images, or click to browse</p>
              <p className={styles.dropzoneHint}>JPEG · PNG · WebP · GIF · BMP · TIFF</p>
            </>
          )}
        </div>

        {images.length > 0 && (
          <Panel>
            <div className={styles.sectionHead}>
              <Headline>
                Your images <Badge>{images.length}</Badge>
              </Headline>
              <div className={styles.actions}>
                {images.length > 1 && (
                  <CustomButton
                    onClick={handleConvertAll}
                    disabled={isConverting}
                  >
                    {isConverting
                      ? 'Converting…'
                      : `Convert all to ${getFormatLabel(format)} (zip)`}
                  </CustomButton>
                )}
                <CustomButton
                  variant="danger"
                  onClick={handleClear}
                >
                  Clear all
                </CustomButton>
              </div>
            </div>

            <ul className={styles.list}>
              {images.map((image) => {
                const selected = selectedImage?.id === image.id
                return (
                  <li
                    key={image.id}
                    className={`${styles.row} ${selected ? styles.rowSelected : ''}`}
                    onClick={() => selectImage(image.id)}
                  >
                    <span className={styles.rowMark}>{selected && <Icon name="check" />}</span>
                    <span className={styles.rowInfo}>
                      <span className={styles.rowName}>{image.name}</span>
                      <span className={styles.rowMeta}>
                        {getFormatLabel(image.originalFormat)} · {formatFileSize(image.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={`Remove ${image.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        removeImage(image.id)
                      }}
                    >
                      <Icon name="close" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </Panel>
        )}

        {selectedImage && (
          <Panel>
            <Headline>Convert</Headline>

            <div className={styles.preview}>
              <div className={styles.previewImage}>
                <img
                  src={selectedImage.dataUrl}
                  alt={selectedImage.name}
                />
              </div>
              <dl className={styles.info}>
                <div>
                  <dt>Name</dt>
                  <dd>{selectedImage.name}</dd>
                </div>
                <div>
                  <dt>Format</dt>
                  <dd>{getFormatLabel(selectedImage.originalFormat)}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>
                    {selectedImage.width} × {selectedImage.height} px
                  </dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{formatFileSize(selectedImage.size)}</dd>
                </div>
                {output && (
                  <div className={styles.output}>
                    <dt>Output</dt>
                    <dd>
                      {getFormatLabel(format)} · {output.width} × {output.height} px
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className={styles.controls}>
              <CustomSelect
                id="format"
                label="Convert to"
                value={format}
                options={OUTPUT_FORMATS}
                onChange={setFormat}
              />
              {isLossyFormat(format) && (
                <CustomSlider
                  id="quality"
                  label="Quality"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  onChange={(value) => setQuality(value / 100)}
                  formatValue={(value) => `${value}%`}
                />
              )}
              <CustomInput
                id="maxDimension"
                label="Max width/height (px)"
                type="number"
                min={0}
                placeholder="Keep original"
                value={maxDimension || ''}
                onValueChange={(value) => setMaxDimension(Math.max(0, Number(value)))}
              />
            </div>

            <CustomButton
              size="lg"
              fullWidth
              onClick={handleConvert}
              disabled={isConverting}
            >
              {isConverting ? 'Converting…' : `Convert & download ${getFormatLabel(format)}`}
            </CustomButton>
            <p className={styles.note}>
              Everything runs locally, so your images never leave your device.
            </p>
          </Panel>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Flipsy.me · Online image converter</p>
      </footer>
    </div>
  )
}

export default Home
