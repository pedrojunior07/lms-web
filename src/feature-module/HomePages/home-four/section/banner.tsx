import React from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import CustomSelect from "../../../../core/common/commonSelect";
import { BannerSelectfour } from "../../../../core/common/selectOption/json/selectOption";
import { all_routes } from "../../../router/all_routes";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const route = all_routes;
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const Path = route.courseList;
    navigate(Path);
  };
  return (
    <>
      {/* Banner Principal */}
      <section className="banner-section-four d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12" data-aos="fade-up">
              <div className="home-slide-face">
                <div className="banner-content">
                  <h1 className="mt-4">
                    Cursos Online{" "}
                    <span className="text-secondary">
                      Engajantes & Acessíveis
                    </span>{" "}
                    Para Todos
                  </h1>
                  <p>
                    Nossos cursos online especializados são projetados para
                    trazer a experiência da sala de aula até você, não importa
                    onde esteja.
                  </p>
                </div>
                <div className="banner-form">
                  <form
                    onSubmit={handleSubmit}
                    className="form"
                    name="store"
                    id="store"
                    method="post"
                  >
                    <div className="form-inner1">
                      <div className="input-group">
                        <span className="drop-detail">
                          <CustomSelect
                            options={BannerSelectfour}
                            className="select d-flex"
                            placeholder="Selecionar"
                          />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar Cursos, Instrutores"
                        />
                        <button
                          className="btn btn-secondary sub-btn1"
                          type="submit"
                        >
                          <i className="fa-solid fa-magnifying-glass me-2" />
                          Buscar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="trust-user">
                  <p>
                    Confiado por mais de 15 mil usuários em todo o mundo desde
                    2024
                  </p>
                  <div className="rating">
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <i className="fas fa-star filled" />
                    <span>4.9 / 200 Avaliações</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="banner-image">
                <div className="row position-relative">
                  <div className="logo-cover">
                    <ImageWithBasePath
                      src="assets/img/logo.png"
                      width={400}
                      alt="img"
                      className="img-fluid img-05 d-none d-xl-flex aos"
                      data-aos="zoom-in"
                    />
                  </div>
                  <div className="col-md-6 d-flex">
                    <div className="flex-fill">
                      <ImageWithBasePath
                        src="assets/img/hero/Projects_01-scaled.jpg"
                        alt="img"
                        className="img-fluid h-100 flex-fill img-01 aos"
                        data-aos="fade-bottm"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 d-flex flex-column">
                    <div className="flex-fill mb-3">
                      <ImageWithBasePath
                        src="assets/img/people-1979261_1280.webp"
                        alt="img"
                        className="img-fluid img-02 aos"
                        data-aos="fade-down"
                      />
                    </div>
                    <div className="flex-fill">
                      <ImageWithBasePath
                        src="assets/img/imagem-corporativa-quais-sao-as-vantagens-de-ter-uma-boa-imagem-corporativa.webp"
                        alt="img"
                        className="img-fluid img-03 aos"
                        data-aos="fade-up"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Formas */}
          <div className="shapes">
            <ImageWithBasePath
              className="shapes-one"
              src="assets/img/bg/bg-10.png"
              alt="Img"
            />
            <ImageWithBasePath
              className="shapes-two"
              src="assets/img/bg/bg-11.png"
              alt="Img"
            />
            <ImageWithBasePath
              className="shapes-middle"
              src="assets/img/bg/bg-12.png"
              alt="Img"
            />
          </div>
          {/* /Formas */}
        </div>
      </section>
      {/* /Banner Principal */}
    </>
  );
};

export default Banner;
