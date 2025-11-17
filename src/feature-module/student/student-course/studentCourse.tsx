import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import StudentSidebar from "../common/studentSidebar";
import { all_routes } from "../../router/all_routes";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

type Course = {
  id: number | string;
  title: string;
  price?: number | string;
  currency?: string;
  thumbnailPath?: string | null;
  instructor?: {
    firstName?: string;
    lastName?: string;
  };
  category?: {
    name?: string;
  };
  rating?: number;
  reviewCount?: number;
  level?: string;
  duration?: string;
};

const StudentCourse = () => {
  const route = all_routes;
  const { getCourcesStudents } = useCourseApi();

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [filters, setFilters] = useState({
    instructorId: 1,
    category: null as number | null | undefined,
    minPrice: null as number | null | undefined,
    maxPrice: null as number | null | undefined,
    status: "DRAFT",
    title: "",
    size: 6,
    sort: "title,asc",
  });

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const id = localStorage.getItem("id");
      const data = await getCourcesStudents({ ...filters, page }, id);
      setCourses(data?.data?.content ?? []);
      setTotalPages(data?.data?.totalPages ?? 0);
    } catch (err: any) {
      console.error("Erro ao buscar cursos:", err);
      setError("Não foi possível carregar os cursos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Utilitário para formatar preço
  const formatPrice = (val: number | string | undefined, currency = "USD") => {
    const amount = Number(val);
    if (Number.isNaN(amount)) return "Grátis";
    if (amount === 0) return "Grátis";
    
    try {
      return new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} €`;
    }
  };

  // Gerar rating aleatório como fallback
  const generateRandomRating = () => {
    const ratings = [4.5, 4.7, 4.8, 4.9, 5.0];
    const reviewCounts = [156, 203, 189, 234, 178];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return {
      rating: ratings[randomIndex],
      reviews: reviewCounts[randomIndex]
    };
  };

  // Função para lidar com erro de imagem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  return (
    <>
      <Breadcrumb title="Cursos Inscritos" />

      <div className="content">
        <div className="container">
          {/* Caixa de perfil */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-6">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath
                      src="assets/img/user/user-02.jpg"
                      alt="avatar"
                    />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      Ronald Richard
                      <Link
                        to={route.instructorProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">Estudante</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2">
                  <Link
                    to={route.becomeAnInstructor}
                    className="btn btn-white rounded-pill me-3"
                  >
                    Torne-se Instrutor
                  </Link>
                  <Link
                    to={route.instructorDashboard}
                    className="btn btn-secondary rounded-pill"
                  >
                    Painel do Instrutor
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Caixa de perfil */}

          <div className="row">
            {/* Barra lateral */}
            <StudentSidebar />
            {/* Barra lateral */}

            <div className="col-lg-9">
              <div className="page-title d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <h5 className="fw-bold mb-0">Cursos Inscritos</h5>
                <div className="tab-list">
                  <ul className="nav mb-0 gap-2" role="tablist">
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        className="active"
                        data-bs-toggle="tab"
                        data-bs-target="#enroll-courses"
                        aria-selected="true"
                        role="tab"
                      >
                        Inscritos (
                        {String(courses?.length ?? 0).padStart(2, "0")})
                      </Link>
                    </li>
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#active-courses"
                        aria-selected="false"
                        role="tab"
                        className=""
                        tabIndex={-1}
                      >
                        Ativos (06)
                      </Link>
                    </li>
                    <li className="nav-item mb-0" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#complete-courses"
                        aria-selected="false"
                        role="tab"
                        className=""
                        tabIndex={-1}
                      >
                        Concluídos (03)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="tab-content">
                {/* Aba Inscritos */}
                <div
                  className="tab-pane fade active show"
                  id="enroll-courses"
                  role="tabpanel"
                >
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                      <div className="mt-2">Carregando cursos...</div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  ) : (
                    <div className="row g-4">
                      {courses.map((course) => {
                        const ratingInfo = generateRandomRating();
                          
                        return (
                          <div className="col-xl-4 col-md-6" key={course.id}>
                            <div className="course-item-two course-item mx-0 h-100 d-flex flex-column shadow-sm border-0">
                              <div className="course-img position-relative">
                                <Link to={`${route.courseWatch}?id=${course.id}`}>
                                  <div className="ratio ratio-16x9">
                                    {course.thumbnailPath ? (
                                      <img
                                        src={
                                          course.thumbnailPath.startsWith('http')
                                            ? course.thumbnailPath
                                            : `/assets/img/${course.thumbnailPath}`
                                        }
                                        alt={course.title || "Curso"}
                                        className="w-100 h-100 object-fit-cover"
                                        onError={handleImageError}
                                      />
                                    ) : (
                                      <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                        <i className="isax isax-book-1 fs-1 text-muted"></i>
                                      </div>
                                    )}
                                  </div>
                                </Link>

                                {/* Badge para cursos gratuitos */}
                                {(course.price === 0 || course.price === "0") && (
                                  <span className="course-tag free-tag position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded">
                                    Grátis
                                  </span>
                                )}
                              </div>

                              <div className="course-content d-flex flex-column flex-grow-1 p-3">
                                {/* Categoria apenas */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge badge-primary rounded-pill bg-primary text-white d-inline-flex align-items-center fs-12 fw-medium">
                                    {course?.category?.name || "Geral"}
                                  </span>
                                  <div className="rating">
                                    <i className="fas fa-star filled text-warning me-1" />
                                    <span className="fs-12 text-muted">
                                      {ratingInfo.rating}
                                    </span>
                                  </div>
                                </div>

                                {/* Título do curso */}
                                <h6 className="title mb-3 line-clamp-2">
                                  <Link
                                    to={`${route.courseWatch}?id=${course.id}`}
                                    className="text-dark text-decoration-none fw-medium"
                                  >
                                    {course?.title || "Curso sem título"}
                                  </Link>
                                </h6>

                                {/* Informações do curso */}
                                <div className="course-meta mb-3">
                                  <div className="d-flex align-items-center text-muted fs-12 gap-3">
                                    {course.duration && (
                                      <span className="d-flex align-items-center">
                                        <i className="fa-regular fa-clock me-1"></i>
                                        {course.duration}
                                      </span>
                                    )}
                                    <span className="d-flex align-items-center">
                                      <i className="fa-solid fa-user-group me-1"></i>
                                      {ratingInfo.reviews} alunos
                                    </span>
                                  </div>
                                </div>

                                {/* Preço e botão */}
                                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                                  <h5 className="text-primary fw-bold mb-0">
                                    {formatPrice(
                                      course.price,
                                      course.currency || "USD"
                                    )}
                                  </h5>

                                  <Link
                                    to={`${route.courseWatch}?id=${course.id}`}
                                    className="btn btn-primary btn-sm d-inline-flex align-items-center rounded-pill"
                                  >
                                    Ver Curso
                                    <i className="isax isax-arrow-right-3 ms-1" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {courses.length === 0 && !loading && (
                        <div className="col-12">
                          <div className="text-center text-muted py-5">
                            <i className="isax isax-book-1 fs-1 mb-3"></i>
                            <h5>Nenhum curso encontrado</h5>
                            <p>Você ainda não está inscrito em nenhum curso.</p>
                            <Link to={route.courseList} className="btn btn-primary">
                              Explorar Cursos
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Aba Cursos Ativos */}
                <div
                  className="tab-pane fade"
                  id="active-courses"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    {/* Exemplo de curso ativo */}
                    <div className="col-xl-4 col-md-6">
                      <div className="course-item-two course-item mx-0 h-100 d-flex flex-column shadow-sm border-0">
                        <div className="course-img position-relative">
                          <Link to={route.courseWatch}>
                            <div className="ratio ratio-16x9">
                              <ImageWithBasePath
                                src="assets/img/course/course-01.jpg"
                                alt="UI/UX Design"
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                          </Link>
                          <span className="course-tag active-tag position-absolute top-0 start-0 bg-info text-white px-2 py-1 m-2 rounded">
                            Em Progresso
                          </span>
                        </div>
                        <div className="course-content d-flex flex-column flex-grow-1 p-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge badge-primary rounded-pill bg-primary text-white d-inline-flex align-items-center fs-12 fw-medium">
                              Design
                            </span>
                            <div className="rating">
                              <i className="fas fa-star filled text-warning me-1" />
                              <span className="fs-12 text-muted">4.9</span>
                            </div>
                          </div>
                          <h6 className="title mb-3 line-clamp-2">
                            <Link to={route.courseWatch} className="text-dark text-decoration-none fw-medium">
                              Informações sobre o curso de UI/UX Design
                            </Link>
                          </h6>
                          <div className="course-meta mb-3">
                            <div className="d-flex align-items-center text-muted fs-12 gap-3">
                              <span className="d-flex align-items-center">
                                <i className="fa-regular fa-clock me-1"></i>
                                6h 30min
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="fa-solid fa-user-group me-1"></i>
                                200 alunos
                              </span>
                            </div>
                          </div>
                          <div className="progress mb-3" style={{height: '6px'}}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{width: '65%'}}
                              aria-valuenow={65} 
                              aria-valuemin={0} 
                              aria-valuemax={100}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                            <small className="text-muted fs-12">65% concluído</small>
                            <Link
                              to={route.courseWatch}
                              className="btn btn-primary btn-sm d-inline-flex align-items-center rounded-pill"
                            >
                              Continuar
                              <i className="isax isax-play-circle ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aba Cursos Concluídos */}
                <div
                  className="tab-pane fade"
                  id="complete-courses"
                  role="tabpanel"
                >
                  <div className="row g-4">
                    {/* Exemplo de curso concluído */}
                    <div className="col-xl-4 col-md-6">
                      <div className="course-item-two course-item mx-0 h-100 d-flex flex-column shadow-sm border-0">
                        <div className="course-img position-relative">
                          <Link to={route.courseWatch}>
                            <div className="ratio ratio-16x9">
                              <ImageWithBasePath
                                src="assets/img/course/course-04.jpg"
                                alt="Desenvolvimento Web"
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                          </Link>
                          <span className="course-tag complete-tag position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded">
                            Concluído
                          </span>
                        </div>
                        <div className="course-content d-flex flex-column flex-grow-1 p-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge badge-primary rounded-pill bg-primary text-white d-inline-flex align-items-center fs-12 fw-medium">
                              Programação
                            </span>
                            <div className="rating">
                              <i className="fas fa-star filled text-warning me-1" />
                              <span className="fs-12 text-muted">4.2</span>
                            </div>
                          </div>
                          <h6 className="title mb-3 line-clamp-2">
                            <Link to={route.courseWatch} className="text-dark text-decoration-none fw-medium">
                              Construa sites responsivos do mundo real
                            </Link>
                          </h6>
                          <div className="course-meta mb-3">
                            <div className="d-flex align-items-center text-muted fs-12 gap-3">
                              <span className="d-flex align-items-center">
                                <i className="fa-regular fa-clock me-1"></i>
                                8h 15min
                              </span>
                              <span className="d-flex align-items-center">
                                <i className="fa-solid fa-user-group me-1"></i>
                                220 alunos
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                            <span className="badge bg-success fs-12">
                              <i className="fas fa-check me-1"></i>
                              Concluído
                            </span>
                            <Link
                              to={route.courseWatch}
                              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center rounded-pill"
                            >
                              Rever
                              <i className="isax isax-refresh ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paginação */}
              {courses.length > 0 && totalPages > 1 && (
                <div className="row align-items-center mt-4">
                  <div className="col-md-4">
                    <p className="pagination-text mb-0 text-muted">
                      Página {totalPages ? page + 1 : 0} de {totalPages}
                    </p>
                  </div>
                  <div className="col-md-8">
                    <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                      <li
                        className={`page-item prev ${
                          page === 0 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(page - 1)}
                          disabled={page === 0}
                        >
                          <i className="fas fa-angle-left" />
                        </button>
                      </li>

                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => (
                        <li
                          key={idx}
                          className={`page-item ${idx === page ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => goToPage(idx)}
                          >
                            {idx + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item next ${
                          page + 1 >= totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(page + 1)}
                          disabled={page + 1 >= totalPages}
                        >
                          <i className="fas fa-angle-right" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {/* /paginação */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourse;