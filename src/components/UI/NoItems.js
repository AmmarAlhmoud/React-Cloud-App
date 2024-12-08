import React from "react";

import styles from "./NoItems.module.css";

const NoItems = ({ type }) => {
  return (
    <p className={styles["no-items"]}>
      {`Seems like there are no ${type} here yet.`}
      <span>Try add some by yourself!</span>
    </p>
  );
};

export default NoItems;
