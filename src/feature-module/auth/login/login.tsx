"use client";

import React, { useState } from "react";
import "./login.css";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { useAuth } from "../../../core/common/context/AuthContextType";
import { all_routes } from "../../router/all_routes";
import { useNavigate } from "react-router-dom";

interface EcoLoginProps {
  onLogin?: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<EcoLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const route = all_routes;
  const navigate = useNavigate();

  const ecoSlides = [
    {
      title: "Educação Digital Sustentável",
      description:
        "Reduza sua pegada de carbono em 85% escolhendo o aprendizado digital.",
      stats: "🌍 -85% CO₂ | 📚 100% Digital",
      icon: "🌱",
    },
    {
      title: "Preservando o Futuro",
      description:
        "Nossa plataforma utiliza servidores alimentados por energia renovável.",
      stats: "🌳 2.500 árvores salvas | ⚡ 100% renovável",
      icon: "🌿",
    },
    {
      title: "Aprendizado Consciente",
      description:
        "Cada estudante contribui para um mundo mais verde e sustentável.",
      stats: "🚗 -70% deslocamentos | 🌱 Futuro sustentável",
      icon: "🍃",
    },
  ];

  // Auto-slide functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ecoSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ecoSlides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      if (onLogin) {
        await onLogin(email, password);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Login realizado com sucesso! 🌱");
      }
    } catch (error) {
      alert("Erro no login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eco-login-container">
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
                Bem-vindo ao <br />
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
          <span>Cada login contribui para um futuro mais verde</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="eco-form-side">
        <div className="eco-form-container">
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

          {/* Form Title */}
          <div className="eco-title-section">
            <h1 className="eco-form-title">Entre na sua Conta</h1>
            <p className="eco-form-subtitle">
              Acesse sua jornada de aprendizado sustentável 🌿
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="eco-login-form">
            {/* Email Field */}
            <div className="eco-field-group">
              <label className="eco-field-label">
                Email <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="eco-input"
                  placeholder="seu@email.com"
                  required
                />
                <span className="eco-input-icon">📧</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="eco-field-group">
              <label className="eco-field-label">
                Senha <span className="eco-required">*</span>
              </label>
              <div className="eco-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Form Options */}
            <div className="eco-form-options">
              <label className="eco-checkbox-wrapper">
                <input type="checkbox" className="eco-checkbox" />
                <span className="eco-checkbox-label">Lembrar de mim</span>
              </label>
              <button type="button" className="eco-forgot-link">
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="eco-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="eco-loading-spinner"></span>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="eco-arrow">→</span>
                </>
              )}
            </button>

            {/* Carbon Info */}
            <div className="eco-carbon-info">
              <span className="eco-carbon-icon">🌍</span>
              <span>Este login economiza ~0.2kg de CO₂ vs. presencial</span>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="eco-signup-section">
            <span>Não tem uma conta? </span>
            <button className="eco-signup-link">
              Cadastre-se gratuitamente
            </button>
          </div>

          {/* Sustainability Badge */}
          <div className="eco-sustainability-badge">
            <div className="eco-badge-icon">🏆</div>
            <div className="eco-badge-content">
              <strong>Certificado Carbono Neutro</strong>
              <span>Plataforma 100% sustentável</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
