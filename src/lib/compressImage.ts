// Compresses an image file in the browser (canvas-based) before upload.
// Encodes as WebP (smaller than JPEG at equivalent quality), resizes to a max
// dimension, and if quality alone can't hit the target size, progressively
// shrinks the dimensions too — so storage usage stays small and predictable
// even for large/detailed source photos.

const MAX_DIMENSION = 1280; // px, longest side — plenty for grid/detail views
const MIN_DIMENSION = 640; // don't shrink below this even if still over target
const TARGET_BYTES = 120 * 1024; // 120KB
const MIN_QUALITY = 0.4;

let webpSupported: boolean | null = null;
function supportsWebp(): boolean {
  if (webpSupported !== null) return webpSupported;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  return webpSupported;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

function scaledSize(width: number, height: number, maxDim: number) {
  if (width <= maxDim && height <= maxDim) return { width, height };
  if (width > height) {
    return { width: maxDim, height: Math.round((height * maxDim) / width) };
  }
  return { width: Math.round((width * maxDim) / height), height: maxDim };
}

export async function compressImage(file: File): Promise<File> {
  // Skip compression for already-tiny files.
  if (file.size <= TARGET_BYTES) return file;

  const img = await loadImage(file);
  const mime = supportsWebp() ? 'image/webp' : 'image/jpeg';
  const ext = mime === 'image/webp' ? 'webp' : 'jpg';

  let maxDim = MAX_DIMENSION;
  let blob: Blob | null = null;

  // Outer loop: shrink dimensions if quality reduction alone isn't enough.
  while (true) {
    const { width, height } = scaledSize(img.naturalWidth, img.naturalHeight, maxDim);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.8;
    blob = await canvasToBlob(canvas, mime, quality);

    while (blob && blob.size > TARGET_BYTES && quality > MIN_QUALITY) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, mime, quality);
    }

    if (!blob) return file;
    if (blob.size <= TARGET_BYTES || maxDim <= MIN_DIMENSION) break;

    maxDim = Math.round(maxDim * 0.8);
  }

  URL.revokeObjectURL(img.src);

  const newName = file.name.replace(/\.[^.]+$/, '') + `.${ext}`;
  return new File([blob], newName, { type: mime });
}
