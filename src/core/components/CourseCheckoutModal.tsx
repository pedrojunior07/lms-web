import React, { useEffect, useState } from "react";
import { usePaymentWallets, PaymentWallet, WalletType } from "../api/hooks/usePaymentWallets";
import { useCourseOrders } from "../api/hooks/useCourseOrders";

interface CourseCheckoutModalProps {
  show: boolean;
  onClose: () => void;
  course: {
    id: number;
    title: string;
    price: number;
    instructorId: number;
    thumbnail?: string;
  };
  onSuccess?: () => void;
}

const CourseCheckoutModal: React.FC<CourseCheckoutModalProps> = ({
  show,
  onClose,
  course,
  onSuccess,
}) => {
  const studentId = Number(localStorage.getItem("id"));
  const { wallets, loading: loadingWallets, fetchWallets } = usePaymentWallets();
  const { createOrder, loading: loadingOrder, error } = useCourseOrders();

  const [selectedMethod, setSelectedMethod] = useState<WalletType>("MPESA");
  const [selectedWallet, setSelectedWallet] = useState<PaymentWallet | null>(null);

  useEffect(() => {
    if (show && course.instructorId) {
      fetchWallets(course.instructorId);
    }
  }, [show, course.instructorId, fetchWallets]);

  useEffect(() => {
    // Select first wallet of selected method
    const methodWallets = wallets.filter(w => w.walletType === selectedMethod && w.active);
    setSelectedWallet(methodWallets[0] || null);
  }, [wallets, selectedMethod]);

  const handleSubmit = async () => {
    if (!selectedWallet) {
      alert("Selecione uma forma de pagamento");
      return;
    }

    try {
      await createOrder({
        courseId: course.id,
        studentId,
        paymentMethod: selectedMethod,
        walletId: selectedWallet.id,
      });
      alert("Pedido criado com sucesso! Verifique os dados de pagamento.");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
    }
  };

  const getMethodWallets = (method: WalletType) => {
    return wallets.filter(w => w.walletType === method && w.active);
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Finalizar Inscricao</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Course Info */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="me-3"
                      style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8 }}
                    />
                  )}
                  <div>
                    <h6 className="mb-1">{course.title}</h6>
                    <span className="fw-bold text-primary fs-5">{course.price.toFixed(2)} MT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <h6 className="mb-3">Selecione a forma de pagamento</h6>

            {loadingWallets ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : wallets.length === 0 ? (
              <div className="alert alert-warning">
                O instrutor ainda nao configurou formas de pagamento.
              </div>
            ) : (
              <>
                <div className="row mb-3">
                  {["MPESA", "EMOLA", "BANK"].map((method) => {
                    const methodWallets = getMethodWallets(method as WalletType);
                    if (methodWallets.length === 0) return null;

                    return (
                      <div key={method} className="col-md-4 mb-2">
                        <div
                          className={`card cursor-pointer ${selectedMethod === method ? "border-primary" : ""}`}
                          onClick={() => setSelectedMethod(method as WalletType)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-body text-center py-3">
                            <i className={`fa fa-${
                              method === "MPESA" ? "mobile-alt" :
                              method === "EMOLA" ? "mobile" : "university"
                            } fa-2x mb-2 ${selectedMethod === method ? "text-primary" : "text-muted"}`}></i>
                            <div className={selectedMethod === method ? "text-primary fw-bold" : ""}>
                              {method === "MPESA" ? "M-Pesa" : method === "EMOLA" ? "E-Mola" : "Banco"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Wallet Selection */}
                {getMethodWallets(selectedMethod).length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Selecione a conta para pagamento</label>
                    <select
                      className="form-select"
                      value={selectedWallet?.id || ""}
                      onChange={(e) => {
                        const wallet = wallets.find(w => w.id === Number(e.target.value));
                        setSelectedWallet(wallet || null);
                      }}
                    >
                      {getMethodWallets(selectedMethod).map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.accountName} - {wallet.accountNumber}
                          {wallet.bankName && ` (${wallet.bankName})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Payment Info */}
                {selectedWallet && (
                  <div className="alert alert-info">
                    <h6 className="alert-heading">Dados para Pagamento</h6>
                    <p className="mb-1"><strong>Nome:</strong> {selectedWallet.accountName}</p>
                    <p className="mb-1"><strong>Numero:</strong> {selectedWallet.accountNumber}</p>
                    {selectedWallet.bankName && (
                      <p className="mb-0"><strong>Banco:</strong> {selectedWallet.bankName}</p>
                    )}
                    <hr />
                    <p className="mb-0 small">
                      Apos realizar o pagamento, va em "Meus Pedidos" para enviar o comprovativo.
                    </p>
                  </div>
                )}
              </>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedWallet || loadingOrder}
            >
              {loadingOrder ? "Processando..." : "Confirmar Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckoutModal;
