import React from "react";
import { useSelector } from "react-redux";

import styles from "./IMGItem.module.css";
import Image from "../../UI/Image";
import Checkbox from "./Checkbox";

const IMGItem = ({
  image,
  isChecked,
  onChange,
  onMouseEnter,
  onMouseLeave,
}) => {
  const parsedDate = new Date(image.uploadedDate);
  const startDeleting = useSelector((state) => state.ui.startDeleting);

  const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const parsedTime = new Date(image.time);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  let imageName;
  if (image.name.length < 17) {
    imageName = image.name.substring(0, 17);
  } else {
    imageName = image.name.substring(0, 15).concat("...");
  }

  return (
    <li data-id={image["data-id"]} className={styles["list-item"]}>
      {isChecked && <div className={styles.backdrop} />}
      {startDeleting && (
        <Checkbox id={image.id} onChange={onChange} isChecked={isChecked} />
      )}
      <div className={styles.image}>
        <Image
          id={image.id}
          src={image.url}
          alt={image.name}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </div>
      <div className={styles["file-details"]}>
        <abbr title={image.name}>{imageName}</abbr>
        <time dateTime={parsedDate}>{formattedDate}</time>
        {",\t"}
        <time>{formattedTime}</time>
      </div>
      <div className={styles.size}>
        {image.info.size} {image.info.unit}
      </div>
    </li>
  );
};

export default IMGItem;
