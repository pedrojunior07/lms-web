import React, { useEffect, useState } from "react";
import InstructorSidebar from "../common/instructorSidebar";
import ProfileCard from "../common/profileCard";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { usePaymentWallets, WalletType, CreateWalletDto } from "../../../core/api/hooks/usePaymentWallets";
import { useCourseOrders, OrderStatus } from "../../../core/api/hooks/useCourseOrders";
import { formatDate } from "../../../utils/formatDate";

const InstructorPayout = () => {
  const instructorId = Number(localStorage.getItem("id"));

  const { wallets, loading: loadingWallets, fetchWallets, createWallet, updateWallet, deleteWallet } = usePaymentWallets();
  const { orders, loading: loadingOrders, fetchInstructorOrders, approveOrder, rejectOrder } = useCourseOrders();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<number | null>(null);
  const [walletForm, setWalletForm] = useState<CreateWalletDto>({
    walletType: "MPESA",
    accountName: "",
    accountNumber: "",
    bankName: "",
    active: true,
  });

  const [viewProofModal, setViewProofModal] = useState<{ url: string; show: boolean }>({ url: "", show: false });
  const [rejectModal, setRejectModal] = useState<{ orderId: number; show: boolean }>({ orderId: 0, show: false });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (instructorId) {
      fetchWallets(instructorId);
      fetchInstructorOrders(instructorId);
    }
  }, [instructorId, fetchWallets, fetchInstructorOrders]);

  // Wallet handlers
  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWallet) {
        await updateWallet(editingWallet, walletForm);
      } else {
        await createWallet(instructorId, walletForm);
      }
      setShowWalletModal(false);
      resetWalletForm();
    } catch (err) {
      console.error("Erro ao salvar carteira:", err);
    }
  };

  const handleEditWallet = (wallet: any) => {
    setEditingWallet(wallet.id);
    setWalletForm({
      walletType: wallet.walletType,
      accountName: wallet.accountName,
      accountNumber: wallet.accountNumber,
      bankName: wallet.bankName || "",
      active: wallet.active,
    });
    setShowWalletModal(true);
  };

  const handleDeleteWallet = async (walletId: number) => {
    if (window.confirm("Tem certeza que deseja remover esta carteira?")) {
      try {
        await deleteWallet(walletId);
      } catch (err) {
        console.error("Erro ao remover carteira:", err);
      }
    }
  };

  const resetWalletForm = () => {
    setEditingWallet(null);
    setWalletForm({
      walletType: "MPESA",
      accountName: "",
      accountNumber: "",
      bankName: "",
      active: true,
    });
  };

  // Order handlers
  const handleApprove = async (orderId: number) => {
    if (window.confirm("Confirmar aprovacao? O aluno sera inscrito no curso.")) {
      try {
        await approveOrder(orderId);
        alert("Pedido aprovado com sucesso!");
      } catch (err) {
        console.error("Erro ao aprovar:", err);
      }
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrder(rejectModal.orderId, rejectReason);
      setRejectModal({ orderId: 0, show: false });
      setRejectReason("");
    } catch (err) {
      console.error("Erro ao rejeitar:", err);
    }
  };

  const getWalletTypeLabel = (type: WalletType) => {
    switch (type) {
      case "MPESA": return "M-Pesa";
      case "EMOLA": return "E-Mola";
      case "BANK": return "Banco";
      default: return type;
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

  // Calculate earnings
  const totalEarnings = orders
    .filter(o => o.status === "APPROVED")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const pendingOrders = orders.filter(o => o.status === "PROOF_UPLOADED");

  const columns = [
    {
      title: "Aluno",
      dataIndex: "studentName",
    },
    {
      title: "Curso",
      dataIndex: "courseTitle",
      render: (text: string) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: 150 }}>
          {text}
        </span>
      ),
    },
    {
      title: "Valor",
      dataIndex: "amount",
      render: (value: number) => `${value?.toFixed(2)} MT`,
    },
    {
      title: "Metodo",
      dataIndex: "paymentMethod",
      render: (text: string) => getWalletTypeLabel(text as WalletType),
    },
    {
      title: "Data",
      dataIndex: "orderDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: OrderStatus) => getStatusBadge(text),
    },
    {
      title: "Acoes",
      dataIndex: "id",
      render: (_: any, record: any) => (
        <div className="d-flex gap-1">
          {record.status === "PROOF_UPLOADED" && (
            <>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => setViewProofModal({ url: record.proofOfPaymentUrl || "", show: true })}
                title="Ver Comprovativo"
              >
                <i className="fa fa-eye"></i>
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleApprove(record.id)}
                title="Aprovar"
              >
                <i className="fa fa-check"></i>
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setRejectModal({ orderId: record.id, show: true })}
                title="Rejeitar"
              >
                <i className="fa fa-times"></i>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />

          <div className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />
            <div className="col-lg-12">
              <div className="payouts">
                {/* Summary Cards */}
                <div className="row mb-4">
                  <div className="col-xl-4">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h6 className="text-white-50">Ganhos Totais</h6>
                        <h3 className="text-white">{totalEarnings.toFixed(2)} MT</h3>
                        <small>{orders.filter(o => o.status === "APPROVED").length} pedidos aprovados</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div className="card bg-warning text-dark">
                      <div className="card-body">
                        <h6>Aguardando Validacao</h6>
                        <h3>{pendingOrders.length}</h3>
                        <small>pedidos com comprovativo</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h6 className="text-white-50">Carteiras Ativas</h6>
                        <h3 className="text-white">{wallets.filter(w => w.active).length}</h3>
                        <small>metodos de pagamento</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fa fa-wallet me-2"></i>
                      Metodos de Pagamento
                    </h5>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        resetWalletForm();
                        setShowWalletModal(true);
                      }}
                    >
                      <i className="fa fa-plus me-1"></i>
                      Adicionar
                    </button>
                  </div>
                  <div className="card-body">
                    {loadingWallets ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                      </div>
                    ) : wallets.length === 0 ? (
                      <p className="text-muted text-center mb-0">
                        Nenhuma carteira cadastrada. Adicione para receber pagamentos.
                      </p>
                    ) : (
                      <div className="row">
                        {wallets.map((wallet) => (
                          <div key={wallet.id} className="col-md-4 mb-3">
                            <div className={`card h-100 ${!wallet.active ? "opacity-50" : ""}`}>
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <span className={`badge ${
                                    wallet.walletType === "MPESA" ? "bg-danger" :
                                    wallet.walletType === "EMOLA" ? "bg-warning" : "bg-info"
                                  }`}>
                                    {getWalletTypeLabel(wallet.walletType)}
                                  </span>
                                  <div>
                                    <button
                                      className="btn btn-sm btn-link p-0 me-2"
                                      onClick={() => handleEditWallet(wallet)}
                                    >
                                      <i className="fa fa-edit"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-link text-danger p-0"
                                      onClick={() => handleDeleteWallet(wallet.id)}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                                <h6 className="mb-1">{wallet.accountName}</h6>
                                <p className="mb-0 text-muted">{wallet.accountNumber}</p>
                                {wallet.bankName && (
                                  <small className="text-muted">{wallet.bankName}</small>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Orders Table */}
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fa fa-list me-2"></i>
                      Pedidos de Inscricao
                    </h5>
                  </div>
                  <div className="card-body">
                    {loadingOrders ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-muted text-center mb-0">Nenhum pedido encontrado</p>
                    ) : (
                      <Table dataSource={orders} columns={columns} Search={true} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingWallet ? "Editar Carteira" : "Nova Carteira"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowWalletModal(false)}></button>
              </div>
              <form onSubmit={handleSaveWallet}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <select
                      className="form-select"
                      value={walletForm.walletType}
                      onChange={(e) => setWalletForm({ ...walletForm, walletType: e.target.value as WalletType })}
                      required
                    >
                      <option value="MPESA">M-Pesa</option>
                      <option value="EMOLA">E-Mola</option>
                      <option value="BANK">Banco</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nome da Conta</label>
                    <input
                      type="text"
                      className="form-control"
                      value={walletForm.accountName}
                      onChange={(e) => setWalletForm({ ...walletForm, accountName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {walletForm.walletType === "BANK" ? "Numero da Conta" : "Numero de Telefone"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={walletForm.accountNumber}
                      onChange={(e) => setWalletForm({ ...walletForm, accountNumber: e.target.value })}
                      required
                    />
                  </div>
                  {walletForm.walletType === "BANK" && (
                    <div className="mb-3">
                      <label className="form-label">Nome do Banco</label>
                      <input
                        type="text"
                        className="form-control"
                        value={walletForm.bankName}
                        onChange={(e) => setWalletForm({ ...walletForm, bankName: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="walletActive"
                      checked={walletForm.active}
                      onChange={(e) => setWalletForm({ ...walletForm, active: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="walletActive">Ativa</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowWalletModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loadingWallets}>
                    Salvar
                  </button>
                </div>
              </form>
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
                <button type="button" className="btn-close" onClick={() => setViewProofModal({ url: "", show: false })}></button>
              </div>
              <div className="modal-body text-center">
                <img src={viewProofModal.url} alt="Comprovativo" style={{ maxWidth: "100%", maxHeight: "70vh" }} />
              </div>
              <div className="modal-footer">
                <a href={viewProofModal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Abrir em Nova Aba
                </a>
                <button type="button" className="btn btn-secondary" onClick={() => setViewProofModal({ url: "", show: false })}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rejeitar Pedido</h5>
                <button type="button" className="btn-close" onClick={() => setRejectModal({ orderId: 0, show: false })}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Motivo</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Informe o motivo..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectModal({ orderId: 0, show: false })}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleReject} disabled={loadingOrders}>
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorPayout;
