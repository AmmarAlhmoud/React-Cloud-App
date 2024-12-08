import React from "react";
import { useSelector } from "react-redux";

import styles from "./DItem.module.css";
import Icon from "../../UI/Icon";
import IC_document from "../../../assets/icons/CL/document.png";
import Checkbox from "./Checkbox";

const DItem = ({ file, isChecked, onChange, onMouseEnter, onMouseLeave }) => {
  const parsedDate = new Date(file.uploadedDate);
  const startDeleting = useSelector((state) => state.ui.startDeleting);

  const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let documentName;
  if (file.name.length < 30) {
    documentName = file.name.substring(0, 30);
  } else {
    documentName = file.name.substring(0, 27).concat("...");
  }

  return (
    <li
      data-id={file["data-id"]}
      id={startDeleting ? "" : file.id}
      className={styles["list-item"]}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isChecked && <div className={styles.backdrop} />}
      <span className={styles["span-1"]}>
        {startDeleting && (
          <Checkbox
            id={file.id}
            onChange={onChange}
            isChecked={isChecked}
            top="14px"
          />
        )}
        <Icon src={IC_document} alt="videos" />
        <abbr title={file.name}>{documentName}</abbr>
      </span>
      <span className={styles["span-2"]}>
        <time>{formattedDate}</time>
        <span>
          {file.info.size} {file.info.unit}
        </span>
      </span>
    </li>
  );
};

export default DItem;
