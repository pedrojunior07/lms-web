// core/api/hooks/useLocalUploader.js
import { useState } from 'react';
import axios from 'axios';

// Definir a URL base baseada no ambiente
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://192.250.224.214:3001';
  }
  return 'http://192.250.224.214:3001';
};

const MEDIA_API_URL = `${getBaseUrl()}/api/upload`;

export const useLocalUploader = () => {
  const [uploadProgressMap, setUploadProgressMap] = useState({});
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Upload de vídeo
  const uploadVideo = async (file) => {
    if (!file) throw new Error('Nenhum arquivo fornecido');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(`${MEDIA_API_URL}/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgressMap((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      setUploading(false);
      // Retorna a URL completa do vídeo
      return response.data.data.fullUrl;
    } catch (error) {
      setUploading(false);
      console.error('Erro ao fazer upload do vídeo:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload do vídeo');
    }
  };

  // Upload de thumbnail
  const uploadThumbnail = async (file) => {
    if (!file) throw new Error('Nenhum arquivo fornecido');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(`${MEDIA_API_URL}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgressMap((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      setUploading(false);
      // Retorna a URL completa da thumbnail
      return response.data.data.fullUrl;
    } catch (error) {
      setUploading(false);
      console.error('Erro ao fazer upload da thumbnail:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload da thumbnail');
    }
  };

  // Upload de PDF
  const uploadPdf = async (file) => {
    if (!file) throw new Error('Nenhum arquivo fornecido');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(`${MEDIA_API_URL}/pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgressMap((prev) => ({
            ...prev,
            [file.name]: percentCompleted,
          }));
        },
      });

      setUploading(false);
      // Retorna a URL completa do PDF
      return response.data.data.fullUrl;
    } catch (error) {
      setUploading(false);
      console.error('Erro ao fazer upload do PDF:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload do PDF');
    }
  };

  // Selecionar thumbnail para preview
  const selectThumbnail = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Processar currículo (módulos e aulas)
  const processCurriculum = async (curriculum) => {
    const processedCurriculum = [];

    for (const module of curriculum) {
      const processedModule = {
        title: module.title,
        description: module.description,
        lessons: [],
      };

      for (const lesson of module.lessons) {
        let contentUrl = '';

        // Se o conteúdo for um arquivo (File), fazer upload
        if (lesson.content instanceof File) {
          const file = lesson.content;
          
          // Determinar tipo de arquivo
          if (file.type.startsWith('video/')) {
            contentUrl = await uploadVideo(file);
          } else if (file.type === 'application/pdf') {
            contentUrl = await uploadPdf(file);
          } else {
            console.warn(`Tipo de arquivo não suportado: ${file.type}`);
            continue;
          }
        } else if (typeof lesson.content === 'string') {
          // Se já for uma string (URL), usar diretamente
          contentUrl = lesson.content;
        }

        processedModule.lessons.push({
          title: lesson.title,
          content: contentUrl,
        });
      }

      processedCurriculum.push(processedModule);
    }

    return processedCurriculum;
  };

  return {
    uploadVideo,
    uploadThumbnail,
    uploadPdf,
    selectThumbnail,
    thumbnailPreview,
    processCurriculum,
    uploadProgressMap,
    uploading,
  };
};