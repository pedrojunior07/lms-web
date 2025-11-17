import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { 
  Play, 
  FileText, 
  ExternalLink, 
  X, 
  Maximize, 
  Volume2, 
  VolumeX,
  Pause,
  Heart,
  Share2,
  BookOpen,
  Clock,
  Users,
  Award,
  Smartphone,
  Download,
  Key,
  Zap,
  GraduationCap,
  BarChart
} from "lucide-react";

export type Experience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
};

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dob: string;
  bio: string;
  experiences: Experience[];
};

export type Category = {
  id: number;
  name: string;
};

export type Course = {
  id: number;
  title: string;
  category: Category;
  level: "INICIANTE" | "INTERMEDIÁRIO" | "AVANÇADO";
  language: string;
  maxStudents: number;
  publicOrPrivate: "PÚBLICO" | "PRIVADO";
  shortDescription: string;
  longDescription: string;
  introVideoUrl: string | null;
  videoProvider: string | null;
  thumbnailPath: string | null;
  whatStudentsWillLearn: string[];
  whatYouWillLearn?: string[];
  requirements: string[];
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
  instructor: Instructor;
  modules: any;
  isFree: boolean;
  price?: number;
  hasDiscount?: boolean;
  discountPrice?: number;
  expiryType?: "LIFETIME" | "MENSAL";
  expiryMonths?: number;
};

const CourseDetails = () => {
  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState(0);
  const [content, setContent] = useState<{
    id: number;
    title: string;
    lessons: { id: number; title: string; content: string }[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course>();
  
  // Estados para modais e players
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const { getCourceById, getCourseCards } = useCourseApi();
  const route = all_routes;

  const getThumbnailUrl = (thumbnailPath: string | null | undefined): string => {
    if (!thumbnailPath) {
      return "/assets/img/course/course-40.jpg";
    }
    return thumbnailPath;
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const openVideoModal = (videoUrl: string, title: string) => {
    setCurrentVideo(videoUrl);
    setCurrentTitle(title);
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setIsPlaying(false);
    setCurrentVideo("");
    if (videoElement) {
      videoElement.pause();
    }
  };

  const openPdfModal = (pdfUrl: string, title: string) => {
    setCurrentPdf(pdfUrl);
    setCurrentTitle(title);
    setShowPdfModal(true);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setCurrentPdf("");
  };

  const togglePlayPause = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoElement.requestFullscreen();
      }
    }
  };

  const renderContentPreview = (contentUrl: string, title: string) => {
    if (!contentUrl) {
      return (
        <div className="content-placeholder bg-light rounded-2 d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
          <span className="text-muted">Conteúdo não disponível</span>
        </div>
      );
    }

    const isYouTube = contentUrl.includes('youtube.com') || contentUrl.includes('youtu.be');
    const isLocalVideo = contentUrl.includes('/media/video/') || contentUrl.match(/\.(mp4|avi|mov|mkv|webm)$/i);
    const isPdf = contentUrl.includes('/media/pdf/') || contentUrl.match(/\.pdf$/i);

    if (isYouTube || isLocalVideo) {
      const videoId = isYouTube ? getYouTubeId(contentUrl) : null;
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

      return (
        <div className="video-preview-card" onClick={() => openVideoModal(contentUrl, title)}>
          <div className="video-thumbnail-wrapper">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={title} className="video-thumbnail" />
            ) : isLocalVideo ? (
              <video className="video-thumbnail" preload="metadata">
                <source src={contentUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="video-placeholder">
                <Play size={32} />
              </div>
            )}
            <div className="play-overlay-modern">
              <div className="play-button-modern">
                <Play size={28} />
              </div>
            </div>
            <div className="content-badge">
              <Play size={14} />
              <span>Vídeo</span>
            </div>
          </div>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="pdf-preview-card" onClick={() => openPdfModal(contentUrl, title)}>
          <div className="pdf-thumbnail-wrapper">
            <div className="pdf-icon-wrapper">
              <FileText size={48} />
            </div>
            <div className="pdf-overlay">
              <p className="mb-0">Clique para visualizar</p>
            </div>
            <div className="content-badge badge-pdf">
              <FileText size={14} />
              <span>PDF</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <a href={contentUrl} target="_blank" rel="noopener noreferrer" className="generic-content-card">
        <div className="generic-content-wrapper">
          <ExternalLink size={32} />
          <span>Abrir Conteúdo</span>
        </div>
      </a>
    );
  };

  useEffect(() => {
    const idcourse = searchParams.get("id");
    setLoading(true);
    
    const fetchCourseData = async () => {
      try {
        const data = await getCourceById(Number(idcourse) || 0);
        const modules = await getCourseCards(idcourse);
        
        setCourse(data.data);
        setContent(modules.data);
        
        const totalLectures: number = modules.data.reduce(
          (sum: number, m: { lessons: any[] }) => sum + m.lessons.length,
          0
        );

        setLessons(totalLectures);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.error("Erro ao buscar curso:", error.response?.data || error.message);
      }
    };

    fetchCourseData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Detalhes do Curso" />

      <style>
        {`
          /* Video Preview Cards */
          .video-preview-card {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            height: 200px;
            background: #000;
          }

          .video-thumbnail-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
          }

          .video-thumbnail {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .video-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .play-overlay-modern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .video-preview-card:hover .play-overlay-modern {
            opacity: 1;
          }

          .play-button-modern {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            transition: transform 0.3s ease;
          }

          .video-preview-card:hover .play-button-modern {
            transform: scale(1.1);
          }

          .content-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .badge-pdf {
            background: rgba(220, 53, 69, 0.9);
          }

          /* PDF Preview Cards */
          .pdf-preview-card {
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            height: 200px;
          }

          .pdf-thumbnail-wrapper {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .pdf-icon-wrapper {
            color: white;
            transition: transform 0.3s ease;
          }

          .pdf-preview-card:hover .pdf-icon-wrapper {
            transform: scale(1.1);
          }

          .pdf-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 12px;
            text-align: center;
            font-size: 13px;
            font-weight: 500;
          }

          /* Generic Content Cards */
          .generic-content-card {
            display: block;
            text-decoration: none;
            border-radius: 12px;
            overflow: hidden;
            height: 200px;
          }

          .generic-content-wrapper {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            gap: 12px;
            transition: transform 0.3s ease;
          }

          .generic-content-card:hover .generic-content-wrapper {
            transform: scale(1.02);
          }

          /* Professional Video Modal */
          .video-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .video-modal-content {
            width: 100%;
            max-width: 1200px;
            position: relative;
          }

          .video-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            color: white;
          }

          .video-modal-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .close-modal-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .close-modal-btn:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .video-container {
            position: relative;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
          }

          .video-player {
            width: 100%;
            max-height: 70vh;
            display: block;
          }

          .video-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .video-container:hover .video-controls {
            opacity: 1;
          }

          .control-btn {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
          }

          .control-btn:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .youtube-embed {
            width: 100%;
            height: 70vh;
            max-height: 600px;
            border: none;
            border-radius: 12px;
          }

          /* PDF Modal */
          .pdf-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .pdf-modal-content {
            width: 100%;
            max-width: 1200px;
            height: 90vh;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .pdf-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background: #f8f9fa;
          }

          .pdf-viewer {
            flex: 1;
            width: 100%;
            border: none;
          }

          /* Lesson Item Improvements */
          .lesson-item {
            transition: all 0.3s ease;
            border-bottom: 1px solid #e9ecef;
          }

          .lesson-item:hover {
            background: #f8f9fa;
          }

          .lesson-item:last-child {
            border-bottom: none;
          }

          /* Course Header Improvements */
          .course-header-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
          }

          .course-thumbnail-wrapper {
            position: relative;
            cursor: pointer;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease;
          }

          .course-thumbnail-wrapper:hover {
            transform: scale(1.02);
          }

          .course-thumbnail-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .course-thumbnail-wrapper:hover .course-thumbnail-overlay {
            opacity: 1;
          }

          .thumbnail-play-btn {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            transition: transform 0.3s ease;
          }

          .course-thumbnail-wrapper:hover .thumbnail-play-btn {
            transform: scale(1.1);
          }

          /* Icon Styles */
          .icon-wrapper {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .video-modal-content, .pdf-modal-content {
              max-width: 100%;
            }

            .youtube-embed {
              height: 50vh;
            }

            .video-player {
              max-height: 50vh;
            }
          }
        `}
      </style>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3 className="video-modal-title">{currentTitle}</h3>
              <button className="close-modal-btn" onClick={closeVideoModal}>
                <X size={24} />
              </button>
            </div>
            <div className="video-container">
              {currentVideo.includes('youtube.com') || currentVideo.includes('youtu.be') ? (
                <iframe
                  className="youtube-embed"
                  src={`https://www.youtube.com/embed/${getYouTubeId(currentVideo)}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <video
                    ref={setVideoElement}
                    className="video-player"
                    src={currentVideo}
                    autoPlay
                    controls={false}
                    onClick={togglePlayPause}
                  />
                  <div className="video-controls">
                    <button className="control-btn" onClick={togglePlayPause}>
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button className="control-btn" onClick={toggleMute}>
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <div style={{ flex: 1 }} />
                    <button className="control-btn" onClick={toggleFullscreen}>
                      <Maximize size={24} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <div className="pdf-modal-overlay" onClick={closePdfModal}>
          <div className="pdf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h3 className="video-modal-title">{currentTitle}</h3>
              <button className="close-modal-btn" onClick={closePdfModal}>
                <X size={24} />
              </button>
            </div>
            <iframe className="pdf-viewer" src={currentPdf} title={currentTitle} />
          </div>
        </div>
      )}

      <section className="course-details-two">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card course-header-card">
                <div className="card-body d-lg-flex align-items-center p-4">
                  <div className="course-thumbnail-wrapper" 
                       onClick={() => course?.introVideoUrl && openVideoModal(course.introVideoUrl, course.title)}>
                    <img
                      src={getThumbnailUrl(course?.thumbnailPath)}
                      className="img-fluid"
                      alt="thumbnail do curso"
                      style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/course/course-40.jpg";
                      }}
                    />
                    {course?.introVideoUrl && (
                      <div className="course-thumbnail-overlay">
                        <div className="thumbnail-play-btn">
                          <Play size={32} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-100 ps-lg-4">
                    <h3 className="mb-2 text-white">{course?.title || "Título do Curso"}</h3>
                    <p className="fs-14 mb-3 text-white-50">
                      {course?.shortDescription || "Nenhuma descrição disponível"}
                    </p>

                    <div className="d-flex align-items-center gap-3 flex-wrap my-3">
                      <p className="fw-medium d-flex align-items-center mb-0 text-white icon-wrapper">
                        <BookOpen size={18} />
                        {content.length} Módulos
                      </p>
                      <p className="fw-medium d-flex align-items-center mb-0 text-white icon-wrapper">
                        <Clock size={18} />
                        {lessons} Aulas
                      </p>
                      <p className="fw-medium d-flex align-items-center mb-0 text-white icon-wrapper">
                        <Users size={18} />
                        {course?.maxStudents ?? "N/A"} alunos
                      </p>
                      <span className="badge badge-sm rounded-pill bg-warning fs-12">
                        {course?.category?.name || "N/A"}
                      </span>
                    </div>

                    <div className="d-sm-flex align-items-center justify-content-sm-between mt-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-lg">
                          <img
                            className="rounded-circle"
                            src="./assets/img/avatar/avatar10.jpg"
                            alt="instrutor"
                          />
                        </div>
                        <div className="ms-2">
                          <h5 className="fs-18 fw-semibold text-white">
                            <Link to={route.instructorDetails} className="text-white">
                              {course?.instructor?.firstName ?? "N/A"}{" "}
                              {course?.instructor?.lastName ?? "N/A"}
                            </Link>
                          </h5>
                          <p className="fs-14 mb-0 text-white-50">Instrutor</p>
                        </div>
                      </div>

                      <div className="d-flex mt-sm-0 mt-2 align-items-center">
                        <i className="fa-solid fa-star text-warning me-1" />
                        <i className="fa-solid fa-star text-warning me-1" />
                        <i className="fa-solid fa-star text-warning me-1" />
                        <i className="fa-solid fa-star text-warning me-1" />
                        <i className="fa-solid fa-star text-warning me-1" />
                        <p className="fs-14 mb-0 ms-2 text-white">
                          <span>4.0</span> (15)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-8">
              <div className="mb-4">
                <img
                  src={getThumbnailUrl(course?.thumbnailPath)}
                  alt="Imagem do curso"
                  className="img-fluid rounded-3 w-100"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/img/course/course-40.jpg";
                  }}
                />
              </div>

              <div className="course-page-content pt-0">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="mb-4">Visão Geral</h5>

                    <h6 className="mb-3">Descrição do Curso</h6>
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{
                        __html: course?.longDescription || "Nenhuma descrição disponível.",
                      }}
                    />

                    <h6 className="mb-3">O que você vai aprender</h6>
                    <ul className="custom-list mb-4">
                      {(course?.whatStudentsWillLearn ?? []).length > 0 ? (
                        course?.whatStudentsWillLearn?.map((item, index) => (
                          <li className="list-item mb-2" key={index}>
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="list-item">Nenhum dado disponível</li>
                      )}
                    </ul>

                    <h6 className="mb-3">Requisitos</h6>
                    <ul className="custom-list mb-0">
                      {(course?.requirements ?? []).length > 0 ? (
                        course?.requirements.map((req, index) => (
                          <li className="list-item mb-2" key={index}>
                            {req}
                          </li>
                        ))
                      ) : (
                        <li className="list-item">Nenhum requisito listado</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="card mb-4 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                      <h5 className="mb-0">Conteúdo do Curso</h5>
                      <span className="badge bg-primary px-3 py-2">
                        {lessons} Aulas
                      </span>
                    </div>

                    <div className="accordion accordion-flush" id="accordionModules">
                      {content.map((module, mIndex) => {
                        const moduleId = `module-${module.id}`;
                        return (
                          <div className="accordion-item border rounded-3 mb-3" key={moduleId}>
                            <h2 className="accordion-header" id={`heading-${moduleId}`}>
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${moduleId}`}
                                aria-expanded="false"
                                aria-controls={`collapse-${moduleId}`}
                              >
                                <div className="d-flex align-items-center w-100">
                                  <span className="me-3 badge bg-primary px-3 py-2">{mIndex + 1}</span>
                                  <div className="flex-grow-1">
                                    <div className="fw-semibold fs-16">{module.title}</div>
                                    <small className="text-muted">
                                      {module.lessons.length} aula{module.lessons.length !== 1 ? 's' : ''}
                                    </small>
                                  </div>
                                </div>
                              </button>
                            </h2>

                            <div
                              id={`collapse-${moduleId}`}
                              className="accordion-collapse collapse"
                              aria-labelledby={`heading-${moduleId}`}
                              data-bs-parent="#accordionModules"
                            >
                              <div className="accordion-body p-0">
                                {module.lessons.map((lesson, lIndex) => (
                                  <div className="lesson-item p-4" key={lesson.id}>
                                    <div className="row align-items-center">
                                      <div className="col-md-8">
                                        <div className="d-flex align-items-start mb-3">
                                          <span className="badge bg-light text-dark me-3 mt-1">
                                            {mIndex + 1}.{lIndex + 1}
                                          </span>
                                          <div className="flex-grow-1">
                                            <h6 className="mb-3">{lesson.title}</h6>
                                            {renderContentPreview(lesson.content, lesson.title)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                        <a
                                          href={lesson.content}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                                        >
                                          <ExternalLink size={16} />
                                          Acessar Conteúdo
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="mb-4">Postar um comentário</h5>
                    <form className="course-details-form">
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input className="form-control" type="text" placeholder="Seu nome" />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input className="form-control" type="email" placeholder="seu@email.com" />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Assunto</label>
                            <input className="form-control" type="text" placeholder="Assunto do comentário" />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label className="form-label">Comentários</label>
                            <textarea 
                              className="form-control" 
                              rows={5} 
                              placeholder="Escreva seu comentário..."
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary px-4">
                            Enviar Comentário
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-sidebar-sec mt-4 mt-lg-0">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {course?.isFree ? (
                        <h2 className="text-success mb-0">GRATUITO</h2>
                      ) : course?.hasDiscount ? (
                        <div>
                          <h2 className="text-success mb-0">
                            MZN {course?.discountPrice?.toFixed(2)}
                          </h2>
                          <p className="text-muted text-decoration-line-through mb-0">
                            MZN {course?.price?.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <h2 className="text-success mb-0">
                          MZN {course?.price?.toFixed(2) ?? "N/A"}
                        </h2>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-2 icon-wrapper">
                        <BarChart size={18} className="text-primary" />
                        <strong className="ms-2">Nível:</strong>
                        <span className="ms-2">{course?.level ?? "N/A"}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2 icon-wrapper">
                        <i className="fa fa-language text-primary" />
                        <strong className="ms-2">Idioma:</strong>
                        <span className="ms-2">{course?.language ?? "N/A"}</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Clock size={18} className="text-primary" />
                        <strong className="ms-2">Expiração:</strong>
                        <span className="ms-2">
                          {course?.expiryType === "LIFETIME"
                            ? "Acesso Vitalício"
                            : `${course?.expiryMonths ?? "N/A"} meses`}
                        </span>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                      <Link
                        to={route.courseCart}
                        className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                      >
                        <GraduationCap size={20} />
                        {course?.isFree ? "Matricular-se Gratuitamente" : "Matricular-se Agora"}
                      </Link>
                    </div>

                    <div className="d-flex gap-2">
                      <Link
                        className="btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                        to={route.studentWishlist}
                      >
                        <Heart size={18} />
                        Lista de Desejos
                      </Link>
                      <Link 
                        className="btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-2" 
                        to="#"
                      >
                        <Share2 size={18} />
                        Compartilhar
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="card mb-4 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="mb-4">Este curso inclui</h5>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center icon-wrapper">
                        <Play size={20} className="text-primary" />
                        <span className="ms-3">11 horas de vídeo sob demanda</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Download size={20} className="text-primary" />
                        <span className="ms-3">69 recursos para download</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Key size={20} className="text-primary" />
                        <span className="ms-3">Acesso vitalício completo</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Smartphone size={20} className="text-primary" />
                        <span className="ms-3">Acesso em mobile e TV</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Zap size={20} className="text-primary" />
                        <span className="ms-3">Atividades práticas</span>
                      </div>
                      <div className="d-flex align-items-center icon-wrapper">
                        <Award size={20} className="text-primary" />
                        <span className="ms-3">Certificado de Conclusão</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="mb-4">Estatísticas do Curso</h5>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center icon-wrapper">
                          <Users size={20} className="text-primary" />
                          <span className="ms-2">Matriculados</span>
                        </div>
                        <strong>32 alunos</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center icon-wrapper">
                          <Clock size={20} className="text-primary" />
                          <span className="ms-2">Duração</span>
                        </div>
                        <strong>20 horas</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center icon-wrapper">
                          <BookOpen size={20} className="text-primary" />
                          <span className="ms-2">Módulos</span>
                        </div>
                        <strong>{content.length}</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center icon-wrapper">
                          <Play size={20} className="text-primary" />
                          <span className="ms-2">Aulas</span>
                        </div>
                        <strong>{lessons}</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center icon-wrapper">
                          <BarChart size={20} className="text-primary" />
                          <span className="ms-2">Nível</span>
                        </div>
                        <strong>{course?.level ?? "N/A"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetails;