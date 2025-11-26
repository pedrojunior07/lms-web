import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import header from "../../../core/common/header/header";

import { Button, Modal } from "react-bootstrap";
import { useCart } from "../../../core/common/context/cartContext";
import { usePerson } from "../../../core/api/hooks/useUserApi";
import { useAuth } from "../../../core/common/context/AuthContextType";
type ProfileInfo = {
  name: string;
  email: string;
  avatar: string;
};

const avatarFallbackStyles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#4f46e5",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "inherit",
  textTransform: "uppercase",
};

const sanitizeText = (value?: string) => (value || "").trim();

const sanitizeAvatar = (value?: string) => {
  if (!value) {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const lower = trimmed.toLowerCase();
  if (lower === "null" || lower === "undefined") {
    return "";
  }
  return trimmed;
};

const getInitials = (value?: string) => {
  const source = sanitizeText(value);
  if (!source) {
    return "IN";
  }
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const buildName = (entity?: any) => {
  if (!entity) {
    return "";
  }
  if (entity.fullName) {
    return sanitizeText(entity.fullName);
  }
  if (entity.name) {
    return sanitizeText(entity.name);
  }
  const first = sanitizeText(entity.firstName);
  const last = sanitizeText(entity.lastName);
  return `${first} ${last}`.trim();
};

const extractAvatar = (entity?: any) =>
  sanitizeAvatar(
    entity?.photoUrl ||
      entity?.profilePicture ||
      entity?.avatarUrl ||
      entity?.imageUrl ||
      entity?.photo
  );


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
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const { getUser } = usePerson();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(() => ({
    name: "",
    email: localStorage.getItem("email") || "",
    avatar: "",
  }));


  const handleLogout = () => {
    logout();
    navigate(all_routes.homefour);
  };

  useEffect(() => {
    const instructorId = localStorage.getItem("id");
    if (!instructorId) {
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const data = await getUser(Number(instructorId));
        if (!isMounted) {
          return;
        }
        setProfileInfo((prev) => ({
          name: buildName(data) || prev.name || "Instrutor",
          email:
            data?.email || prev.email || localStorage.getItem("email") || "",
          avatar: extractAvatar(data) || prev.avatar,
        }));
      } catch (error) {
        console.error("Erro ao carregar dados do instrutor:", error);
      } finally {
        
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [getUser]);

  const displayName = profileInfo.name || profileInfo.email || "Instrutor";
  const displayEmail = profileInfo.email || "";
  const profileAvatar = useMemo(
    () => sanitizeAvatar(profileInfo.avatar),
    [profileInfo.avatar]
  );
  const profileInitials = useMemo(
    () => getInitials(displayName || displayEmail || "Instrutor"),
    [displayName, displayEmail]
  );

  const renderProfileAvatar = (className = "img-fluid rounded-circle") => {
    if (profileAvatar) {
      return (
        <ImageWithBasePath
          src={profileAvatar}
          alt={displayName}
          className={className}
        />
      );
    }

    return (
      <span
        className={`avatar-fallback d-flex align-items-center justify-content-center w-100 h-100 ${className}`}
        style={avatarFallbackStyles}
      >
        {profileInitials}
      </span>
    );
  };

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
              <span className="avatar">{renderProfileAvatar()}</span>
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
                <div className="avatar">{renderProfileAvatar()}</div>
                <div>
                  <h6>{displayName}</h6>
                  {displayEmail && <p>{displayEmail}</p>}
                </div>
              </div>
              <ul className="profile-body">
                <li>
                  <Link
                    to={all_routes.instructorProfile}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-security-user me-2" />
                    Meu Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorCourse}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-teacher me-2" />
                    Cursos
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorEarning}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium2"
                  >
                    <i className="isax isax-dollar-circle me-2" />
                    Ganhos
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorPayout}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-coin me-2" />
                    Pagamentos
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorMessage}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-messages-3 me-2" />
                    Mensagens <span className="message-count">2</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={all_routes.instructorsettings}
                    className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                  >
                    <i className="isax isax-setting-2 me-2" />
                    Configurações
                  </Link>
                </li>
              </ul>
              <div className="profile-footer">
                <Link
                  to={all_routes.login}
                  className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                >
                  <i className="isax isax-arrow-2 me-2" />
                  Entrar como Aluno
                </Link>
                <Link
                  to={all_routes.homefour}
                  className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                  onClick={handleLogout}
                >
                  <i className="isax isax-logout me-2" />
                  Sair
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
