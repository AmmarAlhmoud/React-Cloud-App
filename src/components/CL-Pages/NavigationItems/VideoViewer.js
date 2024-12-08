import React from "react";
import { useSelector } from "react-redux";

import styles from "./VideoViewer.module.css";


const VideoViewer = () => {
  const fetchedVideo = useSelector((state) => state.ui.fetchedVideo);

  return (
    <div className={styles.layout}>
      <div className={styles.backdrop} />
      <section className={styles["layout-main-container"]}>
        <section className={styles["main-content"]}>
          <video controls>
            <source src={fetchedVideo.url} type={fetchedVideo.type} />
            Your browser does not support the video tag.
          </video>
        </section>
      </section>
    </div>
  );
};

export default VideoViewer;
