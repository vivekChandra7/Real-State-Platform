import React from "react";
import { landingPageStyles as s } from "../../assets/dummyStyles";
import Navbar from "../../components/common/Navbar";


const LandingPage = () => {
  return (
    <div className={s.bgMain}>
      <Navbar />
    </div>
  );
};

export default LandingPage;