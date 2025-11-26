"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import axios from "axios";
import { toast } from "react-toastify";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

interface EcoRegisterProps {
  onRegister: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  role: "STUDENT" | "INSTRUCTOR";
  agreeToTerms: boolean;
}

const EcoRegister: React.FC<EcoRegisterProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    role: "STUDENT",
    agreeToTerms: false,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  const ecoSlides = [
    {
      title: "Junte-se à Revolução Verde",
      description:
        "Faça parte de uma comunidade que valoriza o aprendizado sustentável e o futuro do planeta.",
      stats: "🌍 +50.000 estudantes | 🌱 100% sustentável",
      icon: "🌱",
    },
    {
      title: "Aprenda com Propósito",
      description:
        "Cada curso que você faz contribui para reduzir a pegada de carbono da educação tradicional.",
      stats: "📚 -90% papel | ⚡ Energia renovável",
      icon: "📚",
    },
    {
      title: "Construa um Futuro Melhor",
      description:
        "Desenvolva habilidades enquanto ajuda a preservar o meio ambiente para as próximas gerações.",
      stats: "🌳 1 árvore = 1 curso | 🚀 Crescimento sustentável",
      icon: "🌿",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ecoSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ecoSlides.length]);

  // Password strength validation
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, message: "", color: "" });
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = "";
    let color = "";

    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = "Senha muito fraca";
        color = "#ef4444";
        break;
      case 2:
        message = "Senha fraca";
        color = "#f59e0b";
        break;
      case 3:
        message = "Senha boa";
        color = "#3b82f6";
        break;
      case 4:
        message = "Senha excelente!";
        color = "#10b981";
        break;
      default:
        message = "";
        color = "";
    }

    return { score, message, color };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.userName);
      case 2:
        return !!(
          formData.email &&
          formData.email.includes("@") &&
          formData.phoneNumber
        );
      case 3:
        return !!(formData.gender && formData.dob);
      case 4:
        return !!(
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          passwordStrength.score >= 2 &&
          formData.agreeToTerms
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      alert("Por favor, preencha todos os campos obrigatórios");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      alert("Por favor, complete todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://102.211.186.111:8085/e-learning/api/auth/register",
        {
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dob: formData.dob,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success("Registro realizado! Verifique seu e-mail para ativar sua conta.", {
        toastId: "success-register",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="custom-toast-success-icon"
            viewBox="0 0 24 24"
            fill="#2ecc71"
            width="1.2rem"
            height="1.2rem"
          >
            <path d="M9 16.17l-3.5-3.5L4 13.17l5 5 12-12-1.5-1.5z" />
          </svg>
        ),
        className: "custom-toast",
        progressClassName: "custom-toast-progress",
        autoClose: 5000,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Erro ao enviar dados.";
        toast.error(msg, {
          toastId: "error-register",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ef4444"
              width="1.2rem"
              height="1.2rem"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          ),
          className: "custom-toast-body",
          progressClassName: "custom-toast-progress",
        });
      } else {
        toast.error("Erro inesperado ao enviar o formulário.", {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#ef4444"
              width="1.2rem"
              height="1.2rem"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          ),
          className: "custom-toast",
          progressClassName: "custom-toast-progress",
        });
        console.error("Erro ao enviar o formulário:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="eco-step-content">
            <h2 className="eco-step-title">Informações Pessoais</h2>
            <p className="eco-step-subtitle">
              Vamos começar com suas informações básicas
            </p>

            <div className="eco-form-row">
              <div className="eco-field-group">
                <label className="eco-field-label">
                  Nome <span className="eco-required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="eco-field-group">
                <label className="eco-field-label">
                  Sobrenome <span className="eco-required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Nome de Usuário <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="Escolha um nome de usuário"
                  required
                />
                <span className="eco-input-icon">👤</span>
              </div>
            </div>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Tipo de Conta <span className="eco-required">*</span>
              </label>
              <div className="eco-user-type-selector">
                <label
                  className={`eco-user-type-option ${
                    formData.role === "STUDENT" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={formData.role === "STUDENT"}
                    onChange={handleInputChange}
                  />
                  <div className="eco-user-type-content">
                    <span className="eco-user-type-icon">🎓</span>
                    <div>
                      <strong>Estudante</strong>
                      <p>Acesse cursos e aprenda de forma sustentável</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="eco-step-content">
            <h2 className="eco-step-title">Informações de Contato</h2>
            <p className="eco-step-subtitle">
              Como podemos entrar em contato com você?
            </p>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Email <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="seu@email.com"
                  required
                />
                <span className="eco-input-icon">📧</span>
              </div>
            </div>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Telefone <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="(11) 99999-9999"
                  required
                />
                <span className="eco-input-icon">📱</span>
              </div>
            </div>

            <div className="eco-contact-benefits">
              <h4>Benefícios da comunicação digital:</h4>
              <ul>
                <li>🌱 Zero papel utilizado</li>
                <li>⚡ Notificações instantâneas</li>
                <li>♻️ Comunicação 100% sustentável</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="eco-step-content">
            <h2 className="eco-step-title">Informações Pessoais</h2>
            <p className="eco-step-subtitle">
              Alguns dados adicionais para personalizar sua experiência
            </p>

            <div className="eco-form-row">
              <div className="eco-field-group">
                <label className="eco-field-label">
                  Gênero <span className="eco-required">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="eco-input eco-select"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                  <option value="OTHER">Outro</option>
                  <option value="PREFER_NOT_TO_SAY">Prefiro não dizer</option>
                </select>
              </div>

              <div className="eco-field-group">
                <label className="eco-field-label">
                  Data de Nascimento <span className="eco-required">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="eco-input"
                  required
                />
              </div>
            </div>

            <div className="eco-personalization-info">
              <div className="eco-info-card">
                <span className="eco-info-icon">🎯</span>
                <div>
                  <strong>Personalização Inteligente</strong>
                  <p>
                    Usamos essas informações para recomendar cursos mais
                    relevantes para você
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="eco-step-content">
            <h2 className="eco-step-title">Segurança da Conta</h2>
            <p className="eco-step-subtitle">
              Proteja sua conta com uma senha forte
            </p>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Senha <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  className="eco-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {passwordStrength.message && (
                <div
                  className="eco-password-strength"
                  style={{ color: passwordStrength.color }}
                >
                  <div className="eco-strength-bar">
                    <div
                      className="eco-strength-fill"
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    ></div>
                  </div>
                  <span>{passwordStrength.message}</span>
                </div>
              )}
            </div>

            <div className="eco-field-group">
              <label className="eco-field-label">
                Confirmar Senha <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="eco-input"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  className="eco-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <div className="eco-error-message">
                    As senhas não coincidem
                  </div>
                )}
            </div>

            <div className="eco-terms-section">
              <label className="eco-checkbox-wrapper">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="eco-checkbox"
                  required
                />
                <span className="eco-checkbox-label">
                  Concordo com os{" "}
                  <button type="button" className="eco-link">
                    Termos de Uso
                  </button>{" "}
                  e{" "}
                  <button type="button" className="eco-link">
                    Política de Privacidade
                  </button>{" "}
                  sustentáveis
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="eco-register-container">
      {/* Left Side - Eco Banner */}
      <div className="eco-banner-side">
        <div className="eco-background-pattern"></div>

        {/* Floating Elements */}
        <div className="eco-floating-elements">
          <div className="eco-float-item eco-float-1">🍃</div>
          <div className="eco-float-item eco-float-2">🌿</div>
          <div className="eco-float-item eco-float-3">🌱</div>
          <div className="eco-float-item eco-float-4">🍀</div>
        </div>

        {/* Slide Content */}
        <div className="eco-slide-container">
          <div className="eco-slide-content">
            {/* Logo/Icon */}
            <div className="eco-logo-section">
              <div className="eco-main-icon">
                <div className="eco-icon-bg"></div>
                <span className="eco-icon-symbol">
                  {ecoSlides[currentSlide].icon}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="eco-content">
              <div className="eco-stats-badge">
                {ecoSlides[currentSlide].stats}
              </div>

              <h1 className="eco-main-title">
                Junte-se ao <br />
                <span className="eco-brand">EthenaLearn</span>
              </h1>

              <h2 className="eco-slide-title">
                {ecoSlides[currentSlide].title}
              </h2>

              <p className="eco-description">
                {ecoSlides[currentSlide].description}
              </p>

              {/* Impact Indicators */}
              <div className="eco-indicators">
                <div className="eco-indicator">
                  <span className="eco-indicator-icon">🌍</span>
                  <span>Carbono Neutro</span>
                </div>
                <div className="eco-indicator">
                  <span className="eco-indicator-icon">♻️</span>
                  <span>100% Digital</span>
                </div>
                <div className="eco-indicator">
                  <span className="eco-indicator-icon">🌱</span>
                  <span>Sustentável</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="eco-slide-dots">
            {ecoSlides.map((_, index) => (
              <button
                key={index}
                className={`eco-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="eco-footer-message">
          <span className="eco-footer-icon">🌿</span>
          <span>Cada novo membro fortalece nossa comunidade verde</span>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="eco-form-side">
        <div className="">
          {/* Header */}
          <div className="eco-form-header">
            <div className="eco-logo">
              <ImageWithBasePath
                src="assets/img/logo.png"
                className="img-fluid"
                alt="Logo"
                width={350}
              />
            </div>
            <button className="eco-back-btn">← Voltar ao Início</button>
          </div>

          {/* Progress Indicator */}
          <div className="eco-progress-container">
            <div className="eco-progress-bar">
              <div
                className="eco-progress-fill"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <div className="eco-progress-steps">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`eco-progress-step ${
                    currentStep >= step ? "active" : ""
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Form Title */}
          <div className="eco-title-section">
            <h1 className="eco-form-title">Crie sua Conta</h1>
            <p className="eco-form-subtitle">
              Comece sua jornada sustentável hoje mesmo 🌿
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="eco-register-form">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="eco-form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="eco-nav-button eco-nav-prev"
                  onClick={prevStep}
                >
                  ← Anterior
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  className="eco-nav-button eco-nav-next"
                  onClick={nextStep}
                >
                  Próximo →
                </button>
              ) : (
                <button
                  type="submit"
                  className="eco-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="eco-loading-spinner"></span>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <span className="eco-arrow">🌱</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Carbon Info */}
            <div className="eco-carbon-info">
              <span className="eco-carbon-icon">🌍</span>
              <span>
                Ao se cadastrar, você evita ~1.2kg de CO₂ vs. processo
                presencial
              </span>
            </div>
          </form>

          {/* Login Link */}
          <div className="eco-login-section">
            <span>Já tem uma conta? </span>
            <button className="eco-login-link">Faça login</button>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="eco-success-modal-overlay"
          onClick={() => {
            setShowSuccessModal(false);
            navigate("/login");
          }}
        >
          <div
            className="eco-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="eco-success-content">
              <div className="eco-success-icon">📧</div>
              <h2 className="eco-success-title">Verifique seu E-mail!</h2>
              <p className="eco-success-message">
                Enviamos um link de confirmação para <strong>{formData.email}</strong>.
                Clique no link para ativar sua conta e começar a aprender!
              </p>
              <div className="eco-success-stats">
                <div className="eco-success-stat">
                  <span className="eco-stat-icon">📬</span>
                  <span>Verifique sua caixa de entrada</span>
                </div>
                <div className="eco-success-stat">
                  <span className="eco-stat-icon">⏰</span>
                  <span>O link expira em 24 horas</span>
                </div>
              </div>
              <button
                className="eco-success-button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/login");
                }}
              >
                Ir para Login 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoRegister;
