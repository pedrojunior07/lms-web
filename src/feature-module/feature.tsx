import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import Header from "../core/common/header/header";
import BackToTop from "../core/common/backtotop/backToTop";
import Footer from "../core/common/footer/footer";

const Feature = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideHeaderPaths = [
    "/registrationConfirm",
    "/instructor/instructor-dashboard",
    "/instructor/instructor-course",
    "/instructor/instructor-tickets",
    "/instructor/instructor-message",
    "/instructor/instructor-quiz-results",
    "/instructor/instructor-announcements",
    "/instructor/instructor-message",
    "/instructor/instructor-statements",
    "/instructor/instructor-assignment",
    "/instructor/instructor-profile",
    "/instructor/student-list",
    "/instructor/instructor-quiz-results",
    "/instructor/instructor-quiz",
    "/instructor/instructor-certificate",
    "/instructor/instructor-earnings",
    "/instructor/instructor-payout",
    "/instructor/instructor-quiz-questions",
  ];

  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      <div className="main-wrapper">
        <div
          className={
            location.pathname === "/index-3"
              ? "home-3"
              : location.pathname === "/index-4"
              ? "home-4"
              : location.pathname === "/index-6"
              ? "home-six"
              : ""
          }
        >
          {!shouldHideHeader && <Header />}

          <Outlet />

          {location.pathname === "/index" ||
          location.pathname === "/index-3" ||
          location.pathname === "/index-4" ||
          location.pathname === "/index-5" ||
          location.pathname === "/index-6" ? (
            <></>
          ) : (
            <Footer />
          )}

          <BackToTop />
        </div>

        <div className="sidebar-overlay"></div>
      </div>
    </>
  );
};

export default Feature;
