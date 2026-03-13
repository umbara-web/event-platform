'use client';

import { Upload } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';

interface EventImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EventImageUpload({
  imagePreview,
  onImageChange,
}: EventImageUploadProps) {
  return (
    <div className='space-y-2'>
      <Label>Gambar Event</Label>
      <div className='flex items-center gap-4'>
        <ImagePreviewBox imagePreview={imagePreview} />
        <ImageUploadButton onImageChange={onImageChange} />
      </div>
    </div>
  );
}

function ImagePreviewBox({ imagePreview }: { imagePreview: string | null }) {
  if (imagePreview) {
    return (
      <div className='relative h-32 w-48 overflow-hidden rounded-lg'>
        <img
          src={imagePreview}
          alt='Preview'
          className='h-full w-full object-cover'
        />
      </div>
    );
  }

  return (
    <div className='flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed'>
      <Upload className='text-muted-foreground h-8 w-8' />
    </div>
  );
}

function ImageUploadButton({
  onImageChange,
}: {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <input
        type='file'
        accept='image/*'
        onChange={onImageChange}
        className='hidden'
        id='event-image'
      />
      <Label htmlFor='event-image' className='cursor-pointer'>
        <Button type='button' variant='outline' asChild>
          <span>Pilih Gambar</span>
        </Button>
      </Label>
      <p className='text-muted-foreground mt-1 text-xs'>
        JPG, PNG, atau WebP. Maks 5MB.
      </p>
    </div>
  );
}
