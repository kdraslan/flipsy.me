import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import Logo from '@/components/Logo/Logo';
import Tracking from '@/components/Tracking/Tracking';
import { trackButtonClick, trackError } from '@/firebase/tracking';

import styles from './Home.module.css';

interface ImageData {
  dataUrl: string;
  id: string;
  name: string;
  originalFormat: string;
  size: number;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Load images from localStorage on component mount
  useEffect(() => {
    const savedImages = localStorage.getItem('flipsy-images');
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Error loading saved images:', error);
      }
    }
  }, []);

  // Save images to localStorage when they change
  useEffect(() => {
    localStorage.setItem('flipsy-images', JSON.stringify(images));
  }, [images]);

  const onDrop = async (acceptedFiles: File[]) => {
    const newImages = await Promise.all(
      acceptedFiles.map(async (file) => {
        // Get the file extension/format
        const format = file.type;

        // Create a data URL for the image
        const dataUrl = await readFileAsDataURL(file);

        return {
          dataUrl,
          id: generateId(),
          name: file.name,
          originalFormat: format,
          size: file.size,
        };
      })
    );

    setImages((prevImages) => [...prevImages, ...newImages]);
    if (newImages.length > 0 && !selectedImage) {
      setSelectedImage(newImages[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff'],
    },
    onDrop,
  });

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const convertImage = async () => {
    if (!selectedImage) return;

    trackButtonClick('convert_image');
    setIsConverting(true);

    try {
      // Get the format extension without the "image/"
      const formatExt = targetFormat.split('/')[1];

      // Create an image element to use the canvas for conversion
      const img = new Image();
      img.src = selectedImage.dataUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);

      // Convert to the desired format
      const convertedDataUrl = canvas.toDataURL(targetFormat, 0.9);

      // Save or download the converted image
      const blob = dataURLToBlob(convertedDataUrl);
      saveAs(blob, `${selectedImage.name.split('.')[0]}.${formatExt}`);
    } catch (error) {
      console.error('Error converting image:', error);
      trackError('Image conversion failed', 'convertImage');
      alert('Error converting image. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const dataURLToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL format');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  const removeImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(images.length > 1 ? images.find((img) => img.id !== id) || null : null);
    }
  };

  const clearAllImages = () => {
    trackButtonClick('clear_all_images');
    setImages([]);
    setSelectedImage(null);
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFormatName = (mimeType: string): string => {
    switch (mimeType) {
      case 'image/jpeg':
        return 'JPEG';
      case 'image/png':
        return 'PNG';
      case 'image/webp':
        return 'WebP';
      case 'image/gif':
        return 'GIF';
      case 'image/bmp':
        return 'BMP';
      case 'image/tiff':
        return 'TIFF';
      default:
        return mimeType.split('/')[1].toUpperCase();
    }
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <Logo />
      </header>

      <Tracking />

      <main>
        <div className={styles.dropzoneContainer}>
          <div
            {...getRootProps({
              className: `${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`,
            })}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>Drag & drop images here, or click to select files</p>
            )}
          </div>
        </div>

        {images.length > 0 && (
          <div className={styles.imageGallery}>
            <h2>Your Images ({images.length})</h2>
            <div className={styles.imagesList}>
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`${styles.imageItem} ${selectedImage?.id === img.id ? styles.selectedImage : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img.dataUrl} alt={img.name} />
                  <div className={styles.imageDetails}>
                    <p>{img.name}</p>
                    <p>
                      {getFormatName(img.originalFormat)} · {formatSize(img.size)}
                    </p>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className={styles.clearBtn} onClick={clearAllImages}>
              Clear All
            </button>
          </div>
        )}

        {selectedImage && (
          <div className={styles.converterPanel}>
            <h2>Convert Image</h2>
            <div className={styles.selectedImagePreview}>
              <img src={selectedImage.dataUrl} alt={selectedImage.name} />
              <div className={styles.imageInfo}>
                <p>
                  <strong>Name:</strong> {selectedImage.name}
                </p>
                <p>
                  <strong>Format:</strong> {getFormatName(selectedImage.originalFormat)}
                </p>
                <p>
                  <strong>Size:</strong> {formatSize(selectedImage.size)}
                </p>
              </div>
            </div>

            <div className={styles.conversionControls}>
              <div className={styles.formatSelector}>
                <label htmlFor='format-select'>Convert to:</label>
                <select
                  id='format-select'
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                >
                  <option value='image/jpeg'>JPEG</option>
                  <option value='image/png'>PNG</option>
                  <option value='image/webp'>WebP</option>
                  <option value='image/gif'>GIF</option>
                  <option value='image/bmp'>BMP</option>
                </select>
              </div>

              <button className={styles.convertBtn} onClick={convertImage} disabled={isConverting}>
                {isConverting ? 'Converting...' : 'Convert & Download'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Flipsy.me - Online Image Converter</p>
      </footer>
    </div>
  );
};

export default Home;
