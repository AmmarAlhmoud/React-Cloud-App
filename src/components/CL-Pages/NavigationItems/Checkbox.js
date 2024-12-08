import React from "react";

import styles from "./Checkbox.module.css";

function Checkbox({ id, isChecked, onChange, top }) {
  return (
    <div className={styles["checkbox-container"]}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange(id)}
      />
      <label
        id={`${id}_checkbox`}
        htmlFor={id}
        className={styles["checkmark"]}
        style={{ top }}
      />
    </div>
  );
}

export default Checkbox;
