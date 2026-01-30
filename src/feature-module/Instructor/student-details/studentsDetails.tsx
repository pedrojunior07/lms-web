import React, { useEffect, useMemo, useRef, useState } from 'react'
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb'
import ProfileCard from '../common/profileCard'
import { all_routes } from '../../router/all_routes'
import { Link, useSearchParams } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Slider from 'react-slick'
import { useStudent } from '../../../core/api/hooks/useStudents'
import { useCourseApi } from '../../../core/api/hooks/useCourseApi'

const StudentsDetails = () => {
  const [searchParams] = useSearchParams()
  const { getStudentById, getStudents } = useStudent()
  const { getCourcesStudents } = useCourseApi()
  const getStudentByIdRef = useRef(getStudentById)
  const getStudentsRef = useRef(getStudents)
  const getCourcesStudentsRef = useRef(getCourcesStudents)
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const instructorDetailsSlider = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  }

  const formatDate = (value?: string) => {
    if (!value) {
      return '--'
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }
    return parsed.toLocaleDateString()
  }

  const formatCurrency = (value?: number) => {
    const amount = Number(value ?? 0)
    if (!Number.isFinite(amount)) {
      return 'MZN0.00'
    }
    return `MZN${amount.toFixed(2)}`
  }

  const formatAddress = (entity?: any) => {
    if (!entity) {
      return '--'
    }
    const parts = [
      entity.address,
      entity.street,
      entity.city,
      entity.state,
      entity.country,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : '--'
  }

  const studentIdParam = searchParams.get('id')

  useEffect(() => {
    getStudentByIdRef.current = getStudentById
  }, [getStudentById])

  useEffect(() => {
    getStudentsRef.current = getStudents
  }, [getStudents])

  useEffect(() => {
    getCourcesStudentsRef.current = getCourcesStudents
  }, [getCourcesStudents])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        let resolvedId = studentIdParam || localStorage.getItem('studentId')
        if (!resolvedId) {
          const list = await getStudentsRef.current({ page: 0, size: 1 })
          const fallbackId = list?.content?.[0]?.id
          if (fallbackId) {
            resolvedId = String(fallbackId)
          }
        }

        if (!resolvedId) {
          if (isMounted) {
            setStudent(null)
            setCourses([])
            setError('Nenhum estudante encontrado.')
          }
          return
        }

        const [studentData, coursesData] = await Promise.all([
          getStudentByIdRef.current(Number(resolvedId)),
          getCourcesStudentsRef.current({ page: 0, size: 10 }, resolvedId),
        ])

        if (!isMounted) {
          return
        }

        setStudent(studentData || null)
        const content =
          coursesData?.content ||
          coursesData?.data?.content ||
          coursesData?.data ||
          []
        setCourses(Array.isArray(content) ? content : [])
      } catch (err) {
        console.error('Erro ao carregar dados do estudante:', err)
        if (isMounted) {
          setStudent(null)
          setCourses([])
          setError('Erro ao carregar dados do estudante.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [studentIdParam])

  const studentName =
    student?.name ||
    student?.fullName ||
    student?.username ||
    student?.email ||
    '—'
  const joinedDate = formatDate(
    student?.createdAt || student?.joinedAt || student?.created_at
  )
  const aboutText =
    student?.bio ||
    student?.about ||
    student?.description ||
    'Sem descrição disponível.'
  const totalCourses =
    student?.totalCourses ??
    student?.coursesCount ??
    student?.courseCount ??
    courses.length

  const courseSlides = useMemo(() => {
    if (!courses.length) {
      return []
    }

    return courses.map((course: any) => ({
      id: course?.id,
      title: course?.title || course?.name || 'Curso sem título',
      thumbnail:
        course?.thumbnailPath ||
        course?.thumbnail ||
        'assets/img/course/course-01.jpg',
      instructorName:
        course?.instructorName ||
        course?.instructor?.name ||
        course?.instructor ||
        'Instrutor',
      instructorAvatar:
        course?.instructorAvatar ||
        course?.instructor?.avatar ||
        'assets/img/user/user-29.jpg',
      category: course?.categoryName || course?.category || 'Geral',
      rating:
        course?.rating ??
        course?.avgRating ??
        course?.averageRating ??
        course?.ratingText ??
        0,
      reviewCount: course?.reviewCount ?? course?.reviews ?? 0,
      price: course?.price ?? course?.salePrice ?? 0,
      discount: course?.discount ?? course?.discountPercentage,
    }))
  }, [courses])

  const email = student?.email || '--'
  const phone = student?.phone || student?.phoneNumber || '--'
  const address = formatAddress(student)

  return (
    <>
      <Breadcrumb title="Students Details" />
      <div className="content instructor-detail-content">
        <div className="container">
          <ProfileCard />
          <Link
            to={all_routes.studentsList}
            className="d-flex align-items-center mb-3"
          >
            <i className="isax isax-arrow-left me-1 fw-bold" />
            Back to List
          </Link>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-warning mb-0">{error}</div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <div className="instructor-details-item1 mb-4">
                  <div className="instructor-details">
                    <div className="instructor-img">
                      <Link to="#">
                        <ImageWithBasePath
                          src={
                            student?.avatar ||
                            student?.photoUrl ||
                            'assets/img/students/student-01.jpg'
                          }
                          alt="img"
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="flex-fill">
                      <div className="pb-3 border-bottom mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6 className="fs-18 fw-bold">
                            <Link to="#">{studentName}</Link>
                          </h6>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <p>Joined on : {joinedDate}</p>
                        </div>
                        <div>
                          <p>{aboutText}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <div className="d-flex align-items-center counts-details mb-0">
                          <div className="d-flex align-items-center me-4">
                            <span className="d-flex align-items-center">
                              <i className="isax isax-book5 text-primary me-1" />
                              {totalCourses} Courses
                            </span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>
                            <Link
                              to={student?.facebookUrl || '#'}
                              className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                            >
                              <i className="fa-brands fa-facebook-f" />
                            </Link>
                          </span>
                          <span>
                            <Link
                              to={student?.instagramUrl || '#'}
                              className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                            >
                              <i className="fa-brands fa-instagram" />
                            </Link>
                          </span>
                          <span>
                            <Link
                              to={student?.twitterUrl || '#'}
                              className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                            >
                              <i className="fa-brands fa-x-twitter" />
                            </Link>
                          </span>
                          <span>
                            <Link
                              to={student?.youtubeUrl || '#'}
                              className="rounded-circle d-inline-flex align-items-center justify-content-center p-1 me-2"
                            >
                              <i className="fa-brands fa-youtube" />
                            </Link>
                          </span>
                          <span>
                            <Link
                              to={student?.linkedInUrl || '#'}
                              className="rounded-circle d-inline-flex align-items-center justify-content-center"
                            >
                              <i className="fa-brands fa-linkedin-in" />
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about-me-card bg-white">
                  <div className="about-me-body">
                    <h6 className="page-title fs-18 fw-bold">About Me</h6>
                    <p className="mb-2">{aboutText}</p>
                    <Link
                      to="#"
                      className="text-secondary text-decoration-underline fs-14"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="education-card">
                  <div className="education-body">
                    <h6 className="fs-18 fw-bold page-title">Education</h6>
                    {Array.isArray(student?.education) &&
                    student.education.length ? (
                      <div className="education-flow">
                        {student.education.map((item: any, index: number) => (
                          <div
                            key={`${item?.degree || 'edu'}-${index}`}
                            className={`ps-4 ${
                              index < student.education.length - 1 ? 'pb-3' : ''
                            } timeline-flow`}
                          >
                            <div>
                              <h6 className="fs-16 mb-1">
                                {item?.degree || item?.title || '—'}
                              </h6>
                              <p>{item?.institution || item?.school || '—'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-0">No education information available.</p>
                    )}
                  </div>
                </div>
                <div className="enrolled-courses-card mb-4 mb-lg-0">
                  <div className="enrolled-courses-body">
                    <div className="page-title">
                      <h6 className="mb-0 fs-18 fw-bold">Enrolled Courses</h6>
                    </div>
                    {courseSlides.length ? (
                      <Slider
                        {...instructorDetailsSlider}
                        className="course-carousal student-details-carousal"
                      >
                        {courseSlides.map((course) => (
                          <div key={course.id || course.title}>
                            <div className="course-item-two course-item mx-2">
                              <div className="course-img">
                                <Link
                                  to={`${all_routes.courseDetails}?id=${course.id}`}
                                >
                                  <ImageWithBasePath
                                    src={course.thumbnail}
                                    alt="img"
                                    className="img-fluid"
                                  />
                                </Link>
                                <div className="position-absolute start-0 top-0 d-flex align-items-start w-100 z-index-2 p-3">
                                  {course.discount ? (
                                    <div className="badge text-bg-danger">
                                      {course.discount}% off
                                    </div>
                                  ) : null}
                                  <Link to="#" className="fav-icon ms-auto">
                                    <i className="isax isax-heart" />
                                  </Link>
                                </div>
                              </div>
                              <div className="course-content">
                                <div className="d-flex justify-content-between mb-2">
                                  <div className="d-flex align-items-center">
                                    <Link
                                      to={all_routes.instructorDetails}
                                      className="avatar avatar-sm"
                                    >
                                      <ImageWithBasePath
                                        src={course.instructorAvatar}
                                        alt="img"
                                        className="img-fluid avatar avatar-sm rounded-circle"
                                      />
                                    </Link>
                                    <div className="ms-2">
                                      <Link
                                        to={all_routes.instructorDetails}
                                        className="link-default fs-14"
                                      >
                                        {course.instructorName}
                                      </Link>
                                    </div>
                                  </div>
                                  <span className="badge badge-light rounded-pill bg-light d-inline-flex align-items-center fs-13 fw-medium mb-0">
                                    {course.category}
                                  </span>
                                </div>
                                <h6 className="title mb-2">
                                  <Link
                                    to={`${all_routes.courseDetails}?id=${course.id}`}
                                  >
                                    {course.title}
                                  </Link>
                                </h6>
                                <p className="d-flex align-items-center mb-3">
                                  <i className="fa-solid fa-star text-warning me-2" />
                                  {course.rating} ({course.reviewCount} Reviews)
                                </p>
                                <div className="d-flex align-items-center justify-content-between">
                                  <h5 className="text-secondary mb-0">
                                    {formatCurrency(course.price)}
                                  </h5>
                                  <Link
                                    to={`${all_routes.courseDetails}?id=${course.id}`}
                                    className="btn btn-dark btn-sm d-inline-flex align-items-center"
                                  >
                                    View Course
                                    <i className="isax isax-arrow-right-3 ms-1" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <p className="mb-0">No enrolled courses found.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="certification-card">
                  <div className="certification-body">
                    <h5 className="mb-3 fw-bold">Certifications</h5>
                    <div className="d-flex align-items-center">
                      <div className="certificate-img rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/certificates/certificate-01.svg"
                          alt="img"
                          className="img-fluid"
                        />
                      </div>
                      <div className="certificate-img rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/certificates/certificate-02.svg"
                          alt="img"
                          className="img-fluid"
                        />
                      </div>
                      <div className="certificate-img rounded-circle me-2">
                        <ImageWithBasePath
                          src="assets/img/certificates/certificate-03.svg"
                          alt="img"
                          className="img-fluid"
                        />
                      </div>
                      <div className="certificate-img rounded-circle">
                        <ImageWithBasePath
                          src="assets/img/certificates/certificate-01.svg"
                          alt="img"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact-card border-0 mb-0">
                  <div className="contact-details-body">
                    <h5 className="mb-3 fw-bold">Contact Details</h5>
                    <div className="d-flex align-items-center mb-4">
                      <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <i className="fa-regular fa-envelope" />
                      </span>
                      <div>
                        <h6 className="mb-0">Email</h6>
                        <p className="fs-14 mb-0">{email}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-location" />
                      </span>
                      <div>
                        <h6 className="mb-0">Address</h6>
                        <p className="fs-14 mb-0 text-truncate">{address}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="contact-icon flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center me-3">
                        <i className="isax isax-call" />
                      </span>
                      <div>
                        <h6 className="mb-0">Phone</h6>
                        <p className="fs-14 mb-0">{phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentsDetails
