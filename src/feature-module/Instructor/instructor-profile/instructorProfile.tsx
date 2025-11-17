import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import { Link } from "react-router-dom";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { usePerson } from "../../../core/api/hooks/useUserApi";
import { useAuth } from "../../../core/common/context/AuthContextType";

const InstructorProfile = () => {
  const { getUser } = usePerson();

  const [instructor, setInstructor] = useState<any>(null);
  const { isAuthenticated, logout } = useAuth();
  useEffect(() => {
    const id = localStorage.getItem("id");
    const fetchUser = async () => {
      try {
        const data = await getUser(id);
        setInstructor(data);
      } catch (error) {
        console.error("Erro ao buscar instrutor", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />
        <div className="d-flex layout-body content">
          <InstructorSidebar />
          <div className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />

            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Meu Perfil</h5>
                <Link to="#" className="edit-profile-icon">
                  <i className="isax isax-edit-2" />
                </Link>
              </div>

              {/* INFORMAÇÕES BÁSICAS */}
              <div className="card">
                <div className="card-body">
                  <h5 className="fs-18 pb-3 border-bottom mb-3">
                    Informações Básicas
                  </h5>
                  {instructor ? (
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <h6>Nome</h6>
                        <span>{instructor.firstName}</span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Sobrenome</h6>
                        <span>{instructor.lastName}</span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Nome de Usuário</h6>
                        <span>{instructor.userName}</span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Telefone</h6>
                        <span>{instructor.phoneNumber}</span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Email</h6>
                        <span>{instructor.email}</span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Gênero</h6>
                        <span>
                          {instructor.gender === "F"
                            ? "Feminino"
                            : instructor.gender === "M"
                            ? "Masculino"
                            : "Outro"}
                        </span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Data de Nascimento</h6>
                        <span>
                          {instructor.dob
                            ? new Date(instructor.dob).toLocaleDateString(
                                "pt-BR"
                              )
                            : "Não informado"}
                        </span>
                      </div>
                      <div className="col-md-4 mb-3">
                        <h6>Idade</h6>
                        <span>—</span>
                      </div>
                      <div className="col-md-12 mb-3">
                        <h6>Biografia</h6>
                        <span>{instructor.bio}</span>
                      </div>
                    </div>
                  ) : (
                    <p>Carregando informações...</p>
                  )}
                </div>
              </div>

              {/* FORMAÇÃO (Estática) */}
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="fs-18 pb-3 border-bottom mb-3">Formação</h5>
                  <div className="education-flow">
                    <div className="ps-4 pb-3 timeline-flow">
                      <h6 className="mb-1">
                        BCA - Bacharel em Aplicações de Computador
                      </h6>
                      <p>Universidade Internacional - (2004 - 2010)</p>
                    </div>
                    <div className="ps-4 pb-3 timeline-flow">
                      <h6 className="mb-1">
                        MCA - Mestrado em Aplicações de Computador
                      </h6>
                      <p>Universidade Internacional - (2010 - 2012)</p>
                    </div>
                    <div className="ps-4 pb-0 timeline-flow">
                      <h6 className="mb-1">Design de Comunicação Visual</h6>
                      <p>Universidade Internacional - (2012 - 2015)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPERIÊNCIA (da API) */}
              <div className="card mt-4 mb-0">
                <div className="card-body">
                  <h5 className="fs-18 pb-3 border-bottom mb-3">Experiência</h5>
                  {instructor?.experiences?.length > 0 ? (
                    instructor.experiences.map((exp: any, idx: number) => (
                      <div key={idx} className="d-flex align-items-center mb-4">
                        <span className="bg-light border avatar avatar-lg text-gray-9 flex-shrink-0 me-3">
                          <i className="isax isax-briefcase fw-bold" />
                        </span>
                        <div>
                          <h6 className="mb-1">{exp.jobTitle}</h6>
                          <p>
                            {exp.company} - (
                            {new Date(exp.startDate).toLocaleDateString(
                              "pt-BR",
                              {
                                year: "numeric",
                                month: "short",
                              }
                            )}{" "}
                            até{" "}
                            {exp.current || !exp.endDate
                              ? "presente"
                              : new Date(exp.endDate).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    year: "numeric",
                                    month: "short",
                                  }
                                )}
                            )
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Nenhuma experiência cadastrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorProfile;
