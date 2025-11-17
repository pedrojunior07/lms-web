import React from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Knowledge = () => {
  return (
    <>
      {/* Share your knowledge */}
      <div className="knowledge-sec">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-sm-12 ps-0">
              <div className="featured-img-1" />
            </div>
            <div className="col-lg-6 col-sm-12 p-0" data-aos="fade-up">
              <div className="joing-group">
                <div className="section-header">
                  <h2 className="mb-2">
                    Seja um Mentor – Compartilhe Seu Conhecimento
                  </h2>
                </div>
                <div className="joing-list">
                  <ul>
                    <li data-aos="fade-bottom">
                      <div className="joing-header">
                        <span className="joing-icon bg-primary">
                          <ImageWithBasePath
                            src="assets/img/icons/joing-01.svg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </span>
                        <div className="joing-content">
                          <h5 className="title">Gestão Ambiental Prática</h5>
                          <p>
                            Seja parte de uma iniciativa que capacita
                            profissionais e cidadãos para atuar de forma
                            sustentável e responsável com o meio ambiente,
                            aplicando os conhecimentos adquiridos em cenários
                            reais.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li data-aos="fade-bottom">
                      <div className="joing-header">
                        <span className="joing-icon bg-warning">
                          <ImageWithBasePath
                            src="assets/img/icons/joing-02.svg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </span>
                        <div className="joing-content">
                          <h5 className="title">
                            Capacitação de Líderes Ambientais
                          </h5>
                          <p>
                            Participe no desenvolvimento de líderes que serão
                            agentes de mudança em comunidades, empresas e
                            instituições públicas, ajudando na transformação
                            ambiental de Moçambique.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li data-aos="fade-bottom">
                      <div className="joing-header">
                        <span className="joing-icon bg-success">
                          <ImageWithBasePath
                            src="assets/img/icons/joing-03.svg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </span>
                        <div className="joing-content aos">
                          <h5 className="title">
                            Ensino Personalizado em Gestão Ambiental
                          </h5>
                          <p>
                            Oferecemos cursos de fácil acesso, com materiais
                            interativos e aplicáveis ao contexto ambiental de
                            Moçambique, permitindo que os alunos aprendam no seu
                            ritmo.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li data-aos="fade-bottom" className="mb-0">
                      <div className="joing-header">
                        <span className="joing-icon bg-secondary">
                          <ImageWithBasePath
                            src="assets/img/icons/joing-04.svg"
                            alt="Img"
                            className="img-fluid"
                          />
                        </span>
                        <div className="joing-content aos">
                          <h5 className="title">Acesso a Cursos 100% Online</h5>
                          <p>
                            Com a Athena E-learn, você tem acesso a uma
                            plataforma intuitiva, onde pode estudar de qualquer
                            lugar e a qualquer hora, sem limitações. Todos os
                            nossos cursos são 100% online.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Share your knowledge */}
    </>
  );
};

export default Knowledge;
