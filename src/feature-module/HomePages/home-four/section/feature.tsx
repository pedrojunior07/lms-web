import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import { useCart } from "../../../../core/common/context/cartContext";
import { useCourseApi } from "../../../../core/api/hooks/useCourseApi";

const Feature = () => {
  const [featureCourses, setFeautured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const route = all_routes;
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );
  const { addToCart } = useCart();

  const handleItemClick = (id: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddToCart = (e: React.MouseEvent, course: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(course);
  };

  const { getTop10Cources } = useCourseApi();

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        const response = await getTop10Cources();
        
        // Verifica a estrutura da resposta e extrai os dados
        const coursesData = response.data || response || [];
        
        console.log("Featured courses data:", coursesData);
        setFeautured(Array.isArray(coursesData) ? coursesData : []);
      } catch (error: any) {
        console.error("Erro ao buscar cursos em destaque:", error);
        setFeautured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  // Função para gerar avaliações aleatórias (como fallback)
  const generateRandomRating = () => {
    const ratings = [4.5, 4.7, 4.8, 4.9, 5.0];
    const reviewCounts = [156, 203, 189, 234, 178];
    const randomIndex = Math.floor(Math.random() * ratings.length);
    return {
      rating: ratings[randomIndex],
      reviews: reviewCounts[randomIndex]
    };
  };

  // Função para gerar duração aleatória (como fallback)
  const generateRandomDuration = () => {
    const durations = ["6h 30min", "8h 15min", "5h 45min", "7h 20min", "9h 10min"];
    return durations[Math.floor(Math.random() * durations.length)];
  };

  if (loading) {
    return (
      <section className="featured-courses-sec">
        <div className="container">
          <div className="section-header text-center">
            <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
              Novidades
            </span>
            <h2>Cursos em Destaque</h2>
            <p>Carregando os melhores cursos...</p>
          </div>
          <div className="row justify-content-center">
            {[...Array(6)].map((_, index) => (
              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex mb-4" key={index}>
                <div className="course-item course-item-four mx-0 d-flex flex-column w-100">
                  <div className="course-img placeholder-glow">
                    <div className="placeholder bg-secondary" style={{ height: '200px' }}></div>
                  </div>
                  <div className="course-content d-flex flex-column flex-grow-1 p-3">
                    <div className="rating mb-2 placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </div>
                    <h3 className="title mb-2 flex-grow-0 placeholder-glow">
                      <span className="placeholder col-10"></span>
                    </h3>
                    <div className="user-info mb-2 d-flex justify-content-between align-items-center placeholder-glow">
                      <span className="placeholder col-5"></span>
                      <span className="placeholder col-4"></span>
                    </div>
                    <div className="course-info mb-2 d-flex justify-content-between align-items-center placeholder-glow">
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-3"></span>
                    </div>
                    <div className="mt-auto placeholder-glow">
                      <span className="placeholder col-12" style={{ height: '40px' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Cursos em Destaque */}
      <section className="featured-courses-sec">
        <div className="patter-bg">
          <ImageWithBasePath
            className="patter-one"
            src="assets/img/bg/bg-13.png"
            alt="Img"
          />
        </div>
        <div className="container">
          <div className="section-header text-center">
            <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
              Novidades
            </span>
            <h2>Cursos em Destaque</h2>
            <p>
              Obtenha certificação, domine habilidades tecnológicas modernas e
              impulsione sua carreira
            </p>
          </div>
          
          {featureCourses.length === 0 ? (
            <div className="text-center py-5">
              <i className="isax isax-book-1 fs-1 text-muted mb-3"></i>
              <h4 className="text-muted">Nenhum curso em destaque encontrado</h4>
              <p className="text-muted">Tente novamente mais tarde.</p>
            </div>
          ) : (
            <div className="featured-courses-two">
              <div className="row">
                {/* Cursos em Destaque */}
                {featureCourses.map((course) => {
                  const ratingInfo = generateRandomRating();
                  
                  return (
                    <div
                      className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex mb-4"
                      data-aos="fade-down"
                      key={course.id}
                    >
                      <div className="course-item course-item-four mx-0 d-flex flex-column w-100 shadow-sm hover-shadow">
                        <div className="course-img position-relative">
                          <Link
                            to={{
                              pathname: `${all_routes.courseDetails}`,
                              search: `?id=${course.id}`,
                            }}
                          >
                            <img
                              className="img-fluid w-100"
                              alt={course.title || "Curso"}
                              src={
                                course.thumbnailPath 
                                  ? course.thumbnailPath.startsWith('http') 
                                    ? course.thumbnailPath 
                                    : `/assets/img/${course.thumbnailPath}`
                                  : "/assets/img/course/course-40.jpg"
                              }
                              style={{ 
                                height: '200px', 
                                objectFit: 'cover',
                                width: '100%'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/img/course/course-40.jpg";
                              }}
                            />
                          </Link>
                          {course.price === 0 || course.isFree && (
                            <span className="course-tag free-tag position-absolute top-0 start-0 bg-success text-white px-2 py-1 m-2 rounded">
                              Grátis
                            </span>
                          )}
                        </div>
                        <div className="course-content d-flex flex-column flex-grow-1 p-3">
                          <div className="rating mb-2">
                            {[...Array(5)].map((_, index) => (
                              <i 
                                key={index}
                                className={`fas fa-star ${index < Math.floor(ratingInfo.rating) ? 'filled text-warning' : 'text-muted'}`}
                              />
                            ))}
                            <span className="ms-2 text-muted">
                              {ratingInfo.reviews} avaliações
                            </span>
                          </div>
                          
                          <h3 className="title mb-2 flex-grow-0">
                            <Link 
                              to={{
                                pathname: `${all_routes.courseDetails}`,
                                search: `?id=${course.id}`,
                              }}
                              className="text-dark text-decoration-none"
                            >
                              {course.title || "Título do Curso"}
                            </Link>
                          </h3>
                          
                          <div className="user-info mb-2 d-flex justify-content-between align-items-center">
                            <p className="user-name mb-0 text-muted">
                              <Link
                                to={{
                                  pathname: `${all_routes.instructorProfile}`,
                                  search: `?id=${course.instructorId}`,
                                }}
                                className="link-info text-decoration-none"
                              >
                                {course.instructorName || "Instrutor"}
                              </Link>
                            </p>
                            <p className="course-level mb-0 text-muted">
                              {course.level || "Intermediário"}
                            </p>
                          </div>
                          
                          <div className="course-info mb-2 d-flex justify-content-between align-items-center">
                            <p className="course-time mb-0 text-muted">
                              <i className="fa-regular fa-clock me-2" />
                              {course.duration || generateRandomDuration()}
                            </p>
                            <div className="price">
                              <h3 className="mb-0 text-primary">
                                {course.price === 0 || course.isFree ? "Grátis" : `MZN${course.price?.toFixed(2) || "0.00"}`}
                              </h3>
                            </div>
                          </div>
                          
                          {/* Botão Adicionar ao Carrinho alinhado à direita */}
                          <div className="mt-auto d-flex justify-content-end">
                            <button
                              className="btn btn-primary btn-sm d-flex align-items-center"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                                handleAddToCart(e, course)
                              }
                            >
                              <i className="isax isax-shopping-cart5 me-2" />
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* /Cursos em Destaque */}
              </div>
            </div>
          )}

          {/* Ver todos os Cursos */}
          {featureCourses.length > 0 && (
            <div className="col-lg-12 mt-4" data-aos="fade-up">
              <div className="more-details text-center">
                <Link to={route.courseList} className="btn btn-secondary btn-xl">
                  Ver Todos os Cursos{" "}
                  <i className="isax isax-arrow-right-1 ms-2" />
                </Link>
              </div>
            </div>
          )}
          {/* /Ver todos os Cursos */}
        </div>
      </section>
      {/* /Cursos em Destaque */}
    </>
  );
};

export default Feature;