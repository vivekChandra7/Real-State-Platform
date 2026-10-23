import React from "react";
import { Link } from "react-router-dom";

import { navbarStyles as s } from "../../assets/dummyStyles";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const navLinks = (
    <>
      {!user && (
        <>
          <Link to="/properties" className={s.navLink} onClick={closeMenu}>
            Browse Properties
          </Link>
          <Link to="/login" className={s.navLink} onClick={closeMenu}>
            Login
          </Link>
          <Link to="/register" className={s.navLink} onClick={closeMenu}>
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <Link to="/" className={s.navLink} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/properties" className={s.navLink} onClick={closeMenu}>
            Properties
          </Link>
          {user.role === "buyer" && (
            <>
              <Link to="/wishlist" className={s.navLink} onClick={closeMenu}>
                Wishlist
              </Link>
              <Link
                to="/chat-messages"
                className={s.navLink}
                onClick={closeMenu}
              >
                Messages
              </Link>
            </>
          )}
          {user.role === "seller" && (
            <Link to="/dashboard" className={s.navLink} onClick={closeMenu}>
              Dashboard
            </Link>
          )}
          {user.role === "admin" && (
            <Link to="/admin" className={s.navLink} onClick={closeMenu}>
              Admin Panel
            </Link>
          )}
          <Link to="/contact" className={s.navLink} onClick={closeMenu}>
            Contact Us
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              logout();
            }}
            className={s.navLink}
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className={s.nav}>
      <div className={s.container}>
        <div className={s.grid}>
          <Logo />

          <div className={s.desktopMenu}>{navLinks}</div>

          <div className={s.rightSection}>
            {user ? (
              <div className={s.userSection}>
                <Link to="/profile" className="flex items-center">
                  <img
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                    }
                    alt="Profile"
                    className={s.avatar}
                  />
                </Link>
                <button onClick={logout} className={s.logoutButton}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {!isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={s.mobileToggle}
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              <HiMenuAlt3 size={28} />
            </button>
          )}
        </div>
      </div>

      </nav>

      {isOpen && (
        <>
          <div className={s.backdrop(true)} onClick={closeMenu} />
          <div className={s.drawer(true)}>
          <div className={s.drawerHeader}>
            <Logo />
            <button
              type="button"
              onClick={closeMenu}
              className={s.drawerCloseIcon}
              aria-label="Close navigation menu"
            >
              <HiX size={28} />
            </button>
          </div>
          <div className={s.drawerNavLinks}>{navLinks}</div>
          {user && (
            <div className={s.drawerUserSection}>
              <div className={s.drawerUserInfo}>
                <img
                  src={
                    user.profilePic ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`
                  }
                  alt="Profile"
                  className={s.drawerAvatar}
                />
              </div>
              <div className={s.drawerUserDetails}>
                <div />
                <div className={s.drawerUserName}>{user.name}</div>
                <div className={s.drawerUserEmail}>{user.email}</div>
              </div>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
        </>
      )}
    </>
  );
};

export default Navbar;