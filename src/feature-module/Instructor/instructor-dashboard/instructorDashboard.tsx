import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import PredefinedDateRanges from "../../../core/common/range-picker/datePicker";
import ReactApexChart from "react-apexcharts";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import DashboardHeader from "./DashboardHeader";
import { usePerson } from "../../../core/api/hooks/useUserApi";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const InstructorDashboard = () => {
  const location = useLocation();
  const cartCount = 3; // exemplo estático, substitua por seu estado real
  const { getUser } = usePerson();
  const { getCourseStats } = useCourseApi();
  const [stats, setStats] = useState<any>(null);
  const [instructorCourses, setInstructorCourses] = React.useState<any[]>([]);

  const { listInstructorCourses } = useCourseApi();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        var id = localStorage.getItem("id");
        const data = await listInstructorCourses({ instructorId: id });
        setInstructorCourses(data.data.content || []);

        console.log("Fetched instructor courses:", data.data.content);
      } catch (error: any) {
        console.error(
          "Erro ao buscar categorias:",
          error.response?.data || error.message
        );
      }
    };

    fetchCategories();
  }, []);

  const [toursChart] = useState<any>({
    chart: {
      height: 290,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        endingShape: "rounded",
      },
    },
    series: [
      {
        name: "Ganhos",
        data: [80, 100, 70, 110, 80, 90, 85, 85, 110, 30, 100, 90],
      },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      labels: {
        style: {
          colors: "#4D4D4D",
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: "#4D4D4D",
          fontSize: "13px",
        },
      },
    },
    grid: {
      borderColor: "#4D4D4D",
      strokeDashArray: 5,
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "linear",
        shadeIntensity: 0.35,
        gradientToColors: ["#392C7D"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        angle: 90,
      },
    },
  });

  function onHandleMobileMenu(): void {
    throw new Error("Função não implementada.");
  }

  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />

          <main className="dashboard-main p-4 ms-260 w-100">
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
                        <h4 className="fs-24 mt-1">0</h4>
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
                        <h4 className="fs-24 mt-1">0</h4>
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
                        <h4 className="fs-24 mt-1">0</h4>
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
                        <span className="d-block">Total de Alunos</span>
                        <h4 className="fs-24 mt-1">0</h4>
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
                        <h4 className="fs-24 mt-1">0</h4>
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
                        <h4 className="fs-24 mt-1">0</h4>
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
                  options={toursChart}
                  series={toursChart.series}
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
                  {instructorCourses.slice(0, 5).map((course, index) => (
                    <tr key={index}>
                      <td>
                        <div className="course-title d-flex align-items-center">
                          <Link
                            to={{
                              pathname: `${all_routes.courseDetails}`,
                              search: `?id=${course.id}`,
                            }}
                            className="avatar avatar-xl flex-shrink-0 me-2"
                          >
                            <ImageWithBasePath
                              src={
                                course?.thumbnailPath ||
                                "assets/img/placeholder.png"
                              }
                              alt="Course Thumbnail"
                            />
                          </Link>
                          <div>
                            <p className="fw-medium mb-0">
                              <Link to={all_routes.courseDetails}>
                                {course?.title || "Sem título"}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{course?.studentsCount || 0}</td>
                      <td>{course?.status || "Rascunho"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;
