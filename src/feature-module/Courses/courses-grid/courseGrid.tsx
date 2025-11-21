import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import type { SliderSingleProps } from 'antd';
import { Slider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { all_routes } from '../../router/all_routes';
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
import { useCart } from "../../../core/common/context/cartContext";
import { toast } from "react-toastify";
import { useAuth } from "../../../core/common/context/AuthContextType";

const CourseGrid = () => {
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
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
    size: 9,
    sort: "title,asc",
  });

  // Função para obter a URL da thumbnail
  const getThumbnailUrl = (thumbnailPath: string) => {
    if (!thumbnailPath) {
      return "/assets/img/course/course-02.jpg";
    }
    return thumbnailPath;
  };

  const fetchCourses = async () => {
    try {
      const data = await getSearchCourse({ ...filters, page });
      console.log("📊 Dados dos cursos (Grid):", data);
      
      if (data.data && data.data.content) {
        const processedCourses = data.data.content.map((course: any) => ({
          ...course,
          thumbnailUrl: getThumbnailUrl(course.thumbnailPath)
        }));
        
        console.log("📊 Cursos processados (Grid):", processedCourses);
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

  const handleAddToCart = (e: React.MouseEvent, course: any) => {
    e.preventDefault();
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

  const goToPage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `MZN${value}`;

  return (
    <>
      <Breadcrumb title='Grade de Cursos'/>
      
      {/* Course */}
      <section className="course-content">
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
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1One">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1One"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1One"
                      >
                        Categorias <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1One"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1One"
                      data-bs-parent="#accordioncustomicon1Example"
                      style={{}}
                    >
                      <div className="accordion-body">
                        {categories.map((category) => (
                          <div key={category.id}>
                            <label className="custom_check">
                              <input type="checkbox" name="select_category" />
                              <span className="checkmark" /> 
                              {category.name} ({category.courseCount || 0})
                            </label>
                          </div>
                        ))}
                        <Link to="#" className="see-more-btn">
                          Ver Mais
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Two">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Two"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Two"
                      >
                        Instrutores
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Two"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Two"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        {/* Instrutores podem ser adicionados posteriormente */}
                        <div>
                          <label className="custom_check">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" /> Todos os Instrutores
                          </label>
                        </div>
                        <Link to="#" className="see-more-btn">
                          Ver Mais
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Three">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Three"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Three"
                      >
                        Preço
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Three"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Three"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        <div>
                          <label className="custom_check custom_one">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" /> Todos ({courses.length})
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" /> Gratuitos ({courses.filter(c => c.price === 0).length})
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one mb-0">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" /> Pagos ({courses.filter(c => c.price > 0).length})
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Four">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Four"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Four"
                      >
                        Faixa de Preço
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Four"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Four"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        <div className="filter-range">
                          <Slider 
                            range 
                            tooltip={{ formatter }}  
                            min={0} 
                            max={5000} 
                            defaultValue={[0, 2000]}  
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingcustomicon1Five">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Five"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Five"
                      >
                        Nível
                        <i className="fa-solid fa-chevron-down" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Five"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1Five"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body">
                        <div>
                          <label className="custom_check custom_one">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" />
                            Iniciante
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" /> Intermediário
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" />
                            Avançado
                          </label>
                        </div>
                        <div>
                          <label className="custom_check custom_one mb-0">
                            <input type="checkbox" name="select_specialist" />
                            <span className="checkmark" />
                            Especialista
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              {/* Filter */}
              <div className="showing-list mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4">
                    <div className="show-result text-center text-lg-start">
                      <h6 className="fw-medium">
                        Mostrando {page * filters.size + 1}-{Math.min((page + 1) * filters.size, courses.length)} de {courses.length} resultados
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="show-filter add-course-info">
                      <form action="#">
                        <div className="d-sm-flex justify-content-center justify-content-lg-end mb-1 mb-lg-0">
                          <div className="view-icons mb-2 mb-sm-0">
                            <Link to={all_routes.courseGrid} className="grid-view active">
                              <i className="isax isax-element-3" />
                            </Link>
                            <Link to={all_routes.courseList} className="list-view">
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
              {/* /Filter */}
              <div className="row">
                {courses.map((course, index) => (
                  <div className="col-xl-4 col-md-6" key={course.id ?? index}>
                    <div className="course-item-two course-item mx-0">
                      <div className="course-img">
                        <Link to={`${all_routes.courseDetails}/${course.id}`}>
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="img-fluid"
                          />
                        </Link>
                        <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                          {course.price > 0 && (
                            <div className="badge text-bg-danger">15% off</div>
                          )}
                          <Link 
                            to="#" 
                            className={`fav-icon ms-auto ${selectedItems[index] ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleItemClick(index);
                            }}
                          >
                            <i className="isax isax-heart" />
                          </Link>
                        </div>
                      </div>
                      <div className="course-content">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm">
                              <img
                                src="./assets/img/user/user-29.jpg"
                                alt={course.instructorName}
                                className="img-fluid avatar avatar-sm rounded-circle"
                              />
                            </div>
                            <div className="ms-2">
                              <span className="link-default fs-14">
                                {course.instructorName}
                              </span>
                            </div>
                          </div>
                          <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                            {course.category?.name ?? "Sem Categoria"}
                          </span>
                        </div>
                        <h6 className="title mb-2">
                          <Link to={`${all_routes.courseDetails}/${course.id}`}>
                            {course.title}
                          </Link>
                        </h6>
                        <p className="d-flex align-items-center mb-3">
                          <i className="fa-solid fa-star text-warning me-2" />
                          {course.ratingText ?? "Sem avaliação"}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <h5 className="text-secondary mb-0">
                            {course.price > 0 
                              ? `MZN${course.price.toFixed(2)}` 
                              : "Gratuito"}
                          </h5>
                          <button
                            className="btn btn-dark btn-sm d-inline-flex align-items-center"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleAddToCart(e, course)}
                          >
                           Adicionar ao Carrinho
                            <i className="isax isax-arrow-right-3 ms-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
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
              {/* /Paginação */}
            </div>
          </div>
        </div>
      </section>
      {/* /Course */}
    </>
  );
}

export default CourseGrid;