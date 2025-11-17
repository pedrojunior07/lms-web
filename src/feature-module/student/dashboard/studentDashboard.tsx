// src/pages/Student/student-dashboard/index.tsx
import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import StudentSidebar from "../common/studentSidebar";
import CircleProgress from "../../Instructor/instructor-dashboard/circleProgress";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { useCertificateApi } from "../../../core/api/hooks/useCertificateApi";

interface DashboardStats {
  enrolledCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalQuizzes: number;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
  discount?: number;
}

interface Invoice {
  id: string;
  courseTitle: string;
  amount: number;
  status: string;
  invoiceNumber: string;
}

interface QuizProgress {
  id: number;
  quizTitle: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
}

const StudentDashboard = () => {
  const [selectedItems, setSelectedItems] = useState(Array(4).fill(false));
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    enrolledCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    totalQuizzes: 0
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const { 
    getStudentDashboardStats,
    getCourcesStudents,
    getStudentRecentInvoices,
    getStudentQuizProgress,
    toggleCourseLike,
    loading: apiLoading 
  } = useCourseApi();
  
  const { getMyCertificates } = useCertificateApi();

  // Buscar dados reais do backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas do dashboard
        const stats = await getStudentDashboardStats();
        setDashboardData(stats);

        // Buscar cursos recentes do estudante
        const studentId = localStorage.getItem("userId"); // Ajuste conforme sua autenticação
        const coursesResponse = await getCourcesStudents({ page: 0, size: 3 }, studentId);
        setRecentCourses(coursesResponse.content || []);

        // Buscar faturas recentes
        const invoices = await getStudentRecentInvoices();
        setRecentInvoices(invoices);

        // Buscar progresso de quizzes
        const quizzes = await getStudentQuizProgress();
        setQuizProgress(quizzes);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        // Manter dados mockados em caso de erro
        setDashboardData({
          enrolledCourses: 12,
          activeCourses: 3,
          completedCourses: 10,
          totalQuizzes: 8
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Atualizar a função de favoritos para usar a API real
  const handleItemClick = async (index: number, courseId: number) => {
    try {
      await toggleCourseLike(courseId);
      setSelectedItems(prevSelectedItems => {
        const updatedSelectedItems = [...prevSelectedItems];
        updatedSelectedItems[index] = !updatedSelectedItems[index];
        return updatedSelectedItems;
      });
    } catch (error) {
      console.error("Erro ao favoritar curso:", error);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb title="Painel de Controle" />
      <div className="content">
        <div className="container">
          {/* caixa do perfil */}
          <ProfileCard />
          {/* caixa do perfil */}
          
          <div className="row">
            {/* barra lateral */}
            <StudentSidebar />
            {/* barra lateral */}
            
            <div className="col-lg-9">
              {/* Card de Quiz em Andamento */}
              <div className="card bg-light quiz-ans-card">
                <ImageWithBasePath
                  src="./assets/img/shapes/withdraw-bg1.svg"
                  className="quiz-ans-bg1"
                  alt="img"
                />
                <ImageWithBasePath
                  src="./assets/img/shapes/withdraw-bg2.svg"
                  className="quiz-ans-bg2"
                  alt="img"
                />
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div>
                        <h6 className="mb-1">
                          Quiz : Construir Sites Responsivos do Mundo Real{" "}
                        </h6>
                        <p>Respondido : 15/22</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-end">
                        <Link
                          to={all_routes.studentQuiz}
                          className="btn btn-primary rounded-pill"
                        >
                          Continuar Quiz
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="row">
                <div className="col-md-6 col-xl-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-primary-transparent me-2 me-xxl-3 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/icon/graduation.svg"
                            alt=""
                          />
                        </span>
                        <div>
                          <span className="d-block">Cursos Inscritos</span>
                          <h4 className="fs-24 mt-1">{dashboardData.enrolledCourses}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-secondary-transparent me-2 me-xxl-3 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/icon/book.svg"
                            alt=""
                          />
                        </span>
                        <div>
                          <span className="d-block">Cursos Ativos</span>
                          <h4 className="fs-24 mt-1">{dashboardData.activeCourses}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <span className="icon-box bg-success-transparent me-2 me-xxl-3 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/icon/bookmark.svg"
                            alt=""
                          />
                        </span>
                        <div>
                          <span className="d-block">Cursos Concluídos</span>
                          <h4 className="fs-24 mt-1">{dashboardData.completedCourses}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cursos Inscritos Recentemente */}
              <h5 className="mb-3 fs-18">Cursos Inscritos Recentemente</h5>
              <div className="row">
                {recentCourses.map((course, index) => (
                  <div key={course.id} className="col-xl-4 col-md-6">
                    <div className="course-item-two course-item mx-0">
                      <div className="course-img">
                        <Link to={all_routes.courseDetails}>
                          <ImageWithBasePath
                            src={course.image || "assets/img/course/course-01.jpg"}
                            alt="img"
                            className="img-fluid"
                          />
                        </Link>
                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                          {course.discount && (
                            <div className="badge text-bg-danger">{course.discount}% desconto</div>
                          )}
                          <Link
                            to="#"
                            onClick={() => handleItemClick(index, course.id)}
                            className={`fav-icon ${
                              selectedItems[index] ? "selected" : ""
                            } ms-auto`}
                          >
                            <i className="isax isax-heart" />
                          </Link>
                        </div>
                      </div>
                      <div className="course-content">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <Link
                              to={all_routes.instructorDetails}
                              className="avatar avatar-sm"
                            >
                              <ImageWithBasePath
                                src={course.instructorAvatar || "assets/img/user/user-29.jpg"}
                                alt="img"
                                className="img-fluid avatar avatar-sm rounded-circle"
                              />
                            </Link>
                            <div className="ms-2">
                              <Link
                                to={all_routes.instructorDetails}
                                className="link-default fs-14"
                              >
                                {course.instructor}
                              </Link>
                            </div>
                          </div>
                          <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                            {course.category}
                          </span>
                        </div>
                        <h6 className="title mb-2">
                          <Link to={all_routes.courseDetails}>
                            {course.title}
                          </Link>
                        </h6>
                        <p className="d-flex align-items-center mb-3">
                          <i className="fa-solid fa-star text-warning me-2" />
                          {course.rating} ({course.reviewCount} Avaliações)
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5 className="text-secondary mb-0">MZN {course.price}</h5>
                          <Link
                            to={all_routes.courseDetails}
                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                          >
                            Ver Curso
                            <i className="isax isax-arrow-right-3 ms-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Faturas Recentes e Quizzes */}
              <div className="row">
                <div className="col-xl-7">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="mb-3 border-bottom pb-3 fs-18">
                        Faturas Recentes
                      </h5>
                      {recentInvoices.map((invoice, index) => (
                        <div key={invoice.id} className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-3">
                          <div>
                            <h6 className="mb-1">{invoice.courseTitle}</h6>
                            <div className="d-flex align-items-center">
                              <span className="badge badge-sm bg-light border d-inline-flex me-3">
                                {invoice.invoiceNumber}
                              </span>
                              <p className="small">
                                Valor :{" "}
                                <span className="heading-color fw-semibold">
                                  MZN {invoice.amount}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className={`badge fw-normal d-inline-flex align-items-center me-1 ${
                              invoice.status === 'Pago' ? 'bg-success' : 'bg-warning'
                            }`}>
                              <i className="fa-solid fa-circle fs-5 me-1" />
                              {invoice.status}
                            </span>
                            <Link to="#" className="action-icon">
                              <i className="isax isax-document-download" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="col-xl-5">
                  <div className="card mb-0">
                    <div className="card-body">
                      <h5 className="mb-3 fs-18 border-bottom pb-3">
                        Últimos Quizzes
                      </h5>
                      {quizProgress.map((quiz, index) => (
                        <div key={quiz.id} className="d-flex align-items-center flex-wrap flex-md-nowrap justify-content-between row-gap-2 mb-3">
                          <div>
                            <h6 className="mb-1">{quiz.quizTitle}</h6>
                            <div className="d-flex align-items-center">
                              <p>Resposta Correta : {quiz.correctAnswers}/{quiz.totalQuestions}</p>
                            </div>
                          </div>
                          <CircleProgress value={quiz.percentage} />
                        </div>
                      ))}
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

export default StudentDashboard;