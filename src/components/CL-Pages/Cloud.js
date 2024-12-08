import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { getAuthUserId } from "../../util/auth";
import { useSelector, useDispatch } from "react-redux";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { uiActions } from "../../store/ui-slice";
import { previewFileInfo } from "../../util/file";
import { fetchStorageData, sendStorageData } from "../../store/storage-data";
import { storageActions } from "../../store/storage-slice";

import styles from "./Cloud.module.css";
import Logo from "../../assets/logo.png";
import SearchBar from "./SearchBar";
import Icon from "../UI/Icon";
import HoverIcon from "./HoverIcon";
import IC_actions from "../../assets/icons/CL/actions.png";
import IC_logout from "../../assets/icons/CL/logout.png";
import IC_document from "../../assets/icons/CL/document.png";
import IC_upload from "../../assets/icons/CL/upload.png";
import IC_x_close from "../../assets/icons/CL/x_close.png";
import IC_trash_aside from "../../assets/icons/CL/Trash_aside.png";
import IC_download from "../../assets/icons/CL/download.png";
import LayoutItem from "../Layout/Layout-Item";
import Modal from "../UI/Modal";

let initialLoad = true;

const Cloud = ({ children }) => {
  const storageLimmites = useSelector((state) => state.store.storageLimit);

  const [storageLeft] = useState({
    datasets: [
      {
        label: "Storage Left",
        backgroundColor: ["#6b52e5", "#bf4b86", "#ff9020"],
        data: storageLimmites.map((data) => data.storageLeft),
      },
    ],
  });

  const naviate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const userId = getAuthUserId();
  const showModal = useSelector((state) => state.ui.toggleModal);
  const startDeleting = useSelector((state) => state.ui.startDeleting);
  const hoveredItem = useSelector((state) => state.ui.hoveredItem);
  const numOfSelectedItems = useSelector(
    (state) => state.ui.numOfSelectedItems
  );
  const selectedDocuments = useSelector((state) => state.ui.selectedDocuments);
  const selectedImages = useSelector((state) => state.ui.selectedImages);
  const selectedVideos = useSelector((state) => state.ui.selectedVideos);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadprogress, setUploadProgress] = useState(0);
  const [successfullUpload, setSuccessFullUpload] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFileError, setSelectedFileError] = useState(null);
  const [fileSizeLimits, setFileSizeLimits] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [scaleIcon, setScaleIcon] = useState(1);

  useEffect(() => {
    if (initialLoad) {
      // fetch Storage Data after in the first load
      dispatch(fetchStorageData());
      initialLoad = false;
      return;
    }
    dispatch(sendStorageData(userId, storageLimmites));
  }, [dispatch, userId, storageLimmites]);

  const selectedFileHandler = (event) => {
    // reset all states
    dispatch(uiActions.toggleModal(false));
    setFileSizeLimits(false);
    setSuccessFullUpload(null);
    setSelectedFileError(null);
    setUploadedImage(null);
    setUploadedVideo(null);
    setUploadedDocument(null);

    let selectedFile = event.target.files[0];
    const GB = 1073741824;
    const MB = 1048576;
    const allowedFileSize = selectedFile?.size / GB;
    const allowedImageSize = selectedFile?.size / MB;

    // Image type Handler
    if (selectedFile?.type.startsWith("image/")) {
      // allowed size is 25MB
      if (allowedImageSize <= 25) {
        setUploadedImage(selectedFile);
        setUploadFileName(selectedFile.name);
        dispatch(uiActions.toggleModal(true));
        return;
      }
      setFileSizeLimits(true);
      dispatch(uiActions.toggleModal(true));
      return;
    }
    // Video type Handler
    if (selectedFile?.type.startsWith("video/")) {
      // allowed size is 4GB
      if (allowedFileSize <= 4) {
        setUploadedVideo(selectedFile);
        setUploadFileName(selectedFile.name);
        dispatch(uiActions.toggleModal(true));
        return;
      }
      setFileSizeLimits(true);
      dispatch(uiActions.toggleModal(true));
      return;
    }

    // Document type Handler
    if (
      selectedFile?.type.startsWith("application/") ||
      selectedFile?.type.startsWith("text/")
    ) {
      if (allowedFileSize <= 15) {
        // allowed size is 15GB
        setUploadedDocument(selectedFile);
        setUploadFileName(selectedFile.name);
        dispatch(uiActions.toggleModal(true));
        return;
      }
      setFileSizeLimits(true);
      dispatch(uiActions.toggleModal(true));
      return;
    }

    if (event.target.files[0] === undefined) {
      return;
    }

    dispatch(uiActions.toggleModal(true));
    setSelectedFileError({
      title: "Unsupported File Type",
      message:
        "Oops! Only these formats are accepted: Images (JPG, PNG, GIF), Videos (MP4, WEBM), Documents (TXT, PDF, DOCX, PPTX, XLSX, ZIP).",
    });
  };

  const uploadHandler = () => {
    dispatch(uiActions.toggleModal(false));
    let uploadTask;

    // Image upload handler
    if (uploadedImage) {
      const imageRef = ref(
        storage,
        `users/${userId}/images/${uploadedImage.name}`
      );
      uploadTask = uploadBytesResumable(imageRef, uploadedImage);
    }
    // Video upload handler
    if (uploadedVideo) {
      const videoRef = ref(
        storage,
        `users/${userId}/videos/${uploadedVideo.name}`
      );
      uploadTask = uploadBytesResumable(videoRef, uploadedVideo);
    }
    // Document upload Handler
    if (uploadedDocument) {
      const documentRef = ref(
        storage,
        `users/${userId}/documents/${uploadedDocument.name}`
      );
      uploadTask = uploadBytesResumable(documentRef, uploadedDocument);
    }

    if (uploadedImage || uploadedVideo || uploadedDocument) {
      let file = {};
      if (uploadedImage) {
        file.index = 0;
        file.type = "Images";
      }
      if (uploadedVideo) {
        file.index = 1;
        file.type = "Videos";
      }
      if (uploadedDocument) {
        file.index = 2;
        file.type = "Documents";
      }

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          setUploadError(error);
          setUploadProgress(0);
          dispatch(uiActions.toggleModal(true));
        },
        () => {
          // Handle successful uploads on complete
          const sizeInBytes = uploadTask.snapshot.totalBytes;

          dispatch(
            storageActions.setStorageLimit({
              file,
              sizeInBytes,
            })
          );

          setUploadError(null);
          setUploadProgress(0);
          dispatch(uiActions.setNewUpload(true));
          dispatch(uiActions.toggleModal(true));
          setSuccessFullUpload({
            title: "Success",
            message: "Successfully uploaded your files",
          });
        }
      );
    }

    return;
  };

  // Modal Conditional
  let modal;
  if (
    (uploadedImage || uploadedVideo || uploadedDocument) &&
    showModal &&
    !startDeleting
  ) {
    modal = (
      <Modal
        key="upload confirmation"
        err={{
          id: "uploading-confirmation-modal",
          type: "confirmation",
          title: "Confirmation",
          message: "You are about to upload your data to Cloud",
        }}
        onClick={uploadHandler}
      />
    );
  }

  if (fileSizeLimits && showModal) {
    modal = (
      <Modal
        key="File Size Limits"
        err={{
          type: "error",
          title: "File Size Exceeds Limit",
          message:
            "The uploaded file is larger than the permitted size. Maximum file size limits (25MB for images, 4GB for videos, 15GB for documents). Please try a smaller file.",
        }}
        marginTop="0"
        padding="0.8em 0 0.8em 0"
      />
    );
  }

  if (uploadError && showModal) {
    modal = (
      <Modal
        key="uploadError"
        err={{
          type: "error",
          title: "Failed to upload",
          message: "failed to upload the file please try again",
        }}
      />
    );
  }

  if (selectedFileError && showModal) {
    modal = (
      <Modal
        key="selected File Error"
        err={{
          id: "uploading-file-type-error-modal",
          type: "error",
          title: selectedFileError.title,
          message: selectedFileError.message,
        }}
        marginTop="0"
        padding="0.8em 0 0.8em 0"
      />
    );
  }

  if (successfullUpload && showModal && !startDeleting) {
    modal = (
      <Modal
        key="successfull Upload"
        err={{
          id: "uploading-success-modal",
          title: successfullUpload.title,
          message: successfullUpload.message,
        }}
      />
    );
  }

  const startDeleteHandler = () => {
    dispatch(uiActions.setSelectedImages([]));
    dispatch(uiActions.setSelectedVideos([]));
    dispatch(uiActions.setSelectedDocuments([]));
    dispatch(uiActions.setNumOfSelectedItems(0));
    dispatch(uiActions.setStartDeleting());
  };

  const deletingSelectedHandler = () => {
    if (
      selectedDocuments.length === 0 &&
      selectedImages.length === 0 &&
      selectedVideos.length === 0
    ) {
      return;
    }
    dispatch(uiActions.setDeletingSelectedItems(true));
    dispatch(uiActions.toggleDeletingModal(true));
  };

  const downloadSelectedHandler = () => {
    if (
      selectedDocuments.length === 0 &&
      selectedImages.length === 0 &&
      selectedVideos.length === 0
    ) {
      return;
    }
    dispatch(uiActions.setDownloadSelected(true));
    dispatch(uiActions.setNumOfSelectedItems(0));
  };

  let fileName;
  if (uploadFileName.length < 22) {
    fileName = uploadFileName.substring(0, 22);
  } else {
    fileName = uploadFileName.substring(0, 19).concat("...");
  }

  let previewObject = null;
  if (hoveredItem) {
    previewObject = previewFileInfo(hoveredItem);
  }

  let fileNamingCondition;
  if (uploadprogress === 0 && fileName.length === 0) {
    fileNamingCondition = "File State";
  } else if (uploadprogress !== 0) {
    fileNamingCondition = "Uploading In Progress";
  } else if (uploadprogress === 0) {
    fileNamingCondition = "Last Uploaded File";
  }

  let noFile;
  if (fileNamingCondition === "File State") {
    noFile = <span>File state will appear here</span>;
  }

  const logoutHandler = () => {
    logout();
    naviate("/");
  };

  return (
    <>
      <article className={styles["main-container"]}>
        <section className={styles["main-container-left-sec"]}>
          <Link id="act-homepage" to="/">
            <img src={Logo} alt="logo" />
          </Link>
          <form className={styles["left-sec-upload"]}>
            <motion.img
              whileInView={{ scale: scaleIcon }}
              transition={{ type: "spring" }}
              src={IC_upload}
              alt="upload"
            />
            <input
              id="upload"
              name="upload"
              type="file"
              hidden
              onChange={selectedFileHandler}
            />
            <motion.label
              id="input-upload"
              whileHover={{
                scale: 1.06,
                cursor: "pointer",
              }}
              transition={{ type: "spring" }}
              htmlFor="upload"
              onMouseEnter={() => {
                setScaleIcon(1.1);
              }}
              onMouseLeave={() => {
                setScaleIcon(1);
              }}
            >
              Upload New File
            </motion.label>
          </form>
          {modal}
          <ul className={styles["left-sec-list"]}>
            <li>
              <motion.div
                id="act-actions"
                whileHover={{
                  scale: 1.08,
                  cursor: "pointer",
                }}
                transition={{ type: "spring" }}
                onClick={startDeleteHandler}
              >
                <HoverIcon src={IC_actions} alt="actions" />
                <span>Actions</span>
              </motion.div>
            </li>
            <li>
              <motion.div
                id="act-logout"
                onClick={logoutHandler}
                whileHover={{
                  scale: 1.1,
                  cursor: "pointer",
                }}
                transition={{ type: "spring" }}
              >
                <Icon src={IC_logout} alt="logout" />
                <span>Logout</span>
              </motion.div>
            </li>
          </ul>
        </section>
        <section className={styles["main-container-right-sec"]}>
          <main className={styles["main-content"]}>
            <header className={styles["main-1-header"]}>
              <h2>E.T. Cloud</h2>
              <SearchBar />
            </header>
            {children}
          </main>
          <aside className={styles["aside-content"]}>
            {!startDeleting && (
              <LayoutItem
                container={styles["aside-container-item"]}
                className={styles["aside-container-item-1"]}
                height={1}
                title={fileNamingCondition}
              >
                <span className={styles["aside-item-1-span"]}>
                  <Icon src={IC_document} alt="document" />
                  <abbr title={uploadFileName}>{fileName}</abbr>
                  {noFile}
                </span>
                {uploadprogress !== 0 && (
                  <span>{`${uploadprogress.toFixed(0)} %`}</span>
                )}
                {uploadprogress !== 0 && (
                  <progress
                    value={`${uploadprogress}`}
                    max="100"
                    id={styles.uploadprogress}
                  />
                )}
              </LayoutItem>
            )}
            {startDeleting && (
              <LayoutItem
                container={styles["aside-container-item"]}
                className={styles["aside-container-item-1-upload"]}
                height={1}
                title="Selected files"
              >
                <div>
                  <HoverIcon
                    id="act-close"
                    src={IC_x_close}
                    alt="close"
                    onClick={startDeleteHandler}
                  />
                  <span>{`${numOfSelectedItems} Selected`}</span>
                </div>
                <div className={styles["aside-item1-left-icons"]}>
                  <HoverIcon
                    id="act-delete"
                    src={IC_trash_aside}
                    alt="trash"
                    onClick={deletingSelectedHandler}
                  />
                  <HoverIcon
                    id="act-download"
                    src={IC_download}
                    alt="download"
                    onClick={downloadSelectedHandler}
                  />
                </div>
              </LayoutItem>
            )}
            <LayoutItem
              container={styles["aside-container-item"]}
              className={styles["aside-container-item-2"]}
              height={2}
              title="Storage"
            >
              <div className={styles.chart}>
                <Pie data={storageLeft} />
              </div>
              <ul className={styles["aside-list"]}>
                <li>Images</li>
                <li>Videos</li>
                <li>Documents</li>
              </ul>
              <ul className={styles["aside-storage-list"]}>
                <li>{storageLimmites[0].storageLeft.toFixed(1)} GB</li>
                <li>{storageLimmites[1].storageLeft.toFixed(1)} GB</li>
                <li>{storageLimmites[2].storageLeft.toFixed(1)} GB</li>
              </ul>
            </LayoutItem>
            <LayoutItem
              container={styles["aside-container-item"]}
              className={styles["aside-container-item-3"]}
              height={3}
              title="Preview File"
            >
              {hoveredItem && (
                <>
                  <div className={styles["aside-preview"]}>
                    <Icon src={IC_document} alt="document" />
                    <span>{previewObject.name}</span>
                  </div>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td>Type</td>
                        <td>{previewObject.type}</td>
                      </tr>
                      <tr>
                        <td>Size</td>
                        <td>{previewObject.size}</td>
                      </tr>
                      <tr>
                        <td>Uploaded Date</td>
                        <td>
                          <time>{previewObject.uploadedDate}</time>
                        </td>
                      </tr>
                      <tr>
                        <td>Uploaded Time</td>
                        <td>
                          <time>{previewObject.uploadedTime}</time>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
              {!hoveredItem && (
                <p style={{ marginTop: "3.5rem", textAlign: "center" }}>
                  To preview the item details please hover on one of the
                  available items
                </p>
              )}
            </LayoutItem>
          </aside>
        </section>
      </article>
    </>
  );
};

export default Cloud;

export const loader = () => {};
