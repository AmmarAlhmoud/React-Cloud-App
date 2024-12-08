import React from "react";

import styles from "./CL-Layout.module.css";
import BGImage from "../../assets/background.jpeg";
import Image from "../UI/Image";

const CLLayout = (props) => {
  return (
    <div className={styles.layout}>
      <section className={styles["layout-main-container"]}>
        <Image
          className={styles["main-background-img"]}
          src={BGImage}
          alt="background"
        />
        <div className={styles.backdrop} />
        <section className={styles["main-content"]}>{props.children}</section>
      </section>
    </div>
  );
};

export default CLLayout;
