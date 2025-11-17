import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import CountUp from "react-countup";

const Counter = () => {
  return (
    <>
      {/* counter */}
      <section className="counter-sec">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="fw-medium text-secondary text-decoration-underline mb-2 d-inline-block">
              Nosso Impacto Ambiental
            </span>
            <h2>Números que Fazem a Diferença</h2>
            <p>
              Cada estatística representa nosso compromisso com um futuro mais
              sustentável através da educação digital responsável.
            </p>
          </div>
          <div className="row gy-3">
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0 bg-success-light">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon1.svg"
                        alt="Árvores Salvas"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-success">
                        <span className="count-digit">
                          <CountUp end={15} />
                        </span>
                        K+
                      </h4>
                      <p>Árvores Preservadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0 bg-primary-light">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon2.svg"
                        alt="CO2 Reduzido"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-primary">
                        <span className="count-digit">
                          <CountUp end={850} />
                        </span>
                        T
                      </h4>
                      <p>CO₂ Evitado (Toneladas)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0 bg-warning-light">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="counter-icon">
                      <ImageWithBasePath
                        src="./assets/img/icons/counter-icon3.svg"
                        alt="Energia Renovável"
                      />
                    </div>
                    <div className="count-content">
                      <h4 className="text-warning">
                        <span className="count-digit">
                          <CountUp end={100} />
                        </span>
                        %
                      </h4>
                      <p>Energia Renovável</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="card border-0 mb-0 bg-info-light">
                <div className="card-body d-flex align-items-center">
                  <div className="counter-icon">
                    <ImageWithBasePath
                      src="./assets/img/icons/counter-icon4.svg"
                      alt="Estudantes Conscientes"
                    />
                  </div>
                  <div className="count-content">
                    <h4 className="text-info">
                      <span className="count-digit">
                        <CountUp end={75} />
                      </span>
                      K+
                    </h4>
                    <p>Estudantes Eco-Conscientes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Environmental Stats */}
          <div className="row gy-3 mt-4">
            <div className="col-xl-4 col-md-6">
              <div className="card border-0 mb-0 bg-secondary-light">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="isax isax-recycle fs-48 text-secondary"></i>
                  </div>
                  <h4 className="text-secondary">
                    <CountUp end={2.5} decimals={1} />M
                  </h4>
                  <p className="mb-0">Folhas de Papel Economizadas</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card border-0 mb-0 bg-success-light">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="isax isax-tree fs-48 text-success"></i>
                  </div>
                  <h4 className="text-success">
                    <CountUp end={5.2} decimals={1} />K
                  </h4>
                  <p className="mb-0">Árvores Plantadas</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div className="card border-0 mb-0 bg-primary-light">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <i className="isax isax-global fs-48 text-primary"></i>
                  </div>
                  <h4 className="text-primary">
                    <CountUp end={45} />
                  </h4>
                  <p className="mb-0">Países Impactados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* counter */}
    </>
  );
};

export default Counter;
