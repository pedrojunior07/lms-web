import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { all_routes } from "../../../router/all_routes";
import { Category, CourseStats } from "../../../../core/common/data/interface";

import { useCourseApi } from "../../../../core/api/hooks/useCourseApi";

const Topcategories = () => {
  const route = all_routes;

  const [stats, setStats] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getTopCategories } = useCourseApi();
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const Path = route.courseList;
    navigate(Path);
  };
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getTopCategories();
        setStats(data);
        console.log(data);
      } catch (error: any) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchStats();
  }, []);

  const categoriesslider = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* Top Categories */}
      {stats.length >= 10 ? (
        <div className="section how-it-works">
          <div className="container">
            <div
              className="d-flex align-items-center justify-content-between flex-wrap gap-3 aos"
              data-aos="fade-up"
            >
              <div className="section-header">
                <span className="fw-medium text-secondary fs-18 fw-bold mb-2 d-inline-block">
                  Favourite Course
                </span>
                <h2 className="mb-0">Top Category</h2>
              </div>
              <div>
                <Link
                  to={route.courseCategory2}
                  className="btn btn-secondary btn-xl"
                >
                  View all Categories
                </Link>
              </div>
            </div>
            <Slider {...categoriesslider}>
              <div className="categories-item categories-item-two">
                <span className="categories-icon">
                  <ImageWithBasePath
                    src="assets/img/category/icons/icon-1.svg"
                    alt="Img"
                  />
                </span>
                <h5>
                  <Link
                    to={route.courseCategory}
                  >{`${stats[0].categoryName}`}</Link>
                </h5>
                <p>{stats[0].courseCount} Courses</p>
              </div>
              <div className="categories-item categories-item-two">
                <span className="categories-icon">
                  <ImageWithBasePath
                    src="assets/img/category/icons/icon-2.svg"
                    alt="Img"
                  />
                </span>
                <h5>
                  <Link
                    to={route.courseCategory}
                  >{`${stats[1].categoryName}`}</Link>
                </h5>
                <p>{stats[1].courseCount} Courses</p>
              </div>
              <div className="categories-item categories-item-two">
                <span className="categories-icon">
                  <ImageWithBasePath
                    src="assets/img/category/icons/icon-3.svg"
                    alt="Img"
                  />
                </span>
                <h5>
                  <Link
                    to={route.courseCategory}
                  >{`${stats[2].categoryName}`}</Link>
                </h5>
                <p>{stats[2].courseCount} Courses</p>
              </div>
              <div className="categories-item categories-item-two">
                <span className="categories-icon">
                  <ImageWithBasePath
                    src="assets/img/category/icons/icon-4.svg"
                    alt="Img"
                  />
                </span>
                <h5>
                  <Link
                    to={route.courseCategory}
                  >{`${stats[3].categoryName}`}</Link>
                </h5>
                <p>{stats[3].courseCount} Courses</p>
              </div>
              <div className="categories-item categories-item-two">
                <span className="categories-icon">
                  <ImageWithBasePath
                    src="assets/img/category/icons/icon-5.png"
                    alt="Img"
                  />
                </span>
                <h5>
                  <Link
                    to={route.courseCategory}
                  >{`${stats[4].categoryName}`}</Link>
                </h5>
                <p>{stats[4].courseCount} Courses</p>
              </div>
            </Slider>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* /Top Categories */}
    </>
  );
};

export default Topcategories;
