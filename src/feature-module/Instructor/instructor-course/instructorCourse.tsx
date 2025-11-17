import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { courseListData } from "../../../core/common/data/json/courseListData";
import Table from "../../../core/common/dataTable/index";
import { CourseCardDto } from "../../../core/common/data/interface";

import { useCourseApi } from "../../../core/api/hooks/useCourseApi";
// import { useBunnyUploader } from "../../../core/api/hooks/useLocalUploader";
import { useBackendUploader } from "../../../core/api/hooks/useBackendUploader";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";

const InstructorCourse = () => {
  const [instructorCourses, setInstructorCourses] = React.useState<any[]>([]);

  const { listInstructorCourses } = useCourseApi();
  const { getCourseStats } = useCourseApi();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCourseStats();
        console.log("Fetched course stats:", data);
        setStats(data); // .data por causa do wrapper { status, data } vindo do backend
      } catch (err) {
        console.error("Erro ao buscar estatísticas dos cursos", err);
      }
    };

    fetchStats();
  }, []);
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

  const columns = [
    {
      title: "Course",
      dataIndex: "title",
      render: (_: unknown, record: CourseCardDto) => (
        <div className="d-flex align-items-center">
          <Link
            to={{
              pathname: `${all_routes.courseDetails}`,
              search: `?id=${record.id}`,
            }}
            className="avatar avatar-lg me-2 flex-shrink-0"
          >
            <img
              className="img-fluid object-fit-cover"
              src={`${record.thumbnailPath}`}
              alt={record.title}
            />
          </Link>
          <div>
            <h6 className="fw-medium mb-2">
              <Link
                to={{
                  pathname: `${all_routes.courseDetails}`,
                  search: `?id=${record.id}`,
                }}
              >
                {record.title}
              </Link>
            </h6>

            <div className="d-flex align-items-center">
              <span className="d-inline-flex fs-12 align-items-center me-2 pe-2 border-end">
                <i className="isax isax-video-circle me-1 text-gray-9" />
                {record.lessonCount} Lessons
              </span>
              <span className="d-inline-flex fs-12 align-items-center me-2 pe-2 border-end">
                <i className="isax isax-people me-1 text-gray-9" />
                {record.studentCount} Students
              </span>
            </div>
          </div>
        </div>
      ),
      sorter: (a: CourseCardDto, b: CourseCardDto) =>
        a.title.localeCompare(b.title),
    },

    {
      title: "Students",
      dataIndex: "studentCount",
      sorter: (a: CourseCardDto, b: CourseCardDto) =>
        a.studentCount - b.studentCount,
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v: number) => `MZN${  v  ? v.toFixed(2) : 0}`,
      sorter: (a: CourseCardDto, b: CourseCardDto) => a.price - b.price,
    },
    {
      title: "Rating",
      dataIndex: "ratingText",
      render: (v: string) => (
        <span className="d-flex align-items-center">
          <i className="fa-solid fa-star fs-12 filled text-warning me-1" />
          {v}
        </span>
      ),
      sorter: (a: CourseCardDto, b: CourseCardDto) =>
        parseFloat(a.ratingText) - parseFloat(b.ratingText),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: CourseCardDto["status"]) => {
        const map = {
          PENDING: "bg-skyblue",
          DRAFT: "bg-info",
          PUBLISHED: "bg-success",
        } as const;
        return (
          <span
            className={`badge badge-sm ${map[s]} d-inline-flex align-items-center`}
          >
            <i className="fa-solid fa-circle fs-5 me-1" />
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </span>
        );
      },
      sorter: (a: CourseCardDto, b: CourseCardDto) =>
        a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: CourseCardDto) => (
        <div className="d-flex align-items-center">
          <Link
            to={`${"all_routes.editCourse"}/${record.id}`}
            className="d-inline-flex fs-14 me-1 action-icon"
          >
            <i className="isax isax-edit-2" />
          </Link>
          <Link
            to="#"
            className="d-inline-flex fs-14 action-icon"
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
          >
            <i className="isax isax-trash" />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="layout-container">
        <DashboardHeader onHandleMobileMenu={() => {}} />

        <div className="d-flex layout-body content">
          <InstructorSidebar />
          <main className="dashboard-main p-4 ms-260 w-100">
            <ProfileCard />

            <div className="col-lg-9">
              <div className="row">
                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-success">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">
                        Active Courses
                      </h6>
                      <h4 className="fw-bold text-white">
                        {stats ? stats.published : "..."}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-secondary">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">
                        Pending Courses
                      </h6>
                      <h4 className="fw-bold text-white">—</h4>{" "}
                      {/* API não retorna este status */}
                    </div>
                  </div>
                </div>

                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-info">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">
                        Draft Courses
                      </h6>
                      <h4 className="fw-bold text-white">
                        {stats ? stats.draft : "..."}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-skyblue">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">
                        Free Courses
                      </h6>
                      <h4 className="fw-bold text-white">
                        {stats ? stats.free : "..."}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="col-xxl col-lg-4 col-md-6">
                  <div className="card bg-purple">
                    <div className="card-body">
                      <h6 className="fw-medium mb-1 text-white">
                        Paid Courses
                      </h6>
                      <h4 className="fw-bold text-white">
                        {stats ? stats.paid : "..."}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Courses</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to="#" className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to={all_routes.instructorCourseGrid}>
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle text-gray-6 btn  rounded border d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Status
                      </Link>
                      <ul className="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Published
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Pending
                          </Link>
                        </li>
                        <li>
                          <Link to="#" className="dropdown-item rounded-1">
                            Draft
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
              <Table
                dataSource={instructorCourses}
                columns={columns}
                Search={true}
              />
            </div>
          </main>
        </div>
      </div>
      <>
        {/* Delete Modal */}
        <div className="modal fade" id="delete_modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center custom-modal-body">
                <span className="avatar avatar-lg bg-danger-transparent rounded-circle mb-2">
                  <i className="isax isax-trash fs-24 text-danger" />
                </span>
                <div>
                  <h4 className="mb-2">Delete Course</h4>
                  <p className="mb-3">
                    Are you sure you want to delete course?
                  </p>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="btn bg-gray-100 rounded-pill me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-secondary rounded-pill"
                      data-bs-dismiss="modal"
                    >
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default InstructorCourse;
