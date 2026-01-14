import { useState } from "react";
import { API_BASE_URL } from "../../../core/api/axios";
import InstructorSidebar from "../common/instructorSidebar";
import ProfileCard from "../common/profileCard";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";

interface ApiStatus {
  endpoint: string;
  status: "loading" | "success" | "error" | "idle";
  message?: string;
  responseTime?: number;
  data?: any;
}

const InstructorApiTester = () => {
  const [apiTests, setApiTests] = useState<ApiStatus[]>([
    {
      endpoint: "/mpesa/c2b/payment",
      status: "idle",
    },
    {
      endpoint: "/mpesa/b2c/payment",
      status: "idle",
    },
    {
      endpoint: "/mpesa/transaction/status",
      status: "idle",
    },
  ]);

  const [testData, setTestData] = useState({
    phoneNumber: "258843219876",
    amount: 100,
    reference: "ORDER123",
    description: "Pagamento de teste",
    transactionId: "",
    apiKey: "test-api-key",
  });

  const [backendStatus, setBackendStatus] = useState<{
    status: "loading" | "success" | "error" | "idle";
    message: string;
  }>({ status: "idle", message: "" });

  const [selectedApi, setSelectedApi] = useState<"elearning" | "pay">("pay");

  const apiEndpoints = {
    elearning: API_BASE_URL,
    pay: "http://localhost:8089",
  };

  const elearningHost = (() => {
    try {
      return new URL(API_BASE_URL).host;
    } catch {
      return API_BASE_URL;
    }
  })();

  const apiBaseUrl = apiEndpoints[selectedApi];

  const captureTransactionData = (data: any) => {
    const transactionIdFromResponse = data?.data?.transactionID || data?.data?.conversationID;
    const thirdPartyReference = data?.data?.thirdPartyReference;

    if (transactionIdFromResponse || thirdPartyReference) {
      setTestData((prev) => ({
        ...prev,
        transactionId: transactionIdFromResponse || prev.transactionId,
        reference: thirdPartyReference || prev.reference,
      }));
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await fetch(`${apiEndpoints.pay}/api/test/generate-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setTestData({ ...testData, apiKey: data.apiKey });
        alert(`API Key gerada com sucesso!\nExpira em: ${data.expiresAt}`);
      } else {
        alert("Erro ao gerar API Key");
      }
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const testBackendConnection = async () => {
    setBackendStatus({ status: "loading", message: "Testando..." });
    const startTime = Date.now();

    try {
      // Usa endpoints diferentes dependendo da API selecionada
      const testEndpoint = selectedApi === "elearning"
        ? `${apiBaseUrl}/categories?page=0&size=1`
        : `${apiBaseUrl}/swagger-ui.html`;

      const response = await fetch(testEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(selectedApi === "elearning" && {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          }),
        },
      });

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        setBackendStatus({
          status: "success",
          message: `Backend ${selectedApi === "pay" ? "Pay" : "E-Learning"} conectado! (${responseTime}ms)`,
        });
      } else {
        setBackendStatus({
          status: "error",
          message: `Backend respondeu com erro: ${response.status}`,
        });
      }
    } catch (error: any) {
      setBackendStatus({
        status: "error",
        message: `Erro ao conectar: ${error.message}`,
      });
    }
  };

  const testMpesaC2B = async () => {
    updateApiStatus("/mpesa/c2b/payment", "loading");
    const startTime = Date.now();

    try {
      const { phoneNumber, amount, reference, description } = testData;

      // Estrutura diferente dependendo da API
      let url: string;
      let requestBody: any;
      let headers: any;

      if (selectedApi === "pay") {
        // Pay API estrutura
        url = `${apiBaseUrl}/api/payments`;
        requestBody = {
          amount: amount,
          currency: "MZN",
          externalId: reference,
          method: {
            type: "MPESA",
            phone: phoneNumber,
          },
          callback: `http://localhost:3000/payment-callback`,
        };
        headers = {
          "Content-Type": "application/json",
          "X-API-KEY": testData.apiKey,
        };
      } else {
        // E-Learning API estrutura
        url = `${apiBaseUrl}/mpesa/c2b/payment`;
        requestBody = { phoneNumber, amount, reference, description };
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        captureTransactionData(data);
        updateApiStatus("/mpesa/c2b/payment", "success", "Teste bem-sucedido!", responseTime, data);
      } else {
        updateApiStatus(
          "/mpesa/c2b/payment",
          "error",
          `Erro: ${data.message || response.statusText}`,
          responseTime,
          data
        );
      }
    } catch (error: any) {
      updateApiStatus("/mpesa/c2b/payment", "error", `Erro: ${error.message}`);
    }
  };

  const testMpesaB2C = async () => {
    updateApiStatus("/mpesa/b2c/payment", "loading");
    const startTime = Date.now();

    try {
      const { phoneNumber, amount, reference, description } = testData;
      const response = await fetch(`${apiBaseUrl}/mpesa/b2c/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ phoneNumber, amount, reference, description }),
      });

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        captureTransactionData(data);
        updateApiStatus("/mpesa/b2c/payment", "success", "Teste bem-sucedido!", responseTime, data);
      } else {
        updateApiStatus(
          "/mpesa/b2c/payment",
          "error",
          `Erro: ${data.message || response.statusText}`,
          responseTime,
          data
        );
      }
    } catch (error: any) {
      updateApiStatus("/mpesa/b2c/payment", "error", `Erro: ${error.message}`);
    }
  };

  const testTransactionStatus = async () => {
    updateApiStatus("/mpesa/transaction/status", "loading");
    const startTime = Date.now();

    try {
      const transactionId = testData.transactionId || testData.reference;
      const response = await fetch(
        `${apiBaseUrl}/mpesa/transaction/status?transactionID=${encodeURIComponent(
          transactionId
        )}&thirdPartyReference=${encodeURIComponent(testData.reference)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      const responseTime = Date.now() - startTime;
      const data = await response.json();

      if (response.ok) {
        updateApiStatus(
          "/mpesa/transaction/status",
          "success",
          "Consulta bem-sucedida!",
          responseTime,
          data
        );
      } else {
        updateApiStatus(
          "/mpesa/transaction/status",
          "error",
          `Erro: ${data.message || response.statusText}`,
          responseTime,
          data
        );
      }
    } catch (error: any) {
      updateApiStatus("/mpesa/transaction/status", "error", `Erro: ${error.message}`);
    }
  };

  const updateApiStatus = (
    endpoint: string,
    status: "loading" | "success" | "error" | "idle",
    message?: string,
    responseTime?: number,
    data?: any
  ) => {
    setApiTests((prev) =>
      prev.map((test) =>
        test.endpoint === endpoint ? { ...test, status, message, responseTime, data } : test
      )
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "success":
        return "badge bg-success";
      case "error":
        return "badge bg-danger";
      case "loading":
        return "badge bg-warning";
      default:
        return "badge bg-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "[OK]";
      case "error":
        return "[X]";
      case "loading":
        return "[...]";
      default:
        return "[-]";
    }
  };

  const renderStatusPill = (endpoint: string) => {
    const entry = apiTests.find((t) => t.endpoint === endpoint);
    return (
      <span className={getStatusBadgeClass(entry?.status || "idle")}>
        {getStatusIcon(entry?.status || "idle")} {entry?.status || "idle"}
      </span>
    );
  };

  const renderResponseMeta = (endpoint: string) => {
    const entry = apiTests.find((t) => t.endpoint === endpoint);
    return (
      <>
        <p className="mb-1 small text-muted">
          Tempo: {entry?.responseTime ? `${entry.responseTime}ms` : "-"}
        </p>
        <p className="mb-1 small text-muted">Msg: {entry?.message ? entry.message : "-"}</p>
      </>
    );
  };

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />

          <div className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />

            <div className="col-lg-12">
              {/* Seletor de API */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Selecionar API para Teste</h5>
                </div>
                <div className="card-body">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${selectedApi === "pay" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setSelectedApi("pay")}
                    >
                      <strong>Pay API (Local)</strong>
                      <br />
                      <small>localhost:8089</small>
                    </button>
                    <button
                      type="button"
                      className={`btn ${selectedApi === "elearning" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setSelectedApi("elearning")}
                    >
                      <strong>E-Learning API (Produção)</strong>
                      <br />
                      <small>{elearningHost}</small>
                    </button>
                  </div>
                  <div className="alert alert-info mt-3 mb-0">
                    <strong>API Selecionada:</strong> {apiBaseUrl}
                  </div>
                </div>
              </div>

              {/* Visao geral do backend */}
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title mb-1">Status do Backend</h5>
                    <p className="mb-0 text-muted small">{apiBaseUrl}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={testBackendConnection}
                    disabled={backendStatus.status === "loading"}
                  >
                    {backendStatus.status === "loading" ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Testando...
                      </>
                    ) : (
                      "Testar conexao"
                    )}
                  </button>
                </div>
                <div className="card-body">
                  <span className={getStatusBadgeClass(backendStatus.status)}>
                    {backendStatus.message || "Nao testado"}
                  </span>
                  <p className="mt-2 mb-0 text-muted small">
                    Usa token armazenado em localStorage (Bearer) nas chamadas.
                  </p>
                </div>
              </div>

              {/* Dados base do teste */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Dados de Simulacao</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Numero de Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={testData.phoneNumber}
                        onChange={(e) => setTestData({ ...testData, phoneNumber: e.target.value })}
                        placeholder="258843219876"
                      />
                      <small className="text-muted">
                        Aceita 25884..., 84... ou 84-xxx-xxxx (limpo automaticamente).
                      </small>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Valor (MZN)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={testData.amount}
                        onChange={(e) => setTestData({ ...testData, amount: Number(e.target.value) })}
                        min={1}
                        step={1}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Referencia</label>
                      <input
                        type="text"
                        className="form-control"
                        value={testData.reference}
                        onChange={(e) => setTestData({ ...testData, reference: e.target.value })}
                        placeholder="ORDER123"
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Descricao</label>
                      <input
                        type="text"
                        className="form-control"
                        value={testData.description}
                        onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                        placeholder="Pagamento de curso"
                      />
                    </div>
                    {selectedApi === "pay" && (
                      <div className="col-md-12 mb-3">
                        <label className="form-label">API Key (Pay Gateway)</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={testData.apiKey}
                            onChange={(e) => setTestData({ ...testData, apiKey: e.target.value })}
                            placeholder="test-api-key"
                          />
                          <button
                            className="btn btn-success"
                            type="button"
                            onClick={generateApiKey}
                          >
                            Gerar Nova Key
                          </button>
                        </div>
                        <small className="text-muted">
                          Chave de autenticação para Pay API (header X-API-KEY). Clique em "Gerar Nova Key" para criar automaticamente.
                        </small>
                      </div>
                    )}
                    <div className="col-md-6 mb-0">
                      <label className="form-label">Transaction ID (para status)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={testData.transactionId}
                        onChange={(e) => setTestData({ ...testData, transactionId: e.target.value })}
                        placeholder="MPESA123456 ou AG_xxx"
                      />
                      <small className="text-muted">
                        Preenchido automaticamente quando a API retorna transactionID/conversationID.
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco de simulacao de pagamentos */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Simular Pagamentos</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 border rounded h-100">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div>
                            <h6 className="mb-1">Cliente paga (C2B)</h6>
                            <code className="small">/mpesa/c2b/payment</code>
                          </div>
                          {renderStatusPill("/mpesa/c2b/payment")}
                        </div>
                        {renderResponseMeta("/mpesa/c2b/payment")}
                        <button
                          className="btn btn-primary w-100 mt-3"
                          onClick={testMpesaC2B}
                          disabled={
                            apiTests.find((t) => t.endpoint === "/mpesa/c2b/payment")?.status ===
                            "loading"
                          }
                        >
                          {apiTests.find((t) => t.endpoint === "/mpesa/c2b/payment")?.status ===
                          "loading" ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Enviando C2B...
                            </>
                          ) : (
                            "Simular pagamento C2B"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="p-3 border rounded h-100">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div>
                            <h6 className="mb-1">Empresa paga cliente (B2C)</h6>
                            <code className="small">/mpesa/b2c/payment</code>
                          </div>
                          {renderStatusPill("/mpesa/b2c/payment")}
                        </div>
                        {renderResponseMeta("/mpesa/b2c/payment")}
                        <button
                          className="btn btn-secondary w-100 mt-3"
                          onClick={testMpesaB2C}
                          disabled={
                            apiTests.find((t) => t.endpoint === "/mpesa/b2c/payment")?.status ===
                            "loading"
                          }
                        >
                          {apiTests.find((t) => t.endpoint === "/mpesa/b2c/payment")?.status ===
                          "loading" ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Enviando B2C...
                            </>
                          ) : (
                            "Simular pagamento B2C"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco de status */}
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="card-title mb-1">Consultar Status</h5>
                    <code className="small">/mpesa/transaction/status</code>
                  </div>
                  {renderStatusPill("/mpesa/transaction/status")}
                </div>
                <div className="card-body">
                  <div className="row align-items-end">
                    <div className="col-md-8 mb-3">
                      <label className="form-label">Transaction ID ou Reference</label>
                      <input
                        type="text"
                        className="form-control"
                        value={testData.transactionId || testData.reference}
                        onChange={(e) => setTestData({ ...testData, transactionId: e.target.value })}
                        placeholder="MPESA123456"
                      />
                      <small className="text-muted">
                        Usa transactionID e thirdPartyReference enviados/retornados no pagamento.
                      </small>
                    </div>
                    <div className="col-md-4 mb-3 text-md-end">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={testTransactionStatus}
                        disabled={
                          apiTests.find((t) => t.endpoint === "/mpesa/transaction/status")
                            ?.status === "loading"
                        }
                      >
                        {apiTests.find((t) => t.endpoint === "/mpesa/transaction/status")
                          ?.status === "loading" ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Consultando...
                          </>
                        ) : (
                          "Consultar status"
                        )}
                      </button>
                      <div className="mt-2">{renderResponseMeta("/mpesa/transaction/status")}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* JSON bruto */}
              {apiTests.some((test) => test.data) && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">JSON bruto da ultima resposta</h5>
                  </div>
                  <div className="card-body">
                    <pre className="bg-light p-3 rounded mb-0">
                      {JSON.stringify(apiTests.find((test) => test.data)?.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorApiTester;
