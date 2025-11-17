// src/core/pages/CourseCheckout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../core/common/context/cartContext';
import { all_routes } from '../../router/all_routes';
import { toast } from 'react-toastify';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

interface PayPalOrderResponse {
  success: boolean;
  data?: {
    orderId: string;
    paymentId: number;
    purchaseId: number;
    approvalUrl: string;
  };
  error?: string;
}

interface PayPalCaptureResponse {
  success: boolean;
  data?: {
    status: string;
    captureId: string;
    purchaseId: number;
  };
  error?: string;
}

const CourseCheckout: React.FC = () => {
  const { cartItems, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [paypalOrderData, setPaypalOrderData] = useState<{
    orderId: string;
    approvalUrl: string;
  } | null>(null);
  
  const navigate = useNavigate();
  const route = all_routes;

  // Obter studentId do localStorage
  const studentId = parseInt(localStorage.getItem('id') || '0');

  useEffect(() => {
    // Redirecionar se o carrinho estiver vazio
    if (cartItems.length === 0 && !orderCreated) {
      toast.info('Seu carrinho está vazio. Adicione cursos antes de finalizar a compra.');
      navigate(route.courseCart);
    }
  }, [cartItems, navigate, route.courseCart, orderCreated]);

  // 1. Criar ordem PayPal
  const createPayPalOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    if (!studentId) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate(route.login);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        student_id: studentId,
        course_ids: cartItems.map(course => course.id),
        amount: totalPrice,
        currency: 'USD'
      };

      console.log('Criando ordem PayPal:', orderData);

      const response = await fetch('http://192.250.224.214:3001/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result: PayPalOrderResponse = await response.json();

      if (result.success && result.data) {
        setPaypalOrderData({
          orderId: result.data.orderId,
          approvalUrl: result.data.approvalUrl
        });
        setOrderCreated(true);
        toast.success('Ordem PayPal criada com sucesso!');
        
        console.log('Ordem criada:', result.data);
      } else {
        throw new Error(result.error || 'Erro ao criar ordem PayPal');
      }
    } catch (error: any) {
      console.error('Erro ao criar ordem PayPal:', error);
      toast.error(error.message || 'Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Capturar pagamento após aprovação do usuário
  const capturePayPalPayment = async (orderId: string) => {
    setPaymentProcessing(true);

    try {
      const response = await fetch('http://192.250.224.214:3001/api/payment/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      });

      const result: PayPalCaptureResponse = await response.json();

      if (result.success && result.data) {
        if (result.data.status === 'COMPLETED') {
          // Pagamento bem-sucedido
          toast.success('Pagamento processado com sucesso!');
          clearCart();
          
          // Redirecionar para página de sucesso ou cursos do estudante
          setTimeout(() => {
            navigate(route.studentCourses);
          }, 2000);
        } else {
          throw new Error('Pagamento não foi completado');
        }
      } else {
        throw new Error(result.error || 'Erro ao capturar pagamento');
      }
    } catch (error: any) {
      console.error('Erro ao capturar pagamento:', error);
      toast.error(error.message || 'Erro ao finalizar pagamento. Tente novamente.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // 3. Simular retorno do PayPal (quando o usuário retorna do PayPal)
  const handlePayPalReturn = async () => {
    if (!paypalOrderData) {
      toast.error('Nenhuma ordem PayPal encontrada');
      return;
    }

    await capturePayPalPayment(paypalOrderData.orderId);
  };

  // 4. Cancelar ordem
  const handleCancelOrder = () => {
    setOrderCreated(false);
    setPaypalOrderData(null);
    toast.info('Ordem PayPal cancelada');
  };

  // 5. Abrir PayPal em nova aba
  const openPayPalInNewTab = () => {
    if (paypalOrderData?.approvalUrl) {
      window.open(paypalOrderData.approvalUrl, '_blank');
      toast.info('Redirecionando para PayPal...');
    }
  };

  if (cartItems.length === 0 && !orderCreated) {
    return (
      <div className="content">
        <div className="container">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h3>Seu carrinho está vazio</h3>
              <p className="text-muted">
                Adicione cursos incríveis ao seu carrinho antes de finalizar a compra.
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
                              Acesso vitalício • Suporte inclusivo
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="badge bg-light text-dark">
                                {course.level || 'Todos os níveis'}
                              </span>
                              <span className="fw-bold text-primary">
                                MZN {course.price?.toFixed(2) || '0,00'}
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
                      <span className="fw-semibold">MZN {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Taxas</span>
                      <span className="text-success">MZN 0.00</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Desconto</span>
                      <span className="text-success">MZN 0.00</span>
                    </div>
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">Total Final</h5>
                      <h4 className="fw-bold text-primary mb-0">MZN {totalPrice.toFixed(2)}</h4>
                    </div>
                  </div>

                  {/* Informações de segurança */}
                  <div className="alert alert-light border mt-4">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-shield-alt text-success me-3 fs-5"></i>
                      <div>
                        <small className="fw-bold d-block">Pagamento 100% Seguro</small>
                        <small className="text-muted">
                          Processado via PayPal • Dados criptografados
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Processo de Pagamento */}
            <div className="col-lg-7 col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h4 className="card-title mb-0">
                    <i className={`fas ${orderCreated ? 'fa-check-circle text-success' : 'fa-credit-card'} me-2`}></i>
                    {orderCreated ? 'Finalizar Pagamento' : 'Método de Pagamento'}
                  </h4>
                </div>
                <div className="card-body">
                  
                  {!orderCreated ? (
                    // Tela inicial - Criar ordem PayPal
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                          alt="PayPal" 
                          className="mb-3"
                          style={{ height: '50px' }}
                        />
                        <h5 className="fw-bold">Pagamento Seguro com PayPal</h5>
                        <p className="text-muted">
                          Você será redirecionado para o PayPal para concluir seu pagamento de forma segura.
                        </p>
                      </div>

                      {/* Informações de teste */}
                      <div className="row mb-4">
                        <div className="col-12">
                          <div className="alert alert-warning border">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-info-circle me-2"></i>
                              <div>
                                <small className="fw-bold d-block">Ambiente de Teste</small>
                                <small>
                                  Use credenciais de sandbox do PayPal para testar o pagamento
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botão de ação principal */}
                      <button
                        onClick={createPayPalOrder}
                        disabled={loading || cartItems.length === 0}
                        className="btn btn-primary btn-lg w-100 py-3 mb-3"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Criando Ordem PayPal...
                          </>
                        ) : (
                          <>
                            <i className="fab fa-paypal me-2"></i>
                            Pagar com PayPal - MZN {totalPrice.toFixed(2)}
                          </>
                        )}
                      </button>

                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        <Link 
                          to={route.courseCart} 
                          className="btn btn-outline-secondary"
                        >
                          <i className="fas fa-arrow-left me-2"></i>
                          Voltar ao Carrinho
                        </Link>
                        <Link 
                          to={route.courseGrid} 
                          className="btn btn-outline-primary"
                        >
                          <i className="fas fa-plus me-2"></i>
                          Adicionar Mais Cursos
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // Tela após criação da ordem - Opções para finalizar
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <div className="text-success mb-3">
                          <i className="fas fa-check-circle fa-3x"></i>
                        </div>
                        <h5 className="text-success fw-bold">Ordem Criada com Sucesso!</h5>
                        <p className="text-muted">
                          Sua ordem PayPal foi criada. Escolha como deseja prosseguir:
                        </p>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-12">
                          <button
                            onClick={openPayPalInNewTab}
                            className="btn btn-primary w-100 py-3"
                          >
                            <i className="fab fa-paypal me-2"></i>
                            Ir para PayPal (Nova Aba)
                          </button>
                          <small className="text-muted d-block mt-2">
                            Você será redirecionado para o site seguro do PayPal
                          </small>
                        </div>

                        <div className="col-12">
                          <button
                            onClick={handlePayPalReturn}
                            disabled={paymentProcessing}
                            className="btn btn-success w-100 py-3"
                          >
                            {paymentProcessing ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processando Pagamento...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check me-2"></i>
                                Simular Retorno do PayPal (Teste)
                              </>
                            )}
                          </button>
                          <small className="text-muted d-block mt-2">
                            Para testes: Simula retorno bem-sucedido do PayPal
                          </small>
                        </div>
                      </div>

                      {/* Botão de cancelamento */}
                      <div className="border-top pt-4">
                        <button
                          onClick={handleCancelOrder}
                          disabled={paymentProcessing}
                          className="btn btn-outline-danger"
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancelar Ordem
                        </button>
                      </div>

                      {/* Indicador de processamento */}
                      {paymentProcessing && (
                        <div className="mt-4">
                          <div className="progress mb-3">
                            <div 
                              className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                              style={{ width: '100%' }}
                            ></div>
                          </div>
                          <p className="text-muted mb-0">
                            <i className="fas fa-cog fa-spin me-2"></i>
                            Processando seu pagamento...
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Informações de suporte */}
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

              {/* Informações adicionais */}
              <div className="card mt-4 border-0 bg-light">
                <div className="card-body text-center">
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    Processamento instantâneo • Acesso imediato aos cursos • Garantia de 7 dias
                  </small>
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