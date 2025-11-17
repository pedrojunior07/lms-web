import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";
import CustomSelect from "../../../core/common/commonSelect";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const InstructorQuiz = () => {
  const { saveQuizz, listQuizzes, getCourseAll } = useCourseApi();
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const getModalContainer = () => {
    const modalElement = document.getElementById("add_quiz");
    return modalElement ? modalElement : document.body;
  };
  
  const getModalContainer2 = () => {
    const modalElement = document.getElementById("edit_quiz");
    return modalElement ? modalElement : document.body;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourseAll();
      setCourses(
        data.data.map((course: any) => ({
          label: course.title,
          value: course.id,
        }))
      );
    };

    const fetchQuizzes = async () => {
      try {
        const quizzesData = await listQuizzes();
        setQuizzes(quizzesData || []);
      } catch (error) {
        console.error("Erro ao carregar questionários:", error);
        setQuizzes([]);
      }
    };

    fetchCourses();
    fetchQuizzes();
  }, [getCourseAll, listQuizzes]);

  const [quizData, setQuizData] = useState({
    courseId: 0,
    title: "",
    numberOfQuestions: 0,
    totalMarks: 0,
    passMark: 0,
    duration: 0,
  });

  // Função para converter minutos para objeto dayjs
  const minutesToDayjs = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return dayjs().hour(hours).minute(mins).second(0);
  };

  // Função para formatar minutos para string legível
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  };

  const handleDurationChange = (time: any) => {
    if (time) {
      const minutes = time.hour() * 60 + time.minute();
      setQuizData({
        ...quizData,
        duration: minutes,
      });
    } else {
      setQuizData({
        ...quizData,
        duration: 0,
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !quizData.title ||
      !quizData.courseId ||
      !quizData.numberOfQuestions ||
      !quizData.totalMarks ||
      !quizData.passMark ||
      !quizData.duration
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await saveQuizz(quizData);
      console.log("Questionário adicionado com sucesso", response);
      
      // Atualizar a lista de quizzes
      const quizzesData = await listQuizzes();
      setQuizzes(quizzesData || []);
      
      // Fechar modal e limpar formulário após sucesso
      setQuizData({
        courseId: 0,
        title: "",
        numberOfQuestions: 0,
        totalMarks: 0,
        passMark: 0,
        duration: 0,
      });
      
      // Fechar o modal usando Bootstrap
      const modal = document.getElementById('add_quiz');
      if (modal) {
        const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar questionário:", error);
      alert("Erro ao adicionar questionário. Tente novamente.");
    }
  };

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />
        <div className="d-flex layout-body content">
          <InstructorSidebar />
          <main className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Questionários</h5>
                <div>
                  <Link
                    to="#"
                    className="btn btn-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_quiz"
                  >
                    Adicionar Questionário
                  </Link>
                </div>
              </div>
              <div className="border rounded-2 p-3 mb-3">
                <div className="row">
                  <div className="col-md-12">
                    <h6 className="mb-3">Questionários Existentes</h6>
                    {quizzes.length === 0 ? (
                      <p>Nenhum questionário disponível</p>
                    ) : (
                      quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="border rounded-2 p-3 mb-3"
                        >
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div>
                                <h6 className="mb-2">
                                  <Link
                                    to={{
                                      pathname: all_routes.instructorQA,
                                      search: `?quizId=${quiz.id}`,
                                    }}
                                  >
                                    {quiz.title}
                                  </Link>
                                </h6>
                                <div className="question-info d-flex align-items-center">
                                  <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                                    <i className="isax isax-message-question5 text-primary-soft me-2"></i>
                                    {quiz.numberOfQuestions} Perguntas
                                  </p>
                                  <p className="d-flex align-items-center fs-14 mb-0">
                                    <i className="isax isax-clock5 text-secondary-soft me-2"></i>
                                    {formatDuration(quiz.duration)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="d-flex align-items-center justify-content-end mt-2 mt-md-0">
                                <Link
                                  to={all_routes.instructorQuizResult}
                                  className="text-info text-decoration-underline fs-12 fw-medium me-3"
                                >
                                  Ver Resultados
                                </Link>
                                <Link
                                  to="#"
                                  className="d-inline-flex fs-14 me-1 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_quiz"
                                >
                                  <i className="isax isax-edit-2"></i>
                                </Link>
                                <Link
                                  to="#"
                                  className="d-inline-flex fs-14 action-icon"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_modal"
                                >
                                  <i className="isax isax-trash"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Adicionar Questionário */}
      <div className="modal fade" id="add_quiz">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Adicionar Novo Questionário</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body pb-0">
                <div className="mb-3">
                  <label className="form-label">
                    Curso <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                    className="select"
                    options={courses}
                    onChange={(value) =>
                      setQuizData({
                        ...quizData,
                        courseId: Number(value.value),
                      })
                    }
                    placeholder="Selecionar curso"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Título do Questionário <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={quizData.title}
                    onChange={handleInputChange}
                    placeholder="Introduza o título do questionário"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Nº de Perguntas <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="numberOfQuestions"
                        value={quizData.numberOfQuestions}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Pontuação Total <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalMarks"
                        value={quizData.totalMarks}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Pontuação Mínima <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="passMark"
                        value={quizData.passMark}
                        onChange={handleInputChange}
                        min="0"
                        max={quizData.totalMarks}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Duração <span className="text-danger"> *</span>
                      </label>
                      <div className="input-icon-end position-relative">
                        <TimePicker
                          getPopupContainer={getModalContainer}
                          className="form-control timepicker"
                          name="duration"
                          onChange={handleDurationChange}
                          value={quizData.duration ? minutesToDayjs(quizData.duration) : null}
                          format="HH:mm"
                          placeholder="Selecionar duração"
                        />
                        <span className="input-icon-addon">
                          <i className="isax isax-clock" />
                        </span>
                      </div>
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
                  type="submit"
                >
                  Adicionar Questionário
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Adicionar Questionário */}

      {/* Editar Questionário */}
      <div className="modal fade" id="edit_quiz">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="fw-bold">Editar Questionário</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <form action={all_routes.instructorQA}>
              <div className="modal-body pb-0">
                <div className="mb-3">
                  <label className="form-label">
                    Curso <span className="text-danger"> *</span>
                  </label>
                  <CustomSelect
                    className="select"
                    options={courses}
                    modal={true}
                    defaultValue={courses[1]}
                    onChange={(value) =>
                      setQuizData({
                        ...quizData,
                        courseId: Number(value.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Título do Questionário <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Informação sobre Licenciatura em UI/UX Design"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Nº de Perguntas <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={10}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Pontuação Total <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={100}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Pontuação Mínima <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={50}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Duração <span className="text-danger"> *</span>
                      </label>
                      <div className="input-icon-end position-relative">
                        <TimePicker
                          getPopupContainer={getModalContainer2}
                          defaultValue={dayjs("12:08:23", "HH:mm:ss")}
                          className="form-control timepicker"
                        />
                        <span className="input-icon-addon">
                          <i className="isax isax-clock" />
                        </span>
                      </div>
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
                  data-bs-dismiss="modal"
                >
                  Guardar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Editar Questionário */}

      {/* Modal de Eliminação */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Eliminar Questionário</h4>
                <p className="mb-3">Tem a certeza que pretende eliminar este questionário?</p>
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-secondary rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    Sim, Eliminar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Modal de Eliminação */}
    </>
  );
};

export default InstructorQuiz;