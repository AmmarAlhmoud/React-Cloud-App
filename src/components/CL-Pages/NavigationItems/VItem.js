import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { uiActions } from "../../../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";

import styles from "./VItem.module.css";
import Image from "../../UI/Image";
import Play from "../../../assets/icons/CL/play.png";
import video_placeholder from "../../../assets/images/CL/video_placeholder.png";
import Checkbox from "./Checkbox";

const VItem = ({ video, isChecked, onChange, onMouseEnter, onMouseLeave }) => {
  const parsedDate = new Date(video.uploadedDate);
  const startDeleting = useSelector((state) => state.ui.startDeleting);
  const dispatch = useDispatch();

  const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let videoName;
  if (video.name.length < 43) {
    videoName = video.name.substring(0, 43);
  } else {
    videoName = video.name.substring(0, 40).concat("...");
  }

  const sendVideoToView = () => {
    dispatch(
      uiActions.setFetchedVideo({
        url: video.url,
        type: video.vType,
      })
    );
  };

  return (
    <li data-id={video["data-id"]} className={styles.item}>
      <div className={styles["item-first"]}>
        {startDeleting && (
          <Checkbox id={video.id} onChange={onChange} isChecked={isChecked} />
        )}
        <div className={styles.backdrop}>
          {!isChecked && (
            <Link id={video.id} to={video.id} onClick={sendVideoToView}>
              <motion.img
                src={Play}
                alt="playing the video button"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                loading="lazy"
              />
            </Link>
          )}
        </div>
        <Image src={video_placeholder} alt="video placeholder" />
        <span
          id={video.id}
          className={styles["video-details"]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <time dateTime={parsedDate}>{formattedDate}</time>
          <div className={styles.size}>
            {video.info.size} {video.info.unit}
          </div>
        </span>
      </div>
      <abbr
        id={video.id}
        title={video.name}
        className={styles["item-second"]}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {videoName}
      </abbr>
    </li>
  );
};

export default VItem;
