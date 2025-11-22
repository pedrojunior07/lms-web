import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../feature-module/router/all_routes";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterWizard = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    accountType: "",
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    email: "",
    password: "",
    role: "INSTRUCTOR",
  });

  const [eye, setEye] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<number>(0);
  const [strength, setStrength] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [eyeConfirmPassword, setEyeConfirmPassword] = useState<boolean>(true);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setForm((prev) => ({ ...prev, password: newPassword }));
    validatePassword(newPassword);
  };

  const onEyeClick = () => {
    setEye((prev) => !prev);
  };
  const validatePassword = (value: string) => {
    if (!value) {
      setValidationError(1);
    } else if (value.length < 8) {
      setValidationError(2);
    } else if (!/[0-9]/.test(value)) {
      setValidationError(3);
    } else if (!/[!@#$%^&*()]/.test(value)) {
      setValidationError(4);
    } else {
      setValidationError(5);
    }
  };
  const messages = () => {
    switch (validationError) {
      case 2:
        return (
          <span
            id="poor"
            className="active mt-2"
            style={{ fontSize: 14, color: "#DC3545", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/angry.svg"
              className="me-2"
              alt=""
            />{" "}
            Fraco. Deve conter pelo menos 8 caracteres
          </span>
        );
      case 3:
        return (
          <span
            id="weak"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#FFC107", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/anguish.svg"
              className="me-2"
              alt=""
            />{" "}
            Médio. Deve conter pelo menos 1 letra ou número
          </span>
        );
      case 4:
        return (
          <span
            id="strong"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#0D6EFD", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/smile.svg"
              className="me-2"
              alt=""
            />{" "}
            Quase lá. Deve conter símbolo especial
          </span>
        );
      case 5:
        return (
          <span
            id="heavy"
            className="active  mt-2"
            style={{ fontSize: 14, color: "#4BB543", marginTop: "8px" }}
          >
            <ImageWithBasePath
              src="assets/img/icon/smile.svg"
              className="me-2"
              alt=""
            />{" "}
            Incrível! Você tem uma senha segura.
          </span>
        );
      default:
        return null;
    }
  };

  const ErrorIcon = () => (
    <svg
      className="custom-toast-error-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.001 10h2v5h-2zm0 7h2v2h-2z" />
      <path
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 
           10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 
           8-8 8 3.589 8 8-3.589 8-8 8z"
      />
    </svg>
  );
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const route = all_routes;
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8085/e-learning/api/auth/register",
        {
          role: form.role,
          firstName: form.firstName,
          lastName: form.lastName,
          userName: form.userName,
          phoneNumber: form.phoneNumber,
          gender: form.gender,
          dob: form.dob,
          email: form.email,
          password: form.password,
        }
      );

      toast.success("Registro realizado com sucesso!", {
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
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "Erro ao enviar dados.";
        toast.error(msg, {
          toastId: "error-register",
          icon: <ErrorIcon />,
          className: "custom-toast-body",

          progressClassName: "custom-toast-progress",
        });
      } else {
        toast.error("Erro inesperado ao enviar o formulário.", {
          icon: <ErrorIcon />,
          className: "custom-toast",

          progressClassName: "custom-toast-progress",
        });
        console.error("Erro ao enviar o formulário:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastro realizado</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>🎉 Parabéns! Sua conta foi registrada com sucesso.</p>
                <p>
                  Enviamos um e-mail de confirmação para o endereço fornecido.
                </p>
                <p>
                  Não recebeu o e-mail?{" "}
                  <button className="btn btn-link p-0">Reenviar e-mail</button>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSuccessModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="loginbox">
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between login-header">
            <ImageWithBasePath
              src="assets/img/logo.png"
              className="img-fluid"
              alt="Logo"
            />
            <Link to={route.homeone} className="link-1">
              Voltar para Home
            </Link>
          </div>
          <h1 className="fs-32 fw-bold topic">Cadastrar</h1>
          {/* <div className="progress mb-4">
            <div
              className="progress-bar progress-bar-striped"
              role="progressbar"
              style={{ width: `${(step / 3) * 100}%` }}
              aria-valuenow={(step / 3) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              Passo {step} de 3
            </div>
          </div>*/}
          <form onSubmit={handleSubmit} className="mb-3 pb-3">
            {step === 1 && (
              <>
                <div className="mb-3">
                  <label className="form-label">Tipo de Conta *</label>
                  <select
                    name="role"
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">Selecionar</option>
                    <option value="STUDENT">Estudante</option>
                    <option value="INSTRUCTOR">Instrutor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Primeiro Nome *</label>
                  <input
                    name="firstName"
                    className="form-control"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Sobrenome *</label>
                  <input
                    name="lastName"
                    className="form-control"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nome de Usuário *</label>
                  <input
                    name="userName"
                    className="form-control"
                    value={form.userName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Número de Telefone *</label>
                  <input
                    name="phoneNumber"
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gênero *</label>
                  <select
                    name="gender"
                    className="form-control"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Selecionar</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Feminino</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Data de Nascimento *</label>
                  <input
                    type="date"
                    name="dob"
                    className="form-control"
                    value={form.dob}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-3 position-relative">
                  <label className="form-label">
                    E-mail<span className="text-danger ms-1">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      className="form-control form-control-lg"
                    />
                    <span>
                      <i className="isax isax-sms input-icon text-gray-7 fs-14" />
                    </span>
                  </div>
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">
                    Nova Senha <span className="text-danger"> *</span>
                  </label>
                  <div className="position-relative" id="passwordInput">
                    <input
                      name="password"
                      className="form-control form-control-lg pass-input"
                      type={eye ? "password" : "text"}
                      value={form.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={onEyeClick}
                      className={`toggle-passwords text-gray-7 fs-14 isax isax-eye-slash" ${
                        eye ? "isax-eye-slash" : "isax-eye"
                      }`}
                    />
                  </div>
                  <div
                    id="passwordStrength"
                    style={{ display: "flex" }}
                    className={`password-strength ${
                      strength === "poor"
                        ? "poor-active"
                        : strength === "weak"
                        ? "avg-active"
                        : strength === "strong"
                        ? "strong-active"
                        : strength === "heavy"
                        ? "heavy-active"
                        : ""
                    }`}
                  >
                    <span id="poor" className="active"></span>
                    <span id="weak" className="active"></span>
                    <span id="strong" className="active"></span>
                    <span id="heavy" className="active"></span>
                  </div>
                  <div id="passwordInfo">{messages()}</div>
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">
                    Confirmar Senha <span className="text-danger"> *</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={eyeConfirmPassword ? "password" : "text"}
                      className="pass-inputa form-control form-control-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      className={`isax toggle-passworda ${
                        eyeConfirmPassword ? "isax-eye-slash" : "isax-eye"
                      } text-gray-7 fs-14`}
                      onClick={() => setEyeConfirmPassword((prev) => !prev)}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="remember-me d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label mb-0 d-inline-flex remember-me fs-14"
                      htmlFor="flexCheckDefault"
                    >
                      Concordo com{" "}
                      <Link to={route.termsConditions} className="link-2 mx-2">
                        Termos de Serviço
                      </Link>{" "}
                      e{" "}
                      <Link to={route.privacyPolicy} className="link-2 mx-2">
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="d-flex justify-content-between">
              {step > 1 && (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={prevStep}
                >
                  Voltar
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={nextStep}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Enviando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="fs-14 fw-normal d-flex align-items-center justify-content-center">
            Já tem uma conta?
            <Link to={route.login} className="link-2 ms-1">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWizard;