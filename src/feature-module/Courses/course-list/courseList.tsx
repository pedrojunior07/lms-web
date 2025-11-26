import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { Slider } from "antd";
import type { SliderSingleProps } from "antd";
import { all_routes } from "../../router/all_routes";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { useCart } from "../../../core/common/context/cartContext";
import { toast } from "react-toastify";
import { useAuth } from "../../../core/common/context/AuthContextType";
import { useEnrollments } from "../../../core/common/context/enrollmentContext";

const CourseList = () => {
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [categories, setCategories] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isEnrolled } = useEnrollments();
  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { getSearchCourse, getCategoriesWithNumbers } = useCourseApi();

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Faça login para acessar os cursos");
      navigate(all_routes.login);
    }
  }, [isAuthenticated, navigate]);

  const [featureCourses, setFeautured] = useState<any[]>([]);
  const route = all_routes;

  const handleAddToCart = (e: React.MouseEvent, course: any) => {
    e.preventDefault();
    if (isEnrolled(course.id)) {
      toast.info("Voce ja esta inscrito neste curso.");
      return;
    }
    addToCart(course);
    toast.success(`${course.title} adicionado ao carrinho!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  const [courses, setCourses] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    instructorId: null,
    category: null,
    minPrice: null,
    maxPrice: null,
    status: "PUBLICADO",
    title: "",
    size: 6,
    sort: "title,asc",
  });

  // Função SIMPLES para obter a URL da thumbnail
  const getThumbnailUrl = (thumbnailPath: string) => {
    if (!thumbnailPath) {
      return "/assets/img/course/course-02.jpg"; // Imagem padrão
    }
    return thumbnailPath; // Já vem como URL completa do backend
  };

  const fetchCourses = async () => {
    try {
      const data = await getSearchCourse({ ...filters, page });
      console.log("📊 Dados dos cursos:", data);
      
      if (data.data && data.data.content) {
        // Processar os cursos para garantir que as thumbnails tenham URLs corretas
        const processedCourses = data.data.content.map((course: any) => ({
          ...course,
          // Usar a URL processada diretamente
          thumbnailUrl: getThumbnailUrl(course.thumbnailPath)
        }));
        
        console.log("📊 Cursos processados:", processedCourses);
        setCourses(processedCourses);
        setTotalPages(data.data.totalPages);
      }
      
      const cat = await getCategoriesWithNumbers();
      setCategories(cat.data);
      
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value
  ) => `MZN${value}`;

  return (
    <>
      <Breadcrumb title="Lista de Cursos" />
      <>
        {/* Curso */}
        <section className="course-content course-list-content">
          <div className="container">
            <div className="row align-items-baseline">
              <div className="col-lg-3 theiaStickySidebar">
                <div className="filter-clear">
                  <div className="clear-filter mb-4 pb-lg-2 d-flex align-items-center justify-content-between">
                    <h5>
                      <i className="feather-filter me-2" />
                      Filtros
                    </h5>
                    <Link to="#" className="clear-text">
                      Limpar
                    </Link>
                  </div>
                  <div className="accordion accordion-customicon1 accordions-items-seperate">
                    {/* ... (código dos filtros permanece igual) ... */}
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                {/* Filtro */}
                <div className="showing-list mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      <div className="show-result text-center text-lg-start">
                        <h6 className="fw-medium">
                          Mostrando 1-9 de 50 resultados
                        </h6>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="show-filter add-course-info">
                        <form action="#">
                          <div className="d-sm-flex justify-content-center justify-content-lg-end mb-1 mb-lg-0">
                            <div className="view-icons mb-2 mb-sm-0">
                              <Link to={route.courseGrid} className="grid-view">
                                <i className="feather-grid" />
                              </Link>
                              <Link
                                to={route.courseList}
                                className="list-view active"
                              >
                                <i className="isax isax-task" />
                              </Link>
                            </div>
                            <select className="form-select">
                              <option>Recém Publicados</option>
                              <option>Cursos em Tendência</option>
                              <option>Mais Avaliados</option>
                              <option>Cursos Gratuitos</option>
                            </select>
                            <div className=" search-group">
                              <i className="isax isax-search-normal-1" />
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Filtro */}
                <div className="row course-list-wrap">
                  {courses.map((course, m) => {
                    console.log(`🎯 Renderizando curso ${m}:`, {
                      title: course.title,
                      thumbnailUrl: course.thumbnailUrl,
                      thumbnailPath: course.thumbnailPath
                    });
                    const alreadyEnrolled = isEnrolled(course.id);

                    
                    return (
                      <div className="col-12" key={course.id ?? m}>
                        <div className="courses-list-item">
                          <div className="d-md-flex align-items-center">
                            <div className="position-relative overflow-hidden rounded-3 card-image">
                              <Link to={`${route.courseDetails}?id=${course.id}`}>
                                {/* USANDO a URL processada diretamente */}
                                <img 
                                  className="img-fluid rounded-3" 
                                  src={course.thumbnailUrl} 
                                  alt={course.title}
                                />
                              </Link>
                              <div
                                className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-2"
                                onClick={() => handleItemClick(m)}
                              >
                                <Link
                                  to="#"
                                  className={`like ${
                                    selectedItems[m] ? "selected" : ""
                                  }`}
                                >
                                  <i className="isax isax-heart" />
                                </Link>
                              </div>
                            </div>
                            <div className="course-list-contents w-100 ps-0 ps-md-3 pt-4 pt-md-0">
                              <div className="d-flex flex-wrap align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm rounded-circle">
                                    <Link to="#">
                                      <img
                                        className="img-fluid rounded-circle"
                                        src="./assets/img/avatar/avatar2.jpg"
                                        alt={course.instructorName}
                                      />
                                    </Link>
                                  </div>
                                  <p className="ms-2">
                                    <Link to={route.instructorDetails}>
                                      {course.instructorName}
                                    </Link>
                                  </p>
                                </div>
                                <span>
                                  <Link to="#" className="tag-btn">
                                    {course.category?.name ?? "Sem Categoria"}
                                  </Link>
                                </span>
                              </div>
                              <h4 className="mt-3 mb-2">
                                <Link to={`${route.courseDetails}/${course.id}`}>
                                  {course.title}
                                </Link>
                              </h4>
                              <div className="d-flex align-items-center">
                                <p className="d-flex align-items-center mb-0">
                                  <i className="fa-solid fa-star text-warning me-2" />
                                  {course.ratingText ?? "Sem avaliação"}
                                </p>
                                <span className="dot" />
                                <p>{course.status}</p>
                              </div>
                              <div className="d-flex justify-content-between mt-3 align-items-center">
                                <h5 className="text-secondary">
                                  {course.price > 0
                                    ? `MZN${course.price.toFixed(2)}`
                                    : "Gratuito"}
                                </h5>
                                {alreadyEnrolled ? (
                                  <Link
                                    to={`${route.courseWatch}?id=${course.id}`}
                                    className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
                                  >
                                    <i className="fa-solid fa-play me-2" />
                                    Ver Curso
                                  </Link>
                                ) : (
                                  <button
                                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => handleAddToCart(e, course)}
                                  >
                                    <i className="isax isax-shopping-cart5 me-2" />
                                    Adicionar ao Carrinho
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* /paginação */}
                {/* Paginação */}
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <p className="pagination-text">
                      Página {page + 1} de {totalPages}
                    </p>
                  </div>
                  <div className="col-md-10">
                    <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                      <li
                        className={`page-item prev ${
                          page === 0 ? "disabled" : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          tabIndex={-1}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(page - 1);
                          }}
                        >
                          <i className="fas fa-angle-left" />
                        </Link>
                      </li>

                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            page === i ? "active first-page" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(i);
                            }}
                          >
                            {i + 1}
                          </Link>
                        </li>
                      ))}

                      <li
                        className={`page-item next ${
                          page === totalPages - 1 ? "disabled" : ""
                        }`}
                      >
                        <Link
                          className="page-link"
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(page + 1);
                          }}
                        >
                          <i className="fas fa-angle-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* /paginação */}
              </div>
            </div>
          </div>
        </section>
        {/* /Curso */}
      </>
    </>
  );
};

export default CourseList;