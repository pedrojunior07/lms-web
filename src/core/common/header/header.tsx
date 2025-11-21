import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../imageWithBasePath";
import { header } from "../data/json/header";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";
import { setDataTheme } from "../../redux/themeSettingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContextType";
import { Button, Modal } from "react-bootstrap";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenu, setIsMegaMenu] = useState(false);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");
  const [subsidebar2, setSubsidebar2] = useState("");
  const [basePath, setBasePath] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartCount } = useCart();
  const [role, setRole] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [header2, setHeader] = useState<any[]>(header);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
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
      // Se não houver usuário logado, bloqueia menus restritos
      if (!user) {
        // Aqui você pode definir quais menus são públicos; por exemplo, menus com public: true
        return menu.public === true; // assume que menus públicos têm public: true
      }

      // Se usuário logado, filtra menus conforme o papel
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
                {header7.map((mainMenus: any, mainIndex: number) => (
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
                      <ImageWithBasePath
                        src="assets/img/user/user-01.jpg"
                        alt="Img"
                        className="img-fluid rounded-circle"
                      />
                    </span>
                  </Link>
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
                        <p>instructordemo@example.com</p>
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
                      <Link
                        to={all_routes.homefour}
                        className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                      >
                        <i className="isax isax-logout me-2" />
                        Sair
                      </Link>
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
                      <ImageWithBasePath
                        src="assets/img/user/user-02.jpg"
                        alt="Img"
                        className="img-fluid rounded-circle"
                      />
                    </span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="profile-header d-flex align-items-center">
                      <div className="avatar">
                        <ImageWithBasePath
                          src="assets/img/user/user-02.jpg"
                          alt="Img"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div>
                        <h6>Yanik Mussagy</h6>
                        <p>ribeiroyannick405@gmail.com</p>
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

                      <Link
                        to={all_routes.homefour}
                        className="btn btn-secondary d-inline-flex align-items-center justify-content-center w-100"
                      >
                        <i className="isax isax-logout me-2" />
                        Sair
                      </Link>
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
            )}
          </div>
        </div>
      </header>
      {/* /Header */}
    </>
  );
};

export default Header;