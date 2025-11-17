import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../router/all_routes";

const Becomeinstructor = () => {
  const route = all_routes;
  return (
    <>
      {/* Torne-se um Instrutor */}
      <div className="section become-instructors aos" data-aos="fade-up">
        <ImageWithBasePath
          src="assets/img/bg/bg-5.png"
          alt=""
          className="img-fluid become-instructors-bg1"
        />
        <ImageWithBasePath
          src="assets/img/bg/bg-6.png"
          alt=""
          className="img-fluid become-instructors-bg2"
        />
        <div className="container">
          <div className="row row-gap-3">
            <div className="col-md-6 d-flex">
              <div className="student-mentor d-flex flex-fill">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-md-12">
                    <div className="top-instructors">
                      <h4>Seja um Instrutor</h4>
                      <p>
                        Instrutores de todo o mundo ensinam milhões de alunos na
                        plataforma Mentoring.
                      </p>
                      <Link
                        to={route.becomeAnInstructor}
                        className="btn btn-secondary btn-xl"
                      >
                        Registrar como Instrutor
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12">
                    <div className="mentor-img">
                      <ImageWithBasePath
                        className="img-fluid d-none d-lg-flex"
                        alt="Img"
                        src="assets/img/feature/feature-15.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex">
              <div className="student-mentor bg-dark d-flex flex-fill">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-md-12">
                    <div className="top-instructors">
                      <h4>Transforme o Acesso à Educação</h4>
                      <p>
                        Crie uma conta para receber nossa newsletter e promoções
                        de cursos.
                      </p>
                      <Link
                        to={route.becomeAnInstructor}
                        className="btn btn-secondary btn-xl"
                      >
                        Registrar como Instrutor
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-12">
                    <div className="mentor-img d-none d-lg-flex">
                      <ImageWithBasePath
                        className="img-fluid"
                        alt="Img"
                        src="assets/img/feature/feature-14.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Torne-se um Instrutor */}
    </>
  );
};

export default Becomeinstructor;
