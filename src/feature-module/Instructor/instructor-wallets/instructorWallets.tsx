import React, { useEffect, useState } from "react";
import InstructorSidebar from "../common/instructorSidebar";
import { usePaymentWallets, WalletType, CreateWalletDto } from "../../../core/api/hooks/usePaymentWallets";

const InstructorWallets: React.FC = () => {
  const instructorId = Number(localStorage.getItem("id"));
  const { wallets, loading, error, fetchWallets, createWallet, updateWallet, deleteWallet } = usePaymentWallets();

  const [showModal, setShowModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateWalletDto>({
    walletType: "MPESA",
    accountName: "",
    accountNumber: "",
    bankName: "",
    active: true,
  });

  useEffect(() => {
    if (instructorId) {
      fetchWallets(instructorId);
    }
  }, [instructorId, fetchWallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWallet) {
        await updateWallet(editingWallet, formData);
      } else {
        await createWallet(instructorId, formData);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar carteira:", err);
    }
  };

  const handleEdit = (wallet: any) => {
    setEditingWallet(wallet.id);
    setFormData({
      walletType: wallet.walletType,
      accountName: wallet.accountName,
      accountNumber: wallet.accountNumber,
      bankName: wallet.bankName || "",
      active: wallet.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (walletId: number) => {
    if (window.confirm("Tem certeza que deseja remover esta carteira?")) {
      try {
        await deleteWallet(walletId);
      } catch (err) {
        console.error("Erro ao remover carteira:", err);
      }
    }
  };

  const resetForm = () => {
    setEditingWallet(null);
    setFormData({
      walletType: "MPESA",
      accountName: "",
      accountNumber: "",
      bankName: "",
      active: true,
    });
  };

  const getWalletTypeLabel = (type: WalletType) => {
    switch (type) {
      case "MPESA": return "M-Pesa";
      case "EMOLA": return "E-Mola";
      case "BANK": return "Banco";
      default: return type;
    }
  };

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
                    <h3>Minhas Carteiras de Pagamento</h3>
                    <p>Gerencie suas carteiras para receber pagamentos dos alunos</p>
                  </div>

                  <div className="checkout-form settings-wrap">
                    <div className="d-flex justify-content-end mb-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          resetForm();
                          setShowModal(true);
                        }}
                      >
                        <i className="fa fa-plus me-2"></i>
                        Adicionar Carteira
                      </button>
                    </div>

                    {error && (
                      <div className="alert alert-danger">{error}</div>
                    )}

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                      </div>
                    ) : wallets.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fa fa-wallet fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Nenhuma carteira cadastrada</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Tipo</th>
                              <th>Nome da Conta</th>
                              <th>Numero</th>
                              <th>Banco</th>
                              <th>Status</th>
                              <th>Acoes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {wallets.map((wallet) => (
                              <tr key={wallet.id}>
                                <td>
                                  <span className={`badge ${
                                    wallet.walletType === "MPESA" ? "bg-danger" :
                                    wallet.walletType === "EMOLA" ? "bg-warning" : "bg-info"
                                  }`}>
                                    {getWalletTypeLabel(wallet.walletType)}
                                  </span>
                                </td>
                                <td>{wallet.accountName}</td>
                                <td>{wallet.accountNumber}</td>
                                <td>{wallet.bankName || "-"}</td>
                                <td>
                                  <span className={`badge ${wallet.active ? "bg-success" : "bg-secondary"}`}>
                                    {wallet.active ? "Ativo" : "Inativo"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary me-2"
                                    onClick={() => handleEdit(wallet)}
                                  >
                                    <i className="fa fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(wallet.id)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingWallet ? "Editar Carteira" : "Nova Carteira"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tipo de Carteira</label>
                    <select
                      className="form-select"
                      value={formData.walletType}
                      onChange={(e) => setFormData({ ...formData, walletType: e.target.value as WalletType })}
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
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      placeholder="Nome do titular"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {formData.walletType === "BANK" ? "Numero da Conta" : "Numero de Telefone"}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder={formData.walletType === "BANK" ? "Numero da conta" : "84/85/86/87..."}
                      required
                    />
                  </div>

                  {formData.walletType === "BANK" && (
                    <div className="mb-3">
                      <label className="form-label">Nome do Banco</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        placeholder="Ex: BCI, Millennium BIM, Standard Bank"
                      />
                    </div>
                  )}

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="activeCheck"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="activeCheck">
                      Carteira ativa
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorWallets;
