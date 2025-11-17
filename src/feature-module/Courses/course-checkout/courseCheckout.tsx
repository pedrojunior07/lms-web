import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Tipos para os dados do formulário
interface CardData {
  cardNumber: string;
  cardName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface CourseData {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    transactionId: string;
    paymentId: number;
    purchaseId: number;
    status: string;
    amount: number;
    currency: string;
    courses: Array<{ id: number; title: string }>;
    processedAt: string;
  };
}

const CourseCheckout: React.FC = () => {
  // Estados
  const [formData, setFormData] = useState<CardData>({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
  const [cardBrand, setCardBrand] = useState<string>('');

  const navigate = useNavigate();

  // Dados do curso (em produção, viriam de props ou contexto)
  const [courseData] = useState<{
    studentId: number;
    courseIds: number[];
    courses: CourseData[];
    totalAmount: number;
  }>({
    studentId: 1, // Substituir pelo ID real do estudante logado
    courseIds: [1], // IDs dos cursos no carrinho
    courses: [
      { 
        id: 1, 
        title: 'JavaScript Avançado', 
        price: 49.99,
        thumbnail: '/assets/img/course/course-01.jpg'
      }
    ],
    totalAmount: 49.99
  });

  // Formatar número do cartão
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 dígitos + 3 espaços
  };

  // Detectar bandeira do cartão
  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (cleaned.startsWith('5')) return 'MASTERCARD';
    if (cleaned.startsWith('3')) return 'AMEX';
    if (cleaned.startsWith('6')) return 'DISCOVER';
    return '';
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      setCardBrand(detectCardBrand(formatted));
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      const cleaned = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
  };

  // Validar formulário
  const validateForm = (): boolean => {
    if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      setError('Número do cartão inválido');
      return false;
    }
    if (formData.cardName.trim().length < 3) {
      setError('Nome do titular inválido');
      return false;
    }
    const monthNum = parseInt(formData.expiryMonth, 10);
    if (!formData.expiryMonth || monthNum < 1 || monthNum > 12) {
      setError('Mês de validade inválido');
      return false;
    }
    const yearNum = parseInt(formData.expiryYear, 10);
    if (!formData.expiryYear || yearNum < new Date().getFullYear()) {
      setError('Ano de validade inválido');
      return false;
    }
    if (formData.cvv.length < 3) {
      setError('CVV inválido');
      return false;
    }
    return true;
  };

  // Processar pagamento
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Chamar API de pagamento mock
      const response = await fetch('http://192.250.224.214:3001/api/mock-payment/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: courseData.studentId,
          course_ids: courseData.courseIds,
          amount: courseData.totalAmount,
          currency: 'USD',
          cardData: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardName: formData.cardName,
            expiryMonth: parseInt(formData.expiryMonth, 10),
            expiryYear: parseInt(formData.expiryYear, 10),
            cvv: formData.cvv
          }
        })
      });

      const data: PaymentResponse = await response.json();

      if (data.success) {
        setPaymentStatus('success');
        console.log('✅ Pagamento aprovado:', data);
        
        // Redirecionar após 3 segundos
        setTimeout(() => {
          navigate('/student/student-courses');
        }, 3000);
      } else {
        setPaymentStatus('error');
        setError(data.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      setPaymentStatus('error');
      setError('Erro de conexão com o servidor. Tente novamente.');
      console.error('❌ Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gerar anos para o select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  // Tela de Sucesso
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Pagamento Aprovado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu pagamento foi processado com sucesso. Você agora tem acesso ao(s) curso(s):
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {courseData.courses.map(course => (
              <div key={course.id} className="text-left py-2 border-b last:border-b-0">
                <p className="font-semibold text-gray-800">✓ {course.title}</p>
                <p className="text-sm text-gray-500">${course.price}</p>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Redirecionando para Meus Cursos...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
          <Link 
            to="/student/student-courses" 
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Ir para Meus Cursos Agora
          </Link>
        </div>
      </div>
    );
  }

  // Formulário de Pagamento
  return (
    <div className="main-wrapper">
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
            <div className="col-lg-4 col-md-12">
              <div className="card checkout-summary">
                <div className="card-header">
                  <h4 className="card-title">Resumo do Pedido</h4>
                </div>
                <div className="card-body">
                  {courseData.courses.map(course => (
                    <div key={course.id} className="checkout-item mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{course.title}</h6>
                          <p className="text-muted small mb-0">Acesso vitalício</p>
                        </div>
                        <span className="fw-bold">${course.price}</span>
                      </div>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${courseData.totalAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Desconto</span>
                    <span className="text-success">$0.00</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">Total</h5>
                    <h5 className="fw-bold">${courseData.totalAmount}</h5>
                  </div>

                  <div className="alert alert-info mt-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-lock me-2"></i>
                      <small>
                        <strong>Pagamento Seguro</strong><br />
                        Ambiente de teste - Pagamentos simulados
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Formulário de Pagamento */}
            <div className="col-lg-8 col-md-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Dados do Cartão de Crédito</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Número do Cartão */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Número do Cartão</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="cardNumber"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                          />
                          {cardBrand && (
                            <span className="position-absolute top-50 end-0 translate-middle-y me-3">
                              <span className="badge bg-primary">{cardBrand}</span>
                            </span>
                          )}
                        </div>
                        <small className="form-text text-muted">
                          💡 Use qualquer número (ex: 4111 1111 1111 1111)
                        </small>
                      </div>

                      {/* Nome do Titular */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Nome do Titular</label>
                        <input
                          type="text"
                          name="cardName"
                          className="form-control text-uppercase"
                          placeholder="NOME COMPLETO"
                          value={formData.cardName}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Validade - Mês */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Mês</label>
                        <select
                          name="expiryMonth"
                          className="form-select"
                          value={formData.expiryMonth}
                          onChange={handleChange}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Validade - Ano */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Ano</label>
                        <select
                          name="expiryYear"
                          className="form-select"
                          value={formData.expiryYear}
                          onChange={handleChange}
                        >
                          <option value="">AAAA</option>
                          {years.map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* CVV */}
                      <div className="col-md-4 mb-3">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          className="form-control"
                          placeholder="123"
                          maxLength={4}
                          value={formData.cvv}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Mensagem de Erro */}
                      {error && (
                        <div className="col-md-12 mb-3">
                          <div className="alert alert-danger d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <span>{error}</span>
                          </div>
                        </div>
                      )}

                      {/* Botão Submit */}
                      <div className="col-md-12">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary w-100 py-3"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-credit-card me-2"></i>
                              Pagar ${courseData.totalAmount}
                            </>
                          )}
                        </button>
                        <p className="text-center text-muted small mt-2">
                          Ao clicar em "Pagar", o pagamento será processado instantaneamente
                        </p>
                      </div>
                    </div>
                  </form>
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