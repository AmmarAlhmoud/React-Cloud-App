import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import styles from "./MainNavigation.module.css";
import Icon from "../UI/Icon";
import IC_documents from "../../assets/icons/CL/documents.png";
import IC_images from "../../assets/icons/CL/images.png";
import IC_videos from "../../assets/icons/CL/videos.png";
import IC_opened from "../../assets/icons/CL/opened.png";
import IC_closed from "../../assets/icons/CL/closed.png";

function MainNavigation({ children }) {
  const dispatch = useDispatch();

  const showModal = useSelector((state) => state.ui.showErroMoal);
  const dRoute = useSelector((state) => state.ui.dRoute);
  const iRoute = useSelector((state) => state.ui.iRoute);
  const vRoute = useSelector((state) => state.ui.vRoute);

  return (
    <>
      <nav className={styles["main-2-nav"]}>
        <h5>Click to Expand</h5>
        <article>
          <NavLink
            id="nav-documents"
            to="documents"
            onClick={() => {
              dispatch(uiActions.setDRoute(true));
              dispatch(uiActions.setIRoute(false));
              dispatch(uiActions.setVRoute(false));
              dispatch(uiActions.setStartDeleting(false));
              dispatch(uiActions.setSearchedItems([]));
              dispatch(uiActions.setHideSearch(false));
              dispatch(uiActions.setOpenedSearch(null));
              dispatch(uiActions.setOnMove(true));
            }}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <div className={styles["right-sec-list-item"]}>
              <span>
                <Icon src={IC_documents} alt="documents" />
                <span>Documents</span>
              </span>
              {dRoute && <Icon src={IC_opened} alt={"opened"} />}
              {!dRoute && <Icon src={IC_closed} alt={"closed"} />}
            </div>
          </NavLink>
          <NavLink
            id="nav-images"
            to="images"
            onClick={() => {
              dispatch(uiActions.setIRoute(true));
              dispatch(uiActions.setDRoute(false));
              dispatch(uiActions.setVRoute(false));
              dispatch(uiActions.setStartDeleting(false));
              dispatch(uiActions.setSearchedItems([]));
              dispatch(uiActions.setHideSearch(false));
              dispatch(uiActions.setOpenedSearch(null));
              dispatch(uiActions.setOnMove(true));
            }}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <div className={styles["right-sec-list-item"]}>
              <span>
                <Icon src={IC_images} alt="images" />
                <span>Images</span>
              </span>
              {iRoute && <Icon src={IC_opened} alt={"opened"} />}
              {!iRoute && <Icon src={IC_closed} alt={"closed"} />}
            </div>
          </NavLink>
          <NavLink
            id="nav-videos"
            to="videos"
            onClick={() => {
              dispatch(uiActions.setVRoute(true));
              dispatch(uiActions.setDRoute(false));
              dispatch(uiActions.setIRoute(false));
              dispatch(uiActions.setStartDeleting(false));
              dispatch(uiActions.setSearchedItems([]));
              dispatch(uiActions.setHideSearch(false));
              dispatch(uiActions.setOpenedSearch(null));
              dispatch(uiActions.setOnMove(true));
            }}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <div className={styles["right-sec-list-item"]}>
              <span>
                <Icon src={IC_videos} alt="videos" />
                <span>Videos</span>
              </span>
              {vRoute && <Icon src={IC_opened} alt={"opened"} />}
              {!vRoute && <Icon src={IC_closed} alt={"closed"} />}
            </div>
          </NavLink>
        </article>
      </nav>
      <div className={`${styles["main-3-div"]} ${showModal ? styles.rel : ""}`}>
        <h5>View Cloud</h5>
        {children}
      </div>
    </>
  );
}

export default MainNavigation;
