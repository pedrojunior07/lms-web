import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../core/api/axios";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
import ProfileCard from "../common/profileCard";
import html2canvas from "html2canvas";

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

const StudentCertificates = () => {
  const route = all_routes;
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Estilos do certificado - Design Internacional Profissional
  const certificateStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cinzel:wght@400;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');

    .certificate-wrapper {
      padding: 20px;
    }

    .certificate-container-printable {
      background: #fffef8;
      position: relative;
      padding: 0;
      box-shadow: 0 25px 80px rgba(0,0,0,0.4);
      min-height: 850px;
      font-family: 'Cormorant Garamond', 'Times New Roman', serif;
    }

    .certificate-outer-border {
      border: 3px solid #b8860b;
      padding: 8px;
      background: linear-gradient(135deg, #f5e6c8 0%, #faf3e0 50%, #f5e6c8 100%);
    }

    .certificate-inner-border {
      border: 2px solid #8b7355;
      padding: 40px 50px;
      background: #fffef8;
      position: relative;
    }

    .certificate-inner-border::before,
    .certificate-inner-border::after {
      content: '❧';
      position: absolute;
      font-size: 24px;
      color: #b8860b;
    }

    .certificate-inner-border::before {
      top: 10px;
      left: 15px;
    }

    .certificate-inner-border::after {
      bottom: 10px;
      right: 15px;
      transform: rotate(180deg);
    }

    .certificate-header {
      text-align: center;
      margin-bottom: 25px;
    }

    .certificate-logo {
      margin-bottom: 15px;
    }

    .certificate-logo img {
      max-height: 80px;
    }

    .certificate-institution {
      font-family: 'Cinzel', serif;
      font-size: 1.1em;
      color: #5c4a32;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .certificate-main-title {
      font-family: 'Playfair Display', serif;
      font-size: 3.2em;
      font-weight: 700;
      color: #1a3a52;
      margin: 10px 0;
      text-transform: uppercase;
      letter-spacing: 12px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .certificate-subtitle {
      font-size: 1.3em;
      color: #5c4a32;
      margin: 5px 0 0 0;
      font-style: italic;
      letter-spacing: 2px;
    }

    .certificate-divider {
      width: 200px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #b8860b, transparent);
      margin: 20px auto;
    }

    .certificate-body {
      text-align: center;
      padding: 10px 0;
    }

    .certificate-text-intro {
      font-size: 1.15em;
      color: #3d3d3d;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }

    .student-name-container {
      margin: 15px 0;
      padding: 15px 30px;
      position: relative;
    }

    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 2.6em;
      font-weight: 700;
      color: #1a3a52;
      margin: 0;
      letter-spacing: 2px;
      border-bottom: 2px solid #b8860b;
      padding-bottom: 10px;
      display: inline-block;
    }

    .certificate-text-main {
      font-size: 1.15em;
      color: #3d3d3d;
      margin: 20px 0 10px 0;
      letter-spacing: 1px;
    }

    .course-title-container {
      margin: 10px 0 20px 0;
      padding: 10px 20px;
    }

    .course-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.8em;
      font-weight: 600;
      color: #8b4513;
      margin: 0;
      font-style: italic;
      letter-spacing: 1px;
    }

    .certificate-details {
      font-size: 1.05em;
      color: #4a4a4a;
      line-height: 1.7;
      margin: 15px auto;
      max-width: 700px;
      text-align: center;
    }

    .certificate-meta-container {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 25px 0;
      flex-wrap: wrap;
    }

    .certificate-meta-item {
      text-align: center;
    }

    .certificate-meta-label {
      font-size: 0.85em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .certificate-meta-value {
      font-size: 1em;
      color: #1a3a52;
      font-weight: 600;
    }

    .certificate-verification {
      background: #f8f6f0;
      border: 1px solid #e0dcd3;
      border-radius: 5px;
      padding: 12px 20px;
      margin: 20px auto;
      max-width: 400px;
      text-align: center;
    }

    .verification-label {
      font-size: 0.75em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }

    .verification-code {
      font-family: 'Courier New', monospace;
      font-size: 1.1em;
      color: #1a3a52;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .certificate-footer {
      margin-top: 30px;
      padding-top: 20px;
    }

    .signatures {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 30px;
    }

    .signature-block {
      text-align: center;
      min-width: 200px;
    }

    .signature-line {
      width: 180px;
      height: 1px;
      background: #1a3a52;
      margin: 0 auto 8px auto;
    }

    .signature-name {
      font-family: 'Playfair Display', serif;
      font-size: 1em;
      font-weight: 600;
      color: #1a3a52;
      margin: 5px 0 3px 0;
    }

    .signature-role {
      font-size: 0.85em;
      color: #666;
      margin: 0;
      font-style: italic;
    }

    .certificate-seal {
      position: absolute;
      bottom: 60px;
      right: 60px;
      width: 100px;
      height: 100px;
      border: 3px solid #b8860b;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #fffef8 0%, #f5e6c8 100%);
      box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    }

    .seal-icon {
      font-size: 28px;
      color: #b8860b;
      margin-bottom: 3px;
    }

    .seal-text {
      font-size: 0.6em;
      color: #5c4a32;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .certificate-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      opacity: 0.03;
      pointer-events: none;
      z-index: 1;
    }

    .watermark-text {
      font-family: 'Cinzel', serif;
      font-size: 100px;
      font-weight: bold;
      color: #1a3a52;
      white-space: nowrap;
    }

    .certificate-registration {
      text-align: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e0dcd3;
    }

    .registration-text {
      font-size: 0.75em;
      color: #888;
      letter-spacing: 1px;
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
        box-shadow: none;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .modal-footer,
      .modal-header {
        display: none !important;
      }

      .certificate-seal {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    @media (max-width: 768px) {
      .certificate-container-printable {
        min-height: auto;
      }

      .certificate-inner-border {
        padding: 25px 20px;
      }

      .certificate-main-title {
        font-size: 2.2em;
        letter-spacing: 6px;
      }

      .student-name {
        font-size: 1.8em;
      }

      .course-title {
        font-size: 1.4em;
      }

      .signatures {
        flex-direction: column;
        align-items: center;
      }

      .certificate-seal {
        width: 70px;
        height: 70px;
        bottom: 30px;
        right: 30px;
      }

      .seal-icon {
        font-size: 20px;
      }

      .watermark-text {
        font-size: 60px;
      }
    }
  `;

  // Carregar certificados
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        console.log("🔍 Carregando certificados...");
        
        const response = await fetch(`${API_BASE_URL}/certificates/my`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
        });

        if (response.ok) {
          const certificatesData = await response.json();
          console.log("✅ Certificados carregados:", certificatesData);
          setCertificates(certificatesData);
        } else {
          console.error("❌ Erro ao carregar certificados:", response.status);
          setError("Não foi possível carregar os certificados.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar certificados:", error);
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para visualizar certificado
  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  // Função para baixar certificado como PNG
  const downloadCertificate = async (certificate: Certificate) => {
    try {
      const certificateElement = document.getElementById(`certificate-content-${certificate.certificateCode}`);
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
          link.download = `certificado-${certificate.course.title}-${certificate.certificateCode}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Erro ao baixar certificado:', error);
      alert('Erro ao baixar certificado. Tente novamente.');
    }
  };

  // Função para imprimir certificado
  const printCertificate = (certificate: Certificate) => {
    const certificateElement = document.getElementById(`certificate-content-${certificate.certificateCode}`);
    if (certificateElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Certificado - ${certificate.course.title}</title>
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

  // Componente para injetar estilos
  const StyleInjector = () => (
    <style dangerouslySetInnerHTML={{ __html: certificateStyles }} />
  );

  if (loading) {
    return (
      <>
        <Breadcrumb title="My Certificates" />
        <div className="content">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Carregando certificados...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb title="My Certificates" />
        <div className="content">
          <div className="container">
            <div className="alert alert-danger m-4" role="alert">
              <h5 className="alert-heading">Erro ao carregar certificados</h5>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="My Certificates" />
      <StyleInjector />

      <div className="content">
        <div className="container">
          <ProfileCard />
          
          <div className="row">
            {/* Sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Meus Certificados ({certificates.length})</h5>
              </div>
              
              {certificates.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-state">
                    <ImageWithBasePath
                      src="assets/img/icon/empty-certificate.svg"
                      className="img-fluid mb-3"
                      alt="No certificates"
                      style={{ maxWidth: '200px' }}
                    />
                    <h5>Nenhum certificado encontrado</h5>
                    <p className="text-muted">Você ainda não possui certificados emitidos.</p>
                    <Link to={route.courseGrid} className="btn btn-primary">
                      Explorar Cursos
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="table-responsive custom-table">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>Nome do Certificado</th>
                        <th>Curso</th>
                        <th>Data de Emissão</th>
                        <th>Código</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((certificate, index) => (
                        <tr key={certificate.certificateCode}>
                          <td>{index + 1}</td>
                          <td>
                            <Link 
                              to="#" 
                              className="fw-semibold"
                              onClick={() => handleViewCertificate(certificate)}
                            >
                              Certificado de Conclusão
                            </Link>
                          </td>
                          <td>{certificate.course.title}</td>
                          <td>{formatDate(certificate.issuedAt)}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {certificate.certificateCode}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleViewCertificate(certificate)}
                                title="Visualizar Certificado"
                              >
                                <i className="fas fa-eye" />
                              </button>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => downloadCertificate(certificate)}
                                title="Baixar Certificado"
                              >
                                <i className="fas fa-download" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Visualização de Certificado */}
      {showCertificateModal && selectedCertificate && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.95)' }} tabIndex={-1}>
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header bg-dark bg-opacity-75 border-bottom-0">
                <h5 className="modal-title text-white d-flex align-items-center">
                  <i className="fas fa-award me-2 text-warning"></i>
                  Certificado - {selectedCertificate.course.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCertificateModal(false)}
                ></button>
              </div>

              <div className="modal-body p-3 d-flex align-items-center justify-content-center overflow-auto">
                <div className="certificate-wrapper" style={{ maxWidth: '1000px', width: '100%' }}>
                  <div
                    id={`certificate-content-${selectedCertificate.certificateCode}`}
                    className="certificate-container-printable"
                  >
                    <div className="certificate-outer-border">
                      <div className="certificate-inner-border">

                        {/* Header */}
                        <div className="certificate-header">
                          <div className="certificate-logo">
                            <img src="/assets/img/logo.png" alt="Logo" />
                          </div>
                          <p className="certificate-institution">Plataforma de E-Learning</p>
                          <h1 className="certificate-main-title">Certificado</h1>
                          <p className="certificate-subtitle">de Conclusão de Curso</p>
                          <div className="certificate-divider"></div>
                        </div>

                        {/* Body */}
                        <div className="certificate-body">
                          <p className="certificate-text-intro">
                            Certificamos que
                          </p>

                          <div className="student-name-container">
                            <h2 className="student-name">
                              {selectedCertificate.student.firstName} {selectedCertificate.student.lastName}
                            </h2>
                          </div>

                          <p className="certificate-text-main">
                            concluiu com aproveitamento o curso
                          </p>

                          <div className="course-title-container">
                            <h3 className="course-title">{selectedCertificate.course.title}</h3>
                          </div>

                          <div className="certificate-details">
                            <p>
                              Demonstrando domínio dos conhecimentos e habilidades
                              propostos no programa do curso.
                            </p>
                          </div>

                          {/* Meta informações */}
                          <div className="certificate-meta-container">
                            <div className="certificate-meta-item">
                              <div className="certificate-meta-label">Data de Emissão</div>
                              <div className="certificate-meta-value">{formatDate(selectedCertificate.issuedAt)}</div>
                            </div>
                            <div className="certificate-meta-item">
                              <div className="certificate-meta-label">Categoria</div>
                              <div className="certificate-meta-value">{selectedCertificate.course.category || 'Geral'}</div>
                            </div>
                            <div className="certificate-meta-item">
                              <div className="certificate-meta-label">Nível</div>
                              <div className="certificate-meta-value">{selectedCertificate.course.level || 'Todos os níveis'}</div>
                            </div>
                          </div>

                          {/* Código de verificação */}
                          <div className="certificate-verification">
                            <div className="verification-label">Código de Verificação</div>
                            <div className="verification-code">{selectedCertificate.certificateCode}</div>
                          </div>
                        </div>

                        {/* Footer com assinaturas */}
                        <div className="certificate-footer">
                          <div className="signatures">
                            <div className="signature-block">
                              <div className="signature-line"></div>
                              <p className="signature-name">Coordenação Pedagógica</p>
                              <p className="signature-role">Direção Acadêmica</p>
                            </div>
                            <div className="signature-block">
                              <div className="signature-line"></div>
                              <p className="signature-name">Secretaria Geral</p>
                              <p className="signature-role">Registro e Certificação</p>
                            </div>
                          </div>

                          {/* Número de registro */}
                          <div className="certificate-registration">
                            <p className="registration-text">
                              Registro Nº {selectedCertificate.certificateCode.substring(0, 8).toUpperCase()} •
                              Verifique a autenticidade em nosso portal
                            </p>
                          </div>
                        </div>

                        {/* Selo de autenticidade */}
                        <div className="certificate-seal">
                          <div className="seal-icon">✓</div>
                          <div className="seal-text">Válido</div>
                        </div>

                        {/* Marca d'água */}
                        <div className="certificate-watermark">
                          <div className="watermark-text">CERTIFICADO</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-dark bg-opacity-75 border-top-0 justify-content-center">
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() => setShowCertificateModal(false)}
                  >
                    <i className="fas fa-times me-2"></i>
                    Fechar
                  </button>

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => downloadCertificate(selectedCertificate)}
                  >
                    <i className="fas fa-download me-2"></i>
                    Baixar PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentCertificates;