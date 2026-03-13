'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';

interface PaymentProofUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
  currentImage?: string | null;
}

export function PaymentProofUpload({
  onUpload,
  isLoading,
  currentImage,
}: PaymentProofUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: isLoading,
  });

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className='space-y-4'>
      {preview ? (
        <Card>
          <CardContent className='relative p-4'>
            <div className='relative aspect-video overflow-hidden rounded-lg'>
              <Image
                src={preview}
                alt='Bukti pembayaran'
                fill
                className='object-contain'
              />
            </div>
            {!currentImage && (
              <Button
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2'
                onClick={handleRemove}
                disabled={isLoading}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            isLoading && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-2'>
            <div className='bg-muted rounded-full p-3'>
              <Upload className='text-muted-foreground h-6 w-6' />
            </div>
            <div>
              <p className='font-medium'>
                {isDragActive
                  ? 'Lepaskan file di sini'
                  : 'Klik atau drag & drop untuk upload'}
              </p>
              <p className='text-muted-foreground text-sm'>
                JPG, PNG, atau WebP (maks. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedFile && !currentImage && (
        <Button className='w-full' onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Mengupload...
            </>
          ) : (
            <>
              <ImageIcon className='mr-2 h-4 w-4' />
              Upload Bukti Pembayaran
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default PaymentProofUpload;
