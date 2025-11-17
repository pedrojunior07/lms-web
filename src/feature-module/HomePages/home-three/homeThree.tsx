import React, { useEffect } from "react";
import Footer from "./footer";
import Banner from "./section/banner";
import Topcategories from "./section/top-categories";
import Feature from "./section/feature";
import Masterskill from "./section/master-skill";
import Trendingcourse from "./section/trending-course";
import Leadingcompany from "./section/leading-company";
import Knowledge from "./section/knowledge";
import Testimonial from "./section/testimonial";
import Becomeinstructor from "./section/become-instructor";
import Latestblog from "./section/latest-blog";
import { useAuth } from "../../../core/common/context/AuthContextType";

const HomeThree = () => {
  const { login } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    const userData = {
      token: token || "",
      id: id || "",
      role: role || "",
      email: email || "",
    };

    // login(userData);
  }, []);

  return (
    <>
      <Banner />
      {/** <Topcategories /> */}
      <Feature />
      <Masterskill />
      {/** <Trendingcourse />*/}
      {/**<Leadingcompany /> */}
      <Knowledge />
      <Testimonial />
      <Becomeinstructor />
      <Latestblog />
      <Footer />
    </>
  );
};

export default HomeThree;
