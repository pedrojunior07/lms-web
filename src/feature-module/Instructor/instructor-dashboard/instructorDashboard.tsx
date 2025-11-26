import React, { useEffect, useMemo, useRef, useState } from "react";
import { ApexOptions } from "apexcharts";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import PredefinedDateRanges from "../../../core/common/range-picker/datePicker";
import ReactApexChart from "react-apexcharts";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import DashboardHeader from "./DashboardHeader";
import { useCourseApi } from "../../../core/api/hooks/useCourseApi";

const MONTH_LABELS = [
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
];

type DashboardTotals = {
  enrollments: number;
  active: number;
  completed: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
};

const ACTIVE_STATUSES = ["ACTIVE", "PUBLISHED", "LIVE", "APPROVED"];
const COMPLETED_STATUSES = ["COMPLETED", "FINISHED", "ARCHIVED"];

const buildMonthlyArray = () => Array.from({ length: 12 }, () => 0);

const sanitizeText = (value?: string) => (value ? String(value) : "").trim();

const getNumericValue = (value: any) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculateDashboardData = (
  courses: any[],
  stats: any
): { totals: DashboardTotals; monthly: number[] } => {
  const monthly = buildMonthlyArray();

  if (!courses || courses.length === 0) {
    return {
      totals: {
        enrollments: getNumericValue(stats?.enrollments),
        active: getNumericValue(stats?.published),
        completed: getNumericValue(stats?.completed),
        totalStudents: getNumericValue(stats?.students ?? stats?.enrollments),
        totalCourses: getNumericValue(stats?.total),
        totalRevenue: getNumericValue(stats?.revenue),
      },
      monthly,
    };
  }

  let totalStudents = 0;
  let totalRevenue = 0;
  let computedActive = 0;
  let completedCount = 0;

  courses.forEach((course) => {
    const students = getNumericValue(
      course?.studentsCount ??
        course?.studentCount ??
        course?.totalStudents ??
        course?.enrollments ??
        0
    );
    totalStudents += students;

    const price = getNumericValue(
      course?.price ??
        course?.pricing?.price ??
        course?.amount ??
        course?.salePrice ??
        0
    );

    const revenue = getNumericValue(
      course?.totalRevenue ??
        course?.earnings ??
        course?.revenue ??
        students * price
    );
    totalRevenue += revenue;

    const status = sanitizeText(course?.status).toUpperCase();
    if (status && ACTIVE_STATUSES.includes(status)) {
      computedActive += 1;
    }
    if (status && COMPLETED_STATUSES.includes(status)) {
      completedCount += 1;
    }

    const timestamp =
      course?.publishedAt ||
      course?.updatedAt ||
      course?.createdAt ||
      course?.created_at;
    if (timestamp) {
      const parsedDate = new Date(timestamp);
      if (!Number.isNaN(parsedDate.getTime())) {
        monthly[parsedDate.getMonth()] += revenue;
        return;
      }
    }
    if (revenue > 0) {
      monthly[new Date().getMonth()] += revenue;
    }
  });

  return {
    totals: {
      enrollments: stats?.enrollments ?? totalStudents,
      active: stats?.published ?? computedActive,
      completed: stats?.completed ?? completedCount,
      totalStudents,
      totalCourses: stats?.total ?? courses.length,
      totalRevenue,
    },
    monthly: monthly.map((value) => Number(value.toFixed(2))),
  };
};


const InstructorDashboard = () => {
  const location = useLocation();
  const { getCourseStats, listInstructorCourses } = useCourseApi();
  const getCourseStatsRef = useRef(getCourseStats);
  const listInstructorCoursesRef = useRef(listInstructorCourses);

  useEffect(() => {
    getCourseStatsRef.current = getCourseStats;
  }, [getCourseStats]);

  useEffect(() => {
    listInstructorCoursesRef.current = listInstructorCourses;
  }, [listInstructorCourses]);
  const [stats, setStats] = useState<any>(null);
  const [instructorCourses, setInstructorCourses] = React.useState<any[]>([]);
  const [dashboardTotals, setDashboardTotals] = useState<DashboardTotals>({
    enrollments: 0,
    active: 0,
    completed: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
  });
  const [chartSeries, setChartSeries] = useState([{
    name: "Ganhos",
    data: buildMonthlyArray(),
  }]);
  const chartOptions: ApexOptions = useMemo(() => ({
    chart: {
      height: 290,
      type: "bar" as const,
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
    xaxis: {
      categories: MONTH_LABELS,
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
      type: "gradient" as const,
      gradient: {
        shade: "dark",
        type: "linear" as const,
        shadeIntensity: 0.35,
        gradientToColors: ["#392C7D"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        angle: 90,
      },
    },
  }), []);

  const formatNumber = (value: number) =>
    Number(value || 0).toLocaleString("pt-PT");
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));



  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const instructorId = localStorage.getItem("id");
        const [statsResponse, coursesResponse] = await Promise.all([
          getCourseStatsRef
            .current()
            .catch((error) => {
              console.error("Erro ao buscar estat?sticas dos cursos:", error);
              return null;
            }),
          instructorId
            ? listInstructorCoursesRef.current({ instructorId })
            : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        if (statsResponse) {
          setStats(statsResponse);
        }

        const courses =
          coursesResponse?.data?.content ??
          coursesResponse?.content ??
          [];
        setInstructorCourses(courses);
      } catch (error: any) {
        console.error(
          "Erro ao carregar dados do painel do instrutor:",
          error?.response?.data || error?.message || error
        );
        if (isMounted) {
          setInstructorCourses([]);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const { totals, monthly } = calculateDashboardData(
      instructorCourses,
      stats
    );
    setDashboardTotals(totals);
    setChartSeries([{ name: "Ganhos", data: monthly }]);
  }, [instructorCourses, stats]);

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
                        <h4 className="fs-24 mt-1">{formatNumber(dashboardTotals.enrollments)}</h4>
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
                        <h4 className="fs-24 mt-1">{formatNumber(dashboardTotals.active)}</h4>
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
                        <span className="d-block">Cursos Conclu?dos</span>
                        <h4 className="fs-24 mt-1">{formatNumber(dashboardTotals.completed)}</h4>
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
                        <h4 className="fs-24 mt-1">{formatNumber(dashboardTotals.totalStudents)}</h4>
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
                        <h4 className="fs-24 mt-1">{formatNumber(dashboardTotals.totalCourses)}</h4>
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
                        <h4 className="fs-24 mt-1">{formatCurrency(dashboardTotals.totalRevenue)}</h4>
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
                  options={chartOptions}
                  series={chartSeries}
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
                    <tr key={course?.id ?? index}>
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
