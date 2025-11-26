import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { usePerson } from "../../../core/api/hooks/useUserApi"; // Use o caminho correto

const avatarFallbackStyles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "#fff",
  fontWeight: 600,
  fontSize: "1.25rem",
  borderRadius: "inherit",
  textTransform: "uppercase",
};

const getInitials = (name?: string) => {
  if (!name) {
    return "IN";
  }
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) {
    return "IN";
  }
  const [first, second] = parts;
  return `${first.charAt(0)}${second ? second.charAt(0) : ""}`.toUpperCase();
};

const resolveDisplayName = (instructor?: any) => {
  if (!instructor) {
    return "Instrutor";
  }
  if (instructor.fullName) {
    return instructor.fullName;
  }
  const firstName = instructor.firstName || "Instrutor";
  const lastName = instructor.lastName || "";
  return `${firstName} ${lastName}`.trim();
};

const resolveAvatarSrc = (instructor?: any) => {
  if (!instructor) {
    return "";
  }
  return (
    instructor.photoUrl ||
    instructor.profilePicture ||
    instructor.avatarUrl ||
    instructor.imageUrl ||
    instructor.photo ||
    ""
  );
};

const ProfileCard = () => {
  const { getUser } = usePerson();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => resolveDisplayName(instructor), [instructor]);
  const avatarSrc = useMemo(() => resolveAvatarSrc(instructor), [instructor]);
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);

        // Pegar o ID do localStorage
        const instructorId = localStorage.getItem("id");

        if (!instructorId) {
          console.error("ID do instrutor não encontrado no localStorage");
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await getUser(Number(instructorId));
        setInstructor(data);
      } catch (error: any) {
        console.error("Erro ao carregar dados do instrutor:", error);

        // Se o erro for 500 ou 404, redirecionar para o login
        if (error?.response?.status === 500 || error?.response?.status === 404) {
          console.log("Instrutor não encontrado. Limpando sessão e redirecionando...");
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Erro ao carregar perfil");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [navigate]);

  if (loading) {
    return <div className="instructor-profile">Carregando...</div>;
  }

  if (error) {
    return <div className="instructor-profile">{error}</div>;
  }

  return (
    <div className="instructor-profile">
      <div className="instructor-profile-bg">
        <ImageWithBasePath
          src="assets/img/bg/card-bg-01.png"
          className="instructor-profile-bg-1"
          alt="Fundo"
        />
      </div>
      <div className="row align-items-center row-gap-3">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <span className="avatar flex-shrink-0 avatar-xxl avatar-rounded me-3 border border-white border-3 position-relative">
              {avatarSrc ? (
                <ImageWithBasePath src={avatarSrc} alt={displayName} />
              ) : (
                <span style={avatarFallbackStyles}>{initials}</span>
              )}
              <span className="verify-tick">
                <i className="isax isax-verify5" />
              </span>
            </span>
            <div>
              <h5 className="mb-1 text-white d-inline-flex align-items-center">
                {displayName}
                <Link
                  to={all_routes.instructorProfile}
                  className="link-light fs-16 ms-2"
                >
                  <i className="isax isax-edit-2" />
                </Link>
              </h5>
              <p className="text-light">Instrutor</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center flex-wrap gap-3 justify-content-md-end">
            <Link
              to={all_routes.addNewCourse}
              className="btn btn-white rounded-pill"
            >
              Adicionar Curso
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;