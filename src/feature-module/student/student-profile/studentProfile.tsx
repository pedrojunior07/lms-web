import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import StudentSidebar from "../common/studentSidebar";

const StudentProfile = () => {
  const route = all_routes;

  // Recupera os dados do usuário do localStorage
  const getUserData = () => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const role = localStorage.getItem('role')
    const email = localStorage.getItem('email')
    const user = localStorage.getItem('user')

    return {
      token,
      id,
      role,
      email,
      user: user ? JSON.parse(user) : null
    }
  }

  const userData = getUserData()

  // Formata o role para exibição
  const formatRole = (role: string | null) => {
    if (!role) return 'Usuário'
    return role.replace('ROLE_', '').toLowerCase()
  }

  // Nome do usuário
  const getUserName = () => {
    if (userData.user && userData.user.name) {
      return userData.user.name
    }
    if (userData.user && userData.user.firstName) {
      return `${userData.user.firstName} ${userData.user.lastName || ''}`
    }
    return userData.email || 'Usuário'
  }

  // Foto do perfil
  const getProfilePhoto = () => {
    if (userData.user && userData.user.photo) {
      return userData.user.photo
    }
    return 'assets/img/user/user-02.jpg'
  }

  // Informações do perfil (ajuste conforme sua estrutura de dados)
  const getUserProfileInfo = () => {
    if (userData.user) {
      return {
        firstName: userData.user.firstName || 'Pedro',
        lastName: userData.user.lastName || 'Manjate',
        userName: userData.user.userName || 'studentdemo',
        phoneNumber: userData.user.phoneNumber || '90154-91036',
        email: userData.user.email || userData.email,
        gender: userData.user.gender || 'Male',
        dob: userData.user.dob || '16 Jan 2003',
        age: userData.user.age || '24',
        bio: userData.user.bio || 'Hello! I\'m Ronald Richard. I\'m passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor. In my free time, I enjoy coding, reading, hiking etc.',
        registrationDate: userData.user.createdAt || '16 Jan 2024, 11:15 AM'
      }
    }
    
    // Fallback para dados padrão
    return {
      firstName: 'Pedro',
      lastName: 'Manjate',
      userName: 'heisenbeg',
      phoneNumber: '874381448',
      email: userData.email || 'studentdemo@example.com',
      gender: 'Male',
      dob: '16 Jan 2003',
      age: '24',
      bio: 'Hello! I\'m Pedro Manjate. I\'m passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor. In my free time, I enjoy coding, reading, hiking etc.',
      registrationDate: '16 out 2025, 11:15 AM'
    }
  }

  const profileInfo = getUserProfileInfo()

  return (
    <>
      <Breadcrumb title="Meu Perfil" />

      <div className="content">
        <div className="container">
          {/* profile box */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-12">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath src={getProfilePhoto()} alt={getUserName()} />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      {getUserName()}
                      <Link
                        to={route.studentProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">{formatRole(userData.role)}</p>
                    <p className="text-light small">{userData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar/>
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Meu Perfil</h5>
                <Link to="#" className="edit-profile-icon">
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
                        <span>{profileInfo.firstName}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Último Nome</h6>
                        <span>{profileInfo.lastName}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Data de Registro</h6>
                        <span>{profileInfo.registrationDate}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Nome de Usuário</h6>
                        <span>{profileInfo.userName}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Telefone</h6>
                        <span>{profileInfo.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Email</h6>
                        <span>{profileInfo.email}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Gênero</h6>
                        <span>{profileInfo.gender}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Data de Nascimento</h6>
                        <span>{profileInfo.dob}</span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <h6>Idade</h6>
                        <span>{profileInfo.age}</span>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div>
                        <h6>Bio</h6>
                        <span>
                          {profileInfo.bio}
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