import React, { useEffect, useMemo, useState } from "react";
import InstructorSidebar from "../common/instructorSidebar";
import { useCourseOrders, OrderStatus } from "../../../core/api/hooks/useCourseOrders";

const InstructorOrders: React.FC = () => {
  const instructorId = Number(localStorage.getItem("id"));
  const { orders, loading, error, fetchInstructorOrders, approveOrder, rejectOrder } = useCourseOrders();

  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [rejectModal, setRejectModal] = useState<{ orderId: number; show: boolean }>({ orderId: 0, show: false });
  const [rejectReason, setRejectReason] = useState("");
  const [viewProofModal, setViewProofModal] = useState<{ url: string; show: boolean }>({ url: "", show: false });

  useEffect(() => {
    if (instructorId) {
      fetchInstructorOrders(instructorId);
    }
  }, [instructorId, fetchInstructorOrders]);

  const handleApprove = async (orderId: number) => {
    if (window.confirm("Confirmar aprovacao do pedido? O aluno sera inscrito no curso.")) {
      try {
        await approveOrder(orderId);
        alert("Pedido aprovado com sucesso!");
      } catch (err) {
        console.error("Erro ao aprovar pedido:", err);
      }
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrder(rejectModal.orderId, rejectReason);
      setRejectModal({ orderId: 0, show: false });
      setRejectReason("");
      alert("Pedido rejeitado");
    } catch (err) {
      console.error("Erro ao rejeitar pedido:", err);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <span className="badge bg-warning">Pendente</span>;
      case "PROOF_UPLOADED":
        return <span className="badge bg-info">Comprovativo Enviado</span>;
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

  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus | "ALL", number> = {
      ALL: orders.length,
      PENDING: 0,
      PROOF_UPLOADED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    orders.forEach((order) => {
      counts[order.status] += 1;
    });

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="container">
          <div className="row">
            <InstructorSidebar />

            <div className="col-xl-9 col-lg-8 col-md-12">
              <div className="settings-widget card-details mb-0">
                <div className="settings-menu p-0">
                  <div className="profile-heading">
                    <h3>Pedidos de Cursos</h3>
                    <p>Gerencie os pedidos de inscricao dos alunos</p>
                  </div>

                  <div className="checkout-form settings-wrap">
                    {/* Filters */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="btn-group">
                        <button
                          className={`btn btn-sm ${filter === "ALL" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFilter("ALL")}
                        >
                          Todos ({statusCounts.ALL})
                        </button>
                        <button
                          className={`btn btn-sm ${filter === "PROOF_UPLOADED" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFilter("PROOF_UPLOADED")}
                        >
                          Aguardando ({statusCounts.PROOF_UPLOADED})
                        </button>
                        <button
                          className={`btn btn-sm ${filter === "PENDING" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFilter("PENDING")}
                        >
                          Pendentes ({statusCounts.PENDING})
                        </button>
                        <button
                          className={`btn btn-sm ${filter === "APPROVED" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setFilter("APPROVED")}
                        >
                          Aprovados ({statusCounts.APPROVED})
                        </button>
                      </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Nenhum pedido encontrado</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Aluno</th>
                              <th>Curso</th>
                              <th>Valor</th>
                              <th>Metodo</th>
                              <th>Data</th>
                              <th>Status</th>
                              <th>Acoes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order.id}>
                                <td>{order.studentName}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {order.courseThumbnail && (
                                      <img
                                        src={order.courseThumbnail}
                                        alt=""
                                        className="me-2"
                                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                                      />
                                    )}
                                    <span className="text-truncate" style={{ maxWidth: 150 }}>
                                      {order.courseTitle}
                                    </span>
                                  </div>
                                </td>
                                <td>{order.amount?.toFixed(2)} MT</td>
                                <td>{getPaymentMethodLabel(order.paymentMethod)}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>
                                  {order.status === "PROOF_UPLOADED" && (
                                    <>
                                      <button
                                        className="btn btn-sm btn-outline-info me-1"
                                        onClick={() => setViewProofModal({ url: order.proofOfPaymentUrl || "", show: true })}
                                        title="Ver Comprovativo"
                                      >
                                        <i className="fa fa-eye"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-success me-1"
                                        onClick={() => handleApprove(order.id)}
                                        title="Aprovar"
                                      >
                                        <i className="fa fa-check"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => setRejectModal({ orderId: order.id, show: true })}
                                        title="Rejeitar"
                                      >
                                        <i className="fa fa-times"></i>
                                      </button>
                                    </>
                                  )}
                                  {order.status === "REJECTED" && order.rejectionReason && (
                                    <span className="text-muted small" title={order.rejectionReason}>
                                      <i className="fa fa-info-circle"></i>
                                    </span>
                                  )}
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
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rejeitar Pedido</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectModal({ orderId: 0, show: false })}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Motivo da Rejeicao</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Informe o motivo da rejeicao..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRejectModal({ orderId: 0, show: false })}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading ? "Rejeitando..." : "Rejeitar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Proof Modal */}
      {viewProofModal.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comprovativo de Pagamento</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewProofModal({ url: "", show: false })}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={viewProofModal.url}
                  alt="Comprovativo"
                  style={{ maxWidth: "100%", maxHeight: "70vh" }}
                />
              </div>
              <div className="modal-footer">
                <a
                  href={viewProofModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Abrir em Nova Aba
                </a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewProofModal({ url: "", show: false })}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorOrders;
