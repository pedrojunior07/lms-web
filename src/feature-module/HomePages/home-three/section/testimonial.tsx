import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import Slider from "react-slick";
import { all_routes } from "../../../router/all_routes";

const Testimonial = () => {
  const testimonialslider = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const route = all_routes;

  return (
    <>
      {/* Depoimentos Quatro */}
      <div className="testimonial-four">
        <div className="review">
          <div className="container">
            <div className="section-header text-center aos" data-aos="fade-up">
              <span className="fw-medium text-white fs-18 fw-bold mb-2 d-inline-block">
                Veja essas avaliações reais
              </span>
              <h2 className="text-white mb-0">
                Os usuários nos adoram. Não acredite só na nossa palavra.
              </h2>
            </div>
            <Slider
              {...testimonialslider}
              className="mentor-testimonial lazy slider aos"
              data-aos="fade-up"
              data-sizes="50vw "
            >
              <div className="d-flex justify-content-center">
                <div className="testimonial-all">
                  <div className="testimonial-quotes">
                    <ImageWithBasePath
                      src="assets/img/icons/icon-28.png"
                      alt="Img"
                    />
                  </div>
                  <div className="testimonial-content text-center align-items-center d-flex">
                    <div className="testimonial-info ">
                      <div className="testimonial-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-29.png"
                          alt="Img"
                        />
                      </div>
                      <p>
                        Apreciei muito os insights do meu mentor, mas às vezes
                        me senti sobrecarregado com a quantidade de informações
                        fornecidas. Teria sido útil focar em uma ou duas áreas
                        por vez, em vez de tentar cobrir tudo.
                      </p>
                      <div className="testimonial-user">
                        <div className="user-img">
                          <Link to={route.instructorProfile}>
                            <ImageWithBasePath
                              src="assets/img/avatar/avatar-21.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                          </Link>
                        </div>
                        <h6>
                          <Link to={route.instructorProfile}>Daziy Millar</Link>
                        </h6>
                        <span>Fundadora da Awesomeux Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <div className="testimonial-all">
                  <div className="testimonial-quotes">
                    <ImageWithBasePath
                      src="assets/img/icons/icon-28.png"
                      alt="Img"
                    />
                  </div>
                  <div className="testimonial-content text-center align-items-center d-flex">
                    <div className="testimonial-info ">
                      <div className="testimonial-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-29.png"
                          alt="Img"
                        />
                      </div>
                      <p>
                        Apreciei muito os insights do meu mentor, mas às vezes
                        me senti sobrecarregado com a quantidade de informações
                        fornecidas. Teria sido útil focar em uma ou duas áreas
                        por vez, em vez de tentar cobrir tudo.
                      </p>
                      <div className="testimonial-user">
                        <div className="user-img">
                          <Link to={route.instructorProfile}>
                            <ImageWithBasePath
                              src="assets/img/avatar/avatar-23.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                          </Link>
                        </div>
                        <h6>
                          <Link to={route.instructorProfile}>John Smith</Link>
                        </h6>
                        <span>Fundador da Awesomeux Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <div className="testimonial-all">
                  <div className="testimonial-quotes">
                    <ImageWithBasePath
                      src="assets/img/icons/icon-28.png"
                      alt="Img"
                    />
                  </div>
                  <div className="testimonial-content text-center align-items-center d-flex">
                    <div className="testimonial-info ">
                      <div className="testimonial-icon">
                        <ImageWithBasePath
                          src="assets/img/icons/icon-29.png"
                          alt="Img"
                        />
                      </div>
                      <p>
                        Apreciei muito os insights do meu mentor, mas às vezes
                        me senti sobrecarregado com a quantidade de informações
                        fornecidas. Teria sido útil focar em uma ou duas áreas
                        por vez, em vez de tentar cobrir tudo.
                      </p>
                      <div className="testimonial-user">
                        <div className="user-img">
                          <Link to={route.instructorProfile}>
                            <ImageWithBasePath
                              src="assets/img/avatar/avatar-22.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                          </Link>
                        </div>
                        <h6>
                          <Link to={route.instructorProfile}>David Lee</Link>
                        </h6>
                        <span>Fundador da Awesomeux Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
      {/* /Depoimentos Quatro */}
    </>
  );
};

export default Testimonial;
