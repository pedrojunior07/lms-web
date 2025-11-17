import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import Slider from "react-slick";

const Institution = () => {
  const institutionslider = {
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1800,
    speed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 6,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <>
      {/* institutions */}
      <section className="client-section bg-light">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
              Parceiros Sustentáveis
            </span>
            <h2>Organizações que Confiam em Nossa Missão Verde</h2>
            <p>
              Trabalhamos com{" "}
              <span className="text-decoration-underline text-secondary fw-bold">
                50+
              </span>{" "}
              instituições comprometidas com a sustentabilidade e educação
              responsável
            </p>
          </div>

          {/* Environmental Partners */}
          <div className="row mb-5">
            <div className="col-12">
              <h6 className="text-center mb-4 text-success">
                🌱 Parceiros Ambientais
              </h6>
              <Slider
                {...institutionslider}
                className="institutions-slider lazy slider"
              >
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-tree fs-32 text-success mb-2"></i>
                    <small className="d-block">WWF Brasil</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-global fs-32 text-primary mb-2"></i>
                    <small className="d-block">Greenpeace</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-sun-1 fs-32 text-warning mb-2"></i>
                    <small className="d-block">SOS Mata Atlântica</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-leaf fs-32 text-success mb-2"></i>
                    <small className="d-block">Instituto Akatu</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-recycle fs-32 text-info mb-2"></i>
                    <small className="d-block">CEMPRE</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-flash-1 fs-32 text-warning mb-2"></i>
                    <small className="d-block">ABEEÓLICA</small>
                  </div>
                </div>
                <div className="institutions-items p-1">
                  <div className="partner-card text-center p-3 bg-white rounded shadow-sm">
                    <i className="isax isax-heart fs-32 text-danger mb-2"></i>
                    <small className="d-block">Fundação Gaia</small>
                  </div>
                </div>
              </Slider>
            </div>
          </div>

          {/* Educational Partners */}
          <div className="row">
            <div className="col-12">
              <h6 className="text-center mb-4 text-primary">
                🎓 Parceiros Educacionais
              </h6>
              <Slider
                {...institutionslider}
                className="institutions-slider lazy slider"
              >
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/01.svg"
                    alt="Universidade Sustentável"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/02.svg"
                    alt="Instituto Verde"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/03.svg"
                    alt="Escola Ecológica"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/04.svg"
                    alt="Centro de Educação Ambiental"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/05.svg"
                    alt="Faculdade Sustentável"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/06.svg"
                    alt="Instituto de Tecnologia Verde"
                  />
                </div>
                <div className="institutions-items p-1">
                  <ImageWithBasePath
                    className="img-fluid"
                    src="./assets/img/client/07.svg"
                    alt="Universidade Ecológica"
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* Certifications */}
          <div className="row mt-5">
            <div className="col-12">
              <h6 className="text-center mb-4 text-secondary">
                🏆 Certificações e Reconhecimentos
              </h6>
              <div className="row justify-content-center">
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className="certification-badge p-3 bg-success-light rounded">
                    <i className="isax isax-award fs-24 text-success"></i>
                    <small className="d-block mt-2">ISO 14001</small>
                  </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className="certification-badge p-3 bg-primary-light rounded">
                    <i className="isax isax-medal-star fs-24 text-primary"></i>
                    <small className="d-block mt-2">B Corp</small>
                  </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className="certification-badge p-3 bg-warning-light rounded">
                    <i className="isax isax-crown-1 fs-24 text-warning"></i>
                    <small className="d-block mt-2">Green Web</small>
                  </div>
                </div>
                <div className="col-md-2 col-4 text-center mb-3">
                  <div className="certification-badge p-3 bg-info-light rounded">
                    <i className="isax isax-star-1 fs-24 text-info"></i>
                    <small className="d-block mt-2">Carbon Neutral</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* institutions */}
    </>
  );
};

export default Institution;
