import React, { useEffect, useState } from "react";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
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

  // Estilos do certificado
  const certificateStyles = `
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

  // Carregar certificados
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        console.log("🔍 Carregando certificados...");
        
        const response = await fetch('http://192.250.224.214:8585/e-learning/api/certificates/my', {
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
          {/* Profile */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-6">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath
                      src="assets/img/user/user-02.jpg"
                      alt=""
                    />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      {certificates[0]?.student.firstName} {certificates[0]?.student.lastName}
                      <Link
                        to={route.studentProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">Estudante</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2">
                  <Link
                    to={route.courseList}
                    className="btn btn-white rounded-pill me-3"
                  >
                    Explorar Cursos
                  </Link>
                  <Link
                    to={route.studentDashboard}
                    className="btn btn-secondary rounded-pill"
                  >
                    Meu Painel
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* /Profile */}
          
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
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-link text-primary p-0 me-2"
                                onClick={() => handleViewCertificate(certificate)}
                                title="Visualizar Certificado"
                              >
                                <i className="isax isax-eye fs-5" />
                              </button>
                              <button
                                className="btn btn-link text-success p-0"
                                onClick={() => downloadCertificate(certificate)}
                                title="Baixar Certificado"
                              >
                                <i className="isax isax-import fs-5" />
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} tabIndex={-1}>
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-header bg-dark bg-opacity-50 border-bottom-0">
                <h5 className="modal-title text-white">
                  🎓 Certificado - {selectedCertificate.course.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowCertificateModal(false)}
                ></button>
              </div>
              
              <div className="modal-body p-0 d-flex align-items-center justify-content-center">
                <div className="certificate-wrapper" style={{ maxWidth: '1200px', width: '100%' }}>
                  <div 
                    id={`certificate-content-${selectedCertificate.certificateCode}`} 
                    className="certificate-container-printable"
                  >
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
                            {selectedCertificate.student.firstName} {selectedCertificate.student.lastName}
                          </h2>
                        </div>

                        <div className="certificate-text-main">
                          concluiu com êxito o curso de
                        </div>

                        <div className="course-title-container">
                          <h3 className="course-title">"{selectedCertificate.course.title}"</h3>
                        </div>

                        <div className="certificate-details">
                          <p>
                            demonstrando dedicação e competência na aquisição dos 
                            conhecimentos e habilidades necessárias para o domínio do assunto.
                          </p>
                        </div>

                        <div className="certificate-code-container">
                          <div className="certificate-code">
                            <strong>Código de Verificação:</strong> {selectedCertificate.certificateCode}
                          </div>
                          <div className="certificate-date">
                            <strong>Data de Emissão:</strong> {formatDate(selectedCertificate.issuedAt)}
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
                    <i className="isax isax-times me-2"></i>
                    Fechar
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-info"
                    onClick={() => printCertificate(selectedCertificate)}
                  >
                    <i className="isax isax-printer me-2"></i>
                    Imprimir
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => downloadCertificate(selectedCertificate)}
                  >
                    <i className="isax isax-import me-2"></i>
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