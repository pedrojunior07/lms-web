import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import header from "../../../core/common/header/header";

import { Button, Modal } from "react-bootstrap";
import { useCart } from "../../../core/common/context/cartContext";
interface DashboardHeaderProps {
  onHandleMobileMenu: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onHandleMobileMenu,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenu, setIsMegaMenu] = useState(false);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const [basePath, setBasePath] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartCount } = useCart();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function toggleSidebar(tittle: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <header className="fixed-header d-flex justify-content-between align-items-center px-4 py-2">
      <div className="navbar-header d-flex align-items-center">
        <Link id="mobile_btn" to="#" onClick={onHandleMobileMenu}>
          <span className="bar-icon">
            <i className="isax isax-menu"></i>
          </span>
        </Link>
        <div className="navbar-logo ms-3">
          <Link className="logo-white header-logo" to={all_routes.homefour}>
            {location.pathname === "/index" ? (
              <ImageWithBasePath
                src="assets/img/logo-white.svg"
                className="logo"
                alt="Logo"
              />
            ) : (
              <ImageWithBasePath
                src="assets/img/logo.png"
                className="logo"
                alt="Logo"
                width={300}
              />
            )}
          </Link>
          <Link
            className="logo-dark header-logo d-none"
            to={all_routes.homefour}
          >
            <ImageWithBasePath
              src="assets/img/logo-white.svg"
              className="logo"
              alt="Logo"
            />
          </Link>
        </div>
      </div>

      {location.pathname.includes("instructor") && (
        <div className="header-btn d-flex align-items-center">
          <div className="dropdown profile-dropdown">
            <Link
              to="#"
              className="d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <span className="avatar">
                <ImageWithBasePath
                  src="assets/img/user/user-01.jpg"
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </span>
            </Link>
            <ul className={`main-nav ${isMegaMenu ? "active" : ""}`}>
              {Array.isArray(header) &&
                header.map((mainMenus: any, mainIndex: number) => (
                  <React.Fragment key={mainIndex}>
                    {mainMenus.separateRoute ? (
                      <li
                        key={mainIndex}
                        className={`has-submenu megamenu ${
                          location.pathname.includes("index") ? "active" : ""
                        }`}
                        onClick={() => toggleSidebar(mainMenus.tittle)}
                        onMouseOver={() => setIsMegaMenu(true)}
                        onMouseLeave={() => setIsMegaMenu(false)}
                      >
                        <Link to="#">
                          {mainMenus.tittle}
                          <i
                            className={` ${
                              basePath === "instructor" ||
                              basePath === "student"
                                ? "isax isax-add"
                                : "fas fa-chevron-down"
                            }`}
                          />
                        </Link>
                        <ul
                          className={`submenu mega-submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                          onMouseOver={() => setIsMegaMenu(true)}
                          onMouseLeave={() => setIsMegaMenu(false)}
                        >
                          <li>
                            <div className="megamenu-wrapper">
                              <div className="row">
                                {mainMenus.menu.map((menu: any, idx: any) => (
                                  <div className="col-lg-2" key={idx}>
                                    <div
                                      className={`single-demo ${
                                        location.pathname === menu.route
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div className="demo-img">
                                        <Link
                                          to={menu.route}
                                          className="inner-demo-img"
                                        >
                                          <ImageWithBasePath
                                            src={menu.img}
                                            className="img-fluid "
                                            alt="img"
                                          />
                                        </Link>
                                      </div>
                                      <div className="demo-info">
                                        <Link
                                          to={menu.route}
                                          className="inner-demo-img"
                                        >
                                          {menu.menuValue}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      <li
                        className={`has-submenu ${
                          mainMenus?.menu?.some((item: any) =>
                            item?.route?.includes(location.pathname)
                          ) ||
                          basePath === mainMenus.base ||
                          basePath === mainMenus.base2
                            ? "active"
                            : ""
                        }`}
                      >
                        <Link
                          to="#"
                          onClick={() => toggleSidebar(mainMenus.tittle)}
                        >
                          {mainMenus.tittle}{" "}
                          <i
                            className={` ${
                              basePath === "instructor" ||
                              basePath === "student"
                                ? "isax isax-add"
                                : "fas fa-chevron-down"
                            }`}
                          ></i>
                        </Link>
                        <ul
                          className={`submenu ${
                            subOpen === mainMenus.tittle ? "d-block" : ""
                          }`}
                        >
                          {mainMenus.menu?.map((menu: any, menuIndex: any) => (
                            <React.Fragment key={`${mainIndex}-${menuIndex}`}>
                              {menu.hasSubRoute ? (
                                <li
                                  key={`${mainIndex}-${menuIndex}`}
                                  className={`${
                                    menu.hasSubRoute ? "has-submenu" : ""
                                  } ${
                                    menu?.subMenus?.some((item: any) =>
                                      item?.route?.includes(location.pathname)
                                    ) || basePath === menu.base
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <Link
                                    to="#"
                                    className={`hideonmob`}
                                    onClick={() => {
                                      toggleSidebar(menu.menuValue);
                                    }}
                                  >
                                    {menu.menuValue}
                                  </Link>
                                  <ul
                                    className={`submenu showonmob ${
                                      subsidebar === menu.menuValue
                                        ? "d-block"
                                        : ""
                                    }`}
                                  >
                                    {menu.subMenus?.map(
                                      (subMenu: any, subMenuIndex: any) => (
                                        <React.Fragment
                                          key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                        >
                                          {subMenu.hasSubRoute ? (
                                            <li
                                              className={`${
                                                menu.hasSubRoute
                                                  ? "has-submenu"
                                                  : ""
                                              } ${
                                                subMenu?.subMenus?.some(
                                                  (item: any) =>
                                                    item?.route?.includes(
                                                      location.pathname
                                                    )
                                                )
                                                  ? "active"
                                                  : ""
                                              }`}
                                            >
                                              <Link
                                                to="#"
                                                onClick={() => {
                                                  toggleSidebar(
                                                    subMenu.menuValue
                                                  );
                                                }}
                                              >
                                                {subMenu.menuValue}
                                              </Link>
                                              <ul
                                                className={`submenu ${
                                                  subsidebar2 ===
                                                  subMenu.menuValue
                                                    ? "d-block"
                                                    : ""
                                                }`}
                                              >
                                                {subMenu.subMenus?.map(
                                                  (
                                                    menu: any,
                                                    menuIndex2: any
                                                  ) => (
                                                    <li
                                                      key={menuIndex2}
                                                      className={
                                                        location.pathname ===
                                                        menu.route
                                                          ? "active"
                                                          : ""
                                                      }
                                                    >
                                                      <Link to={menu.route}>
                                                        {menu.menuValue}
                                                      </Link>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </li>
                                          ) : (
                                            <li
                                              className={
                                                location.pathname ===
                                                subMenu.route
                                                  ? "active"
                                                  : ""
                                              }
                                              key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                            >
                                              <Link to={subMenu.route}>
                                                {subMenu.menuValue}
                                              </Link>
                                            </li>
                                          )}
                                        </React.Fragment>
                                      )
                                    )}
                                  </ul>
                                </li>
                              ) : (
                                <li
                                  key={`${mainIndex}-${menuIndex}`}
                                  className={
                                    location.pathname.includes(menu.route || "")
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <Link to={menu.route}>{menu.menuValue}</Link>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
            </ul>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="profile-header d-flex align-items-center">
                <div className="avatar">
                  <ImageWithBasePath
                    src="assets/img/user/user-01.jpg"
                    alt="Img"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <div>
                  <h6>Eugene Andre</h6>
                  <p>instructerdemo@example.com</p>
                </div>
              </div>
              <ul className="profile-body">
                <li>
                  <Link
                    to={all_routes.instructorProfile}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-security-user me-2" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorCourse}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-teacher me-2" />
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorEarning}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium2"
                  >
                    <i className="isax isax-dollar-circle me-2" />
                    Earnings
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorPayout}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-coin me-2" />
                    Payouts
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorMessage}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-messages-3 me-2" />
                    Messages <span className="message-count">2</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorsettings}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-setting-2 me-2" />
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="profile-footer">
                <Link
                  to={all_routes.login}
                  className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                >
                  <i className="isax isax-arrow-2 me-2" />
                  Log in as Student
                </Link>
                <Link
                  to={all_routes.homeone}
                  className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                >
                  <i className="isax isax-logout me-2" />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
