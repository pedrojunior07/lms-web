import React from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Masterskill = () => {
  return (
    <>
      {/* Domine Habilidades */}
      <div className="section master-skill">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-6 col-md-12">
              <div className="section-header aos" data-aos="fade-up">
                <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                  Novidades
                </span>
                <h2>Domine as habilidades para impulsionar sua carreira</h2>
                <p>
                  Obtenha certificações, aprenda tecnologias modernas e avance
                  na sua carreira — seja você iniciante ou um profissional
                  experiente. 95% dos alunos de eLearning relatam que nosso
                  conteúdo prático ajudou diretamente em suas carreiras.
                </p>
              </div>
              <div className="career-group aos" data-aos="fade-up">
                <div className="row row-gap-4">
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="certified-item d-flex align-items-center flex-fill">
                      <div className="certified-img ">
                        <i className="fas fa-chalkboard-teacher text-primary fs-3"></i>
                      </div>
                      <p>Mantenha-se motivado com instrutores envolventes</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="certified-item d-flex align-items-center flex-fill">
                      <div className="certified-img ">
                        <i className="fas fa-cloud-upload-alt text-primary fs-3"></i>
                      </div>
                      <p>Acompanhe as novidades sobre computação em nuvem</p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="certified-item d-flex align-items-center flex-fill">
                      <div className="certified-img ">
                        <i className="fas fa-certificate text-primary fs-3"></i>
                      </div>
                      <p>
                        Obtenha certificação com mais de 100 cursos disponíveis
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 d-flex">
                    <div className="certified-item d-flex align-items-center flex-fill">
                      <div className="certified-img ">
                        <i className="fas fa-laptop-code text-primary fs-3"></i>
                      </div>
                      <p>
                        Desenvolva habilidades do seu jeito, com laboratórios e
                        cursos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="career-img aos" data-aos="fade-up">
                <ImageWithBasePath
                  src="assets/img/bg/bg-2.png"
                  alt="Imagem"
                  className="img-fluid master-bg"
                />
                <ImageWithBasePath
                  src="assets/img/feature/feature-7.png"
                  alt="Imagem"
                  className="img-fluid girl-img"
                />
                <ImageWithBasePath
                  src="assets/img/icons/icon-18.svg"
                  alt="Imagem"
                  className="img-fluid float-img-01"
                />
                <ImageWithBasePath
                  src="assets/img/icons/icon-19.svg"
                  alt="Imagem"
                  className="img-fluid float-img-02"
                />
                <ImageWithBasePath
                  src="assets/img/icons/icon-20.svg"
                  alt="Imagem"
                  className="img-fluid float-img-03"
                />
                <ImageWithBasePath
                  src="assets/img/icons/icon-21.svg"
                  alt="Imagem"
                  className="img-fluid float-img-04"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Domine Habilidades */}
    </>
  );
};

export default Masterskill;
