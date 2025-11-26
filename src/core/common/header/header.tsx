import React, { useEffect, useMemo, useState } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { header } from "../data/json/header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";
import { setDataTheme } from "../../redux/themeSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContextType";
import { Button, Modal } from "react-bootstrap";
import { usePerson } from "../../api/hooks/useUserApi";
import { useStudent } from "../../api/hooks/useStudents";



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
  backgroundColor: "rgba(36, 118, 255, 0.9)",
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
  const sanitized = value.trim();
  if (!sanitized) {
    return "";
  }
  const lower = sanitized.toLowerCase();
  if (lower === "null" || lower === "undefined") {
    return "";
  }
  return sanitized;
};

const getInitials = (value?: string) => {
  const source = sanitizeText(value);
  if (!source) {
    return "US";
  }
  const parts = source.split(" ").filter(Boolean);
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

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenu, setIsMegaMenu] = useState(false);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const [basePath, setBasePath] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isInstructorRoute = location.pathname.includes("instructor");
  const { cartCount } = useCart();
  const [role, setRole] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [header2, setHeader] = useState<any[]>(header);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate(all_routes.homefour);
  };
  
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  
  const handleDataThemeChange = (theme: string) => {
    dispatch(setDataTheme(theme));
  };
  
  const onHandleMobileMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.add("menu-opened");
  };
  
  const onhandleCloseMenu = () => {
    const root = document.getElementsByTagName("html")[0];
    root.classList.remove("menu-opened");
  };
  
  const { isAuthenticated, user, logout } = useAuth();
  const { getUser } = usePerson();
  const { getStudentById } = useStudent();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: "",
    email: "",
    avatar: "",
  });

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };
  
  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  
  const toggleSubsidebar2 = (subitem: any) => {
    if (subitem === subsidebar2) {
      setSubsidebar2("");
    } else {
      setSubsidebar2(subitem);
    }
  };

  const header7 = header.map((mainMenu: any) => {
    const filteredMenu = mainMenu.menu?.filter((menu: any) => {
      if (!user) {
        return menu.public === true;
      }
      if (user.role === "ROLE_STUDENT" && menu.menuValue === "Instrutor") {
        return false;
      }
      if (user.role === "ROLE_INSTRUCTOR" && menu.menuValue === "Aluno") {
        return false;
      }
      return true;
    });

    return {
      ...mainMenu,
      menu: filteredMenu,
    };
  });

  const visibleHeaderMenus = isInstructorRoute
    ? header7.filter((menu: any) => menu.tittle !== "Home")
    : header7;

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileInfo({ name: "", email: "", avatar: "" });
      return;
    }

    const storedEmail = localStorage.getItem("email") || user?.email || "";
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
      if (storedEmail) {
        setProfileInfo((prev) => ({ ...prev, email: storedEmail }));
      }
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setProfileInfo((prev) => ({
        name: buildName(parsed) || prev.name,
        email: parsed?.email || storedEmail || prev.email,
        avatar: extractAvatar(parsed) || prev.avatar,
      }));
    } catch (error) {
      console.error("Erro ao analisar usu?rio armazenado:", error);
      if (storedEmail) {
        setProfileInfo((prev) => ({ ...prev, email: storedEmail }));
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return;
    }
    const id = localStorage.getItem("id");
    if (!id) {
      return;
    }

    const fetchProfile = async () => {
      try {
        if (role === "ROLE_INSTRUCTOR") {
          const data = await getUser(Number(id));
          setProfileInfo((prev) => ({
            name: buildName(data) || prev.name,
            email: data?.email || prev.email,
            avatar: extractAvatar(data) || prev.avatar,
          }));
        } else if (role === "ROLE_STUDENT") {
          const response = await getStudentById(Number(id));
          const studentData = response?.data ?? response;
          setProfileInfo((prev) => ({
            name: buildName(studentData) || prev.name,
            email: studentData?.email || prev.email,
            avatar: extractAvatar(studentData) || prev.avatar,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      }
    };

    fetchProfile();
  }, [getStudentById, getUser, isAuthenticated, role]);

  const fallbackEmail =
    profileInfo.email || user?.email || localStorage.getItem("email") || "";
  const defaultName =
    role === "ROLE_INSTRUCTOR"
      ? "Instrutor"
      : role === "ROLE_STUDENT"
      ? "Estudante"
      : "Usu?rio";
  const displayName = profileInfo.name?.trim() || fallbackEmail || defaultName;
  const displayEmail = fallbackEmail || defaultName;
  const profileAvatar = useMemo(
    () => sanitizeAvatar(profileInfo.avatar),
    [profileInfo.avatar]
  );
  const profileInitials = useMemo(
    () => getInitials(displayName || displayEmail || defaultName),
    [displayName, displayEmail, defaultName]
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

  // Atualiza role sempre que o usuário mudar
  useEffect(() => {
    setRole(user?.role || "");
  }, [user]);
  
  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role!);
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", role);
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [role]);
  
  useEffect(() => {
    document.documentElement.setAttribute("class", dataTheme);
  }, [dataTheme]);
  
  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/").filter(Boolean);
    setBasePath(pathArray[0]);
  }, [location.pathname]);
  
  const DarkButton = () => {
    return (
      <div
        className={`icon-btn  ${location.pathname === "/index" ? "" : "me-2"}`}
      >
        <Link
          to="#"
          id="dark-mode-toggle"
          className={`theme-toggle ${dataTheme === "light" && "activate"}`}
          onClick={() => handleDataThemeChange("dark-mode")}
        >
          <i className="isax isax-sun-15" />
        </Link>
        <Link
          to="#"
          id="light-mode-toggle"
          className={`theme-toggle ${dataTheme === "dark-mode" && "activate"}`}
          onClick={() => handleDataThemeChange("light")}
        >
          <i className="isax isax-moon" />
        </Link>
      </div>
    );
  };
  
  return (
    <>
      {/* /Header Topbar*/}
      {/* Header */}
      <header
        className={`${
          location.pathname === "/index"
            ? "header-one"
            : location.pathname === "/index-3" ||
              location.pathname === "/index-6"
            ? "header-three"
            : location.pathname === "/index-4"
            ? "header-four"
            : location.pathname === "/index-5"
            ? "header-five header-two"
            : "header-two"
        } ${scrolled ? "fixed" : ""}`}
      >
        <div className="container">
          <div className="header-nav">
            <div className="navbar-header">
              <Link id="mobile_btn" to="#" onClick={() => onHandleMobileMenu()}>
                <span className="bar-icon">
                  <i className="isax isax-menu"></i>
                </span>
              </Link>
              <div className="navbar-logo">
                <Link
                  className="logo-white header-logo"
                  to={all_routes.homefour}
                >
                  {location.pathname === "/index" ? (
                    <ImageWithBasePath
                      src="assets/img/logo-white.svg"
                      className="logo"
                      alt="Logo"
                    />
                  ) : (
                    <ImageWithBasePath
                      src="assets/img/logo.png"
                      width={300}
                      className="logo"
                      alt="Logo"
                    />
                  )}
                </Link>
                <Link
                  className="logo-dark header-logo"
                  to={all_routes.homefour}
                >
                  <ImageWithBasePath
                    src="assets/img/logo-white.svg"
                    className="logo"
                    width={300}
                    alt="Logo"
                  />
                </Link>
              </div>
            </div>
            <div className={`main-menu-wrapper ${isMegaMenu ? "active" : ""}`}>
              <div className="menu-header">
                <Link to={all_routes.homethree} className="menu-logo">
                  <ImageWithBasePath
                    src="assets/img/logo.png"
                    className="img-fluid"
                    alt="Logo"
                  />
                </Link>
                <Link
                  id="menu_close"
                  className="menu-close"
                  to="#"
                  onClick={() => onhandleCloseMenu()}
                >
                  <i className="fas fa-times" />
                </Link>
              </div>
              <ul className={`main-nav ${isMegaMenu ? "active" : ""}`}>
                {visibleHeaderMenus.map((mainMenus: any, mainIndex: number) => (
                  <React.Fragment key={mainIndex}>
                    {/* Redirecionamento direto para Home */}
                    {mainMenus.tittle === "Home" ? (
                      <li
                        className={
                          location.pathname === all_routes.homefour
                            ? "active"
                            : ""
                        }
                      >
                        <Link to={all_routes.homefour}>{mainMenus.tittle}</Link>
                      </li>
                    ) : mainMenus.tittle === "Cursos" ? (
                      // Redirecionamento direto para Lista de Cursos
                      <li
                        className={
                          location.pathname === all_routes.courseList
                            ? "active"
                            : ""
                        }
                      >
                        <Link to={all_routes.courseList}>
                          {mainMenus.tittle}
                        </Link>
                      </li>
                    ) : mainMenus.tittle === "Páginas" ? (
                      // Redirecionamento direto para Sobre nós
                      <li
                        className={
                          location.pathname === all_routes.courseList
                            ? "active"
                            : ""
                        }
                      >
                        <Link to={all_routes.about_us}>Sobre nós</Link>
                      </li>
                    ) : mainMenus.isDashboard ? (
                      // Redirecionamento dinâmico do Painel baseado no role
                      <li
                        className={
                          location.pathname === all_routes.instructorDashboard ||
                          location.pathname === all_routes.studentProfile
                            ? "active"
                            : ""
                        }
                      >
                        <Link
                          to={
                            role === "ROLE_INSTRUCTOR"
                              ? all_routes.instructorDashboard
                              : all_routes.studentProfile
                          }
                        >
                          {mainMenus.tittle}
                        </Link>
                      </li>
                    ) : mainMenus.separateRoute ? (
                      // Caso de megamenu
                      <li
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
                            className={`${
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
                                {mainMenus.menu.map(
                                  (menu: any, idx: number) => (
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
                                              className="img-fluid"
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
                                  )
                                )}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    ) : (
                      // Menus normais com submenu
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
                          {mainMenus.tittle}
                          <i
                            className={`${
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
                          {mainMenus.menu.map(
                            (menu: any, menuIndex: number) => (
                              <React.Fragment key={`${mainIndex}-${menuIndex}`}>
                                {menu.hasSubRoute ? (
                                  <li
                                    className={`has-submenu ${
                                      menu?.subMenus?.some((item: any) =>
                                        item?.route?.includes(location.pathname)
                                      ) || basePath === menu.base
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    <Link
                                      to="#"
                                      className="hideonmob"
                                      onClick={() =>
                                        toggleSubsidebar(menu.menuValue)
                                      }
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
                                        (
                                          subMenu: any,
                                          subMenuIndex: number
                                        ) => (
                                          <React.Fragment
                                            key={`${mainIndex}-${menuIndex}-${subMenuIndex}`}
                                          >
                                            {subMenu.hasSubRoute ? (
                                              <li
                                                className={`has-submenu ${
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
                                                  onClick={() =>
                                                    toggleSubsidebar2(
                                                      subMenu.menuValue
                                                    )
                                                  }
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
                                                      menuIndex2: number
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
                                    className={
                                      location.pathname.includes(
                                        menu.route || ""
                                      )
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    <Link to={menu.route}>
                                      {menu.menuValue}
                                    </Link>
                                  </li>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </ul>
                      </li>
                    )}
                  </React.Fragment>
                ))}
                {isAuthenticated && role === "ROLE_STUDENT" && (
                  <li
                    className={
                      location.pathname === all_routes.studentCourses
                        ? "active"
                        : ""
                    }
                  >
                    <Link to={all_routes.studentCourses}>Meus Cursos</Link>
                  </li>
                )}
              </ul>
            </div>
            {location.pathname === "/index" ? (
              <div className="header-btn d-flex align-items-center">
                <div className="dropdown flag-dropdown icon-btn">
                  <Link
                    to="#"
                    className="d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/us-flag.svg"
                      alt="bandeira"
                    />
                  </Link>
                </div>
                <div className="dropdown icon-btn">
                  <Link to="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="isax isax-dollar-circle4" />
                  </Link>
                  <ul className="dropdown-menu p-2 mt-2">
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        USD
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        YEN
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        EURO
                      </Link>
                    </li>
                  </ul>
                </div>
                <DarkButton />
                {isAuthenticated ? (
                  <>
                    <div className="dropdown profile-dropdown me-3">
                      <Link
                        to="#"
                        className="d-flex align-items-center"
                        data-bs-toggle="dropdown"
                      >
                        <span className="avatar">{renderProfileAvatar()}</span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <div className="profile-header d-flex align-items-center">
                          <div className="avatar">{renderProfileAvatar()}</div>
                          <div>
                            <h6>{displayName}</h6>
                            {displayEmail && <p>{displayEmail}</p>}
                          </div>
                        </div>
                        <div className="profile-footer">
                          <button
                            type="button"
                            className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                            onClick={() => setShowLogoutModal(true)}
                          >
                            <i className="isax isax-logout me-2" />
                            Terminar Sessao
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger d-inline-flex align-items-center"
                    >
                      Sair
                    </button>

                    {/* Modal de Confirmacao */}
                    <Modal
                      show={showLogoutModal}
                      onHide={() => setShowLogoutModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmar Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.login}
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={all_routes.register}
                      className="btn btn-secondary me-0"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            ) : location.pathname === "/index-3" ? (
              <div className="header-btn d-flex align-items-center">
                <DarkButton />

                {/* Dropdown de Moeda (mostra sempre) */}
                <div className="dropdown me-3">
                  <Link
                    to="#"
                    className="dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    USD
                  </Link>
                  <ul className="dropdown-menu p-2 mt-2">
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        USD
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        YEN
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        EURO
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Ícone do Carrinho (mostra sempre) */}
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Botões condicionais */}
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger d-inline-flex align-items-center"
                    >
                      Sair
                    </button>

                    {/* Modal de Confirmação */}
                    <Modal
                      show={showLogoutModal}
                      onHide={() => setShowLogoutModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmar Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.login}
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={all_routes.register}
                      className="btn btn-secondary me-0"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            ) : location.pathname === "/index-4" ? (
              <div className="header-btn d-flex align-items-center">
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger d-inline-flex align-items-center"
                    >
                      Sair
                    </button>

                    {/* Modal de Confirmação */}
                    <Modal
                      show={showLogoutModal}
                      onHide={() => setShowLogoutModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmar Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.login}
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={all_routes.register}
                      className="btn btn-secondary me-0"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            ) : location.pathname === "/index-5" ? (
              <div className="header-btn d-flex align-items-center">
                <div className="dropdown flag-dropdown icon-btn">
                  <Link
                    to="#"
                    className="d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <ImageWithBasePath
                      src="assets/img/flags/us-flag.svg"
                      alt="bandeira"
                    />
                  </Link>
                  <ul className="dropdown-menu p-2 mt-2">
                    <li>
                      <Link
                        className="dropdown-item rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/us-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        ENG
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/arab-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        ARA
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/france-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        FRE
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown icon-btn">
                  <Link to="#" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="isax isax-dollar-circle4" />
                  </Link>
                  <ul className="dropdown-menu p-2 mt-2">
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        USD
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        YEN
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded" to="#">
                        EURO
                      </Link>
                    </li>
                  </ul>
                </div>
                <DarkButton />
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger d-inline-flex align-items-center"
                    >
                      Sair
                    </button>

                    {/* Modal de Confirmação */}
                    <Modal
                      show={showLogoutModal}
                      onHide={() => setShowLogoutModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmar Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.login}
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={all_routes.register}
                      className="btn btn-secondary me-0"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            ) : location.pathname === "/index-6" ? (
              <div className="header-btn d-flex align-items-center">
                <div className="icon-btn me-2">
                  <Link
                    to="#"
                    className="bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <ImageWithBasePath
                      className="rounded-pill"
                      src="assets/img/flags/us-flag.svg"
                      alt="bandeira"
                    />
                  </Link>
                  <ul className="dropdown-menu p-2 mt-2">
                    <li className="mb-2">
                      <Link
                        className="dropdown-item w-100 rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/us-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        ENG
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        className="dropdown-item w-100 rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/arab-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        ARA
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item w-100 rounded d-flex align-items-center"
                        to="#"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/france-flag.svg"
                          className="me-2"
                          alt="bandeira"
                        />
                        FRE
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="icon-btn me-2">
                  <Link to="#" className="bg-white text-primary">
                    <i className="isax isax-dollar-circle4" />
                  </Link>
                </div>
                <DarkButton />
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div>
                  <Link
                    to={all_routes.login}
                    className="btn btn-primary d-inline-flex align-items-center me-2 px-3"
                  >
                    Entrar
                  </Link>
                </div>
                <Link
                  to={all_routes.register}
                  className="btn btn-secondary me-0 px-3"
                >
                  Registrar
                </Link>
              </div>
            ) : location.pathname.includes("instructor") ? (
              <div className="header-btn d-flex align-items-center">
                <DarkButton />
                {/* Ícone do Carrinho (mostra sempre) */}
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="dropdown profile-dropdown">
                  <Link
                    to="#"
                    className="d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <span className="avatar">
                      {renderProfileAvatar()}
                    </span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="profile-header d-flex align-items-center">
                      <div className="avatar">
                        {renderProfileAvatar()}
                      </div>
                      <div>
                        <h6>{displayName}</h6>
                        {displayEmail && <p>{displayEmail}</p>}
                      </div>
                    </div>
                    <ul className="profile-body">
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.instructorProfile}
                        >
                          <i className="isax isax-security-user me-2" />
                          Meu Perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.instructorCourse}
                        >
                          <i className="isax isax-teacher me-2" />
                          Cursos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium2"
                          to={all_routes.instructorEarning}
                        >
                          <i className="isax isax-dollar-circle me-2" />
                          Ganhos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.instructorPayout}
                        >
                          <i className="isax isax-coin me-2" />
                          Pagamentos
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.instructorMessage}
                        >
                          <i className="isax isax-messages-3 me-2" />
                          Mensagens<span className="message-count">2</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.instructorsettings}
                        >
                          <i className="isax isax-setting-2 me-2" />
                          Configurações
                        </Link>
                      </li>
                    </ul>
                    <div className="profile-footer">
                      <Link
                        className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                        to={all_routes.login}
                      >
                        <i className="isax isax-arrow-2 me-2" />
                        Entrar como Aluno
                      </Link>
                      <button
                        type="button"
                        className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                        onClick={handleLogout}
                      >
                        <i className="isax isax-logout me-2" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : location.pathname.includes("student") ? (
              <div className="header-btn d-flex align-items-center">
                <DarkButton />
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="dropdown profile-dropdown">
                  <Link
                    to="#"
                    className="d-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <span className="avatar">
                      {renderProfileAvatar()}
                    </span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="profile-header d-flex align-items-center">
                      <div className="avatar">
                        {renderProfileAvatar()}
                      </div>
                      <div>
                        <h6>{displayName}</h6>
                        {displayEmail && <p>{displayEmail}</p>}
                      </div>
                    </div>
                    <ul className="profile-body">
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.studentProfile}
                        >
                          <i className="isax isax-security-user me-2" />
                          Meu Perfil
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.studentQuiz}
                        >
                          <i className="isax isax-award me-2" />
                          Tentativas de Quiz
                        </Link>
                      </li>
                      <li>
                       
                      </li>
                     
                      <li>
                        <Link
                          className="dropdown-item d-inline-flex align-items-center rounded fw-medium"
                          to={all_routes.studentSettings}
                        >
                          <i className="isax isax-setting-2 me-2" />
                          Configurações
                        </Link>
                      </li>
                    </ul>
                    <div className="profile-footer">

                      <button
                        type="button"
                        className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                        onClick={handleLogout}
                      >
                        <i className="isax isax-logout me-2" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="header-btn d-flex align-items-center">
                {location.pathname === "/index-2" && (
                  <>
                    <div className="dropdown flag-dropdown icon-btn">
                      <Link
                        to="#"
                        className="d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <ImageWithBasePath
                          src="assets/img/flags/us-flag.svg"
                          alt="bandeira"
                        />
                      </Link>
                      <ul className="dropdown-menu p-2 mt-2">
                        <li>
                          <Link
                            className="dropdown-item rounded d-flex align-items-center"
                            to="#"
                          >
                            <ImageWithBasePath
                              src="assets/img/flags/us-flag.svg"
                              className="me-2"
                              alt="bandeira"
                            />
                            ENG
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item rounded d-flex align-items-center"
                            to="#"
                          >
                            <ImageWithBasePath
                              src="assets/img/flags/arab-flag.svg"
                              className="me-2"
                              alt="bandeira"
                            />
                            ARA
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item rounded d-flex align-items-center"
                            to="#"
                          >
                            <ImageWithBasePath
                              src="assets/img/flags/france-flag.svg"
                              className="me-2"
                              alt="bandeira"
                            />
                            FRE
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="dropdown icon-btn">
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="isax isax-dollar-circle4" />
                      </Link>
                      <ul className="dropdown-menu p-2 mt-2">
                        <li>
                          <Link className="dropdown-item rounded" to="#">
                            USD
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item rounded" to="#">
                            YEN
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item rounded" to="#">
                            EURO
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
                <DarkButton />
                <div className="icon-btn me-3">
                  <Link
                    to={all_routes.courseCart}
                    className="position-relative"
                  >
                    <i className="isax isax-shopping-cart5" />
                    {cartCount > 0 && (
                      <span className="count-icon bg-success p-1 rounded-pill text-white fs-10 fw-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                {isAuthenticated ? (
                  <>
                    <div className="dropdown profile-dropdown me-3">
                      <Link
                        to="#"
                        className="d-flex align-items-center"
                        data-bs-toggle="dropdown"
                      >
                        <span className="avatar">{renderProfileAvatar()}</span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <div className="profile-header d-flex align-items-center">
                          <div className="avatar">{renderProfileAvatar()}</div>
                          <div>
                            <h6>{displayName}</h6>
                            {displayEmail && <p>{displayEmail}</p>}
                          </div>
                        </div>
                        <div className="profile-footer">
                          <button
                            type="button"
                            className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                            onClick={() => setShowLogoutModal(true)}
                          >
                            <i className="isax isax-logout me-2" />
                            Terminar Sessao
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="btn btn-danger d-inline-flex align-items-center"
                    >
                      Sair
                    </button>

                    {/* Modal de Confirmacao */}
                    <Modal
                      show={showLogoutModal}
                      onHide={() => setShowLogoutModal(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmar Logout</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Tem certeza que deseja sair da sua conta?</p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setShowLogoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                          Sair
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </>
                ) : (
                  <>
                    <Link
                      to={all_routes.login}
                      className="btn btn-primary d-inline-flex align-items-center me-2"
                    >
                      Entrar
                    </Link>
                    <Link
                      to={all_routes.register}
                      className="btn btn-secondary me-0"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {/* /Header */}
    </>
  );
};

export default Header;
