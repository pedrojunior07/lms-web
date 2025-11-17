import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Faq = () => {
  return (
    <>
      {/* faq */}
      <section className="faq-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 pe-md-5">
              <div className="position-relative">
                <ImageWithBasePath
                  className="img-fluid rounded-4"
                  src="assets/img/about/about-1.jpg"
                  alt="Sustentabilidade EthenaLearn"
                />
                <div className="bg-success text-center p-3 rounded-5 position-absolute top-0 end-0 z-index-1 d-none d-sm-block my-3 mx-3">
                  <i className="isax isax-tree heading-color fs-46" />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="section-header">
                <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
                  Perguntas Frequentes
                </span>
                <h2>Dúvidas sobre Sustentabilidade</h2>
                <p>
                  Esclarecemos as principais questões sobre nosso compromisso
                  ambiental e práticas sustentáveis na educação digital.
                </p>
              </div>
              <div className="faq-content">
                <div
                  className="accordion accordion-customicon1 accordions-items-seperate"
                  id="accordioncustomicon1Example"
                >
                  <div className="accordion-item" data-aos="fade-up">
                    <h2 className="accordion-header" id="headingcustomicon1One">
                      <Link
                        to="#"
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1One"
                        aria-expanded="true"
                        aria-controls="collapsecustomicon1One"
                      >
                        Como a EthenaLearn contribui para a sustentabilidade?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1One"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingcustomicon1One"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          A EthenaLearn elimina completamente o uso de papel,
                          reduz emissões de CO₂ através do ensino remoto,
                          utiliza 100% energia renovável em nossos servidores e
                          destina parte da receita para projetos de
                          reflorestamento. Cada estudante ativo representa uma
                          economia de 2.5kg de papel e 1.2kg de CO₂ por curso.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2 className="accordion-header" id="headingcustomicon1Two">
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Two"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Two"
                      >
                        Vocês realmente plantam árvores?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Two"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Two"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Sim! Temos parceria com ONGs ambientais certificadas e
                          plantamos uma árvore para cada 100 estudantes ativos.
                          Já contribuímos para o plantio de mais de 5.200
                          árvores. Você pode acompanhar o progresso em tempo
                          real no seu painel de impacto ambiental pessoal.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Three"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Three"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Three"
                      >
                        Como posso acompanhar meu impacto ambiental?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Three"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Three"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Cada estudante possui um "Painel Verde" personalizado
                          que mostra: papel economizado, CO₂ evitado, árvores
                          preservadas e sua contribuição para o reflorestamento.
                          Também oferecemos badges de sustentabilidade e
                          certificados verdes para reconhecer seu compromisso
                          ambiental.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Four"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Four"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Four"
                      >
                        A energia dos servidores é realmente renovável?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Four"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Four"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Absolutamente! Nossos data centers são alimentados
                          100% por energia solar e eólica. Temos certificação
                          Green Web Foundation e relatórios trimestrais de
                          auditoria energética. Também compensamos qualquer
                          pegada de carbono residual através de créditos de
                          carbono verificados.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={250}
                  >
                    <h2
                      className="accordion-header"
                      id="headingcustomicon1Five"
                    >
                      <Link
                        to="#"
                        className="accordion-button collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsecustomicon1Five"
                        aria-expanded="false"
                        aria-controls="collapsecustomicon1Five"
                      >
                        Como vocês garantem a qualidade mantendo a
                        sustentabilidade?{" "}
                        <i className="isax isax-add fs-20 fw-semibold ms-1" />
                      </Link>
                    </h2>
                    <div
                      id="collapsecustomicon1Five"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingcustomicon1Five"
                      data-bs-parent="#accordioncustomicon1Example"
                    >
                      <div className="accordion-body pt-0">
                        <p>
                          Sustentabilidade e qualidade andam juntas na
                          EthenaLearn. Nossos instrutores são especialistas em
                          suas áreas E em práticas sustentáveis. Todos os cursos
                          incluem módulos de consciência ambiental. Utilizamos
                          tecnologia de ponta para otimizar recursos e garantir
                          a melhor experiência de aprendizado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* faq */}
    </>
  );
};

export default Faq;
