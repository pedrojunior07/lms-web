import React from "react";

const Vision = () => {
  return (
    <>
      {/* Seção Visão */}
      <div className="vision-section">
        <div className="container">
          <div className="row row-gap-4">
            <div className="col-xl-3 col-lg-6 d-flex">
              <div className="vision-item flex-fill">
                <span className="vision-icon border">
                  <i
                    className="fas fa-certificate"
                    style={{ color: "green", fontSize: "2rem" }}
                  ></i>
                </span>
                <p>Certifique-se com mais de 100 cursos com certificação</p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 d-flex">
              <div className="vision-item flex-fill">
                <span className="vision-icon border">
                  <i
                    className="fas fa-cloud"
                    style={{ color: "green", fontSize: "2rem" }}
                  ></i>
                </span>
                <p>Mantenha-se atualizado com as novidades em nuvem</p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 d-flex">
              <div className="vision-item flex-fill">
                <span className="vision-icon border">
                  <i
                    className="fas fa-graduation-cap"
                    style={{ color: "green", fontSize: "2rem" }}
                  ></i>
                </span>
                <p>
                  Desenvolva habilidades do seu jeito, de laboratórios a cursos
                </p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 d-flex">
              <div className="vision-item flex-fill">
                <span className="vision-icon border">
                  <i
                    className="fas fa-chalkboard-teacher"
                    style={{ color: "green", fontSize: "2rem" }}
                  ></i>
                </span>
                <p>Mantenha-se motivado com instrutores engajadores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Seção Visão */}
    </>
  );
};

export default Vision;
