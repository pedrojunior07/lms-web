import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import StudentSidebar from "../common/studentSidebar";
import { useStudent } from "../../../core/api/hooks/useStudents";
import ProfileCard from "../common/profileCard";

const StudentProfile = () => {
  const route = all_routes;
  const { getStudentById } = useStudent();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recupera o ID do localStorage
  const studentId = localStorage.getItem('id');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setError("ID do estudante não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getStudentById(Number(studentId));
        const data = response?.data ?? response;
        setStudentData(data);
        setError("");
      } catch (err: any) {
        console.error("Erro ao carregar dados do estudante:", err);
        setError("Não foi possível carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Formata data
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Calcula idade
  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    } catch {
      return 'N/A';
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Breadcrumb title="Meu Perfil" />
        <div className="content">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <div className="mt-2">Carregando dados do perfil...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Breadcrumb title="Meu Perfil" />
        <div className="content">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Meu Perfil" />

      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* sidebar */}
            <StudentSidebar/>
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Meu Perfil</h5>
                <Link to={route.studentSettings} className="edit-profile-icon">
                  <i className="isax isax-edit-2" />
                </Link>
              </div>
              <div className="card mb-0">
                <div className="card-body">
                  <h6 className="fs-18 page-title fw-bold">
                    Informações Básicas
                  </h6>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Primeiro Nome</h6>
                        <span>{studentData?.firstName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Último Nome</h6>
                        <span>{studentData?.lastName || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Data de Registro</h6>
                        <span>{formatDate(studentData?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Nome de Usuário</h6>
                        <span>{studentData?.userName || studentData?.username || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Telefone</h6>
                        <span>{studentData?.phoneNumber || studentData?.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Email</h6>
                        <span>{studentData?.email || email || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Gênero</h6>
                        <span>{studentData?.gender || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Data de Nascimento</h6>
                        <span>{studentData?.dob ? formatDate(studentData.dob) : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Idade</h6>
                        <span>{studentData?.dob ? calculateAge(studentData.dob) : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div>
                        <h6>Bio</h6>
                        <span>
                          {studentData?.bio || 'Nenhuma biografia adicionada ainda.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;