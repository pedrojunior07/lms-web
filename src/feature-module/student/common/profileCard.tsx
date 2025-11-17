import React from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'

const ProfileCard = () => {
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

  // Nome do usuário (você pode ajustar conforme sua estrutura de dados)
  const getUserName = () => {
    if (userData.user && userData.user.name) {
      return userData.user.name
    }
    if (userData.user && userData.user.firstName) {
      return `${userData.user.firstName} ${userData.user.lastName || ''}`
    }
    return userData.email || 'Usuário'
  }

  // Foto do perfil (ajuste conforme sua aplicação)
  const getProfilePhoto = () => {
    if (userData.user && userData.user.photo) {
      return userData.user.photo
    }
    return 'assets/img/user/user-02.jpg' // foto padrão
  }

  return (
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
                <Link to={all_routes.studentsDetails}>{getUserName()}</Link>
                <Link
                  to={all_routes.studentProfile}
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
  )
}

export default ProfileCard