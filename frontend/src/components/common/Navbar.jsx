import React from "react";

import { navbarStyles as s } from "../../assets/dummyStyles";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <>
      <nav className={s.nav}>
        <div className={s.container}>
          <div className={s.grid}>
            <div className="justify-self-start">
              <Logo/>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
