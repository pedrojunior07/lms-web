// src/core/api/hooks/useLocalUploader.ts
import { useState } from "react";
import { useBackendUploader } from "./useBackendUploader";
import { Module } from "../../common/data/interface";

export function useLocalUploader() {
  const [uploadProgressMap, setUploadProgressMap] = useState<Record<string, number>>({});

  // Hook para upload de vídeos (usa o mesmo endpoint, mas com path diferente)
  const videoUploader = useBackendUploader({
    uploadUrl: "/storage/upload",
    defaultPath: "videos"
  });

  // Hook para thumbnails
  const thumbnailUploader = useBackendUploader({
    uploadUrl: "/storage/upload",
    defaultPath: "thumbnails"
  });

  // Hook para PDFs e outros arquivos
  const fileUploader = useBackendUploader({
    uploadUrl: "/storage/upload", 
    defaultPath: "files"
  });

  // Função para upload de vídeo introdutório
  const uploadIntroVideo = async (file: File) => {
    return await videoUploader.upload("videos");
  };

  // Função para upload de thumbnail
  const uploadThumbnail = async (file: File) => {
    thumbnailUploader.selectFile(file);
    return await thumbnailUploader.upload("thumbnails");
  };

  // Processa todo o currículo (módulos e aulas)
  const processCurriculum = async (curriculum: Module[]): Promise<Module[]> => {
    const processedCurriculum = await Promise.all(
      curriculum.map(async (module, moduleIndex) => {
        const processedLessons = await Promise.all(
          module.lessons.map(async (lesson, lessonIndex) => {
            // Se o conteúdo é um arquivo (vídeo ou PDF), faz upload
            if (lesson.content instanceof File) {
              const fileKey = `module-${moduleIndex}-lesson-${lessonIndex}`;
              
              try {
                // Determina o path baseado no tipo de arquivo
                let uploadPath = "files";
                if (lesson.content.type.startsWith('video/')) {
                  uploadPath = "videos";
                } else if (lesson.content.type === 'application/pdf') {
                  uploadPath = "pdfs";
                }

                // Configura callback de progresso
                const onProgress = (progress: number) => {
                  setUploadProgressMap(prev => ({
                    ...prev,
                    [fileKey]: progress
                  }));
                };

                // Faz upload do arquivo passando diretamente
                const fileUrl = await fileUploader.upload(uploadPath, onProgress, lesson.content);
                
                // Limpa o progresso após conclusão
                setTimeout(() => {
                  setUploadProgressMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[fileKey];
                    return newMap;
                  });
                }, 1000);

                return {
                  ...lesson,
                  content: fileUrl // URL do arquivo no servidor local
                };
              } catch (error) {
                console.error(`Erro no upload da aula ${lessonIndex}:`, error);
                throw new Error(`Falha no upload da aula "${lesson.title}": ${error}`);
              }
            }
            
            // Se já é uma URL, mantém como está
            return lesson;
          })
        );

        return {
          ...module,
          lessons: processedLessons
        };
      })
    );

    return processedCurriculum;
  };

  return {
    // Upload de vídeos individuais
    uploadVideo: uploadIntroVideo,
    videoUploading: videoUploader.uploading,
    videoUploadProgress: videoUploader.uploadProgress,
    videoError: videoUploader.error,
    
    // Upload de thumbnails
    uploadThumbnail,
    thumbnailUploading: thumbnailUploader.uploading,
    thumbnailPreview: thumbnailUploader.previewUrl,
    thumbnailError: thumbnailUploader.error,
    selectThumbnail: thumbnailUploader.selectFile,
    
    // Processamento de currículo
    processCurriculum,
    uploadProgressMap,
    
    // Estados gerais
    uploading: videoUploader.uploading || thumbnailUploader.uploading || fileUploader.uploading
  };
}