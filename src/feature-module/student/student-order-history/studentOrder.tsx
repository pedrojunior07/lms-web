import React, { useEffect, useState, useRef } from "react";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import { useCourseOrders, OrderStatus, CourseOrder } from "../../../core/api/hooks/useCourseOrders";

const StudentOrder = () => {
  const route = all_routes;
  const studentId = Number(localStorage.getItem("id"));
  const { orders, loading, error, fetchStudentOrders, uploadProof } = useCourseOrders();

  const [uploadModal, setUploadModal] = useState<{ orderId: number; show: boolean }>({ orderId: 0, show: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CourseOrder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recupera os dados do usuário do localStorage
  const getUserData = () => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const role = localStorage.getItem('role')
    const email = localStorage.getItem('email')
    const user = localStorage.getItem('user')

    return {
      token,
      id,
      role,
      email,
      user: user ? JSON.parse(user) : null
    }
  }

  const userData = getUserData()

  useEffect(() => {
    if (studentId) {
      fetchStudentOrders(studentId);
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

  // Formata o role para exibição
  const formatRole = (role: string | null) => {
    if (!role) return 'Usuário'
    return role.replace('ROLE_', '').toLowerCase()
  }

  // Nome do usuário
  const getUserName = () => {
    if (userData.user && userData.user.name) {
      return userData.user.name
    }
    if (userData.user && userData.user.firstName) {
      return `${userData.user.firstName} ${userData.user.lastName || ''}`
    }
    return userData.email || 'Usuário'
  }

  // Foto do perfil
  const getProfilePhoto = () => {
    if (userData.user && userData.user.photo) {
      return userData.user.photo
    }
    return 'assets/img/user/user-02.jpg'
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="badge bg-warning d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1" />
            Aguardando
          </span>
        );
      case "PROOF_UPLOADED":
        return (
          <span className="badge bg-info d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1" />
            Em Análise
          </span>
        );
      case "APPROVED":
        return (
          <span className="badge bg-success d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1" />
            Aprovado
          </span>
        );
      case "REJECTED":
        return (
          <span className="badge bg-danger d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1" />
            Rejeitado
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary d-inline-flex align-items-center">
            <i className="fa-solid fa-circle fs-5 me-1" />
            {status}
          </span>
        );
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <Breadcrumb title="Histórico de Pedidos" />
      <div className="content">
        <div className="container">
          {/* profile box */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-12">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath src={getProfilePhoto()} alt={getUserName()} />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      {getUserName()}
                      <Link
                        to={route.studentProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">{formatRole(userData.role)}</p>
                    <p className="text-light small">{userData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Histórico de Pedidos</h5>
              </div>

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
                  <p className="text-muted">Você ainda não fez nenhum pedido</p>
                  <Link to={route.courseGrid} className="btn btn-primary">
                    Explorar Cursos
                  </Link>
                </div>
              ) : (
                <div className="table-responsive custom-table">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>Curso</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Método</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {order.courseThumbnail ? (
                                <img
                                  src={order.courseThumbnail}
                                  alt={order.courseTitle}
                                  className="rounded me-2"
                                  style={{ width: 50, height: 35, objectFit: "cover" }}
                                />
                              ) : (
                                <div className="bg-light rounded me-2 d-flex align-items-center justify-content-center" style={{ width: 50, height: 35 }}>
                                  <i className="fa fa-image text-muted"></i>
                                </div>
                              )}
                              <span className="text-truncate" style={{ maxWidth: 150 }}>
                                {order.courseTitle}
                              </span>
                            </div>
                          </td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>{order.amount?.toFixed(2)} MT</td>
                          <td>{getPaymentMethodLabel(order.paymentMethod)}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setSelectedOrder(order)}
                                data-bs-toggle="modal"
                                data-bs-target="#view_invoice"
                              >
                                <i className="isax isax-eye" />
                              </button>
                              {order.status === "PENDING" && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => setUploadModal({ orderId: order.id, show: true })}
                                >
                                  <i className="fa fa-upload" />
                                </button>
                              )}
                              {order.status === "APPROVED" && (
                                <Link
                                  to={`/course-watch?id=${order.courseId}`}
                                  className="btn btn-sm btn-success"
                                >
                                  <i className="fa fa-play" />
                                </Link>
                              )}
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

      {/* View Invoice */}
      <div className="modal fade" id="view_invoice">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Detalhes do Pedido</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <>
                  <div className="border-bottom mb-3 pb-3">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="mb-2">Pedido #{selectedOrder.id}</h6>
                        <p className="mb-1">
                          <strong>Data:</strong> {formatDate(selectedOrder.orderDate)}
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                        </p>
                      </div>
                      <div className="col-md-6 text-end">
                        <h4 className="text-primary">{selectedOrder.amount?.toFixed(2)} MT</h4>
                        <p className="text-muted">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-bottom mb-3 pb-3">
                    <h6 className="mb-3">Curso</h6>
                    <div className="d-flex align-items-center">
                      {selectedOrder.courseThumbnail ? (
                        <img
                          src={selectedOrder.courseThumbnail}
                          alt={selectedOrder.courseTitle}
                          className="rounded me-3"
                          style={{ width: 80, height: 60, objectFit: "cover" }}
                        />
                      ) : (
                        <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: 80, height: 60 }}>
                          <i className="fa fa-image text-muted"></i>
                        </div>
                      )}
                      <div>
                        <h6 className="mb-1">{selectedOrder.courseTitle}</h6>
                        <p className="text-muted mb-0">ID: {selectedOrder.courseId}</p>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.selectedWallet && (
                    <div className="border-bottom mb-3 pb-3">
                      <h6 className="mb-3">Dados para Pagamento</h6>
                      <p className="mb-1"><strong>Nome:</strong> {selectedOrder.selectedWallet.accountName}</p>
                      <p className="mb-1"><strong>Número:</strong> {selectedOrder.selectedWallet.accountNumber}</p>
                      {selectedOrder.selectedWallet.bankName && (
                        <p className="mb-1"><strong>Banco:</strong> {selectedOrder.selectedWallet.bankName}</p>
                      )}
                    </div>
                  )}

                  {selectedOrder.proofOfPaymentUrl && (
                    <div className="border-bottom mb-3 pb-3">
                      <h6 className="mb-3">Comprovativo de Pagamento</h6>
                      <img
                        src={selectedOrder.proofOfPaymentUrl}
                        alt="Comprovativo"
                        className="img-fluid rounded"
                        style={{ maxHeight: 200 }}
                      />
                    </div>
                  )}

                  {selectedOrder.rejectionReason && (
                    <div className="alert alert-danger">
                      <strong>Motivo da Rejeição:</strong> {selectedOrder.rejectionReason}
                    </div>
                  )}

                  {selectedOrder.validatedDate && (
                    <p className="text-muted">
                      <strong>Data de Validação:</strong> {formatDate(selectedOrder.validatedDate)}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /View Invoice */}
    </>
  );
};

export default StudentOrder;
