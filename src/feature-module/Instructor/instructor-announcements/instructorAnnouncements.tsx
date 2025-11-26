import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomSelect, { OptionType } from "../../../core/common/commonSelect";
import Table from "../../../core/common/dataTable/index";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { useAnnouncementApi } from "../../../core/api/hooks/useAnnouncementApi";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const STATUS_OPTIONS: OptionType[] = [
  { label: "Publicado", value: "1" },
  { label: "Rascunho", value: "2" },
];

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    courseId: null as OptionType | null,
    status: null as OptionType | null,
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    message: "",
    courseId: null as OptionType | null,
    status: null as OptionType | null,
  });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any>(null);
  const { getCourseAll } = useCourseApi();
  const [courses, setCourses] = useState<OptionType[]>([]);
  const { listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncementApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData, coursesData] = await Promise.all([
          listAnnouncements(),
          getCourseAll()
        ]);
        console.log("Fetched Announcements:", announcementsData);
        console.log("Fetched Courses:", coursesData);
        setAnnouncements(announcementsData);

        // Formatar cursos para o CustomSelect
        const formattedCourses = coursesData.map((course: any) => ({
          label: course.name || course.title,
          value: course.id
        }));
        setCourses(formattedCourses);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, []);
  const handleEnviar = async () => {
    try {
      if (!formData.title || !formData.courseId) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
      }

      await createAnnouncement({
        title: formData.title,
        message: formData.message,
        courseId: Number(formData.courseId.value),
        status: formData.status?.label || "Publicado",
      });

      alert("Anúncio criado com sucesso!");

      // Limpar formulário
      setFormData({
        title: "",
        message: "",
        courseId: null,
        status: null,
      });

      // Refetch
      const data = await listAnnouncements();
      setAnnouncements(data);

      // Fechar modal
      document.getElementById("add_announcement")?.querySelector('[data-bs-dismiss="modal"]')?.dispatchEvent(new Event('click'));
    } catch (err) {
      console.error("Erro ao criar anúncio:", err);
      alert("Erro ao criar anúncio. Por favor, tente novamente.");
    }
  };

  const handleEdit = (announcement: any) => {
    // Encontrar o curso correspondente
    const selectedCourse = courses.find(c => c.value === announcement.courseId);
    // Encontrar o status correspondente
    const selectedStatus = STATUS_OPTIONS.find(s => s.label === announcement.status);

    setEditFormData({
      id: announcement.id,
      title: announcement.title,
      message: announcement.message,
      courseId: selectedCourse || null,
      status: selectedStatus || null,
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editFormData.title || !editFormData.courseId) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
      }

      await updateAnnouncement(editFormData.id, {
        title: editFormData.title,
        message: editFormData.message,
        courseId: Number(editFormData.courseId.value),
        status: editFormData.status?.label || "Publicado",
      });

      alert("Anúncio atualizado com sucesso!");

      // Refetch
      const data = await listAnnouncements();
      setAnnouncements(data);

      // Fechar modal
      document.getElementById("edit_announcement")?.querySelector('[data-bs-dismiss="modal"]')?.dispatchEvent(new Event('click'));
    } catch (err) {
      console.error("Erro ao atualizar anúncio:", err);
      alert("Erro ao atualizar anúncio. Por favor, tente novamente.");
    }
  };

  const handleView = (announcement: any) => {
    setSelectedAnnouncement(announcement);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!announcementToDelete) return;

      await deleteAnnouncement(announcementToDelete.id);

      alert("Anúncio excluído com sucesso!");

      // Refetch
      const data = await listAnnouncements();
      setAnnouncements(data);

      setAnnouncementToDelete(null);

      // Fechar modal
      document.getElementById("delete_modal")?.querySelector('[data-bs-dismiss="modal"]')?.dispatchEvent(new Event('click'));
    } catch (err) {
      console.error("Erro ao excluir anúncio:", err);
      alert("Erro ao excluir anúncio. Por favor, tente novamente.");
    }
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "createdAt",
      sorter: (a: any, b: any) => a.Date.length - b.Date.length,
    },
    {
      title: "Anuncio",
      dataIndex: "title",
      render: (text: string, record: any) => (
        <div>
          <h6 className="mb-1">
            <Link
              to="#"
              onClick={() => handleView(record)}
              data-bs-toggle="modal"
              data-bs-target="#view_announcement"
            >
              {text}
            </Link>
          </h6>
          <p>{record.message?.substring(0, 50)}{record.message?.length > 50 ? '...' : ''}</p>
        </div>
      ),
      sorter: (a: any, b: any) =>
        (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Estado",
      dataIndex: "Status",
      render: (text: string) => {
        const statusMap: Record<string, string> = {
          Pendente: "Pendente",
          Rascunho: "Rascunho",
          Publicado: "Publicado",
        };
        return (
          <span
            className={`badge badge-sm ${
              text === "Rascunho"
                ? "bg-skyblue"
                : text === "Pending"
                ? "bg-info"
                : "bg-success"
            } d-inline-flex align-items-center me-1`}
          >
            <i className="fa-solid fa-circle fs-5 me-1" />
            {statusMap[text] || text}
          </span>
        );
      },
      sorter: (a: any, b: any) => a.Status.length - b.Status.length,
    },
    {
      title: "Ações",
      dataIndex: "",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to="#"
            className="d-inline-flex fs-14 me-1 action-icon"
            onClick={() => handleEdit(record)}
            data-bs-toggle="modal"
            data-bs-target="#edit_announcement"
          >
            <i className="isax isax-edit-2"></i>
          </Link>
          <Link
            to="#"
            className="d-inline-flex fs-14 action-icon"
            onClick={() => setAnnouncementToDelete(record)}
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
          >
            <i className="isax isax-trash"></i>
          </Link>
        </div>
      ),
    },
  ];

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
                <h5 className="fw-bold">Anuncios</h5>
                <div>
                  <Link
                    to="#"
                    className="btn btn-secondary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_announcement"
                  >
                    <i className="isax isax-add-circle me-1" />
                    Adicionar anúncio
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle btn rounded border d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Status
                      </Link>
                      <ul className="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Published
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Draft
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
              <Table
                dataSource={announcements}
                columns={columns}
                Search={true}
              />
            </div>
          </div>
        </div>
      </div>
      <>
        {/* Add Announcement */}
        <div className="modal fade" id="add_announcement">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="fw-bold">Adicionar novo anuncio</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Curso <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          className="select"
                          options={courses}
                          modal={true}
                          value={formData.courseId || undefined}
                          onChange={(value: OptionType) =>
                            setFormData({ ...formData, courseId: value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Titulo do anuncio{" "}
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <textarea
                          className="form-control"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="form-label">
                          Status <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          className="select"
                          options={STATUS_OPTIONS}
                          modal={true}
                          value={formData.status || undefined}
                          onChange={(value: OptionType) =>
                            setFormData({ ...formData, status: value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill"
                    type="button"
                    onClick={handleEnviar}
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Announcement */}
        {/* Editar anuncio */}
        <div className="modal fade" id="edit_announcement">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="fw-bold">Editar anuncio</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Curso <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          className="select"
                          options={courses}
                          value={editFormData.courseId || undefined}
                          onChange={(value: OptionType) =>
                            setEditFormData({ ...editFormData, courseId: value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Titulo do anuncio{" "}
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, title: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <textarea
                          className="form-control"
                          value={editFormData.message}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, message: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="form-label">
                          Status <span className="text-danger"> *</span>
                        </label>
                        <CustomSelect
                          className="select"
                          options={STATUS_OPTIONS}
                          value={editFormData.status || undefined}
                          onChange={(value: OptionType) =>
                            setEditFormData({ ...editFormData, status: value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn bg-gray-100 rounded-pill me-2"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-secondary rounded-pill"
                    type="button"
                    onClick={handleSaveEdit}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Editar anuncio */}
        {/* Detalhes do anuncio */}
        <div className="modal fade" id="view_announcement">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="fw-bold">Detalhes do anuncio</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <div className="modal-body">
                {selectedAnnouncement && (
                  <>
                    <div className="mb-3">
                      <h6 className="mb-1">Curso</h6>
                      <p>{selectedAnnouncement.course?.name || selectedAnnouncement.course?.title || 'N/A'}</p>
                    </div>
                    <div className="mb-3">
                      <h6 className="mb-1">Título</h6>
                      <p>{selectedAnnouncement.title}</p>
                    </div>
                    <div className="mb-3">
                      <h6 className="mb-1">Descrição</h6>
                      <p>{selectedAnnouncement.message || 'Sem descrição'}</p>
                    </div>
                    <div className="mb-3">
                      <h6 className="mb-1">Status</h6>
                      <p>{selectedAnnouncement.status || 'N/A'}</p>
                    </div>
                    <div className="mb-0">
                      <h6 className="mb-1">Data de Criação</h6>
                      <p>{selectedAnnouncement.createdAt ? new Date(selectedAnnouncement.createdAt).toLocaleString('pt-BR') : 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* /Detalhes do anuncio */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Excluir anúncio</h4>
                  <p className="mb-3">
                    Tem certeza de que deseja excluir o anúncio {announcementToDelete?.title ? `"${announcementToDelete.title}"` : ''}?
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-danger rounded-pill"
                      type="button"
                      onClick={handleDeleteConfirm}
                    >
                      Sim, Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </>
  );
};

export default InstructorAnnouncements;
