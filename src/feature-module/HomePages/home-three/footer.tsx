import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";

const Footer = () => {
  return (
    <footer className="footer footer-three">
      {/* Topo do Rodapé */}
      <div className="footer-top aos" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-between row-gap-4">
            <div className="col-lg-4 col-md-12">
              {/* Widget de Rodapé */}
              <div className="footer-widget footer-about">
                <div className="footer-logo">
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    alt="logo"
                  />
                </div>
                <div className="footer-about-content">
                  <p>
                    Plataforma projetada para ajudar organizações, educadores e
                    alunos a gerenciar, entregar e acompanhar atividades de
                    aprendizagem e treinamento.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/appstore.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </Link>
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/icons/googleplay.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </Link>
                </div>
              </div>
              {/* /Widget de Rodapé */}
            </div>
            <div className="col-lg-8">
              <div className="row row-gap-4">
                <div className="col-lg-3 col-md-6">
                  {/* Widget de Rodapé */}
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Suporte</h6>
                    <ul>
                      <li>
                        <Link to={all_routes.courseGrid}>Educação</Link>
                      </li>
                      <li>
                        <Link to={all_routes.addNewCourse}>
                          Inscrever-se em um Curso
                        </Link>
                      </li>
                      <li>
                        <Link to={all_routes.register}>Pedidos</Link>
                      </li>
                      <li>
                        <Link to={all_routes.pricingPlan}>Pagamentos</Link>
                      </li>
                      <li>
                        <Link to={all_routes.contactUs}>Fale Conosco</Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Widget de Rodapé */}
                </div>
                <div className="col-lg-3 col-md-6">
                  {/* Widget de Rodapé */}
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Sobre</h6>
                    <ul>
                      <li>
                        <Link to={all_routes.courseCategory}>Categorias</Link>
                      </li>
                      <li>
                        <Link to={all_routes.courseCategory}>Serviços</Link>
                      </li>
                      <li>
                        <Link to={all_routes.about_us}>Quem Somos</Link>
                      </li>
                      <li>
                        <Link to={all_routes.FAQ}>Perguntas Frequentes</Link>
                      </li>
                      <li>
                        <Link to={all_routes.blogGrid3}>Blog</Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Widget de Rodapé */}
                </div>
                <div className="col-lg-3 col-md-6">
                  {/* Widget de Rodapé */}
                  <div className="footer-widget footer-menu">
                    <h6 className="footer-title">Links Úteis</h6>
                    <ul>
                      <li>
                        <Link to="#">Nossos valores</Link>
                      </li>
                      <li>
                        <Link to="#">Conselho consultivo</Link>
                      </li>
                      <li>
                        <Link to="#">Nossos parceiros</Link>
                      </li>
                      <li>
                        <Link to="#">Seja um parceiro</Link>
                      </li>
                      <li>
                        <Link to="#">Aprendizado Futuro</Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Widget de Rodapé */}
                </div>
                <div className="col-lg-3 col-md-6">
                  {/* Widget de Contato */}
                  <div className="footer-widget footer-contact">
                    <h6 className="footer-title">Informações de Contato</h6>
                    <ul>
                      <li>
                        <div className="contact-infos">
                          <span>Telefone</span>
                          <p>310-437-2766</p>
                        </div>
                      </li>
                      <li>
                        <div className="contact-infos">
                          <span>E-mail</span>
                          <p>contact@example.com</p>
                        </div>
                      </li>
                      <li>
                        <div className="contact-infos">
                          <span>Endereço</span>
                          <p>706 Campfire Ave. Meriden, CT</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* /Widget de Contato */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Topo do Rodapé */}

      {/* Rodapé Inferior */}
      <div className="footer-bottom">
        <div className="container">
          {/* Direitos Autorais */}
          <div className="row row-gap-3">
            <div className="col-md-4">
              <div className="copyright-text">
                <p>
                  Copyright 2025 © <Link to="#">DreamsLMS</Link>. Todos os
                  direitos reservados.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/fb.svg"
                    alt="facebook"
                    className="img-fluid"
                  />
                </Link>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/instagram.svg"
                    alt="instagram"
                    className="img-fluid"
                  />
                </Link>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/be.svg"
                    alt="behance"
                    className="img-fluid"
                  />
                </Link>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/linkedin.svg"
                    alt="linkedin"
                    className="img-fluid"
                  />
                </Link>
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/icons/x.svg"
                    alt="twitter"
                    className="img-fluid"
                  />
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="privacy-link">
                <Link to={all_routes.termsConditions} className="mb-0">
                  Termos &amp; Política
                </Link>
                <Link to={all_routes.privacyPolicy}>
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
          {/* /Direitos Autorais */}
        </div>
      </div>
      {/* /Rodapé Inferior */}
    </footer>
  );
};

export default Footer;
