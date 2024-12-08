import React from "react";

import styles from "./Layout-Item.module.css";

const LayoutItem = ({ title, className, container, height, children }) => {
  if (height === 1) {
    height = "50px";
  } else if (height === 2) {
    height = "220px";
  } else if (height === 3) {
    height = "180px";
  } else {
    height = "";
  }

  return (
    <div className={`${styles.item} ${container}`}>
      {title && <h5>{title}</h5>}
      <div style={{ height }} className={`${styles.div}`}>
        <div className={className || ""}>{children}</div>
      </div>
    </div>
  );
};

export default LayoutItem;
