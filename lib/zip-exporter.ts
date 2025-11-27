import JSZip from 'jszip';
import { GeneratedImage } from '@/store/bulk-store';

export async function downloadAsZip(
  images: GeneratedImage[],
  zipFileName: string
): Promise<void> {
  const zip = new JSZip();

  // Filter only successful images
  const successfulImages = images.filter(
    (img) => img.status === 'done' && img.dataUrl
  );

  if (successfulImages.length === 0) {
    console.warn('No images to download');
    return;
  }

  // Add each image to ZIP
  for (const img of successfulImages) {
    try {
      // Extract base64 data from data URL
      const base64Data = img.dataUrl.split(',')[1];
      
      if (base64Data) {
        zip.file(`${img.fileName}.png`, base64Data, { base64: true });
      }
    } catch (error) {
      console.error(`Failed to add ${img.fileName} to ZIP:`, error);
    }
  }

  // Generate ZIP blob
  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  // Trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(link.href);
}

export async function downloadSingleImage(
  image: GeneratedImage,
  format: 'png' | 'webp' = 'png'
): Promise<void> {
  if (!image.dataUrl) {
    console.warn('No image data to download');
    return;
  }

  const link = document.createElement('a');
  link.href = image.dataUrl;
  link.download = `${image.fileName}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
