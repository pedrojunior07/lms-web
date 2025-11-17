import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";

const Knowledge = () => {
  const route = all_routes;
  return (
    <>
      {/* Compartilhar Conhecimento */}
      <div className="section share-knowledge">
        <div className="home-three-sec-bg">
          <ImageWithBasePath
            src="assets/img/bg/bg-3.png"
            alt="img"
            className="img-fluid sec-bg-01"
          />
          <ImageWithBasePath
            src="assets/img/bg/bg-4.png"
            alt="img"
            className="img-fluid sec-bg-02"
          />
        </div>
        <div className="container">
          <div className="row align-items-center row-gap-4">
            <div className="col-md-6">
              <div className="knowledge-img aos" data-aos="fade-up">
                <ImageWithBasePath
                  src="assets/img/feature/feature-17.svg"
                  alt="Img"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div className="join-mentor aos" data-aos="fade-up">
                <h2>
                  Quer compartilhar seu conhecimento? Junte-se a nós como Mentor
                </h2>
                <p>
                  Vídeo em alta definição é um vídeo com resolução e qualidade
                  superiores ao padrão. Embora não haja um significado
                  padronizado para alta definição, geralmente refere-se a
                  qualquer vídeo com maior qualidade.
                </p>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex mb-3">
                    <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                    Acesse sua aula de qualquer lugar
                  </li>
                  <li className="d-flex mb-3">
                    <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                    Plano de curso flexível
                  </li>
                  <li className="d-flex mb-3">
                    <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                    Garantia de qualidade
                  </li>
                  <li className="d-flex mb-3">
                    <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                    Custo-benefício
                  </li>
                  <li className="d-flex mb-3">
                    <i className="isax isax-tick-circle5 text-success fs-24 me-2" />
                    Os melhores instrutores do mundo
                  </li>
                </ul>
                <div>
                  <Link
                    to={route.instructorList}
                    className="btn btn-secondary btn-xl"
                  >
                    Saiba mais
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Compartilhar Conhecimento */}
    </>
  );
};

export default Knowledge;
