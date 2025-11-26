import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { useStudent } from '../../../core/api/hooks/useStudents'

const avatarFallbackStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.25rem',
  borderRadius: 'inherit',
  textTransform: 'uppercase',
};

const getInitials = (name?: string) => {
  if (!name) return 'ST';
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) {
    return 'ST';
  }
  const [first, second] = parts;
  return `${first.charAt(0)}${second ? second.charAt(0) : ''}`.toUpperCase();
};

const ProfileCard = () => {
  const { getStudentById } = useStudent();
  const [studentData, setStudentData] = useState<any>(null);

  const studentId = localStorage.getItem('id');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;

      try {
        const response = await getStudentById(Number(studentId));
        const data = response?.data ?? response;
        setStudentData(data);
      } catch (err: any) {
        console.error("Erro ao carregar dados do estudante:", err);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Formata o role para exibição
  const formatRole = (role: string | null) => {
    if (!role) return 'Usuário';
    return role.replace('ROLE_', '').charAt(0).toUpperCase() + role.replace('ROLE_', '').slice(1).toLowerCase();
  };

  // Nome do usuário
  const getUserName = () => {
    if (!studentData) return email || 'Usuário';

    if (studentData.fullName) return studentData.fullName;
    if (studentData.name) return studentData.name;
    if (studentData.firstName) {
      return `${studentData.firstName} ${studentData.lastName || ''}`.trim();
    }
    return studentData.email || email || 'Usuário';
  };

  // Foto do perfil
  const getProfilePhoto = () => {
    if (studentData?.photoUrl) return studentData.photoUrl;
    if (studentData?.profilePicture) return studentData.profilePicture;
    if (studentData?.avatarUrl) return studentData.avatarUrl;
    if (studentData?.photo) return studentData.photo;
    return null;
  };

  const profilePhoto = getProfilePhoto();
  const displayName = getUserName();
  const initials = getInitials(displayName);

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
              {profilePhoto ? (
                <ImageWithBasePath src={profilePhoto} alt={displayName} />
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
                  to={all_routes.studentSettings}
                  className="link-light fs-16 ms-2"
                >
                  <i className="isax isax-edit-2" />
                </Link>
              </h5>
              <p className="text-light">{formatRole(role)}</p>
              <p className="text-light small">{studentData?.email || email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard