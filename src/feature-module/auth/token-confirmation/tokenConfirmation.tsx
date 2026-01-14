import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../core/api/axios";

/**
 * Tela de confirmação de registro.
 * Ao acessar /confirm?token=SEU_TOKEN o componente:
 *  1. Extrai o token do parâmetro de query.
 *  2. Envia GET /registrationConfirm?token=TOKEN para o backend.
 *  3. Mostra feedback de carregamento, sucesso ou erro.
 */
const TokenConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg("Token não encontrado na URL.");
      setLoading(false);
      return;
    }

    /**
     * É recomendável configurar axios.defaults.baseURL com a URL do seu backend
     * em um único ponto da aplicação.
     */
    axios
      .get(`${API_BASE_URL}/auth/registrationConfirm`, {
        params: { token },
      })
      .then((response) => {
        // Supondo structure { status:"success", message:"..." }
        const message = response.data?.message || "Conta ativada com sucesso!";
        setSuccessMsg(message);
      })
      .catch((error) => {
        // Tenta extrair mensagem personalizada do backend
        const msg =
          error.response?.data?.message ||
          error.response?.data?.data ||
          "Falha ao ativar a conta.";
        setErrorMsg(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div
      className="container main-wrapper d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status" />
          <p className="mt-3">Validando token…</p>
        </div>
      )}

      {!loading && successMsg && (
        <div className="card p-4 text-center">
          <h3 className="mb-3">🎉 {successMsg}</h3>
          <p>Sua conta foi ativada! Agora você pode fazer login.</p>
          <Link to="/login" className="btn btn-primary">
            Ir para Login
          </Link>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="card p-4 text-center">
          <h3 className="mb-3 text-danger">Ops!</h3>
          <p>{errorMsg}</p>
          <Link to="/resend-token" className="btn btn-link">
            Reenviar e‑mail de confirmação
          </Link>
        </div>
      )}
    </div>
  );
};

export default TokenConfirmation;
