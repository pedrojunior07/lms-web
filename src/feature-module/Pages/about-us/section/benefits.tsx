import ImageWithBasePath from "../../../../core/common/imageWithBasePath";

const Benefits = () => {
  return (
    <>
      {/* benefits */}
      <section className="benefit-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
              Nossos Benefícios Sustentáveis
            </span>
            <h2>Aprenda Enquanto Protege o Planeta</h2>
            <p>
              Cada escolha que fazemos na EthenaLearn é pensada para maximizar o
              aprendizado e minimizar o impacto ambiental. Conheça nossos
              diferenciais verdes.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="./assets/img/shapes/bg-1.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-primary-transparent d-inline-flex">
                    <i className="isax isax-document-text fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">100% Paperless</h5>
                  <p>
                    Eliminamos completamente o uso de papel. Todos os materiais,
                    certificados e avaliações são digitais, economizando
                    milhares de árvores anualmente e reduzindo resíduos.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-2.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-secondary-transparent d-inline-flex">
                    <i className="isax isax-car fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Zero Deslocamento</h5>
                  <p>
                    Aprenda de qualquer lugar sem precisar se deslocar. Isso
                    elimina emissões de transporte, reduz o trânsito urbano e
                    economiza tempo que pode ser investido no aprendizado.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-3.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-success-transparent d-inline-flex">
                    <i className="isax isax-refresh-2 fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Economia Circular</h5>
                  <p>
                    Nosso modelo de negócio segue princípios de economia
                    circular: conteúdo reutilizável, atualizações constantes e
                    vida útil estendida dos materiais educacionais.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="./assets/img/shapes/bg-1.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-warning-transparent d-inline-flex">
                    <i className="isax isax-sun-1 fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Energia Limpa</h5>
                  <p>
                    Toda nossa infraestrutura é alimentada por energia
                    renovável. Painéis solares e turbinas eólicas garantem que
                    seu aprendizado seja 100% sustentável.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-2.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-info-transparent d-inline-flex">
                    <i className="isax isax-medal-star fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Certificação Verde</h5>
                  <p>
                    Nossos certificados digitais são reconhecidos
                    internacionalmente e incluem um selo de sustentabilidade,
                    comprovando seu compromisso com o meio ambiente.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <div className="position-absolute top-0 end-0 mt-n3 me-n4">
                    <ImageWithBasePath
                      src="assets/img/shapes/bg-3.png"
                      alt="img"
                    />
                  </div>
                  <div className="p-4 rounded-pill bg-danger-transparent d-inline-flex">
                    <i className="isax isax-heart fs-24" />
                  </div>
                  <h5 className="mt-3 mb-1">Impacto Social</h5>
                  <p>
                    Parte da nossa receita é destinada a projetos de
                    reflorestamento e educação ambiental em comunidades
                    carentes, multiplicando o impacto positivo da sua escolha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* benefits */}
    </>
  );
};

export default Benefits;
