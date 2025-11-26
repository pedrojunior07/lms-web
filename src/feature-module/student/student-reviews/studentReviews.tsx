import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import ProfileCard from "../common/profileCard";
import { all_routes } from "../../router/all_routes";

const StudentReviews = () => {

    const route = all_routes;

  return (
    <>
      <Breadcrumb title="Avaliações" />

      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            {/* barra lateral */}
            <StudentSidebar />
            {/* barra lateral */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Avaliações</h5>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">6 meses atrás</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    Este é o segundo curso de Photoshop que concluí com
                    Nancy Duarte. Vale cada centavo e recomendo fortemente. Para
                    aproveitar ao máximo este curso, é melhor fazer o
                    curso do Iniciante ao Avançado primeiro. A qualidade do som e vídeo
                    é de um bom padrão. Obrigado Nancy Duarte.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Editar
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Excluir
                    </Link>
                  </div>
                </div>
                <div className="bg-light border p-3 rounded-2">
                  <h6 className="mb-1">Resposta</h6>
                  <p className="fs-14">
                    Como um aprendiz que navegou por várias plataformas online,
                    a sofisticação e o design centrado no usuário deste
                    website estabelecem um novo padrão
                  </p>
                </div>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 meses atrás</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    Tenho usado este LMS por vários meses para meus cursos online,
                    e tem sido um divisor de águas. A interface é
                    incrivelmente amigável, facilitando tanto para
                    instrutores quanto para alunos navegarem pelos cursos.
                    A variedade de ferramentas disponíveis para criar conteúdo
                    interativo e envolvente melhorou significativamente a experiência de aprendizagem.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Editar
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Excluir
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border mb-3 p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 meses atrás</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    Sempre que tive uma pergunta ou encontrei um problema menor,
                    a equipe de suporte ao cliente foi rápida para responder e
                    incrivelmente útil. Além disso, a confiabilidade deste LMS
                    me impressionou—o tempo de inatividade é quase inexistente, garantindo
                    que os alunos tenham acesso aos seus cursos 24/7.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Editar
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Excluir
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded-2">
                <div className="d-flex flex-wrap gap-1 align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg avatar-rounded me-2">
                      <Link to={route.studentsDetails}>
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="img"
                        />
                      </Link>
                    </div>
                    <div className="reviewer-info">
                      <h6 className="mb-1">
                        <Link to={route.studentsDetails}>Ronald Richard</Link>
                      </h6>
                      <p className="fs-14">9 meses atrás</p>
                    </div>
                  </div>
                  <div className="rating">
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star filled" />
                    <i className="fa-solid fa-star" />
                  </div>
                </div>
                <div className="mb-3">
                  <p>
                    Desde o início, minha experiência com este Site LMS tem sido
                    nada menos que extraordinária. Como um aprendiz que
                    navegou por várias plataformas online, a
                    sofisticação e o design centrado no usuário deste website estabelecem
                    um novo referencial para como a educação digital deve ser.
                  </p>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center me-3 edit-review"
                      data-bs-toggle="modal"
                      data-bs-target="#edit_review"
                    >
                      <i className="isax isax-edit-2 me-1" />
                      Editar
                    </Link>
                    <Link
                      to="#"
                      className="d-inline-flex align-items-center delete-review"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="isax isax-trash me-1" />
                      Excluir
                    </Link>
                  </div>
                </div>
              </div>
              {/* /paginação */}
              <div className="row align-items-center mt-3">
                <div className="col-md-2">
                  <p className="pagination-text">Página 1 de 2</p>
                </div>
                <div className="col-md-10">
                  <ul className="pagination lms-page justify-content-center justify-content-md-end mt-2 mt-md-0">
                    <li className="page-item prev">
                      <Link
                        className="page-link"
                        to="#"
                        tabIndex={-1}
                      >
                        <i className="fas fa-angle-left" />
                      </Link>
                    </li>
                    <li className="page-item first-page active">
                      <Link className="page-link" to="#">
                        1
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        2
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link className="page-link" to="#">
                        3
                      </Link>
                    </li>
                    <li className="page-item next">
                      <Link className="page-link" to="#">
                        <i className="fas fa-angle-right" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* /paginação */}
            </div>
          </div>
        </div>
      </div>

      {/* Editar Avaliação */}
      <div className="modal fade" id="edit_review">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Editar Avaliação</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="mb-3">
                <label className="form-label fs-14">
                  Sua Classificação <span className="text-danger">*</span>
                </label>
                <div className="selection-wrap">
                  <div className="d-inline-block">
                    <div className="rating-selction">
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={5}
                        id="rating5"
                        defaultChecked
                      />
                      <label htmlFor="rating5">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={4}
                        id="rating4"
                        defaultChecked
                      />
                      <label htmlFor="rating4">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={3}
                        id="rating3"
                        defaultChecked
                      />
                      <label htmlFor="rating3">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={2}
                        id="rating2"
                      />
                      <label htmlFor="rating2">
                        <i className="fa-solid fa-star" />
                      </label>
                      <input
                        type="radio"
                        name="rating"
                        defaultValue={1}
                        id="rating1"
                      />
                      <label htmlFor="rating1">
                        <i className="fa-solid fa-star" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fs-14">
                  Escreva Sua Avaliação <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control lh-base"
                  rows={3}
                  defaultValue={
                    "Este é o segundo curso de Photoshop que concluí com Nancy Duarte. Vale cada centavo e recomendo fortemente. Para aproveitar ao máximo este curso, é melhor fazer o curso do Iniciante ao Avançado primeiro. A qualidade do som e vídeo é de um bom padrão. Obrigado Nancy Duarte."
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to="#"
                className="btn btn-md bg-gray-100 rounded-pill me-2"
                data-bs-dismiss="modal"
              >
                Cancelar
              </Link>
              <button
                type="button"
                className="btn btn-md btn-secondary rounded-pill"
                 data-bs-dismiss="modal"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Editar Avaliação */}
      {/* Modal de Exclusão */}
      <div className="modal fade" id="delete_modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center custom-modal-body">
              <span className="avatar avatar-lg bg-secondary-transparent rounded-circle mb-2">
                <i className="isax isax-trash fs-24 text-danger" />
              </span>
              <div>
                <h4 className="mb-2">Excluir Avaliação</h4>
                <p className="mb-3">Tem certeza que deseja excluir a avaliação?</p>
                <div className="d-flex align-items-center justify-content-center">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </Link>
                  <Link to="#" className="btn btn-secondary rounded-pill"  data-bs-dismiss="modal">
                    Sim, Remover Tudo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Modal de Exclusão */}
    </>
  );
};

export default StudentReviews;