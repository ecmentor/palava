'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Plus, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/compressImage';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 3 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    if (images.length + files.length > maxImages) {
      setError(`You can upload up to ${maxImages} images only.`);
      return;
    }
    setError('');
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      let toUpload: File;
      try {
        toUpload = await compressImage(file);
      } catch {
        toUpload = file; // fall back to original if compression fails
      }

      const formData = new FormData();
      formData.append('file', toUpload);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        setUploading(false);
        return;
      }
      newUrls.push(data.url);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80"
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
            ) : (
              <>
                <Plus className="w-5 h-5" strokeWidth={2} />
                <span className="text-xs mt-1">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-xs text-gray-400">
        Up to {maxImages} photos · JPEG, PNG, WebP · Auto-compressed to ~120KB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
