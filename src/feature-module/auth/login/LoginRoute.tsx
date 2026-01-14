import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../../../core/api/axios";

import Login from "./login";
import { useAuth } from "../../../core/common/context/AuthContextType";
import { all_routes } from "../../router/all_routes";

const LoginRoute = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const routes = all_routes;

  const location = useLocation();
  const { login } = useAuth();
  // Pega a página de origem (callback) se existir
  const from = (location.state as { from?: string })?.from || null;

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password }
      );

      const { data } = response;
      const userData = {
        token: data.data.token,
        id: data.data.id,
        role: data.data.role,
        email: data.data.email,
      };

      localStorage.setItem("token", userData.token);
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      await login(user, data.data.token);
      localStorage.setItem("id", userData.id);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("user", user);

      toast.success("Login realizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      if (from) {
        navigate(from);
      } else if (userData.role === "ROLE_INSTRUCTOR") {
        navigate(routes.instructorDashboard);
      } else {
        navigate(routes.studentProfile);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Falha no login. Verifique suas credenciais.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginRoute;
