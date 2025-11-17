import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import Slider from "react-slick";

const Testimonials = () => {
  const route = all_routes;
  const testimonialsSlider = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* testimonials */}
      <section className="testimonials-section text-center">
        <div className="container">
          <div className="section-header text-center">
            <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
              Depoimentos Sustentáveis
            </span>
            <h2>Vozes da Comunidade Verde</h2>
            <p>
              Histórias reais de pessoas que escolheram aprender de forma
              sustentável e estão fazendo a diferença no mundo.
            </p>
          </div>
          <Slider
            {...testimonialsSlider}
            className="testimonials-slider lazy mt-4"
          >
            <div>
              <div className="testimonials-item rounded-3 bg-white">
                <div className="position-relative d-inline-flex mb-2">
                  <div className="avatar rounded-circle avatar-xxl border border-success border-3">
                    <Link to={route.instructorDetails}>
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-41.jpg"
                        alt="Marina Silva - Bióloga"
                      />
                    </Link>
                  </div>
                  <i className="isax isax-tree bg-success quote rounded-pill fs-16 p-1 text-white" />
                </div>
                <h6 className="mb-1">
                  <Link to={route.instructorDetails}>Marina Silva</Link>
                </h6>
                <p className="fs-14 mb-3 text-success">Bióloga Ambiental</p>
                <p className="mb-3 text-truncate line-clamb-3">
                  "A EthenaLearn não apenas me ensinou sobre sustentabilidade,
                  mas me mostrou como cada escolha educacional pode impactar
                  positivamente o planeta. Já economizei 15kg de papel em meus
                  estudos!"
                </p>
                <div className="mb-3">
                  <span className="badge bg-success-light text-success me-1">
                    <i className="isax isax-leaf me-1"></i>
                    Eco-Warrior
                  </span>
                  <span className="badge bg-primary-light text-primary">
                    <i className="isax isax-tree me-1"></i>5 Árvores
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                </div>
              </div>
            </div>
            <div>
              <div className="testimonials-item rounded-3 bg-white">
                <div className="position-relative d-inline-flex mb-2">
                  <div className="avatar rounded-circle avatar-xxl border border-primary border-3">
                    <Link to={route.instructorDetails}>
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-42.jpg"
                        alt="Carlos Mendes - Engenheiro"
                      />
                    </Link>
                  </div>
                  <i className="isax isax-flash-1 bg-primary quote rounded-pill fs-16 p-1 text-white" />
                </div>
                <h6 className="mb-1">
                  <Link to={route.instructorDetails}>Carlos Mendes</Link>
                </h6>
                <p className="fs-14 mb-3 text-primary">Engenheiro de Energia</p>
                <p className="mb-3 text-truncate line-clamb-3">
                  "Incrível saber que meu aprendizado é 100% alimentado por
                  energia renovável. Os cursos de energia sustentável me
                  ajudaram a implementar soluções verdes na minha empresa,
                  reduzindo 30% do consumo energético."
                </p>
                <div className="mb-3">
                  <span className="badge bg-warning-light text-warning me-1">
                    <i className="isax isax-sun-1 me-1"></i>
                    Solar Expert
                  </span>
                  <span className="badge bg-info-light text-info">
                    <i className="isax isax-global me-1"></i>
                    Carbon Neutral
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                </div>
              </div>
            </div>
            <div>
              <div className="testimonials-item rounded-3 bg-white">
                <div className="position-relative d-inline-flex mb-2">
                  <div className="avatar rounded-circle avatar-xxl border border-info border-3">
                    <Link to={route.instructorDetails}>
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-43.jpg"
                        alt="Ana Costa - Educadora"
                      />
                    </Link>
                  </div>
                  <i className="isax isax-heart bg-info quote rounded-pill fs-16 p-1 text-white" />
                </div>
                <h6 className="mb-1">
                  <Link to={route.instructorDetails}>Ana Costa</Link>
                </h6>
                <p className="fs-14 mb-3 text-info">Educadora Ambiental</p>
                <p className="mb-3 text-truncate line-clamb-3">
                  "Como educadora, fico emocionada em saber que cada aula que
                  dou aqui contribui para um futuro mais verde. Meus alunos
                  aprendem não apenas conteúdo, mas também consciência
                  ambiental."
                </p>
                <div className="mb-3">
                  <span className="badge bg-success-light text-success me-1">
                    <i className="isax isax-book-1 me-1"></i>
                    Green Teacher
                  </span>
                  <span className="badge bg-secondary-light text-secondary">
                    <i className="isax isax-people me-1"></i>
                    500+ Alunos
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                </div>
              </div>
            </div>
            <div>
              <div className="testimonials-item rounded-3 bg-white">
                <div className="position-relative d-inline-flex mb-2">
                  <div className="avatar rounded-circle avatar-xxl border border-warning border-3">
                    <Link to={route.instructorDetails}>
                      <ImageWithBasePath
                        className="img-fluid rounded-circle"
                        src="./assets/img/user/user-44.jpg"
                        alt="Roberto Lima - Empresário"
                      />
                    </Link>
                  </div>
                  <i className="isax isax-crown-1 bg-warning quote rounded-pill fs-16 p-1 text-white" />
                </div>
                <h6 className="mb-1">
                  <Link to={route.instructorDetails}>Roberto Lima</Link>
                </h6>
                <p className="fs-14 mb-3 text-warning">CEO Sustentável</p>
                <p className="mb-3 text-truncate line-clamb-3">
                  "Transformei minha empresa em um negócio sustentável graças
                  aos cursos da EthenaLearn. O melhor é saber que meu
                  aprendizado também está ajudando a plantar árvores e reduzir
                  emissões de carbono."
                </p>
                <div className="mb-3">
                  <span className="badge bg-warning-light text-warning me-1">
                    <i className="isax isax-briefcase me-1"></i>
                    Eco-CEO
                  </span>
                  <span className="badge bg-success-light text-success">
                    <i className="isax isax-medal-star me-1"></i>
                    B-Corp
                  </span>
                </div>
                <div>
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                  <i className="fa-solid fa-star text-warning" />
                </div>
              </div>
            </div>
          </Slider>

          {/* Impact Summary */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="bg-success-light rounded-4 p-4">
                <h5 className="text-success mb-3">
                  <i className="isax isax-heart me-2"></i>
                  Impacto Coletivo da Nossa Comunidade
                </h5>
                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-3">
                    <h4 className="text-success mb-1">2.5M+</h4>
                    <small>Folhas Economizadas</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h4 className="text-success mb-1">850T</h4>
                    <small>CO₂ Evitado</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h4 className="text-success mb-1">5.2K</h4>
                    <small>Árvores Plantadas</small>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <h4 className="text-success mb-1">75K+</h4>
                    <small>Eco-Estudantes</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* testimonials */}
    </>
  );
};

export default Testimonials;
