import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bg">
        <ImageWithBasePath
          src="assets/img/bg/footer-bg-01.png"
          className="footer-bg-1"
          alt=""
        />
        <ImageWithBasePath
          src="assets/img/bg/footer-bg-02.png"
          className="footer-bg-2"
          alt=""
        />
      </div>
      <div className="footer-top">
        <div className="container">
          <div className="row row-gap-4">
            <div className="col-lg-4">
              <div className="footer-about">
                <div className="footer-logo">
                  <ImageWithBasePath src="assets/img/logo.png" alt="" />
                </div>
                <p>
                  Plataforma concebida para ajudar organizações, educadores e
                  aprendizes a gerir, entregar e acompanhar actividades de
                  aprendizagem e formação.
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row row-gap-4">
                <div className="col-lg-3">
                  <div className="footer-widget footer-menu">
                    <h5 className="footer-title">Para Instrutores</h5>
                    <ul>
                      <li>
                        <Link to={all_routes.courseGrid}>Procurar Mentores</Link>
                      </li>
                      <li>
                        <Link to={all_routes.login}>Iniciar Sessão</Link>
                      </li>
                      <li>
                        <Link to={all_routes.register}>Registar</Link>
                      </li>
                      <li>
                        <Link to={all_routes.courseList}>Reservas</Link>
                      </li>
                      <li>
                        <Link to={all_routes.studentDashboard}>
                          Painel do Estudante
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="footer-widget footer-menu">
                    <h5 className="footer-title">Para Estudantes</h5>
                    <ul>
                      <li>
                        <Link to="#">Marcaçoes</Link>
                      </li>
                      <li>
                        <Link to={all_routes.instructorMessage}>Chat</Link>
                      </li>
                      <li>
                        <Link to={all_routes.login}>Iniciar Sessão</Link>
                      </li>
                      <li>
                        <Link to={all_routes.register}>Registar</Link>
                      </li>
                      <li>
                        <Link to={all_routes.instructorDashboard}>
                          Painel do Instrutor
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="footer-widget footer-contact">
                    <h5 className="footer-title">Newsletter</h5>
                    <div className="subscribe-input">
                      <form action="#">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Introduza o seu Email"
                        />
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm inline-flex align-items-center"
                        >
                          <i className="isax isax-send-2 me-1" />
                          Subscrever
                        </button>
                      </form>
                    </div>
                    <div className="footer-contact-info">
                      <div className="footer-address d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icon/icon-20.svg"
                          alt="Img"
                          className="img-fluid me-2"
                        />
                        <p>
                          {" "}
                          Avenida 25 de Setembro, Maputo,
                          <br /> Moçambique{" "}
                        </p>
                      </div>
                      <div className="footer-address d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icon/icon-19.svg"
                          alt="Img"
                          className="img-fluid me-2"
                        />
                        <p>info@dreamslms.co.mz</p>
                      </div>
                      <div className="footer-address d-flex align-items-center">
                        <ImageWithBasePath
                          src="assets/img/icon/icon-21.svg"
                          alt="Img"
                          className="img-fluid me-2"
                        />
                        <p>+258 84 123 4567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row row-gap-2">
            <div className="col-md-6">
              <div className="text-center text-md-start">
                <p className="text-white">
                  Copyright © 2025 DreamsLMS. Todos os direitos reservados.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <ul className="d-flex align-items-center justify-content-center justify-content-md-end footer-link">
                  <li>
                    <Link to={all_routes.termsConditions}>
                      Termos &amp; Condições
                    </Link>
                  </li>
                  <li>
                    <Link to={all_routes.privacyPolicy}>Política de Privacidade</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;