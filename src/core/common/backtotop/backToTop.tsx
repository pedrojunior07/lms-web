import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BackToTop = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="back-to-top">
      <Link
        className={`back-to-top-icon align-items-center justify-content-center d-flex ${
          scrolled ? "show" : ""
        }`}
        to="#"
        onClick={scrollToTop}
      >
        <i className="fa-solid fa-arrow-up" />
      </Link>
    </div>
  );
};

export default BackToTop;
