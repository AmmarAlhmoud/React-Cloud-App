import React from "react";

import styles from "./PopupError.module.css";
import IC_excl_mark from "../../assets/icons/LO-RE/excl_mark.png";
import Icon from "../UI/Icon";

const PopupError = ({ message }) => {
  return (
    <li className={styles.dialog}>
      <Icon
        className={styles.icon}
        src={IC_excl_mark}
        alt={"Exclamation Mark"}
      />
      <p>{message}</p>
    </li>
  );
};

export default PopupError;
