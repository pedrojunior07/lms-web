import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { usePerson } from "../../../core/api/hooks/useUserApi"; // Use o caminho correto

const ProfileCard = () => {
  const { getUser } = usePerson();
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const data = await getUser(6); // Use o ID 6 que funciona
        setInstructor(data);
      } catch (error) {
        console.error("Erro ao carregar dados do instrutor:", error);
        setError("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, []);

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
              <ImageWithBasePath
                src="assets/img/user/user-01.jpg"
                alt="Imagem de perfil"
              />
              <span className="verify-tick">
                <i className="isax isax-verify5" />
              </span>
            </span>
            <div>
              <h5 className="mb-1 text-white d-inline-flex align-items-center">
                {instructor
                  ? `${instructor.firstName} ${instructor.lastName}`
                  : "Carregando..."}
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