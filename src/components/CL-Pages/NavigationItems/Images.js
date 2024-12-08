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

import styles from "./Images.module.css";
import IMGItem from "./IMGItem";
import DeletingModal from "../../UI/DeletingModal";
import BarLoader from "../../UI/BarLoader";
import NoItems from "../../UI/NoItems";

const Images = () => {
  const selectedImages = useSelector((state) => state.ui.selectedImages);

  const userId = getAuthUserId();
  const dispatch = useDispatch();
  const imagesRef = useRef();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const newUpload = useSelector((state) => state.ui.newUpload);

  const showModal = useSelector((state) => state.ui.toggleDeletingModal);
  const fetchedImages = useSelector((state) => state.ui.fetchedImages);
  const fileDeleted = useSelector((state) => state.ui.fileDeleted);
  const deletingSelectedItems = useSelector(
    (state) => state.ui.deletingSelectedItems
  );
  const searchedItemId = useSelector((state) => state.ui.searchedItemId);

  const downloadSelected = useSelector((state) => state.ui.downloadSelected);

  useEffect(() => {
    const imagesFolderRef = ref(storage, `users/${userId}/images`);

    const imagesFetcher = async () => {
      setLoading(true);
      try {
        const response = await listAll(imagesFolderRef);

        const fetchedImages = [];
        for (const item of response.items) {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);

          const fileName = metadata.name.trim();
          const imgName = fileName.slice(0, fileName.lastIndexOf("."));
          const dateObject = new Date(metadata.timeCreated);
          const dateOfCreation = new Date(
            dateObject.getFullYear(),
            dateObject.getMonth(),
            dateObject.getDate()
          );
          const fileCreationTime = new Date(Date.parse(metadata.timeCreated));
          const fileSize = fileSizeConverter(metadata.size);

          const stringifiedTime = fileCreationTime.toISOString(); // Convert to ISO string
          const stringifiedDate = dateOfCreation.toISOString(); // Convert to ISO string

          const contentType = metadata.contentType;

          fetchedImages.push({
            id: metadata.name,
            name: imgName,
            info: fileSize,
            type: contentType,
            creationTime: stringifiedTime,
            creationDate: stringifiedDate,
            url: url,
            "data-id": metadata.id,
          });
        }
        dispatch(uiActions.setFetchedImages(fetchedImages)); // Set all images at once
        dispatch(uiActions.setNewUpload(false));
        setLoading(false);
      } catch (error) {
        // Error handling
        setError({
          title: "Failed to fetch images",
          message: "Please try again or check your internet connection.",
        });
        dispatch(uiActions.toggleModal(true));
      }
    };

    imagesFetcher();
  }, [dispatch, newUpload, userId, fileDeleted, error]);

  const handleCheckboxChange = (itemId) => {
    const isSelected = selectedImages.includes(itemId);
    if (isSelected) {
      dispatch(uiActions.setNumOfSelectedItems(selectedImages.length - 1));
      dispatch(
        uiActions.setSelectedImages(
          selectedImages.filter((id) => id !== itemId)
        )
      );
    } else {
      dispatch(uiActions.setNumOfSelectedItems(selectedImages.length + 1));
      dispatch(uiActions.setSelectedImages([...selectedImages, itemId]));
    }
  };

  const deleteHandler = () => {
    const deleteMultipleItems = async () => {
      const fileReferences = selectedImages.map((id) =>
        ref(storage, `users/${userId}/images/${id}`)
      );

      try {
        await Promise.all(
          fileReferences.map((fileRef) => deleteObject(fileRef))
        );

        dispatch(uiActions.setSelectedImages([]));
        dispatch(uiActions.setNumOfSelectedItems(0));
        dispatch(uiActions.setDeletingSelectedItems(false));
        dispatch(uiActions.setStartDeleting(false));
        dispatch(uiActions.setFileDeleted(true));
        dispatch(uiActions.toggleDeletingModal(true));
      } catch (error) {
        setError({
          title: "Faild to Delete!",
          message:
            "There was an error deleting the images please try again later.",
        });
        dispatch(uiActions.toggleDeletingModal(true));
      }
    };

    deleteMultipleItems();
  };

  const downloadHandler = async () => {
    try {
      const listRef = ref(storage, `users/${userId}/images`);
      const listResult = await listAll(listRef);

      for (const itemRef of listResult.items) {
        if (selectedImages.includes(itemRef.name)) {
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
            .catch(() => {
              setError({
                title: "Faild to Download",
                message:
                  "There was an error downloading the images please try again later.",
              });
              dispatch(uiActions.toggleDeletingModal()); // for download :)
            });
          dispatch(uiActions.setDownloadSelected(false));
          dispatch(uiActions.setSelectedImages([]));
          dispatch(uiActions.setStartDeleting());
        }
      }
    } catch (error) {
      setError({
        title: "Faild to Download",
        message:
          "There was an error downloading the images please try again later.",
      });
      dispatch(uiActions.toggleDeletingModal()); // for download :)
    }
  };

  if (downloadSelected && selectedImages !== 0) {
    downloadHandler();
  }

  const handleMouseEnter = (event) => {
    const element = event.target;
    const id = element.getAttribute("id");

    const hoveredItem = fetchedImages.filter((item) => item.id === id);

    dispatch(uiActions.setHoveredItem(...hoveredItem));
  };

  const handleMouseLeave = () => {
    dispatch(uiActions.setHoveredItem(null));
  };

  useEffect(() => {
    if (!searchedItemId) {
      return;
    }
    const targetItem = imagesRef.current.querySelector(
      `[data-id="${searchedItemId}"]`
    );
    if (targetItem) {
      targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [imagesRef, searchedItemId]);

  return (
    <>
      {deletingSelectedItems && selectedImages.length !== 0 && showModal && (
        <DeletingModal
          err={{
            id: "images-deleting-modal",
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
      {fileDeleted && selectedImages.length === 0 && showModal && (
        <DeletingModal
          err={{
            id: "images-deleting-modal-success",
            title: "Success",
            message: "Your selected items were successfully deleted",
          }}
        />
      )}
      <ul ref={imagesRef} className={styles.ul}>
        {!fetchedImages.length && loading && <BarLoader dashboard={true} />}
        {fetchedImages.length === 0 && !loading && <NoItems type="images" />}
        {!error &&
          !showModal &&
          fetchedImages &&
          fetchedImages.map((item) => (
            <IMGItem
              key={item.id}
              isChecked={selectedImages.includes(item.id)}
              onChange={handleCheckboxChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              image={{
                id: item.id,
                name: item.name,
                uploadedDate: item.creationDate,
                time: item.creationTime,
                info: item.info,
                url: item.url,
                "data-id": item.id,
              }}
            />
          ))}
      </ul>
    </>
  );
};

export default Images;
