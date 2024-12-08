import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand}>
          <img
            src="./images/photo-album.png"
            alt="PhotoFolio"
            className={styles.navbarLogo}
          />
          <span className={styles.navbarTitle}>PhotoFolio</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
