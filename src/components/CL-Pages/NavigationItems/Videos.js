import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../firebase";
import { getAuthUserId } from "../../../util/auth";
import { fileSizeConverter } from "../../../util/file";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { fileTypeFinder } from "../../../util/file";

import styles from "./Videos.module.css";
import VItem from "./VItem";
import DeletingModal from "../../UI/DeletingModal";
import BarLoader from "../../UI/BarLoader";
import NoItems from "../../UI/NoItems";

function Videos() {
  const selectedVideos = useSelector((state) => state.ui.selectedVideos);

  const userId = getAuthUserId();
  const dispatch = useDispatch();
  const videosRef = useRef();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const showModal = useSelector((state) => state.ui.toggleDeletingModal);
  const newUpload = useSelector((state) => state.ui.newUpload);
  const fetchedVideos = useSelector((state) => state.ui.fetchedVideos);
  const fileDeleted = useSelector((state) => state.ui.fileDeleted);
  const deletingSelectedItems = useSelector(
    (state) => state.ui.deletingSelectedItems
  );

  const downloadSelected = useSelector((state) => state.ui.downloadSelected);
  const searchedItemId = useSelector((state) => state.ui.searchedItemId);

  useEffect(() => {
    const videosFolderRef = ref(storage, `users/${userId}/videos`);

    const videosFetcher = async () => {
      setLoading(true);
      try {
        const response = await listAll(videosFolderRef);

        const fetchedvideos = [];
        for (const item of response.items) {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);

          const fileName = metadata.name.trim();
          const videoName = fileName.slice(0, fileName.lastIndexOf("."));
          const dateObject = new Date(metadata.timeCreated);
          const dateOfCreation = new Date(
            dateObject.getFullYear(),
            dateObject.getMonth(),
            dateObject.getDate()
          );

          const fileCreationTime = new Date(Date.parse(metadata.timeCreated));
          const fileSize = fileSizeConverter(metadata.size);

          const stringifiedDate = dateOfCreation.toISOString(); // Convert to ISO string
          const stringifiedTime = fileCreationTime.toISOString(); // Convert to ISO string

          const contentType = metadata.contentType;

          fetchedvideos.push({
            id: metadata.name,
            name: videoName,
            info: fileSize,
            creationDate: stringifiedDate,
            creationTime: stringifiedTime,
            type: contentType,
            url: url,
            "data-id": metadata.id,
          });
        }
        dispatch(uiActions.setFetchedVideos(fetchedvideos)); // Set all videos at once
        dispatch(uiActions.setNewUpload(false));
        setLoading(false);
      } catch (error) {
        // Error handling
        setError({
          title: "Failed to fetch videos",
          message: "Please try again or check your internet connection.",
        });
        dispatch(uiActions.toggleModal(true));
      }
    };

    videosFetcher();
  }, [dispatch, newUpload, userId, fileDeleted, error]);

  const handleCheckboxChange = (itemId) => {
    const isSelected = selectedVideos.includes(itemId);
    if (isSelected) {
      dispatch(uiActions.setNumOfSelectedItems(selectedVideos.length - 1));
      dispatch(
        uiActions.setSelectedVideos(
          selectedVideos.filter((id) => id !== itemId)
        )
      );
    } else {
      dispatch(uiActions.setNumOfSelectedItems(selectedVideos.length + 1));
      dispatch(uiActions.setSelectedVideos([...selectedVideos, itemId]));
    }
  };

  const deleteHandler = () => {
    const deleteMultipleItems = async () => {
      const fileReferences = selectedVideos.map((id) =>
        ref(storage, `users/${userId}/videos/${id}`)
      );

      try {
        await Promise.all(
          fileReferences.map((fileRef) => deleteObject(fileRef))
        );

        dispatch(uiActions.setSelectedVideos([]));
        dispatch(uiActions.setNumOfSelectedItems(0));
        dispatch(uiActions.setDeletingSelectedItems(false));
        dispatch(uiActions.setStartDeleting(false));
        dispatch(uiActions.setFileDeleted(true));
        dispatch(uiActions.toggleDeletingModal(true));
      } catch (error) {
        setError({
          title: "Faild to Delete!",
          message:
            "There was an error deleting the videos please try again later.",
        });
        dispatch(uiActions.toggleDeletingModal(true));
      }
    };

    deleteMultipleItems();
  };

  const downloadHandler = async () => {
    try {
      const listRef = ref(storage, `users/${userId}/videos`);
      const listResult = await listAll(listRef);

      for (const itemRef of listResult.items) {
        if (selectedVideos.includes(itemRef.name)) {
          const downloadURL = await getDownloadURL(itemRef, {
            responseDisposition: "attachment",
          });

          fetch(downloadURL)
            .then((response) => response.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", itemRef.name);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            })
            .catch((error) => {
              setError({
                title: "Faild to Download",
                message:
                  "There was an error downloading the videos please try again later.",
              });
              dispatch(uiActions.toggleDeletingModal()); // for download :)
            });
          dispatch(uiActions.setDownloadSelected(false));
          dispatch(uiActions.setSelectedVideos([]));
          dispatch(uiActions.setStartDeleting());
        }
      }
    } catch (error) {
      setError({
        title: "Faild to Download",
        message:
          "There was an error downloading the videos please try again later.",
      });
      dispatch(uiActions.toggleDeletingModal()); // for download :)
    }
  };

  if (downloadSelected && selectedVideos !== 0) {
    downloadHandler();
  }

  const handleMouseEnter = (event) => {
    const element = event.target;
    const id = element.getAttribute("id");

    const hoveredItem = fetchedVideos.filter((item) => item.id === id);

    dispatch(uiActions.setHoveredItem(...hoveredItem));
  };

  const handleMouseLeave = () => {
    dispatch(uiActions.setHoveredItem(null));
  };

  useEffect(() => {
    if (!searchedItemId) {
      return;
    }
    const targetItem = videosRef.current.querySelector(
      `[data-id="${searchedItemId}"]`
    );
    if (targetItem) {
      targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [videosRef, searchedItemId]);

  return (
    <>
      {deletingSelectedItems && selectedVideos.length !== 0 && showModal && (
        <DeletingModal
          err={{
            id: "videos-deleting-modal",
            type: "confirmation",
            title: "Delete Selected Items",
            message: "You are about to delete the selected items",
          }}
          onClick={deleteHandler}
        />
      )}
      {error && showModal && (
        <DeletingModal
          err={{
            type: "error",
            title: error.title,
            message: error.message,
          }}
        />
      )}
      {fileDeleted && selectedVideos.length === 0 && showModal && (
        <DeletingModal
          err={{
            id: "videos-deleting-modal-success",
            title: "Success",
            message: "Your selected items were successfully deleted",
          }}
        />
      )}
      <ul ref={videosRef} className={styles.ul}>
        {!fetchedVideos.length && loading && <BarLoader dashboard={true} />}
        {fetchedVideos.length === 0 && !loading && <NoItems type="videos" />}
        {!error &&
          !showModal &&
          fetchedVideos &&
          fetchedVideos.map((item) => (
            <VItem
              key={item.id}
              onChange={handleCheckboxChange}
              isChecked={selectedVideos.includes(item.id)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              video={{
                id: item.id,
                name: item.name,
                uploadedDate: item.creationDate,
                info: item.info,
                vType: item.type,
                url: item.url,
                "data-id": item.id,
              }}
            />
          ))}
      </ul>
    </>
  );
}

export default Videos;
