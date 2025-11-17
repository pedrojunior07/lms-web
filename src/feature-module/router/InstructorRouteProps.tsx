import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../core/common/context/AuthContextType";

interface InstructorRouteProps {
  children: React.ReactNode; // mais flexível que JSX.Element
}

const InstructorRoute: React.FC<InstructorRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "ROLE_INSTRUCTOR") {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>; // pode envolver em fragmento para flexibilidade
};

export default InstructorRoute;
