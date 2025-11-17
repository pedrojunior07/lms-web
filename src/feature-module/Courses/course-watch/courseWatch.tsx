import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import html2canvas from "html2canvas";

// Tipos (mantidos iguais)
interface Lesson {
  id: number;
  title: string;
  content: string;
  duration?: string;
  contentType?: string;
  progress?: {
    completed: boolean;
    progressPercentage: number;
    completedAt?: string;
  } | null;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  completed?: boolean;
  totalLessons?: number;
  completedLessons?: number;
}

interface Course {
  id: number;
  title: string;
  longDescription?: string;
  thumbnailPath?: string;
  documents?: any[];
  resources?: any[];
}

interface Progress {
  courseId: number;
  completedLessons: number[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessDate?: string;
}

interface Certificate {
  certificateCode: string;
  issuedAt: string;
  revoked: boolean;
  student: {
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    email: string;
    gender: string;
    dob: string;
  };
  course: {
    id: number;
    price: number | null;
    title: string;
    category: string | null;
    level: string | null;
    language: string | null;
    maxStudents: number | null;
    publicOrPrivate: string | null;
    shortDescription: string;
    longDescription: string;
    introVideoUrl: string | null;
    videoProvider: string | null;
    thumbnailPath: string | null;
    whatStudentsWillLearn: string | null;
    requirements: string | null;
    status: string | null;
    instructor: any | null;
    modules: any | null;
    hasLiked: boolean;
    likeCount: number | null;
  };
}

type TabKey = "overview" | "notes" | "documents" | "faq";
type ContentType = "video" | "pdf" | "image" | "document" | "unknown";

// Helpers
const isDocumentUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const u = url.toLowerCase();
  return (
    u.endsWith(".pdf") ||
    u.endsWith(".png") ||
    u.endsWith(".jpg") ||
    u.endsWith(".jpeg") ||
    u.endsWith(".gif") ||
    u.endsWith(".webp") ||
    u.endsWith(".svg") ||
    u.endsWith(".txt") ||
    u.endsWith(".csv") ||
    u.endsWith(".xlsx") ||
    u.endsWith(".xls") ||
    u.endsWith(".doc") ||
    u.endsWith(".docx") ||
    u.includes("/api/upload/")
  );
};

const isPdf = (url: string): boolean => 
  url.toLowerCase().endsWith(".pdf") || url.includes("/api/upload/pdf");

const isImage = (url: string): boolean =>
  [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].some((ext) =>
    url.toLowerCase().endsWith(ext)
  ) || url.includes("/api/upload/thumbnail");

const isVideoUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return /youtube\.com|youtu\.be|vimeo\.com|\.mp4($|\?)|\.webm($|\?)|\.m3u8($|\?)/i.test(url) ||
    url.includes("/api/upload/video");
};

const getContentType = (url: string | null): ContentType => {
  if (!url) return "unknown";
  if (isVideoUrl(url)) return "video";
  if (isPdf(url)) return "pdf";
  if (isImage(url)) return "image";
  if (isDocumentUrl(url)) return "document";
  return "unknown";
};

const buildResourceUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? 'https://your-production-domain.com'
    : 'http://localhost:3001';
  
  if (url.startsWith('/api/')) {
    return `${baseUrl}${url}`;
  }
  
  return `${baseUrl}/api/upload/${url}`;
};

const niceFileName = (url: string): string => {
  try {
    const u = new URL(url, window.location.origin);
    return decodeURIComponent(u.pathname.split("/").pop() || url);
  } catch {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1] || url);
  }
};

const parseSeconds = (val?: string): number => {
  if (!val) return NaN;
  const n = Number(val);
  if (!Number.isNaN(n)) return n;
  const match = val.match(/(?:(\d+)m)?\s*(?:(\d+)s)?/i);
  if (!match) return NaN;
  const mins = Number(match[1] || 0);
  const secs = Number(match[2] || 0);
  return mins * 60 + secs;
};

const formatDuration = (secondsLike?: any): string => {
  const seconds = Number.isNaN(Number(secondsLike))
    ? parseSeconds(secondsLike)
    : Number(secondsLike);
  const total = Number.isNaN(seconds) ? 120 : seconds;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
};

const formatMinutesShort = (secondsLike?: string): string => {
  const secs = Number.isNaN(Number(secondsLike))
    ? parseSeconds(secondsLike)
    : Number(secondsLike);
  if (Number.isNaN(secs)) return "";
  const mins = Math.max(1, Math.ceil(secs / 60));
  return `${mins} min`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Estilos do certificado
const certificateStyles = `
  .certificate-wrapper {
    padding: 20px;
  }

  .certificate-container-printable {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border: 20px solid #2c3e50;
    border-radius: 15px;
    padding: 50px;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    min-height: 800px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Times New Roman', serif;
  }

  .certificate-border {
    border: 2px solid #3498db;
    padding: 40px;
    position: relative;
    background: white;
    min-height: 700px;
  }

  .certificate-header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 3px solid #ecf0f1;
    padding-bottom: 30px;
  }

  .certificate-logo {
    margin-bottom: 20px;
  }

  .certificate-main-title {
    font-size: 3.5em;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 8px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }

  .certificate-subtitle {
    font-size: 1.4em;
    color: #7f8c8d;
    margin: 10px 0 0 0;
    font-style: italic;
  }

  .certificate-body {
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .certificate-text-intro {
    font-size: 1.3em;
    color: #34495e;
    margin-bottom: 20px;
  }

  .student-name-container {
    margin: 30px 0;
    padding: 20px;
    background: linear-gradient(135deg, #3498db, #2c3e50);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.3);
  }

  .student-name {
    font-size: 2.8em;
    font-weight: bold;
    color: white;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  .certificate-text-main {
    font-size: 1.4em;
    color: #34495e;
    margin: 30px 0 20px 0;
  }

  .course-title-container {
    margin: 20px 0 30px 0;
    padding: 15px;
    border: 2px dashed #3498db;
    border-radius: 8px;
    background: #f8f9fa;
  }

  .course-title {
    font-size: 2em;
    font-weight: bold;
    color: #e74c3c;
    margin: 0;
    font-style: italic;
  }

  .certificate-details {
    font-size: 1.2em;
    color: #2c3e50;
    line-height: 1.6;
    margin: 30px 0;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .certificate-code-container {
    display: flex;
    justify-content: space-around;
    margin: 40px 0;
    padding: 20px;
    background: #ecf0f1;
    border-radius: 10px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .certificate-code, .certificate-date {
    font-size: 1.1em;
    color: #2c3e50;
  }

  .certificate-code strong, .certificate-date strong {
    color: #e74c3c;
  }

  .certificate-footer {
    margin-top: 40px;
    border-top: 2px solid #bdc3c7;
    padding-top: 30px;
  }

  .signatures {
    display: flex;
    justify-content: center;
  }

  .signature-block {
    text-align: center;
  }

  .signature-line {
    width: 300px;
    height: 2px;
    background: #2c3e50;
    margin: 0 auto 10px auto;
  }

  .signature-name {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
    margin: 5px 0;
  }

  .signature-role {
    font-size: 1em;
    color: #7f8c8d;
    margin: 0;
  }

  .certificate-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    opacity: 0.03;
    pointer-events: none;
    z-index: 1;
  }

  .watermark-text {
    font-size: 120px;
    font-weight: bold;
    color: #2c3e50;
    white-space: nowrap;
  }

  @media print {
    body * {
      visibility: hidden;
    }
    
    .certificate-container-printable,
    .certificate-container-printable * {
      visibility: visible;
    }
    
    .certificate-container-printable {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
      border: none;
      box-shadow: none;
      background: white !important;
    }
    
    .modal-footer,
    .modal-header {
      display: none !important;
    }
    
    .certificate-border {
      border: 3px solid #2c3e50 !important;
      margin: 0;
      padding: 30px !important;
    }
    
    .student-name {
      color: #2c3e50 !important;
      -webkit-print-color-adjust: exact;
    }
    
    .student-name-container {
      background: #f8f9fa !important;
      -webkit-print-color-adjust: exact;
    }
  }

  @media (max-width: 768px) {
    .certificate-container-printable {
      padding: 20px;
      min-height: auto;
    }
    
    .certificate-border {
      padding: 20px;
    }
    
    .certificate-main-title {
      font-size: 2.5em;
      letter-spacing: 4px;
    }
    
    .student-name {
      font-size: 2em;
    }
    
    .course-title {
      font-size: 1.6em;
    }
    
    .certificate-code-container {
      flex-direction: column;
      text-align: center;
    }
    
    .watermark-text {
      font-size: 80px;
    }
  }
`;

// Componente para injetar estilos
const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{ __html: certificateStyles }} />
);

// Componente Player Universal
const UniversalPlayer = ({ 
  src, 
  title,
  contentType 
}: { 
  src: string | null; 
  title?: string;
  contentType?: ContentType;
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  const handleFullscreen = () => {
    const element = document.getElementById('universal-player-content');
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeError = () => {
    console.warn('Iframe bloqueado por CSP, usando fallback');
    setIframeBlocked(true);
  };

  const detectedType = contentType || (src ? getContentType(src) : 'unknown');

  if (!src) {
    return (
      <div className="ratio ratio-16x9 bg-light rounded position-relative overflow-hidden">
        <img
          className="w-100 h-100"
          src="/assets/img/course/course-27.jpg"
          alt="Selecione uma aula para reproduzir"
          style={{ objectFit: "cover" }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-25">
          <div className="play-icon mb-2 text-white">
            <i className="fas fa-play fs-1" />
          </div>
          <p className="text-white fs-5 mb-0">
            Selecione uma aula para começar
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (detectedType) {
      case "video":
        if (src.includes("/api/upload/video") || src.endsWith(".mp4") || src.endsWith(".webm")) {
          return (
            <video 
              controls 
              className="w-100 h-100" 
              style={{ objectFit: "contain" }}
            >
              <source src={src} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          );
        } else {
          return iframeBlocked ? (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center p-4">
                <i className="fas fa-video fs-1 text-warning mb-3"></i>
                <h5>Conteúdo de Vídeo Externo</h5>
                <p className="text-muted">Para assistir este vídeo, abra em uma nova aba.</p>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  Assistir em Nova Aba
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={`${src}${src.includes("?") ? "&" : "?"}autoplay=1`}
              title={title || "Aula em vídeo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-100 h-100 border-0"
              onError={handleIframeError}
            />
          );
        }

      case "pdf":
        return (
          <div className="w-100 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
              <span>
                <i className="fas fa-file-pdf me-2"></i>
                {title || "Documento PDF"}
              </span>
              <div>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light me-2"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Abrir em Nova Aba
                </a>
                <a 
                  href={src} 
                  className="btn btn-sm btn-light me-2"
                  download
                >
                  <i className="fas fa-download me-1"></i>
                  Baixar
                </a>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={handleFullscreen}
                >
                  <i className="fas fa-expand me-1"></i>
                  Tela Cheia
                </button>
              </div>
            </div>
            
            {!pdfError ? (
              <div className="flex-grow-1">
                <object
                  data={`${src}#view=FitH`}
                  type="application/pdf"
                  className="w-100 h-100"
                  onError={() => setPdfError(true)}
                >
                  <div className="alert alert-warning h-100 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                      <p>Não foi possível carregar o PDF inline.</p>
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        Abrir PDF em Nova Aba
                      </a>
                    </div>
                  </div>
                </object>
              </div>
            ) : (
              <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div className="alert alert-warning m-3 text-center">
                  <i className="fas fa-exclamation-triangle fs-1 mb-3"></i>
                  <h5>Não foi possível carregar o PDF inline</h5>
                  <p>Você pode abrir o documento em uma nova aba ou fazer o download.</p>
                  <div className="mt-3">
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary me-2"
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      Abrir em Nova Aba
                    </a>
                    <a
                      href={src}
                      download
                      className="btn btn-success"
                    >
                      <i className="fas fa-download me-2"></i>
                      Baixar PDF
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="w-100 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
              <span>
                <i className="fas fa-image me-2"></i>
                {title || "Imagem"}
              </span>
              <div>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light me-2"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Abrir em Nova Aba
                </a>
                <a 
                  href={src} 
                  className="btn btn-sm btn-light me-2"
                  download
                >
                  <i className="fas fa-download me-1"></i>
                  Baixar
                </a>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={handleFullscreen}
                >
                  <i className="fas fa-expand me-1"></i>
                  Tela Cheia
                </button>
              </div>
            </div>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-dark">
              <img
                src={src}
                alt={title || "Imagem da aula"}
                className="img-fluid"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', src);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        );

      case "document":
        return (
          <div className="w-100 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
              <span>
                <i className="fas fa-file me-2"></i>
                {title || "Documento"}
              </span>
              <div>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light me-2"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Abrir em Nova Aba
                </a>
                <a 
                  href={src} 
                  className="btn btn-sm btn-light"
                  download
                >
                  <i className="fas fa-download me-1"></i>
                  Baixar
                </a>
              </div>
            </div>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center p-4">
                <i className="fas fa-file fs-1 text-muted mb-3"></i>
                <h5>Documento</h5>
                <p className="text-muted">{niceFileName(src)}</p>
                <div className="mt-3">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary me-2"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Abrir em Nova Aba
                  </a>
                  <a
                    href={src}
                    download
                    className="btn btn-success"
                  >
                    <i className="fas fa-download me-2"></i>
                    Baixar Documento
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-100 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
              <span>
                <i className="fas fa-question-circle me-2"></i>
                Conteúdo não reconhecido
              </span>
              <div>
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-light me-2"
                >
                  <i className="fas fa-external-link-alt me-1"></i>
                  Abrir em Nova Aba
                </a>
                <a 
                  href={src} 
                  className="btn btn-sm btn-light"
                  download
                >
                  <i className="fas fa-download me-1"></i>
                  Baixar
                </a>
              </div>
            </div>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
              <div className="text-center p-4">
                <i className="fas fa-exclamation-triangle fs-1 text-warning mb-3"></i>
                <h5>Tipo de conteúdo não suportado</h5>
                <p className="text-muted">Não é possível visualizar este tipo de arquivo inline.</p>
                <div className="mt-3">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary me-2"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Abrir em Nova Aba
                  </a>
                  <a
                    href={src}
                    download
                    className="btn btn-success"
                  >
                    <i className="fas fa-download me-2"></i>
                    Baixar Arquivo
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      id="universal-player-content"
      className={`ratio ratio-16x9 bg-black rounded overflow-hidden ${isFullscreen ? 'fullscreen-mode' : ''}`}
    >
      {renderContent()}
    </div>
  );
};

const getCertificateApiBaseUrl = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction 
    ? 'https://your-production-domain.com/e-learning/api'
    : 'http://192.250.224.214:8585/e-learning/api';
};

const CourseWatch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const studentId = 5;

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);

  const [currentContent, setCurrentContent] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentContentType, setCurrentContentType] = useState<ContentType>("unknown");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>("");
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [existingCertificates, setExistingCertificates] = useState<Certificate[]>([]);

  // Estados adicionais que estavam faltando
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);

  const { 
    getCourceById, 
    getCourseCards, 
    getCourseProgress, 
    completeLesson,
    getDetailedProgress 
  } = useCourseApi();

  const getCourceByIdRef = useRef(getCourceById);
  const getCourseCardsRef = useRef(getCourseCards);
  const getCourseProgressRef = useRef(getCourseProgress);
  const completeLessonRef = useRef(completeLesson);
  const getDetailedProgressRef = useRef(getDetailedProgress);

  useEffect(() => {
    getCourceByIdRef.current = getCourceById;
    getCourseCardsRef.current = getCourseCards;
    getCourseProgressRef.current = getCourseProgress;
    completeLessonRef.current = completeLesson;
    getDetailedProgressRef.current = getDetailedProgress;
  }, [getCourceById, getCourseCards, getCourseProgress, completeLesson, getDetailedProgress]);

  const loadExistingCertificates = async () => {
    try {
      console.log("🔍 Carregando certificados existentes...");
      const apiBaseUrl = getCertificateApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/certificates/my`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
      });

      if (response.ok) {
        const certificates = await response.json();
        console.log("✅ Certificados carregados:", certificates);
        setExistingCertificates(certificates);
        return certificates;
      } else {
        console.warn("⚠️ Não foi possível carregar certificados:", response.status);
        return [];
      }
    } catch (error) {
      console.error("❌ Erro ao carregar certificados:", error);
      return [];
    }
  };

  const getCertificateForCurrentCourse = () => {
    if (!courseId || existingCertificates.length === 0) return null;
    
    const courseCert = existingCertificates.find(cert => 
      cert.course.id.toString() === courseId
    );
    
    console.log("🔍 Certificado para curso atual:", courseCert);
    return courseCert || null;
  };

  const hasExistingCertificate = getCertificateForCurrentCourse();

  const printCertificate = () => {
    const certificateElement = document.getElementById('certificate-content');
    if (certificateElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Certificado - ${certificate?.course.title}</title>
              <style>
                ${certificateStyles}
                
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f8f9fa;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  font-family: 'Times New Roman', serif;
                }
                
                @media print {
                  body {
                    padding: 0;
                    background: white;
                  }
                  
                  .certificate-container-printable {
                    box-shadow: none !important;
                    border: 3px solid #2c3e50 !important;
                    margin: 0 !important;
                    page-break-after: avoid;
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              ${certificateElement.outerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const downloadCertificate = async () => {
    try {
      const certificateElement = document.getElementById('certificate-content');
      if (!certificateElement) return;

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `certificado-${certificate?.course.title}-${certificate?.certificateCode}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      alert('Erro ao baixar certificado. Tente imprimir como alternativa.');
    }
  };

  const handleCertificateAction = async () => {
    if (!courseId) return;
    
    setLoadingCertificate(true);
    try {
      await loadExistingCertificates();
      
      const existingCert = getCertificateForCurrentCourse();
      
      if (existingCert) {
        console.log("🎓 Certificado já existe, mostrando...");
        setCertificate(existingCert);
        setShowCertificateModal(true);
      } else {
        console.log(`🎓 Tentando gerar novo certificado para curso ${courseId}`);
        
        const apiBaseUrl = getCertificateApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/certificates/issue/${courseId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
        });

        if (response.ok) {
          const newCertificate = await response.json();
          console.log("✅ Novo certificado gerado:", newCertificate);
          setCertificate(newCertificate);
          setShowCertificateModal(true);
          
          await loadExistingCertificates();
        } else {
          const errorText = await response.text();
          console.error("❌ Erro ao gerar certificado:", response.status, errorText);
          
          if (response.status === 400) {
            alert("Não foi possível gerar o certificado. Verifique se você completou todos os requisitos do curso.");
          } else {
            alert("Erro ao gerar certificado. Tente novamente mais tarde.");
          }
        }
      }
    } catch (error: any) {
      console.error("❌ Erro no processo de certificado:", error);
      
      const existingCert = getCertificateForCurrentCourse();
      if (existingCert) {
        setCertificate(existingCert);
        setShowCertificateModal(true);
      } else {
        alert("Erro ao processar certificado. Tente novamente.");
      }
    } finally {
      setLoadingCertificate(false);
    }
  };

  const loadDetailedProgress = async (courseId: number, studentId: number) => {
    try {
      console.log(`🔍 Carregando progresso detalhado: curso ${courseId}, estudante ${studentId}`);
      const response = await getDetailedProgressRef.current(courseId, studentId);
      console.log("✅ Progresso detalhado carregado:", response);
      return response.data || response;
    } catch (error: any) {
      console.error("❌ Erro ao carregar progresso detalhado:", error);
      throw error;
    }
  };

  const calculateRealProgress = (modulesData: Module[]) => {
    let totalCompleted = 0;
    let totalLessonsCount = 0;

    modulesData.forEach(module => {
      const moduleLessons = module.lessons || [];
      totalLessonsCount += moduleLessons.length;
      
      moduleLessons.forEach(lesson => {
        if (lesson.progress && lesson.progress.completed === true) {
          totalCompleted++;
          console.log(`✅ Aula ${lesson.id} - ${lesson.title} está CONCLUÍDA`);
        } else {
          console.log(`❌ Aula ${lesson.id} - ${lesson.title} NÃO concluída`);
        }
      });
    });

    const percentage = totalLessonsCount > 0 
      ? Math.round((totalCompleted / totalLessonsCount) * 100) 
      : 0;

    console.log(`📊 Progresso calculado: ${totalCompleted}/${totalLessonsCount} = ${percentage}%`);

    return {
      completedLessons: totalCompleted,
      totalLessons: totalLessonsCount,
      progressPercentage: percentage
    };
  };

  const handleViewProgress = async () => {
    if (!courseId) return;
    
    try {
      setShowProgressModal(true);
      console.log("📊 Abrindo modal de progresso detalhado");
    } catch (error) {
      console.error("Erro ao carregar progresso detalhado:", error);
    }
  };

  const handleLessonPlay = async (lesson: Lesson, moduleId?: number) => {
    const contentUrl = buildResourceUrl(lesson.content);
    const contentType = getContentType(contentUrl);
    
    setCurrentContent(contentUrl);
    setCurrentLesson(lesson);
    setCurrentContentType(contentType);
    setActiveTab("overview");
    
    if (moduleId) setExpandedModule(moduleId);
    
    console.log(`🎬 Reproduzindo aula: ${lesson.title}`, { contentType, url: contentUrl });
  };

  // Funções que estavam faltando
  const toggleCompleteCurrent = async () => {
    if (!currentLesson || !courseId) return;
    
    const wasCompleted = completedLessons.has(currentLesson.id);
    const newCompletedState = !wasCompleted;
    
    console.log(`${newCompletedState ? '✅' : '⬜'} Marcando aula ${currentLesson.id} como ${newCompletedState ? 'concluída' : 'não concluída'}`);

    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (newCompletedState) {
        next.add(currentLesson.id);
      } else {
        next.delete(currentLesson.id);
      }
      return next;
    });

    const newCount = newCompletedState ? completedLessons.size + 1 : completedLessons.size - 1;
    const newPercentage = totalLessons > 0 ? Math.round((newCount / totalLessons) * 100) : 0;
    setProgressPercentage(newPercentage);

    try {
      if (newCompletedState) {
        await completeLessonRef.current(Number(courseId), currentLesson.id);
        console.log("✅ Aula marcada como concluída no servidor");
        
        const now = new Date();
        setLastActivity(`Última atividade em ${now.toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`);
        
        setTimeout(async () => {
          try {
            console.log("🔄 Recarregando progresso após marcar aula...");
            const updatedProgress = await loadDetailedProgress(Number(courseId), studentId);
            const updatedModules = updatedProgress as Module[];
            const realProgress = calculateRealProgress(updatedModules);
            
            setProgressPercentage(realProgress.progressPercentage);
            
            const updatedCompletedLessons = new Set<number>();
            updatedModules.forEach(module => {
              module.lessons.forEach(lesson => {
                if (lesson.progress && lesson.progress.completed === true) {
                  updatedCompletedLessons.add(lesson.id);
                }
              });
            });
            setCompletedLessons(updatedCompletedLessons);
            setModules(updatedModules);
            
            console.log("✅ Progresso recarregado com sucesso!");
          } catch (error) {
            console.error("❌ Erro ao recarregar progresso:", error);
          }
        }, 1000);
        
      } else {
        console.log("⚠️ Desmarcar como concluída ainda não implementado no backend");
      }
    } catch (error: any) {
      console.error("❌ Erro ao atualizar progresso no servidor:", error);
      
      setCompletedLessons((prev) => {
        const next = new Set(prev);
        if (!newCompletedState) {
          next.add(currentLesson.id);
        } else {
          next.delete(currentLesson.id);
        }
        return next;
      });
      
      const revertCount = wasCompleted ? completedLessons.size : completedLessons.size - 1;
      const revertPercentage = totalLessons > 0 ? Math.round((revertCount / totalLessons) * 100) : 0;
      setProgressPercentage(revertPercentage);
      
      alert(`Erro ao atualizar progresso: ${error?.response?.data?.message || error?.message || 'Tente novamente'}`);
    }
  };

  const descricaoComprimento = useMemo(() => {
    const html = course?.longDescription;
    if (!html) return 0;
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return (doc.body.textContent || "").trim().length;
    } catch {
      return html.length;
    }
  }, [course?.longDescription]);
  
  const podeExpandirDescricao = descricaoComprimento > 500;

  const flatLessons = useMemo(() => {
    return modules.flatMap((m) =>
      (m.lessons || []).map((l) => ({ moduleId: m.id, lesson: l }))
    );
  }, [modules]);

  const positionInfo = useMemo(() => {
    if (!currentLesson) return null;
    let moduleIndex = -1;
    let lessonIndexInModule = -1;
    let moduleLessonsCount = 0;

    modules.forEach((m, mi) => {
      const li = m.lessons.findIndex((l) => l.id === currentLesson.id);
      if (li !== -1) {
        moduleIndex = mi;
        lessonIndexInModule = li;
        moduleLessonsCount = m.lessons.length;
      }
    });

    const flatIndex = flatLessons.findIndex(
      (x) => x.lesson.id === currentLesson.id
    );

    return {
      moduleIndex,
      lessonIndexInModule,
      moduleLessonsCount,
      flatIndex,
      modulesCount: modules.length,
    };
  }, [currentLesson, modules, flatLessons]);

  const hasPrev = !!positionInfo && positionInfo.flatIndex > 0;
  const hasNext = !!positionInfo && positionInfo.flatIndex < Math.max(0, flatLessons.length - 1);

  const goToIndex = (idx: number) => {
    const node = flatLessons[idx];
    if (!node) return;
    handleLessonPlay(node.lesson, node.moduleId);
  };

  const goPrev = () => {
    if (!positionInfo) return;
    goToIndex(positionInfo.flatIndex - 1);
  };

  const goNext = () => {
    if (!positionInfo) return;
    goToIndex(positionInfo.flatIndex + 1);
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModule((prev) => (prev === moduleId ? null : moduleId));
  };

  // Componente Modal de Progresso
  const ProgressModal = () => {
    if (!showProgressModal) return null;

    const completedCount = Array.from(completedLessons).length;
    const remainingCount = totalLessons - completedCount;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">📊 Progresso do Curso</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowProgressModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-4">
                <h3 className="text-primary">{progressPercentage}%</h3>
                <p className="text-muted">Concluído</p>
              </div>
              
              <div className="row text-center mb-4">
                <div className="col-6">
                  <div className="border-end">
                    <h4 className="text-success">{completedCount}</h4>
                    <small className="text-muted">Aulas Concluídas</small>
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <h4 className="text-warning">{remainingCount}</h4>
                    <small className="text-muted">Aulas Restantes</small>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Progresso Geral</span>
                  <span className="fw-bold">{progressPercentage}%</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h6>Progresso por Módulo:</h6>
                {modules.map((module, index) => {
                  const moduleCompleted = module.lessons.filter(lesson => 
                    lesson.progress?.completed
                  ).length;
                  const moduleTotal = module.lessons.length;
                  const modulePercentage = moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;
                  
                  return (
                    <div key={module.id} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="fw-bold">Módulo {index + 1}: {module.title}</small>
                        <small>{modulePercentage}%</small>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: `${modulePercentage}%` }}
                        />
                      </div>
                      <small className="text-muted">
                        {moduleCompleted}/{moduleTotal} aulas concluídas
                      </small>
                    </div>
                  );
                })}
              </div>

              {lastActivity && (
                <div className="alert alert-info mb-0 mt-3">
                  <small>
                    <i className="fas fa-clock me-2"></i>
                    {lastActivity}
                  </small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowProgressModal(false)}
              >
                Fechar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setShowProgressModal(false);
                  const firstUncompleted = flatLessons.find(item => 
                    !completedLessons.has(item.lesson.id)
                  );
                  if (firstUncompleted) {
                    handleLessonPlay(firstUncompleted.lesson, firstUncompleted.moduleId);
                  }
                }}
              >
                Continuar Estudando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente Modal de Certificado
  const CertificateModal = () => {
    if (!showCertificateModal || !certificate) return null;

    const existingCert = getCertificateForCurrentCourse();
    const isExisting = !!existingCert;

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} tabIndex={-1}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content bg-transparent border-0">
            <div className="modal-header bg-dark bg-opacity-50 border-bottom-0">
              <h5 className="modal-title text-white">
                🎓 Certificado de Conclusão
                {isExisting && <span className="badge bg-success ms-2">JÁ EMITIDO</span>}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowCertificateModal(false)}
              ></button>
            </div>
            
            <div className="modal-body p-0 d-flex align-items-center justify-content-center">
              <div className="certificate-wrapper" style={{ maxWidth: '1200px', width: '100%' }}>
                <div id="certificate-content" className="certificate-container-printable">
                  <div className="certificate-border">
                    <div className="certificate-header">
                      <div className="certificate-logo">
                        <img src="/assets/img/logo.png" alt="Logo" width="200" />
                      </div>
                      <div className="certificate-title-section">
                        <h1 className="certificate-main-title">CERTIFICADO</h1>
                        <p className="certificate-subtitle">de Conclusão de Curso</p>
                      </div>
                    </div>

                    <div className="certificate-body">
                      <div className="certificate-text-intro">
                        A plataforma de E-learning certifica que
                      </div>
                      
                      <div className="student-name-container">
                        <h2 className="student-name">
                          {certificate.student.firstName} {certificate.student.lastName}
                        </h2>
                      </div>

                      <div className="certificate-text-main">
                        concluiu com êxito o curso de
                      </div>

                      <div className="course-title-container">
                        <h3 className="course-title">"{certificate.course.title}"</h3>
                      </div>

                      <div className="certificate-details">
                        <p>
                          com carga horária total de {totalLessons * 45} minutos, 
                          demonstrando dedicação e competência na aquisição dos 
                          conhecimentos e habilidades necessárias para o domínio do assunto.
                        </p>
                      </div>

                      <div className="certificate-code-container">
                        <div className="certificate-code">
                          <strong>Código de Verificação:</strong> {certificate.certificateCode}
                        </div>
                        <div className="certificate-date">
                          <strong>Data de Emissão:</strong> {formatDate(certificate.issuedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="certificate-footer">
                      <div className="signatures">
                        <div className="signature-block">
                          <div className="signature-line"></div>
                          <p className="signature-name">Diretoria Acadêmica</p>
                          <p className="signature-role">Plataforma de E-learning</p>
                        </div>
                      </div>
                    </div>

                    <div className="certificate-watermark">
                      <div className="watermark-text">CERTIFICADO VÁLIDO</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-dark bg-opacity-50 border-top-0 justify-content-center">
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCertificateModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  Fechar
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-info"
                  onClick={printCertificate}
                >
                  <i className="fas fa-print me-2"></i>
                  Imprimir
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={downloadCertificate}
                >
                  <i className="fas fa-download me-2"></i>
                  Baixar PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!courseId) {
      setError("ID do curso não fornecido");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchCourseData = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("🔍 Carregando curso ID:", courseId);
        console.log("👤 ID do Estudante:", studentId);

        const courseResponse = await getCourceByIdRef.current(Number(courseId));
        if (cancelled) return;
        
        console.log("✅ Curso carregado:", courseResponse);
        const courseData = courseResponse.data as Course;
        setCourse(courseData);

        const detailedProgress = await loadDetailedProgress(Number(courseId), studentId);
        if (cancelled) return;

        console.log("📊 Dados detalhados do progresso:", detailedProgress);
        
        const fetchedModules = detailedProgress as Module[];
        
        const processedModules = fetchedModules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            content: buildResourceUrl(lesson.content)
          }))
        }));
        
        setModules(processedModules);

        const realProgress = calculateRealProgress(processedModules);
        console.log("🎯 Progresso real calculado:", realProgress);

        setTotalLessons(realProgress.totalLessons);
        setProgressPercentage(realProgress.progressPercentage);

        const completedLessonsSet = new Set<number>();
        processedModules.forEach(module => {
          module.lessons.forEach(lesson => {
            if (lesson.progress && lesson.progress.completed === true) {
              completedLessonsSet.add(lesson.id);
            }
          });
        });
        setCompletedLessons(completedLessonsSet);

        console.log("📋 Aulas concluídas:", Array.from(completedLessonsSet));

        await loadExistingCertificates();

        try {
          console.log("🔍 Carregando progresso adicional do curso...");
          const progressResponse = await getCourseProgressRef.current(Number(courseId));
          if (!cancelled && progressResponse.data) {
            console.log("✅ Progresso adicional carregado:", progressResponse.data);
            const progress = progressResponse.data as Progress;
            
            if (progress.lastAccessDate) {
              const date = new Date(progress.lastAccessDate);
              setLastActivity(`Última atividade em ${date.toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}`);
            }
          }
        } catch (progressError) {
          console.warn("⚠️ Não foi possível carregar o progresso adicional:", progressError);
        }

        const courseDocsRaw: any[] = (courseData as any)?.documents || (courseData as any)?.resources || [];
        const courseDocs = (Array.isArray(courseDocsRaw) ? courseDocsRaw : [])
          .map((d) => typeof d === "string" ? buildResourceUrl(d) : d?.url ? buildResourceUrl(String(d.url)) : null)
          .filter((x: string | null): x is string => !!x && isDocumentUrl(x));

        const lessonDocs = processedModules
          .flatMap((m) => m.lessons || [])
          .map((l) => l.content)
          .filter((url) => isDocumentUrl(url));

        const uniqueDocs = Array.from(new Set([...courseDocs, ...lessonDocs]));
        setDocuments(uniqueDocs);
        setSelectedDoc((prev) => prev ?? (uniqueDocs[0] || null));

        if (processedModules.length > 0) {
          setExpandedModule(processedModules[0].id);
          
          let firstUncompletedLesson: Lesson | null = null;
          let firstLesson: Lesson | null = null;
          
          for (const module of processedModules) {
            for (const lesson of module.lessons) {
              if (!firstLesson) firstLesson = lesson;
              if (!lesson.progress?.completed && !firstUncompletedLesson) {
                firstUncompletedLesson = lesson;
                break;
              }
            }
            if (firstUncompletedLesson) break;
          }
          
          const lessonToPlay = firstUncompletedLesson || firstLesson;
          if (lessonToPlay) {
            console.log("🎬 Selecionando aula:", lessonToPlay.title);
            handleLessonPlay(lessonToPlay, processedModules[0].id);
          }
        }

        console.log("✅ Todos os dados carregados com sucesso!");

      } catch (err: any) {
        if (cancelled) return;
        console.error("❌ Erro ao carregar dados do curso:", err?.response?.data || err?.message || err);
        setError(
          err?.response?.data?.message || 
          err?.message || 
          "Não foi possível carregar os dados do curso. Verifique se o ID está correto."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourseData();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="content pt-0">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <div className="mt-2">Carregando curso...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content pt-0">
        <div className="container-fluid">
          <div className="alert alert-danger m-4" role="alert">
            <h5 className="alert-heading">Erro ao carregar curso</h5>
            <p>{error}</p>
            <hr />
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content pt-0">
      <StyleInjector />
      <div className="container-fluid">
        <div className="course-watch-section">
          <div className="row g-0 g-lg-4">
            {/* Sidebar - Progresso e Módulos */}
            <div className="col-lg-4 border-end">
              <div className="progress-overview-section p-3 p-lg-4">
                <div className="mb-4">
                  <Link
                    to="#"
                    className="d-inline-flex align-items-center text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(-1);
                    }}
                  >
                    <i className="me-2">←</i>
                    Voltar ao curso
                  </Link>
                </div>

                <h3 className="mb-2">{course?.title || "Curso"}</h3>
                <div className="text-muted mb-4">
                  {modules.length} módulos • {totalLessons} aulas
                </div>

                <div className="mb-4">
                  <button 
                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center mb-2"
                    onClick={handleViewProgress}
                  >
                    <i className="fas fa-chart-line me-2"></i>
                    Ver Meu Progresso ({progressPercentage}%)
                  </button>

                  {progressPercentage === 100 && (
                    <button 
                      className={`btn w-100 d-flex align-items-center justify-content-center ${
                        hasExistingCertificate ? 'btn-info' : 'btn-success'
                      }`}
                      onClick={handleCertificateAction}
                      disabled={loadingCertificate}
                    >
                      {loadingCertificate ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-award me-2"></i>
                          {hasExistingCertificate ? 'Ver Certificado' : 'Gerar Certificado'}
                        </>
                      )}
                    </button>
                  )}
                  
                  {lastActivity && (
                    <small className="text-muted mt-2 d-block text-center">
                      {lastActivity}
                    </small>
                  )}
                </div>

                <div className="accordion accordion-flush">
                  {modules.map((module, index) => {
                    const moduleCompleted = module.lessons.filter(lesson => 
                      lesson.progress?.completed
                    ).length;
                    const moduleTotal = module.lessons.length;
                    
                    return (
                      <div className="accordion-item border-0 mb-3" key={module.id}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${expandedModule === module.id ? "" : "collapsed"} bg-light`}
                            type="button"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-start w-100">
                                <div>
                                  <small className="text-muted d-block">Seção {index + 1}</small>
                                  <strong>{module.title}</strong>
                                </div>
                                <span className="badge bg-primary ms-2">
                                  {moduleCompleted}/{moduleTotal}
                                </span>
                              </div>
                            </div>
                          </button>
                        </h2>

                        <div className={`accordion-collapse ${expandedModule === module.id ? "show" : "collapse"}`}>
                          <div className="accordion-body p-2">
                            {module.lessons.map((lesson) => {
                              const isCurrent = currentLesson?.id === lesson.id;
                              const isDone = lesson.progress?.completed === true;
                              const contentType = getContentType(lesson.content);
                              const showMinutes = contentType === "video";
                              const minutesText = showMinutes
                                ? formatMinutesShort(lesson.duration || "120")
                                : lesson.duration || "";
                              
                              const getIcon = () => {
                                switch (contentType) {
                                  case "video": return "fas fa-play";
                                  case "pdf": return "fas fa-file-pdf";
                                  case "image": return "fas fa-image";
                                  case "document": return "fas fa-file";
                                  default: return "fas fa-file";
                                }
                              };
                              
                              return (
                                <div
                                  key={lesson.id}
                                  className={`d-flex align-items-center justify-content-between p-2 mb-2 rounded cursor-pointer ${
                                    isCurrent ? "bg-primary bg-opacity-10" : "hover-bg-light"
                                  }`}
                                  onClick={() => handleLessonPlay(lesson, module.id)}
                                  role="button"
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="d-flex align-items-center flex-grow-1">
                                    <span className="me-2">
                                      {isDone ? (
                                        <span className="text-success">✓</span>
                                      ) : (
                                        <i className={`${getIcon()} ${isCurrent ? "text-primary" : "text-muted"}`}></i>
                                      )}
                                    </span>
                                    <span className={`${isCurrent ? "fw-bold text-primary" : ""} small`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  {minutesText && <small className="text-muted">{minutesText}</small>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="col-lg-8">
              <div className="p-3 p-lg-4">
                <div className="mb-4">
                  <UniversalPlayer 
                    src={currentContent} 
                    title={currentLesson?.title}
                    contentType={currentContentType}
                  />

                  {currentLesson && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h4 className="mb-2">{currentLesson.title}</h4>
                      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                        <span className={`badge ${
                          currentContentType === "video" ? "bg-danger" :
                          currentContentType === "pdf" ? "bg-danger" :
                          currentContentType === "image" ? "bg-success" :
                          "bg-secondary"
                        }`}>
                          <i className={`me-1 ${
                            currentContentType === "video" ? "fas fa-video" :
                            currentContentType === "pdf" ? "fas fa-file-pdf" :
                            currentContentType === "image" ? "fas fa-image" :
                            "fas fa-file"
                          }`}></i>
                          {currentContentType === "video" ? "Vídeo" :
                           currentContentType === "pdf" ? "PDF" :
                           currentContentType === "image" ? "Imagem" :
                           "Documento"}
                        </span>
                        {currentLesson.duration && (
                          <span className="badge bg-secondary">{currentLesson.duration}</span>
                        )}
                        {positionInfo && positionInfo.moduleIndex >= 0 && (
                          <span className="text-muted small">
                            Módulo {positionInfo.moduleIndex + 1} • Aula {positionInfo.lessonIndexInModule + 1} de {positionInfo.moduleLessonsCount}
                          </span>
                        )}
                        <span className={`badge ${completedLessons.has(currentLesson.id) ? 'bg-success' : 'bg-warning'}`}>
                          {completedLessons.has(currentLesson.id) ? '✓ Concluída' : 'Pendente'}
                        </span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={goPrev}
                          disabled={!hasPrev}
                        >
                          ← Anterior
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={goNext}
                          disabled={!hasNext}
                        >
                          Próxima →
                        </button>
                        <button
                          className={`btn btn-sm ms-auto ${
                            completedLessons.has(currentLesson.id)
                              ? "btn-success"
                              : "btn-outline-success"
                          }`}
                          onClick={toggleCompleteCurrent}
                        >
                          {completedLessons.has(currentLesson.id) ? "✓ Concluída" : "Marcar como concluída"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Visão geral
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "documents" ? "active" : ""}`}
                      onClick={() => setActiveTab("documents")}
                    >
                      Documentos ({documents.length})
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {activeTab === "overview" && (
                    <div>
                      <h5 className="mb-3">Sobre este curso</h5>
                      {course?.longDescription ? (
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: descricaoExpandida
                                ? course.longDescription
                                : course.longDescription.substring(0, 500) + (podeExpandirDescricao ? "..." : ""),
                            }}
                          />
                          {podeExpandirDescricao && (
                            <button
                              className="btn btn-link p-0 mt-2"
                              onClick={() => setDescricaoExpandida(!descricaoExpandida)}
                            >
                              {descricaoExpandida ? "Ver menos" : "Ver mais"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted">Nenhuma descrição disponível.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "documents" && (
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="list-group">
                          {documents.length === 0 ? (
                            <div className="text-muted p-3">Nenhum documento disponível.</div>
                          ) : (
                            documents.map((doc) => (
                              <button
                                key={doc}
                                type="button"
                                className={`list-group-item list-group-item-action ${
                                  selectedDoc === doc ? "active" : ""
                                }`}
                                onClick={() => setSelectedDoc(doc)}
                              >
                                <small>{niceFileName(doc)}</small>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="border rounded p-3">
                          {!selectedDoc ? (
                            <div className="text-center text-muted py-5">
                              Selecione um documento à esquerda
                            </div>
                          ) : isPdf(selectedDoc) ? (
                            <div className="w-100" style={{ height: "600px" }}>
                              <object
                                data={`${selectedDoc}#view=FitH`}
                                type="application/pdf"
                                className="w-100 h-100"
                              >
                                <div className="alert alert-warning h-100 d-flex align-items-center justify-content-center">
                                  <div className="text-center">
                                    <p>Não foi possível carregar o PDF inline.</p>
                                    <a
                                      href={selectedDoc}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-primary"
                                    >
                                      Abrir PDF em Nova Aba
                                    </a>
                                  </div>
                                </div>
                              </object>
                            </div>
                          ) : isImage(selectedDoc) ? (
                            <img
                              src={selectedDoc}
                              alt={niceFileName(selectedDoc)}
                              className="img-fluid rounded"
                            />
                          ) : (
                            <div className="text-center py-5">
                              <p>Não é possível visualizar este tipo de arquivo inline.</p>
                              <a
                                href={selectedDoc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                              >
                                Abrir em nova aba
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Progresso */}
      <ProgressModal />

      {/* Modal de Certificado */}
      <CertificateModal />
    </div>
  );
};

export default CourseWatch;