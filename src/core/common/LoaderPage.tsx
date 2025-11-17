// LoaderPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona após 3 segundos
    const timer = setTimeout(() => {
      navigate("/index-4"); // Coloque aqui a rota de destino
    }, 3000);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
      <p>Carregando...</p>
    </div>
  );
}

// Estilos simples inline
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  loader: {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #3498db",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1s linear infinite",
  },
};

// Adicione este CSS global ou no arquivo CSS do projeto
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
