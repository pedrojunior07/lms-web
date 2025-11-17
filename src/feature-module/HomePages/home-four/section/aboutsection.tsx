import React from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";

const Aboutsection = () => {
  const route = all_routes;
  return (
    <>
      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center row-gap-4">
            <div
              className="col-lg-7 wow fadeInLeft order-lg-1 order-xs-2 order-sm-2"
              data-aos="fade-up"
            >
              <div className="section-header">
                <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                  Aprenda com Athena E-learn
                </span>
                <h2 className="mb-0">Seja Bem-vindo à Athena E-learn</h2>
              </div>
              <div className="about-content">
                <p>
                  Transforme o seu conhecimento, proteja o nosso planeta. Na
                  Athena E-learn, acreditamos que a educação é a chave para um
                  futuro sustentável. A nossa plataforma de e-learning oferece
                  cursos especializados em Gestão Ambiental, adaptados à
                  realidade de Mundo e aos desafios ambientais do nosso tempo.
                </p>
                <div className="about-img">
                  <div className="row row-gap-4">
                    <div className="col-md-4">
                      <ImageWithBasePath
                        src="https://dreamslms.dreamstechnologies.com/html/template/assets/img/about/about-3.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="col-md-4">
                      <ImageWithBasePath
                        src="https://dreamslms.dreamstechnologies.com/html/template/assets/img/about/about-4.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                    <div className="col-md-4">
                      <ImageWithBasePath
                        src="https://dreamslms.dreamstechnologies.com/html/template/assets/img/about/about-5.jpg"
                        className="img-fluid"
                        alt="img"
                      />
                    </div>
                  </div>
                </div>
                <Link
                  to={route.courseList}
                  className="btn btn-secondary btn-xl"
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div className="col-lg-5 order-lg-2 order-xs-1 order-sm-1">
              <div className="stylist-gallery">
                <div className="row row-gap-4">
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 col-12"
                    data-aos="fade-down"
                  >
                    <div className="about-image border count-one d-flex align-items-center justify-content-center flex-fill project-details">
                      <div className="about-count">
                        <div className="course-img">
                          <ImageWithBasePath
                            src="assets/img/icons/count-one.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="count-content-three course-count ms-0">
                          <h4>
                            <span className="counterUp">10</span>K
                          </h4>
                          <p className="mb-0">Online Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 col-12"
                    data-aos="fade-down"
                  >
                    <div className="about-image border count-two d-flex align-items-center justify-content-center flex-fill project-details">
                      <div className="about-count">
                        <div className="course-img">
                          <ImageWithBasePath
                            src="assets/img/icons/count-two.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="count-content-three course-count ms-0">
                          <h4>
                            <span className="counterUp">215</span>+
                          </h4>
                          <p className="mb-0">Expert Tutors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 col-12"
                    data-aos="fade-bottm"
                    data-wow-delay="1.5"
                  >
                    <div className="about-image border count-three d-flex align-items-center justify-content-center flex-fill project-details">
                      <div className="about-count">
                        <div className="course-img">
                          <ImageWithBasePath
                            src="assets/img/icons/count-three.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="count-content-three course-count ms-0">
                          <h4>
                            <span className="counterUp">10</span>K
                          </h4>
                          <p className="mb-0">Ceritified Courses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-md-6 col-sm-12 col-12"
                    data-aos="fade-top"
                    data-wow-delay="0.5"
                  >
                    <div className="about-image border count-four d-flex align-items-center justify-content-center flex-fill project-details">
                      <div className="about-count">
                        <div className="course-img">
                          <ImageWithBasePath
                            src="assets/img/icons/count-four.svg"
                            alt="Img"
                          />
                        </div>
                        <div className="count-content-three course-count ms-0">
                          <h4>
                            <span className="counterUp">10</span>K
                          </h4>
                          <p className="mb-0">Online Students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about-bg">
                  <ImageWithBasePath
                    src="assets/img/bg/bg-8.png"
                    alt="img"
                    className="about-02"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-bg">
          <ImageWithBasePath
            src="assets/img/bg/bg-7.png"
            alt="img"
            className="about-01"
          />
          <ImageWithBasePath
            src="assets/img/bg/bg-9.png"
            alt="img"
            className="about-03"
          />
        </div>
      </section>
      {/* /About us */}
    </>
  );
};

export default Aboutsection;
