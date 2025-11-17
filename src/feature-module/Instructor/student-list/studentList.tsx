import React from "react";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ProfileCard from "../common/profileCard";
import InstructorSidebar from "../common/instructorSidebar";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { studentListData } from "../../../core/common/data/json/studentListData";
import Table from "../../../core/common/dataTable/index";
import DashboardHeader from "../instructor-dashboard/DashboardHeader";
import { useEffect, useState } from "react";

import { useStudent } from "../../../core/api/hooks/useStudents";

const StudentList = () => {
  const { getStudents } = useStudent();

  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const data = await getStudents({ page: page - 1, size }); // Spring começa no 0
      console.log(data);
      setStudents(
        data.content.map((s: any) => ({
          StudentID: s.id,
          StudentName: s.name,
          EnrollDate: new Date(s.createdAt).toLocaleDateString(),
          Progress: "100%", // ajuste conforme necessário
          Courses: s.totalCourses,
          Img: "1.jpg", // ou pegue real se tiver
        }))
      );
      setPagination({
        current: data.number + 1,
        pageSize: data.size,
        total: data.totalElements,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchStudents(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: "StudentID",
      render: (text: string) => (
        <Link to={all_routes.studentsDetails} className="text-primary">
          {text}
        </Link>
      ),
    },
    {
      title: "Student Name",
      dataIndex: "StudentName",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link
            to={all_routes.studentsDetails}
            className="avatar avatar-md avatar-rounded me-2"
          >
            <ImageWithBasePath src={`assets/img/user/${record.Img}`} alt="" />
          </Link>
          <Link to={all_routes.studentsDetails}>
            <p className="fs-14">{text}</p>
          </Link>
        </div>
      ),
    },
    {
      title: "Enroll Date",
      dataIndex: "EnrollDate",
    },
    {
      title: "Progress",
      dataIndex: "Progress",
      render: (text: string) => (
        <div className="d-flex align-items-center">
          <div
            className="progress progress-xs"
            style={{ width: 110, height: 4 }}
          >
            <div className="progress-bar bg-success" style={{ width: text }} />
          </div>
          <span className="ms-2">{text}</span>
        </div>
      ),
    },
    {
      title: "Courses",
      dataIndex: "Courses",
    },
    {
      title: "Action",
      dataIndex: "",
      render: () => (
        <div className="d-flex align-items-center">
          <Link
            to={all_routes.studentsDetails}
            className="fs-14 me-1 action-icon"
          >
            <i className="isax isax-eye" />
          </Link>
          <Link to="#" className="fs-14 action-icon">
            <i className="isax isax-messages-3" />
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

          <div className="dashboard-main p-4 ms-260 w-100">
            {/* Sidebar */}
            <ProfileCard />
            {/* /Sidebar */}
            <div className="col-lg-9">
              <div className="page-title d-flex align-items-center justify-content-between">
                <h5 className="fw-bold">Students</h5>
                <div className="d-flex align-items-center list-icons">
                  <Link to={all_routes.studentsList} className="active me-2">
                    <i className="isax isax-task" />
                  </Link>
                  <Link to={all_routes.studentsGrid}>
                    <i className="isax isax-element-3" />
                  </Link>
                </div>
              </div>
              <div className="row justify-content-end">
                <div className="col-md-4">
                  <div className="input-icon mb-3 invisible">
                    <span className="input-icon-addon">
                      <i className="isax isax-search-normal-14" />
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-md"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <Table dataSource={students} columns={columns} Search={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentList;
