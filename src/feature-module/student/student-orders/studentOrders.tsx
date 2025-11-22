import React, { useEffect, useState, useRef } from "react";
import StudentSidebar from "../common/studentSidebar";
import { useCourseOrders, OrderStatus } from "../../../core/api/hooks/useCourseOrders";

const StudentOrders: React.FC = () => {
  const studentId = Number(localStorage.getItem("id"));
  const { orders, loading, error, fetchStudentOrders, uploadProof } = useCourseOrders();

  const [uploadModal, setUploadModal] = useState<{ orderId: number; show: boolean }>({ orderId: 0, show: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (studentId) {
      console.log("Fetching orders for student:", studentId);
      fetchStudentOrders(studentId).then(data => {
        console.log("Orders fetched:", data);
      }).catch(err => {
        console.error("Error fetching orders:", err);
      });
    }
  }, [studentId, fetchStudentOrders]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadProof(uploadModal.orderId, selectedFile);
      setUploadModal({ orderId: 0, show: false });
      setSelectedFile(null);
      setPreviewUrl(null);
      alert("Comprovativo enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar comprovativo:", err);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning">Aguardando Pagamento</span>;
      case "PROOF_UPLOADED":
        return <span className="badge bg-info">Em Analise</span>;
      case "APPROVED":
        return <span className="badge bg-success">Aprovado</span>;
      case "REJECTED":
        return <span className="badge bg-danger">Rejeitado</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "MPESA": return "M-Pesa";
      case "EMOLA": return "E-Mola";
      case "BANK": return "Banco";
      default: return method;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container">
          <div className="row">
            <StudentSidebar />

            <div className="col-xl-9 col-lg-8 col-md-12">
              <div className="settings-widget card-details mb-0">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Meus Pedidos</h3>
                    <p>Acompanhe seus pedidos de inscricao em cursos</p>
                  </div>

                  <div className="checkout-form settings-wrap">
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Voce ainda nao fez nenhum pedido</p>
                      </div>
                    ) : (
                      <div className="row">
                        {orders.map((order) => (
                          <div key={order.id} className="col-12 mb-4">
                            <div className="card">
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col-md-2">
                                    {order.courseThumbnail ? (
                                      <img
                                        src={order.courseThumbnail}
                                        alt={order.courseTitle}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: 80, objectFit: "cover" }}
                                      />
                                    ) : (
                                      <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: 80 }}>
                                        <i className="fa fa-image text-muted"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-md-4">
                                    <h6 className="mb-1">{order.courseTitle}</h6>
                                    <small className="text-muted">
                                      Pedido em {new Date(order.orderDate).toLocaleDateString()}
                                    </small>
                                  </div>
                                  <div className="col-md-2 text-center">
                                    <span className="fw-bold">{order.amount?.toFixed(2)} MT</span>
                                    <br />
                                    <small className="text-muted">{getPaymentMethodLabel(order.paymentMethod)}</small>
                                  </div>
                                  <div className="col-md-2 text-center">
                                    {getStatusBadge(order.status)}
                                  </div>
                                  <div className="col-md-2 text-end">
                                    {order.status === "PENDING" && (
                                      <div>
                                        <button
                                          className="btn btn-sm btn-primary"
                                          onClick={() => setUploadModal({ orderId: order.id, show: true })}
                                        >
                                          <i className="fa fa-upload me-1"></i>
                                          Enviar Comprovativo
                                        </button>
                                        {order.selectedWallet && (
                                          <div className="mt-2 small text-muted">
                                            <strong>Pagar para:</strong><br />
                                            {order.selectedWallet.accountName}<br />
                                            {order.selectedWallet.accountNumber}
                                            {order.selectedWallet.bankName && <><br />{order.selectedWallet.bankName}</>}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {order.status === "REJECTED" && order.rejectionReason && (
                                      <div className="text-danger small">
                                        <strong>Motivo:</strong> {order.rejectionReason}
                                      </div>
                                    )}
                                    {order.status === "APPROVED" && (
                                      <a href={`/course-watch?id=${order.courseId}`} className="btn btn-sm btn-success">
                                        <i className="fa fa-play me-1"></i>
                                        Acessar Curso
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enviar Comprovativo de Pagamento</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setUploadModal({ orderId: 0, show: false });
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Selecione a imagem do comprovativo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                  />
                </div>
                {previewUrl && (
                  <div className="text-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: 300 }}
                      className="rounded"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setUploadModal({ orderId: 0, show: false });
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOrders;
