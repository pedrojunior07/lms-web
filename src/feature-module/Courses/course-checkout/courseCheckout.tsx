// src/feature-module/Courses/course-checkout/courseCheckout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../core/common/context/cartContext';
import { all_routes } from '../../router/all_routes';
import { toast } from 'react-toastify';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { usePaymentWallets, PaymentWallet, WalletType } from '../../../core/api/hooks/usePaymentWallets';
import { useCourseOrders } from '../../../core/api/hooks/useCourseOrders';
import { useCourseApi } from '../../../core/api/hooks/useCourseApi';

const CourseCheckout: React.FC = () => {
  const { cartItems, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const route = all_routes;

  const studentId = parseInt(localStorage.getItem('id') || '0');

  const { wallets, loading: loadingWallets, fetchWallets } = usePaymentWallets();
  const { createOrder, loading: loadingOrder } = useCourseOrders();
  const { getCourceById } = useCourseApi();

  const [selectedMethod, setSelectedMethod] = useState<WalletType>("MPESA");
  const [selectedWallet, setSelectedWallet] = useState<PaymentWallet | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [instructorId, setInstructorId] = useState<number | null>(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderCreated) {
      toast.info('Seu carrinho esta vazio. Adicione cursos antes de finalizar a compra.');
      navigate(route.courseCart);
    }
  }, [cartItems, navigate, route.courseCart, orderCreated]);

  // Fetch course details to get instructorId, then fetch wallets
  useEffect(() => {
    const fetchCourseAndWallets = async () => {
      if (cartItems.length > 0) {
        try {
          const courseDetails = await getCourceById(cartItems[0].id);
          if (courseDetails?.data?.instructor?.id) {
            const instId = courseDetails.data.instructor.id;
            setInstructorId(instId);
            fetchWallets(instId);
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do curso:', error);
        }
      }
    };
    fetchCourseAndWallets();
  }, [cartItems]);

  // Select first wallet of selected method
  useEffect(() => {
    const methodWallets = wallets.filter(w => w.walletType === selectedMethod && w.active);
    setSelectedWallet(methodWallets[0] || null);
  }, [wallets, selectedMethod]);

  const getMethodWallets = (method: WalletType) => {
    return wallets.filter(w => w.walletType === method && w.active);
  };

  const handleCreateOrder = async () => {
    if (!selectedWallet) {
      toast.error('Selecione uma forma de pagamento');
      return;
    }

    if (!studentId) {
      toast.error('Voce precisa estar logado para finalizar a compra');
      navigate(route.login);
      return;
    }

    try {
      // Create order for first course (can be extended for multiple courses)
      const course = cartItems[0];
      const order = await createOrder({
        courseId: course.id,
        studentId,
        paymentMethod: selectedMethod,
        walletId: selectedWallet.id,
      });

      setOrderCreated(true);
      setOrderInfo({
        ...order,
        wallet: selectedWallet,
      });
      toast.success('Pedido criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast.error(error.message || 'Erro ao processar pedido. Tente novamente.');
    }
  };

  const handleGoToOrders = () => {
    clearCart();
    navigate('/student/orders');
  };

  if (cartItems.length === 0 && !orderCreated) {
    return (
      <div className="content">
        <div className="container">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h3>Seu carrinho esta vazio</h3>
              <p className="text-muted">
                Adicione cursos incriveis ao seu carrinho antes de finalizar a compra.
              </p>
            </div>
            <Link to={route.courseGrid} className="btn btn-primary mt-3">
              <i className="fas fa-search me-2"></i>
              Explorar Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="breadcrumb-list">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={route.courseCart}>Carrinho</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <div className="row">
            {/* Coluna Esquerda - Resumo do Pedido */}
            <div className="col-lg-5 col-md-12 mb-4">
              <div className="card checkout-summary shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h4 className="card-title mb-0">
                    <i className="fas fa-receipt me-2 text-primary"></i>
                    Resumo do Pedido
                  </h4>
                </div>
                <div className="card-body">
                  <div className="courses-list">
                    {cartItems.map(course => (
                      <div key={course.id} className="checkout-item mb-3 pb-3 border-bottom">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0">
                            <ImageWithBasePath
                              src={course.image || "assets/img/course/course-01.jpg"}
                              alt={course.title}
                              className="rounded"
                              style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1 fs-14 fw-semibold">{course.title}</h6>
                            <p className="text-muted small mb-1">
                              Acesso vitalicio - Suporte inclusivo
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="badge bg-light text-dark">
                                {course.level || 'Todos os niveis'}
                              </span>
                              <span className="fw-bold text-primary">
                                {course.price?.toFixed(2) || '0.00'} MT
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-semibold">{totalPrice.toFixed(2)} MT</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Taxas</span>
                      <span className="text-success">0.00 MT</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Total Final</h5>
                      <h4 className="fw-bold text-primary mb-0">{totalPrice.toFixed(2)} MT</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Metodo de Pagamento */}
            <div className="col-lg-7 col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h4 className="card-title mb-0">
                    <i className={`fas ${orderCreated ? 'fa-check-circle text-success' : 'fa-credit-card'} me-2`}></i>
                    {orderCreated ? 'Pedido Criado' : 'Metodo de Pagamento'}
                  </h4>
                </div>
                <div className="card-body">

                  {!orderCreated ? (
                    // Tela de selecao de pagamento
                    <div>
                      {loadingWallets ? (
                        <div className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                          </div>
                        </div>
                      ) : wallets.length === 0 ? (
                        <div className="alert alert-warning">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          O instrutor ainda nao configurou formas de pagamento.
                        </div>
                      ) : (
                        <>
                          <h6 className="mb-3">Selecione a forma de pagamento</h6>

                          {/* Payment Method Buttons */}
                          <div className="row mb-4">
                            {["MPESA", "EMOLA", "BANK"].map((method) => {
                              const methodWallets = getMethodWallets(method as WalletType);
                              if (methodWallets.length === 0) return null;

                              return (
                                <div key={method} className="col-md-4 mb-2">
                                  <div
                                    className={`card cursor-pointer h-100 ${selectedMethod === method ? "border-primary border-2" : ""}`}
                                    onClick={() => setSelectedMethod(method as WalletType)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="card-body text-center py-3">
                                      <i className={`fa fa-${
                                        method === "MPESA" ? "mobile-alt text-danger" :
                                        method === "EMOLA" ? "mobile text-warning" : "university text-info"
                                      } fa-2x mb-2`}></i>
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
                          {getMethodWallets(selectedMethod).length > 1 && (
                            <div className="mb-4">
                              <label className="form-label">Selecione a conta</label>
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

                          {/* Payment Info Preview */}
                          {selectedWallet && (
                            <div className="alert alert-info mb-4">
                              <h6 className="alert-heading">
                                <i className="fas fa-info-circle me-2"></i>
                                Dados para Pagamento
                              </h6>
                              <p className="mb-1"><strong>Nome:</strong> {selectedWallet.accountName}</p>
                              <p className="mb-1"><strong>Numero:</strong> {selectedWallet.accountNumber}</p>
                              {selectedWallet.bankName && (
                                <p className="mb-0"><strong>Banco:</strong> {selectedWallet.bankName}</p>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <button
                            onClick={handleCreateOrder}
                            disabled={!selectedWallet || loadingOrder}
                            className="btn btn-primary btn-lg w-100 py-3 mb-3"
                          >
                            {loadingOrder ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Criando Pedido...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-shopping-cart me-2"></i>
                                Confirmar Pedido - {totalPrice.toFixed(2)} MT
                              </>
                            )}
                          </button>

                          <div className="d-flex gap-2 justify-content-center">
                            <Link to={route.courseCart} className="btn btn-outline-secondary">
                              <i className="fas fa-arrow-left me-2"></i>
                              Voltar
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    // Tela apos criacao do pedido
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <div className="text-success mb-3">
                          <i className="fas fa-check-circle fa-4x"></i>
                        </div>
                        <h4 className="text-success fw-bold">Pedido Criado com Sucesso!</h4>
                        <p className="text-muted">
                          Realize o pagamento usando os dados abaixo e depois envie o comprovativo.
                        </p>
                      </div>

                      {/* Payment Details */}
                      <div className="card bg-light mb-4">
                        <div className="card-body text-start">
                          <h6 className="fw-bold mb-3">
                            <i className="fas fa-wallet me-2 text-primary"></i>
                            Dados para Pagamento
                          </h6>
                          <p className="mb-1"><strong>Nome:</strong> {orderInfo?.wallet?.accountName}</p>
                          <p className="mb-1"><strong>Numero:</strong> {orderInfo?.wallet?.accountNumber}</p>
                          {orderInfo?.wallet?.bankName && (
                            <p className="mb-1"><strong>Banco:</strong> {orderInfo?.wallet?.bankName}</p>
                          )}
                          <hr />
                          <p className="mb-0 fw-bold text-primary">
                            <strong>Valor:</strong> {totalPrice.toFixed(2)} MT
                          </p>
                        </div>
                      </div>

                      <div className="alert alert-warning text-start">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Proximo passo:</strong> Apos realizar o pagamento, va em "Meus Pedidos" para enviar o comprovativo de pagamento.
                      </div>

                      <button
                        onClick={handleGoToOrders}
                        className="btn btn-success btn-lg w-100 py-3"
                      >
                        <i className="fas fa-arrow-right me-2"></i>
                        Ir para Meus Pedidos
                      </button>
                    </div>
                  )}

                  {/* Footer Info */}
                  <div className="mt-4 pt-4 border-top">
                    <div className="row text-center">
                      <div className="col-4">
                        <i className="fas fa-lock text-primary mb-2 fs-5"></i>
                        <p className="small mb-0 fw-semibold">Seguro</p>
                      </div>
                      <div className="col-4">
                        <i className="fas fa-shield-alt text-primary mb-2 fs-5"></i>
                        <p className="small mb-0 fw-semibold">Protegido</p>
                      </div>
                      <div className="col-4">
                        <i className="fas fa-headset text-primary mb-2 fs-5"></i>
                        <p className="small mb-0 fw-semibold">Suporte</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
