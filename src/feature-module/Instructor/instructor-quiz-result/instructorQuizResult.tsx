import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { studentResultData } from "../../../core/common/data/json/studentresult";
import Table from "../../../core/common/dataTable/index";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import PredefinedDateRanges from "../../../core/common/range-picker/datePicker";
import ReactApexChart from "react-apexcharts";

const InstructorQuizResult = () => {
  const data = studentResultData;
  const columns = [
    {
      title: "Nome do Estudante",
      dataIndex: "StudentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={all_routes.studentsDetails}
            className="avatar avatar-md avatar-rounded flex-shrink-0 me-2"
          >
            <ImageWithBasePath src={`assets/img/user/${record.Img}`} alt="" />
          </Link>
          <Link to={all_routes.studentsDetails}>
            <p className="fs-14">{text}</p>
          </Link>
        </div>
      ),
      sorter: (a: any, b: any) => a.StudentName.length - b.StudentName.length,
    },

    {
      title: "Pontuação",
      dataIndex: "Score",
      sorter: (a: any, b: any) => a.Score.length - b.Score.length,
    },
    {
      title: "Tentativas",
      dataIndex: "Attempts",
      sorter: (a: any, b: any) => a.Attempts.length - b.Attempts.length,
    },
    {
      title: "Tempo de Finalização",
      dataIndex: "FinishTime",
      sorter: (a: any, b: any) => a.FinishTime.length - b.FinishTime.length,
    },
  ];
  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />

          <div className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />

            <div className="row g-4 mt-3">
              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-primary-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/graduation.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Cursos Inscritos</span>
                        <h4 className="fs-24 mt-1">12</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-secondary-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/book.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Cursos Ativos</span>
                        <h4 className="fs-24 mt-1">08</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-success-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/bookmark.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Cursos Concluídos</span>
                        <h4 className="fs-24 mt-1">06</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-info-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/user-octagon.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Total de Estudantes</span>
                        <h4 className="fs-24 mt-1">17</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-blue-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/book-2.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Total de Cursos</span>
                        <h4 className="fs-24 mt-1">11</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <span className="icon-box bg-purple-transparent me-2">
                        <ImageWithBasePath
                          src="assets/img/icon/money-add.svg"
                          alt=""
                        />
                      </span>
                      <div>
                        <span className="d-block">Ganhos Totais</span>
                        <h4 className="fs-24 mt-1">$486</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap gap-3 justify-content-between border-bottom mb-2 pb-3">
                  <h5 className="fw-bold">Ganhos por Ano</h5>
                  <div className="input-icon position-relative input-range-picker">
                    <span className="input-icon-addon">
                      <i className="isax isax-calendar" />
                    </span>
                    <PredefinedDateRanges />
                  </div>
                </div>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 290,
                    },
                    xaxis: {
                      categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                    },
                  }}
                  series={[
                    {
                      name: "Ganhos",
                      data: [10, 41, 35, 51, 49, 62],
                    },
                  ]}
                  type="bar"
                  height={290}
                />
              </div>
            </div>

            <h5 className="mb-3 fw-bold mt-4">Cursos Criados Recentemente</h5>
            <div className="table-responsive custom-table">
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th>Cursos</th>
                    <th>Inscritos</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-01.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Curso Completo de HTML, CSS e Javascript
                              <br />
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>0</td>
                    <td>Publicado</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-02.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Curso Completo de Desenvolvedor Web
                              <br /> Fullstack
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>2</td>
                    <td>Publicado</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-03.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Fundamentos de Ciência de Dados e
                              <br /> Bootcamp Avançado
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>2</td>
                    <td>Publicado</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-04.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Domine Microserviços com Spring Boot
                              <br /> e Spring Cloud
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>1</td>
                    <td>Publicado</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="course-title d-flex align-items-center">
                        <Link
                          to={all_routes.courseDetails}
                          className="avatar avatar-xl flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/instructor/instructor-table-05.jpg"
                            alt="Img"
                          />
                        </Link>
                        <div>
                          <p className="fw-medium">
                            <Link to={all_routes.courseDetails}>
                              Informações sobre Graduação em
                              <br /> Design UI/UX
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>0</td>
                    <td>Publicado</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* /Sidebar */}
            <div className="col-lg-9">
              <h5 className="page-title">Resultados do Quiz</h5>
              <div className="card">
                <div className="card-body">
                  <div className="d-sm-flex align-items-center">
                    <div className="quiz-img me-3 mb-2 mb-sm-0">
                      <ImageWithBasePath
                        src="assets/img/students/quiz.jpg"
                        alt=""
                      />
                    </div>
                    <div>
                      <h5 className="mb-2">
                        <Link to="#">
                          Informações sobre Graduação em Design UI/UX
                        </Link>
                      </h5>
                      <div className="question-info d-flex align-items-center">
                        <p className="d-flex align-items-center fs-14 me-2 pe-2 border-end mb-0">
                          <i className="isax isax-message-question5 text-primary-soft me-2" />
                          25 Questões
                        </p>
                        <p className="d-flex align-items-center fs-14 mb-0">
                          <i className="isax isax-clock5 text-secondary-soft me-2" />
                          30 Minutos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="card bg-secondary-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">
                            Total de Participantes
                          </h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            30
                          </span>
                        </div>
                        <div className="icon-box bg-soft-secondary">
                          <ImageWithBasePath
                            src="assets/img/icon/user-tick.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="card bg-info-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">Pontuações</h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            03
                          </span>
                        </div>
                        <div className="icon-box  bg-soft-info">
                          <ImageWithBasePath
                            src="assets/img/icon/document.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="card bg-purple-transparent border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1 fw-normal text-gray-5">
                            Tempo Médio
                          </h6>
                          <span className="fs-20 fw-bold mb-1 d-block text-gray-9">
                            00:00:55
                          </span>
                        </div>
                        <div className="icon-box  bg-soft-purple">
                          <ImageWithBasePath
                            src="assets/img/icon/clock.svg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Table dataSource={data} columns={columns} Search={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorQuizResult;