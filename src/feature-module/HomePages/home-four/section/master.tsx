import React from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Master = () => {
  return (
    <>
      {/* Master Skills */}
      <section className="master-skills-sec pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto">
              <div className="section-header text-center">
                <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                  O que oferecemos
                </span>
                <h2>Domine habilidades essenciais para sua carreira</h2>
                <p>
                  A Athena E-learn oferece cursos online flexíveis e acessíveis,
                  focados em Gestão Ambiental, para que você aprenda ao seu
                  ritmo e de acordo com suas necessidades.
                </p>
              </div>
            </div>
          </div>

          {/* Curso Info*/}
          <div className="course-info-two">
            <div className="skills-item">
              <div className="skills-wrap">
                <div className="row row-gap-4 align-items-center">
                  {/* Master skills Content */}
                  <div
                    className="col-xl-5 col-lg-6 col-md-12 order-lg-0 order-md-0 order-0"
                    data-aos="fade-up"
                  >
                    <h3>📚 Cursos Online</h3>
                    <p>
                      Oferecemos cursos flexíveis e acessíveis, focados em
                      Gestão Ambiental, que permitem aos alunos aprender ao seu
                      ritmo.
                    </p>
                    <ul className="list-unstyled heading-color mb-4">
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Acesso a uma plataforma online fácil de usar
                      </li>
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Aprendizado baseado em conteúdo relevante e local
                      </li>
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Aprenda ao seu próprio ritmo, 100% online
                      </li>
                    </ul>
                  </div>
                  {/* /Master skills Content */}
                  {/* Master skills Image */}
                  <div
                    className="col-xl-7 col-lg-6 col-md-12 order-lg-1 order-md-1 order-1"
                    data-aos="fade-up"
                  >
                    <div className="join-mentor-img">
                      <ImageWithBasePath
                        src="https://www.terradecultivo.com.br/tcsolucoesambientais/wp-content/uploads/2022/01/blog_tcsa_gestaoamiental-1080x675.jpg"
                        alt="Img"
                        className="img-fluid rounded-4"
                      />
                    </div>
                  </div>
                  {/* /Master skills Image */}
                </div>
              </div>
            </div>

            <div className="skills-item">
              <div className="skills-wrap skill-center">
                <div className="row row-gap-4 align-items-center">
                  {/* Master skills Content */}
                  <div
                    className="col-xl-7 col-lg-7 col-md-12 order-lg-2 order-md-3 order-3"
                    data-aos="fade-up"
                  >
                    <h3>👩‍🏫 Instrutores Qualificados</h3>
                    <p>
                      Contamos com especialistas experientes e dedicados, que
                      garantem uma aprendizagem prática e relevante.
                    </p>
                    <ul className="list-unstyled heading-color mb-4">
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Instrutores experientes e especializados em Gestão
                        Ambiental
                      </li>
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Ensinar práticas aplicáveis ao contexto moçambicano
                      </li>
                    </ul>
                  </div>
                  {/* /Master skills Content */}
                  {/* Master skills Image */}
                  <div
                    className="col-xl-5 col-lg-5 col-md-12 order-lg-3 order-md-2 order-2"
                    data-aos="fade-up"
                  >
                    <div className="join-mentor-img">
                      <ImageWithBasePath
                        src="https://blog.estacio.br/wp-content/uploads/2023/08/Gestao-ambiental.jpeg"
                        alt="Img"
                        className="img-fluid rounded-4"
                      />
                    </div>
                  </div>
                  {/* /Master skills Image */}
                </div>
              </div>
            </div>

            <div className="skills-item">
              <div className="skills-wrap">
                <div className="row row-gap-4 align-items-center">
                  {/* Master skills Content */}
                  <div
                    className="col-xl-5 col-lg-7 col-md-12 order-lg-4 order-md-4 order-4"
                    data-aos="fade-up"
                  >
                    <h3>💬 Comunicação Efectiva</h3>
                    <p>
                      Promovemos uma interação contínua entre alunos e
                      instrutores, com canais abertos para dúvidas e partilhas.
                    </p>
                    <ul className="list-unstyled heading-color mb-4">
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Canais de comunicação abertos para dúvidas
                      </li>
                      <li className="d-flex mb-3">
                        <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                        Discussões e troca de ideias entre alunos e instrutores
                      </li>
                    </ul>
                  </div>
                  {/* /Master skills Content */}
                  {/* Master skills Image */}
                  <div
                    className="col-xl-7 col-lg-5 col-md-12 order-lg-5 order-md-5 order-5"
                    data-aos="fade-up"
                  >
                    <div className="join-mentor-img">
                      <ImageWithBasePath
                        src="https://credcarbo.com/wp-content/uploads/8-praticas-de-gestao-ambiental-e-os-beneficios-para-a-sua-empresa.webp"
                        alt="Img"
                        className="img-fluid rounded-4"
                      />
                    </div>
                  </div>
                  {/* /Master skills Image */}
                </div>
              </div>
            </div>
          </div>
          {/* /Course Info */}
        </div>
      </section>
      {/* /Master Skills */}
    </>
  );
};

export default Master;
