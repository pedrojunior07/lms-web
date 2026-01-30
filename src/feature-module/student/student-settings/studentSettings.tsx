import React, { useEffect, useMemo, useState } from "react";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import StudentSidebar from "../common/studentSidebar";
import { Link } from "react-router-dom";
import SettingsLinks from "./settingsLinks/settingsLinks";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CustomSelect from "../../../core/common/commonSelect";
import { Gender } from "../../../core/common/selectOption/json/selectOption";
import { DatePicker } from "antd";
import SettingsModal from "./settingsModal/settingsModal";
import dayjs from "dayjs";
import { useStudent } from "../../../core/api/hooks/useStudents";

const StudentSettings = () => {
  const route = all_routes;
  const { getStudentById } = useStudent();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    bio: "",
    avatar: "",
  });

  const getModalContainer = () => {
    const modalElement = document.getElementById("add_assignment");
    return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
  };

  useEffect(() => {
    let isMounted = true;
    const loadStudent = async () => {
      const id = Number(localStorage.getItem("id") || localStorage.getItem("userId") || 0);
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await getStudentById(id);
        const data = response?.data ?? response;
        if (!isMounted) return;
        setStudent(data || null);
        setFormData({
          firstName: data?.firstName || data?.name?.split(" ")?.[0] || "",
          lastName:
            data?.lastName ||
            (data?.name ? data.name.split(" ").slice(1).join(" ") : ""),
          userName: data?.userName || data?.username || "",
          phoneNumber: data?.phoneNumber || data?.phone || "",
          gender: data?.gender || "",
          dob: data?.dob || data?.dateOfBirth || "",
          bio: data?.bio || data?.about || data?.description || "",
          avatar:
            data?.avatar ||
            data?.photoUrl ||
            data?.profilePicture ||
            data?.imageUrl ||
            "",
        });
      } catch (error) {
        console.error("Erro ao carregar estudante:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStudent();
    return () => {
      isMounted = false;
    };
  }, [getStudentById]);

  const initials = useMemo(() => {
    const base =
      formData.firstName ||
      formData.userName ||
      student?.email ||
      "S";
    const parts = base.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [formData.firstName, formData.userName, student?.email]);

  const genderValue = useMemo(() => {
    if (!formData.gender) return undefined;
    const match = Gender.find(
      (g) => String(g.value).toLowerCase() === String(formData.gender).toLowerCase()
    );
    return match ? { value: match.value, label: match.label } : undefined;
  }, [formData.gender]);

  return (
    <>
      <Breadcrumb title="Configurações" />
      <div className="content">
        <div className="container">
          {/* profile box */}
          <ProfileCard />
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="mb-3">
                <h5>Configurações</h5>
              </div>
              <SettingsLinks />
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : (
                  <form>
                    <div className="profile-upload-group">
                      <div className="d-flex align-items-center">
                        <Link
                          to={route.studentProfile}
                          className="avatar flex-shrink-0 avatar-xxxl avatar-rounded border me-3"
                        >
                          {formData.avatar ? (
                            <ImageWithBasePath
                              src={formData.avatar}
                              alt="Img"
                              className="img-fluid"
                            />
                          ) : (
                            <span className="d-flex align-items-center justify-content-center w-100 h-100 bg-light text-secondary fw-bold fs-3">
                              {initials}
                            </span>
                          )}
                        </Link>
                        <div className="profile-upload-head">
                          <h6>
                            <Link to={route.studentProfile}>Foto de Perfil</Link>
                          </h6>
                          <p className="fs-14 mb-0">
                            PNG ou JPG com no mÃ¡ximo 800px de largura e altura
                          </p>
                          <div className="new-employee-field">
                            <div className="d-flex align-items-center mt-2">
                              <div className="image-upload position-relative mb-0 me-2">
                                <input type="file" />
                                <Link
                                  to="#"
                                  className="btn bg-gray-100 btn-sm rounded-pill image-uploads"
                                >
                                  Enviar
                                </Link>
                              </div>
                              <div className="img-delete">
                                <Link
                                  to="#"
                                  className="btn btn-secondary btn-sm rounded-pill"
                                >
                                  Remover
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="edit-profile-info mb-3">
                        <h5 className="mb-1">Detalhes Pessoais</h5>
                        <p>Edite suas informaÃ§Ãµes pessoais</p>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Primeiro Nome <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Ãšltimo Nome <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Nome de UsuÃ¡rio <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.userName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  userName: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Telefone{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.phoneNumber}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  phoneNumber: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              GÃªnero <span className="text-danger"> *</span>
                            </label>
                            <CustomSelect
                              options={Gender}
                              className="select d-flex"
                              placeholder="Selecione"
                              value={genderValue}
                              onChange={(val) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: String(val?.value || ""),
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Data de Nascimento <span className="text-danger"> *</span>
                            </label>
                            <div className="input-icon-end position-relative">
                              <DatePicker
                                className="form-control datetimepicker"
                                getPopupContainer={getModalContainer}
                                placeholder="dd/mm/aaaa"
                                value={formData.dob ? dayjs(formData.dob) : undefined}
                                onChange={(date) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    dob: date ? date.toISOString() : "",
                                  }))
                                }
                              />
                              <span className="input-icon-addon">
                                <i className="isax isax-calendar" />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">
                              Biografia <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              rows={4}
                              className="form-control"
                              value={formData.bio}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  bio: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button
                            className="btn btn-secondary rounded-pill"
                            type="submit"
                          >
                            Atualizar Perfil
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  )}
                </div>
              </div>
              <div className="card mb-0">
                <div className="card-body">
                  <h5 className="fs-18 mb-3">Excluir Conta</h5>
                  <h6 className="mb-1">
                    Tem certeza que deseja excluir sua conta?
                  </h6>
                  <p className="mb-3">
                    Essa aÃ§Ã£o remove permanentemente sua conta e todos os dados associados.
                  </p>
                  <Link
                    to="#"
                    className="btn btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_account"
                  >
                    Excluir Conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SettingsModal />
    </>
  );
};

export default StudentSettings;
