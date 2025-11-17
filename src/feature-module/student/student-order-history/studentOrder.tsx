import React from "react";
import { all_routes } from "../../router/all_routes";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import StudentSidebar from "../common/studentSidebar";

const StudentOrder = () => {
  const route = all_routes;

  // Recupera os dados do usuário do localStorage
  const getUserData = () => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('id')
    const role = localStorage.getItem('role')
    const email = localStorage.getItem('email')
    const user = localStorage.getItem('user')

    return {
      token,
      id,
      role,
      email,
      user: user ? JSON.parse(user) : null
    }
  }

  const userData = getUserData()

  // Formata o role para exibição
  const formatRole = (role: string | null) => {
    if (!role) return 'Usuário'
    return role.replace('ROLE_', '').toLowerCase()
  }

  // Nome do usuário
  const getUserName = () => {
    if (userData.user && userData.user.name) {
      return userData.user.name
    }
    if (userData.user && userData.user.firstName) {
      return `${userData.user.firstName} ${userData.user.lastName || ''}`
    }
    return userData.email || 'Usuário'
  }

  // Foto do perfil
  const getProfilePhoto = () => {
    if (userData.user && userData.user.photo) {
      return userData.user.photo
    }
    return 'assets/img/user/user-02.jpg'
  }

  return (
    <>
      <Breadcrumb title="Histórico de Pedidos" />
      <div className="content">
        <div className="container">
          {/* profile box */}
          <div className="profile-card overflow-hidden bg-blue-gradient2 mb-5 p-5">
            <div className="profile-card-bg">
              <ImageWithBasePath
                src="assets/img/bg/card-bg-01.png"
                className="profile-card-bg-1"
                alt=""
              />
            </div>
            <div className="row align-items-center row-gap-3">
              <div className="col-lg-12">
                <div className="d-flex align-items-center">
                  <span className="avatar avatar-xxl avatar-rounded me-3 border border-white border-2 position-relative">
                    <ImageWithBasePath src={getProfilePhoto()} alt={getUserName()} />
                    <span className="verify-tick">
                      <i className="isax isax-verify5" />
                    </span>
                  </span>
                  <div>
                    <h5 className="mb-1 text-white d-inline-flex align-items-center">
                      {getUserName()}
                      <Link
                        to={route.studentProfile}
                        className="link-light fs-16 ms-2"
                      >
                        <i className="isax isax-edit-2" />
                      </Link>
                    </h5>
                    <p className="text-light">{formatRole(userData.role)}</p>
                    <p className="text-light small">{userData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* profile box */}
          <div className="row">
            {/* sidebar */}
            <StudentSidebar />
            {/* sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5>Histórico de Pedidos</h5>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle btn rounded border d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Status
                      </Link>
                      <ul className="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Concluído
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Pendente
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="input-icon mb-3">
                    <span className="input-icon-addon">
                      <i className="isax isax-search-normal-14" />
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-md"
                      placeholder="Pesquisar"
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive custom-table">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>ID do Pedido</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD010
                        </Link>
                      </td>
                      <td>22 Ago 2025</td>
                      <td>$160</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD009
                        </Link>
                      </td>
                      <td>10 Ago 2025</td>
                      <td>$180</td>
                      <td>
                        <span className="badge bg-info d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Pendente
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD008
                        </Link>
                      </td>
                      <td>26 Jul 2025</td>
                      <td>$200</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD007
                        </Link>
                      </td>
                      <td>12 Jul 2025</td>
                      <td>$220</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD006
                        </Link>
                      </td>
                      <td>02 Jul 2025</td>
                      <td>$170</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Link
                          to="#"
                          className="text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#view_invoice"
                        >
                          #ORD005
                        </Link>
                      </td>
                      <td>25 Jun 2025</td>
                      <td>$150</td>
                      <td>
                        <span className="badge bg-success d-inline-flex align-items-center me-1">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Concluído
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 me-1 action-icon"
                            data-bs-toggle="modal"
                            data-bs-target="#view_invoice"
                          >
                            <i className="isax isax-eye" />
                          </Link>
                          <Link
                            to="#"
                            className="d-inline-flex fs-14 action-icon"
                          >
                            <i className="isax isax-import" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Invoice */}
      <div className="modal fade" id="view_invoice">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Fatura</h5>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="isax isax-close-circle5" />
              </button>
            </div>
            <div className="modal-body">
              <div className="border-bottom mb-3">
                <div className="row justify-content-between align-items-center flex-wrap row-gap-4">
                  <div className="col-md-6">
                    <div className="mb-2 invoice-logo-white">
                      <ImageWithBasePath
                        src="assets/img/logo.png"
                        className="img-fluid"
                        alt="logo"
                      />
                    </div>
                    <p className="mb-2">
                      3099 Kennedy Court Framingham, MA 01702
                    </p>
                  </div>
                  <div className="col-md-6">
                    <div className=" text-end mb-3">
                      <h6 className="text-default mb-1 text-secondary fs-16">
                        #OI0010
                      </h6>
                      <p className="mb-1">
                        Data de Criação :{" "}
                        <span className="text-gray-9">25 Ago, 2025</span>{" "}
                      </p>
                      <p>
                        Data de Vencimento :{" "}
                        <span className="text-gray-9">30 Ago, 2025</span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-bottom mb-3">
                <div className="row g-4">
                  <div className="col-lg-5">
                    <span className="mb-3 d-flex">De</span>
                    <div>
                      <h6 className="mb-2 fs-16">Thomas Lawler</h6>
                      <p className="fs-14 mb-1">
                        2077 Chicago Avenue Orosi, CA 93647
                      </p>
                      <p className="fs-14 mb-1">
                        Email : thomaslawler@example.com
                      </p>
                      <p className="fs-14">Telefone : +1 987 654 3210</p>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <span className="mb-3 d-flex">Para</span>
                    <div>
                      <h6 className="mb-2">{getUserName()}</h6>
                      <p className="fs-14 mb-1">
                        3103 Trainer Avenue Peoria, IL 61602
                      </p>
                      <p className="fs-14 mb-1">
                        Email : <Link to="#">{userData.email}</Link>
                      </p>
                      <p className="fs-14">
                        Telefone : <Link to="#">+1 987 471 6589</Link>
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="mb-3 text-end">
                      <span className="mb-1 d-block">Status do Pagamento</span>
                      <span className="badge bg-success badge-sm d-inline-flex align-items-center fs-10 fw-normal mb-4">
                        <i className="fa-solid fa-circle fs-5 me-1" />
                        Concluído
                      </span>
                      <div>
                        <ImageWithBasePath
                          src="assets/img/icon/qr.svg"
                          className="img-fluid"
                          alt="QR"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="table-responsive custom-table rounded-0">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th className="w-50">Descrição</th>
                        <th className="text-center">Qtd</th>
                        <th className="text-end">Custo</th>
                        <th className="text-end">Desconto</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p className="text-gray-9">
                            Informações sobre Curso de UI/UX Design
                          </p>
                        </td>
                        <td className="text-gray text-center">1</td>
                        <td className="text-gray text-end">$120</td>
                        <td className="text-gray text-end">$0</td>
                        <td className="text-gray text-end">$120</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="border-bottom mb-3 pb-3">
                <div className="row">
                  <div className="col-md-6" />
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center border-bottom my-2 pb-2 pe-3">
                      <p className="text-gray mb-0">Subtotal</p>
                      <p className="text-gray-9 fw-medium">$120</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-bottom my-2 pb-2 pe-3">
                      <p className="mb-0">Desconto (0%)</p>
                      <p className="text-gray-9 fs-14 fw-medium">$0</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3 pe-3">
                      <p className="mb-0">IVA (5%)</p>
                      <p className="text-gray-9 fs-14 fw-medium mb-2">$0</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2 pe-3">
                      <h6 className="fs-16">Valor Total</h6>
                      <h6 className="fs-16">$120</h6>
                    </div>
                    <p>Valor por Extenso : Dólar Cento e Vinte</p>
                  </div>
                </div>
              </div>
              <div className="row align-items-center gy-3">
                <div className="col-lg-9">
                  <div className="mb-3">
                    <h6 className="mb-1 fs-15">Notas</h6>
                    <p>
                      Fatura para compra de curso, cobrindo taxa do curso, descontos e impostos aplicáveis.
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-1 fs-16">Termos e Condições</h6>
                    <p>
                      O pagamento integral concede acesso não transferível ao curso, sujeito à política de reembolso do provedor.
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-end pe-4 mb-2">
                    <ImageWithBasePath
                      src="assets/img/icons/sign.svg"
                      className="img-fluid"
                      alt="sign"
                    />
                  </div>
                  <div className="text-end">
                    <h6 className="fs-15 pe-3 mb-2">Ted M. Davis</h6>
                    <p>Gerente Assistente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /View Invoice */}
    </>
  );
};

export default StudentOrder;