import React, { useEffect } from "react";
import Footer from "./footer";
import Banner from "./section/banner";
import Vision from "./section/vision";
import Aboutsection from "./section/aboutsection";
import Topcategories from "./section/top-categories";
import Feature from "./section/feature";
import Master from "./section/master";
import Testimonial from "./section/testimonial";
import Knowledge from "./section/knowledge";
import Featureinstructors from "./section/feature-instructors";
import Leadingcompanies from "./section/leading-companies";
import Latestblog from "./section/latest-blog";
import { useAuth } from "../../../core/common/context/AuthContextType";

const HomeFour = () => {
  const { login } = useAuth();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const id = localStorage.getItem("id");
  //   const role = localStorage.getItem("role");
  //   const email = localStorage.getItem("email");

  //   const userData = {
  //     token: token || "",
  //     id: id || "",
  //     role: role || "",
  //     email: email || "",
  //   };

  //   login(userData);
  // }, []);
  return (
    <>
      <Banner />
      <Vision />
      <Aboutsection />
      {/** <Topcategories /> */}
      <Feature />
      <Master />
      <Knowledge />
      {/** <Testimonial /> */}
      {/***/}
      {/** <Featureinstructors /> */}
      {/** <Leadingcompanies /> */}
      {/** <Latestblog /> */}
      <Footer />
    </>
  );
};

export default HomeFour;
