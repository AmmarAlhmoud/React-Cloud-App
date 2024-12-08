import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import styles from "./LO-RE-Layout.module.css";
import BGImage from "../../assets/background.jpeg";
import Image from "../UI/Image";
import Logo from "../../assets/logo.png";

const RELOLayout = (props) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ width: "100%" }}
      transition={{ type: "tween", duration: 0.2 }}
      className={styles.layout}
    >
      <section className={styles["layout-main-container"]}>
        <Image
          className={styles["main-background-img"]}
          src={BGImage}
          alt="background"
        />
        <div className={styles.backdrop} />
        <main className={styles["main-content"]}>
          <section className={styles["main-container-logo"]}>
            <Link to="/">
              <img className={styles.logo} src={Logo} alt="website logo" />
            </Link>
          </section>
          <section className={styles["main-container-form"]}>
            {props.children}
          </section>
        </main>
      </section>
      <footer className={styles.footer}>
        <p>
          Powered by
          <img
            className={styles["footer-logo"]}
            src={Logo}
            alt="website logo"
          />
          Tech-U
        </p>
      </footer>
    </motion.div>
  );
};

export default RELOLayout;
