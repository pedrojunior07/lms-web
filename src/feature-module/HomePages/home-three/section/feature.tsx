import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";
import { useCourseApi } from "../../../../core/api/hooks/useCourseApi";
import { useCart } from "../../../../core/common/context/cartContext";

const Feature = () => {
  const [featureCourses, setFeautured] = useState<any[]>([]);
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
    addToCart(course);
  };

  const { getTop10Cources } = useCourseApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getTop10Cources();
        setFeautured(data.data);
        console.log(data);
      } catch (error: any) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      {/* Cursos em Destaque */}
      <div className="section new-course">
        <div className="home-three-sec-bg">
          {" "}
          <ImageWithBasePath
            src="assets/img/bg/bg-3.png"
            alt="img"
            className="img-fluid sec-bg-01"
          />
          <ImageWithBasePath
            src="assets/img/bg/bg-4.png"
            alt="img"
            className="img-fluid sec-bg-02"
          />
        </div>
        <div className="container">
          <div
            className="d-flex align-items-center justify-content-between flex-wrap gap-3 aos"
            data-aos="fade-up"
          >
            <div className="section-header">
              <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                Novidades
              </span>
              <h2 className="mb-0">Cursos em Destaque</h2>
            </div>
            <div>
              <Link to={route.courseList} className="btn btn-secondary btn-xl">
                Ver todas as categorias
              </Link>
            </div>
          </div>
          <div className="course-feature">
            <div className="row">
              {featureCourses.map((course) => (
                <div className="col-lg-4 col-md-6 d-flex" key={course.id}>
                  <div
                    className="course-item course-item-three mx-0 flex-fill aos"
                    data-aos="fade-up"
                  >
                    <div className="course-img">
                      <Link to={`${route.courseDetails}?id=${course.id}`}>
                        <ImageWithBasePath
                          className="img-fluid"
                          alt="Img"
                          src={
                            course.thumbnailPath ??
                            "assets/img/course/course-40.jpg"
                          }
                        />
                      </Link>
                      <div className="price">
                        <h3>{course.price ?? 0}</h3>
                      </div>
                    </div>
                    <div className="course-content">
                      <div className="course-user">
                        <div className="course-user-img">
                          <Link to={route.instructorProfile}>
                            <ImageWithBasePath
                              src="assets/img/avatar/avatar-21.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                          </Link>
                          <div className="course-name">
                            <h4>
                              <Link to={route.instructorProfile}>
                                {course.instructorName ?? "N/A"}
                              </Link>
                            </h4>
                            <p>Instrutor</p>
                          </div>
                        </div>
                        <button
                          className={`fav-icon ${
                            selectedItems[course.id] ? "selected" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleItemClick(course.id);
                          }}
                        >
                          <i className="fa-regular fa-heart" />
                        </button>
                      </div>
                      <h3 className="title">
                        <Link to={route.courseDetails}>
                          {course.title ?? "N/A"}
                        </Link>
                      </h3>
                      <div className="course-info d-flex align-items-center">
                        <div className="course-lesson d-flex align-items-center">
                          <ImageWithBasePath
                            src="assets/img/icons/icon-3.svg"
                            alt="Img"
                          />
                          <p>{course.lessonCount ?? 0} Aula(s)</p>
                        </div>
                        <div className="course-time d-flex align-items-center">
                          <ImageWithBasePath
                            src="assets/img/icons/icon-4.svg"
                            alt="Img"
                          />
                          <p>9h 30min</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating m-0">
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star filled" />
                          <i className="fas fa-star" />
                          <span className="d-inline-block average-rating">
                            <span>4.0</span> (15)
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-xl d-inline-flex align-items-center"
                          onClick={(e) => handleAddToCart(e, course)}
                        >
                          <i className="isax isax-shopping-cart5 me-2" />
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* /Cursos em Destaque */}
    </>
  );
};

export default Feature;
