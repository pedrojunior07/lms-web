import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";
import Table from "../../../core/common/dataTable/index";
import { StudentRefferalData } from "../../../core/common/data/json/studentRefferalData";

const StudentRefferal = () => {
  const route = all_routes;

  const data = StudentRefferalData;
  const columns = [
    {
      title: "ID Indicado",
      dataIndex: "Referred_ID",
      render: (text: string) => (
        <Link to="#" className="text-primary">
          {text}
        </Link>
      ),
      sorter: (a: any, b: any) => a.Referred_ID.length - b.Referred_ID.length,
    },

    {
      title: "Indicações",
      dataIndex: "Referrals",
      render: (text: string, rendor: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={route.instructorDetails}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={`assets/img/user/${rendor.image}`} alt="" />
          </Link>
          <Link to={route.instructorDetails}>
            <p className="fs-14">{text}</p>
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.Referrals.length - b.Referrals.length,
    },
    {
      title: "URL",
      dataIndex: "URL",
      sorter: (a: any, b: any) => a.URL.length - b.URL.length,
    },
    {
      title: "",
      dataIndex: "FIELD4",
      render: (text: string) => (
        <Link to="#" className="action-icon">
          <i className="isax isax-document-copy4" />
        </Link>
      ),
      sorter: (a: any, b: any) => a.FIELD4.length - b.FIELD4.length,
    },
    {
      title: "Visitas",
      dataIndex: "Visits",
      sorter: (a: any, b: any) => a.Visits.length - b.Visits.length,
    },
    {
      title: "Total Ganho",
      dataIndex: "Total_Earned",
      sorter: (a: any, b: any) => a.Total_Earned.length - b.Total_Earned.length,
    },
  ];

  return (
    <>
      <Breadcrumb title="Indicações" />

      <div className="content">
        <div className="container">
          {/* caixa de perfil */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-6">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath
                      src="assets/img/user/user-02.jpg"
                      alt=""
                    />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      Ronald Richard
                      <Link
                        to={route.studentProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">Estudante</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center justify-content-lg-end flex-wrap gap-2">
                  <Link
                    to={route.courseList}
                    className="btn btn-white rounded-pill me-3"
                  >
                    Explorar Cursos
                  </Link>
                  <Link
                    to={route.studentDashboard}
                    className="btn btn-secondary rounded-pill"
                  >
                    Meu Painel
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* caixa de perfil */}
          <div className="row">
            {/* barra lateral */}
            <StudentSidebar />
            {/* barra lateral */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Indicações</h5>
              </div>
              <div className="row">
                <div className="col-xl-4 col-md-6">
                  <div className="student-info bg-skyblue-transparent referral-card border-0">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-skyblue me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/dollar-circle.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">
                          Ganhos Líquidos
                        </h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-skyblue">
                          $12.000
                        </span>
                        <p className="fs-13">Ganhos este mês</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="student-info border-0 bg-secondary-transparent referral-card">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-secondary me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/wallet.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">Saldo</h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-secondary">
                          $15.000
                        </span>
                        <p className="fs-13">Na Carteira</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="student-info border-0 bg-info-transparent referral-card">
                    <div className="d-flex align-items-center">
                      <div className="referral-icon bg-info me-3">
                        <ImageWithBasePath
                          src="assets/img/icon/wallet.svg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-gray-5 fw-normal">
                          Nº de Indicações
                        </h6>
                        <span className="fs-20 fw-semibold mb-1 d-block text-info">
                          10
                        </span>
                        <p className="fs-13">Neste mês</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h5 className="mb-3 fs-18">Seu Link de Indicação</h5>
                      <p className="mb-2">
                        Você pode ganhar dinheiro facilmente copiando e compartilhando
                      </p>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="https://dreamslmscourse.com/refer/?refid=345re667877k9"
                        />
                      </div>
                      <Link to="#" className="btn btn-secondary rounded-pill">
                        Copiar link
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <h5 className="mb-3 fs-18">Sacar Dinheiro</h5>
                      <ul className="mb-4">
                        <li className="mb-2">
                          Saque com segurança para sua conta bancária.
                        </li>
                        <li>Comissão de $25 por transação abaixo de $10.000</li>
                      </ul>
                      <Link
                        to="#"
                        className="btn btn-secondary rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#withdraw_request"
                      >
                        Sacar Dinheiro
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Table dataSource={data} columns={columns} Search={true} />
            </div>
          </div>
        </div>
      </div>
      <>
        {/* Visualizar Fatura */}
        <div className="modal fade" id="withdraw_request">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Solicitação de Saque</h5>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="isax isax-close-circle5" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="card withdraw-item">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-6">
                          <div>
                            <p className="mb-1">Saldo para Saque</p>
                            <h6>$15000</h6>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div>
                            <p className="mb-1">Selecionado </p>
                            <h6>PayPal</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Valor <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="$"
                    />
                    <p className="d-flex align-items-center pt-1">
                      <i className="isax isax-info-circle me-1" />
                      Valor mínimo de saque é $50
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn bg-gray-100 rounded-pill me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </Link>
                  <button
                    className="btn btn-secondary rounded-pill"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Visualizar Fatura */}
      </>
    </>
  );
};

export default StudentRefferal;