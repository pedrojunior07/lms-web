// src/core/api/hooks/useBackendUploader.ts
import { useState } from "react";
import { apiMultipart } from "../axios";

type UseBackendUploaderOptions = {
  uploadUrl: string;
  defaultPath?: string;
};

export function useBackendUploader({
  uploadUrl,
  defaultPath = "imagens",
}: UseBackendUploaderOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const selectFile = (selected: File) => {
    setFile(selected);
    
    // Cria preview para imagens e vídeos
    if (selected.type.startsWith('image/') || selected.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl(null);
    }
    
    setUploadedUrl(null);
    setError(null);
  };

  const upload = async (path?: string, onProgress?: (progress: number) => void) => {
    if (!file) {
      setError("Nenhum arquivo selecionado");
      return null;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path || defaultPath);

      const response = await apiMultipart.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
          onProgress?.(percent);
        },
      });

      console.log("Upload response:", response);

      if (!response.data || response.status !== 200) {
        throw new Error(`Erro no upload: ${response.status} ${response.statusText}`);
      }

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Erro desconhecido no backend");
      }

      setUploadedUrl(response.data.url);
      return response.data.url;

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    previewUrl,
    file,
    uploading,
    uploadedUrl,
    error,
    uploadProgress,
    selectFile,
    upload,
  };
}