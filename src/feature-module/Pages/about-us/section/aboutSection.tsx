import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const AboutSection = () => {
  return (
    <>
      {/* about */}
      <section className="about-section-two pb-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="p-3 p-sm-4 position-relative">
                <div className="position-absolute top-0 start-0 z-n1">
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-1.svg"
                    alt="img"
                  />
                </div>
                <div className="position-absolute bottom-0 end-0 z-n1">
                  <ImageWithBasePath
                    src="assets/img/shapes/shape-2.svg"
                    alt="img"
                  />
                </div>
                <div className="position-absolute bottom-0 start-0 mb-md-5 ms-md-n5">
                  <ImageWithBasePath
                    src="assets/img/icons/icon-1.svg"
                    alt="img"
                  />
                </div>
                <ImageWithBasePath
                  className="img-fluid img-radius"
                  src="./assets/img/about/about-2.svg"
                  alt="Educação Sustentável"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="ps-0 ps-lg-2 pt-4 pt-lg-0 ps-xl-5">
                <div className="section-header">
                  <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                    Sobre a EthenaLearn
                  </span>
                  <h2>Educação Sustentável para um Futuro Verde</h2>
                  <p>
                    Na EthenaLearn, acreditamos que a educação é a chave para um
                    futuro mais sustentável. Nossa plataforma 100% digital
                    elimina a necessidade de papel, reduz emissões de carbono e
                    oferece aprendizado de qualidade com impacto ambiental
                    positivo.
                  </p>
                </div>
                <div className="d-flex align-items-center about-us-banner">
                  <div>
                    <span className="bg-primary-transparent rounded-3 p-2 about-icon d-flex justify-content-center align-items-center">
                      <i className="isax isax-global fs-24" />
                    </span>
                  </div>
                  <div className="ps-3">
                    <h6 className="mb-2">Impacto Global Sustentável</h6>
                    <p>
                      Cada curso realizado em nossa plataforma evita o uso de
                      aproximadamente 2.5kg de papel e reduz 1.2kg de emissões
                      de CO₂ comparado ao ensino tradicional.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center about-us-banner">
                  <div>
                    <span className="bg-secondary-transparent rounded-3 p-2 about-icon d-flex justify-content-center align-items-center">
                      <i className="isax isax-tree fs-24" />
                    </span>
                  </div>
                  <div className="ps-3">
                    <h6 className="mb-2">Compromisso Ambiental</h6>
                    <p>
                      Para cada 100 estudantes ativos, plantamos uma árvore. Já
                      contribuímos para o plantio de mais de 5.000 árvores em
                      parceria com ONGs ambientais.
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center about-us-banner">
                  <div>
                    <span className="bg-success-transparent rounded-3 p-2 about-icon d-flex justify-content-center align-items-center">
                      <i className="isax isax-flash-1 fs-24" />
                    </span>
                  </div>
                  <div className="ps-3">
                    <h6 className="mb-2">Energia 100% Renovável</h6>
                    <p>
                      Nossos servidores são alimentados exclusivamente por
                      energia solar e eólica, garantindo que sua jornada de
                      aprendizado seja completamente carbono neutro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about */}
    </>
  );
};

export default AboutSection;
