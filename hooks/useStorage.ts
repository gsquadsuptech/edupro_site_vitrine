"use client";

import { useState } from 'react';
import { sanitizeFileName } from '@/lib/utils';

interface UploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (
    file: File,
    bucket: string,
    folder: string = ''
  ): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Nettoyer le nom de fichier pour éviter les erreurs "Invalid key"
      const sanitizedFileName = sanitizeFileName(file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', `${folder}/${sanitizedFileName}`);

      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      return data.publicUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (
    path: string,
    bucket: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/storage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    error,
  };
}; 