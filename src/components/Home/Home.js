import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuthUserId } from "../../util/auth";

import styles from "./Home.module.css";
import Image from "../UI/Image";
import background from "../../assets/background.jpeg";
import img_stars from "../../assets/images/Home/stars.png";
import img_moon from "../../assets/images/Home/moon.png";
import img_dashboard from "../../assets/images/Home/dashboard.png";
import img_g1 from "../../assets/images/Home/Group 1.png";
import img_g2 from "../../assets/images/Home/Group 2.png";
import img_g3 from "../../assets/images/Home/Group 3.png";
import img_g4 from "../../assets/images/Home/Group 4.png";
import img_g5 from "../../assets/images/Home/Group 5.png";

const Home = () => {
  const userId = getAuthUserId();
  const { logout } = useAuth();

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className={styles["overall-container"]}>
      <Image
        className={styles["main-background-img"]}
        src={background}
        alt="background"
      />
      <div className={styles["backdrop-outer"]} />

      <div className={styles["main-container"]}>
        <header className={styles.header}>
          <nav>
            <h1 className={styles["header-left"]}>E.T. -Cloud</h1>
            {!userId && (
              <div className={styles["header-right"]}>
                <Link id="nav-login" to="login">
                  Login
                </Link>
                <span>/</span>
                <Link id="nav-signup" to="signup">
                  Signup
                </Link>
              </div>
            )}
            {userId && (
              <div
                className={`${styles["header-right"]} ${styles["header-right-dashboard"]}`}
              >
                <Link id="nav-dashboard" to="cloud/documents">
                  My Dashboard
                </Link>
                <span>/</span>
                <Link id="nav-logout" onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            )}
          </nav>
        </header>
        <main className={styles.main}>
          <section className={styles["sec-1"]}>
            <h1>E.T. Evolution Found Its Way Home!</h1>
            <p>Never lose a memory, note or progress</p>
          </section>
          <section className={styles["sec-2"]}>
            <img className={styles["image-1"]} src={img_stars} alt="stars" />
            {/* <img className={styles["image-2"]} src={img_moon} alt="moon" /> */}
            <Image
              className={styles["image-3"]}
              src={img_dashboard}
              alt="E.T.cloud dashboard"
            />
          </section>
          <section className={styles["sec-3"]}>
            <div>
              <h2>
                <p>Everything you need.</p>
                <p>Nothing you don’t</p>
              </h2>
              <p className={styles["sec-3-header-p"]}>
                Your digital fortress for secure, seamless access to your data,
                and beyond. Say goodbye to data loss with our entirely free
                storage. Your files, your freedom.
              </p>
            </div>
            <div className={styles["sec-3-div"]}>
              <Image src={img_g1} alt="shield" />
              <Image src={img_g2} alt="rocket" />
              <Image src={img_g3} alt="accessibility" />
              <div className={styles["sec-3-sec-div"]}>
                <Image src={img_g4} alt="rocket" />
                <Image src={img_g5} alt="accessibility" />
              </div>
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <div className={styles["footer-div-1"]}>
            <div>
              <span>© 2023 Electronic Technology Cloud.</span>
              <span>Privacy Policy</span> <span>Terms of Use</span>
            </div>
            <p>
              Welcome to E.T. Cloud, your privacy-focused file storage solution.
              We do not collect any personal information from users, ensuring
              full privacy for your uploaded files. Your data remains
              confidential, and we do not share or sell it to third parties. By
              using E.T. Cloud, you agree to our commitment to user privacy, and
              we do not engage in any data collection practices. Prohibited
              activities include violating laws and infringing on others'
              rights. We reserve the right to terminate accounts for any reason.
              Updates are effective immediately.
            </p>
          </div>
          <div className={styles["footer-div-2"]}>
            <h5>Contact Us:</h5>
            <p>
              For any inquiries or concerns regarding your privacy or the use of
              E.T. Cloud, please feel free to contact our dedicated team at
              [contact@etcloud.com]. We value your feedback and are committed to
              addressing any questions you may have. Thank you for choosing E.T.
              Cloud for your secure and private file storage needs.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
