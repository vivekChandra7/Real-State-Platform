import React from "react";
import { Link } from "react-router-dom";

import { navbarStyles as s } from "../../assets/dummyStyles";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { user, logout } = useAuth();

  // toggle menu for mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className={s.nav}>
        <div className={s.container}>
          <div className={s.grid}>
            
            {/* Logo */}
            <div className="justify-self-start">
              <Logo />
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className={s.menuBtn}>
              {isOpen ? "Close" : "Menu"}
            </button>

            {/* Nav Links */}
            <div className={`${s.navLinks} ${isOpen ? s.showMenu : ""}`}>
              
              {/* Show only if NOT buyer */}
              {(!user || user.role !== "buyer") && (
                <Link
                  to="/properties"
                  className={s.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  Browse Properties
                </Link>
              )}

              {/* Show only for buyer */}
              {user && user.role === "buyer" && (
                <Link
                  to="/"
                  className={s.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              )}

              <Link
                to="/properties"
                className={s.navLink}
                onClick={() => setIsOpen(false)}
              >
                Property
              </Link>

              <Link
                to="/wishlist"
                className={s.navLink}
                onClick={() => setIsOpen(false)}
              >
                Wishlist
              </Link>

              <Link
                to="/chat-messages"
                className={s.navLink}
                onClick={() => setIsOpen(false)}
              >
                Messages
              </Link>

              <Link
                to="/contact"
                className={s.navLink}
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>

              {/* Logout Button */}
              {user && (
                <button
                  onClick={logout}
                  className={s.logoutBtn}
                >
                  Logout
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;