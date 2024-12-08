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
import { convertFileExtension } from "../../../util/file";

import styles from "./Documents.module.css";
import DItem from "./DItem";
import DeletingModal from "../../UI/DeletingModal";
import BarLoader from "../../UI/BarLoader";
import NoItems from "../../UI/NoItems";

function Documents() {
  const selectedDocuments = useSelector((state) => state.ui.selectedDocuments);

  const userId = getAuthUserId();
  const dispatch = useDispatch();
  const documentsRef = useRef();
  const [error, setError] = useState(null);
  const newUpload = useSelector((state) => state.ui.newUpload);

  const fetchedDocuments = useSelector((state) => state.ui.fetchedDocuments);
  const deletingSelectedItems = useSelector(
    (state) => state.ui.deletingSelectedItems
  );
  const [loading, setLoading] = useState(false);

  const showModal = useSelector((state) => state.ui.toggleDeletingModal);
  const fileDeleted = useSelector((state) => state.ui.fileDeleted);

  const downloadSelected = useSelector((state) => state.ui.downloadSelected);
  const searchedItemId = useSelector((state) => state.ui.searchedItemId);

  useEffect(() => {
    const documentsFolderRef = ref(storage, `users/${userId}/documents`);

    const documentsFetcher = async () => {
      setLoading(true);
      try {
        const response = await listAll(documentsFolderRef);

        const fetchedDocuments = [];
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

          const stringifiedTime = fileCreationTime.toISOString(); // Convert to ISO string
          const stringifiedDate = dateOfCreation.toISOString(); // Convert to ISO string

          const contentType = metadata.contentType;

          fetchedDocuments.push({
            id: metadata.name,
            name: videoName,
            info: fileSize,
            sizeInBytes: metadata.size,
            type: contentType,
            creationDate: stringifiedDate,
            creationTime: stringifiedTime,
            url: url,
            "data-id": metadata.id,
          });
        }
        dispatch(uiActions.setFetchedDocuments(fetchedDocuments)); // Set all documents at once
        dispatch(uiActions.setNewUpload(false));
        setLoading(false);
      } catch (error) {
        // Error handling
        setError({
          title: "Failed to fetch documents",
          message: "Please try again or check your internet connection.",
        });
        dispatch(uiActions.toggleModal(true));
      }
    };

    documentsFetcher();
  }, [dispatch, newUpload, userId, fileDeleted, error]);

  const handleCheckboxChange = (itemId) => {
    const isSelected = selectedDocuments.includes(itemId);
    if (isSelected) {
      dispatch(uiActions.setNumOfSelectedItems(selectedDocuments.length - 1));
      dispatch(
        uiActions.setSelectedDocuments(
          selectedDocuments.filter((id) => id !== itemId)
        )
      );
    } else {
      dispatch(uiActions.setNumOfSelectedItems(selectedDocuments.length + 1));
      dispatch(uiActions.setSelectedDocuments([...selectedDocuments, itemId]));
    }
  };

  const deleteHandler = () => {
    const deleteMultipleItems = async () => {
      const fileReferences = selectedDocuments.map((id) =>
        ref(storage, `users/${userId}/documents/${id}`)
      );

      try {
        await Promise.all(
          fileReferences.map((fileRef) => deleteObject(fileRef))
        );

        dispatch(uiActions.setSelectedDocuments([]));
        dispatch(uiActions.setNumOfSelectedItems(0));
        dispatch(uiActions.setDeletingSelectedItems(false));
        dispatch(uiActions.setStartDeleting(false));
        dispatch(uiActions.setFileDeleted(true));
        dispatch(uiActions.toggleDeletingModal(true));
      } catch (error) {
        setError({
          title: "Faild to Delete",
          message:
            "There was an error deleting the documents please try again later.",
        });
        dispatch(uiActions.toggleDeletingModal(true));
      }
    };

    deleteMultipleItems();
  };

  const downloadHandler = async () => {
    try {
      const listRef = ref(storage, `users/${userId}/documents`);
      const listResult = await listAll(listRef);

      for (const itemRef of listResult.items) {
        if (selectedDocuments.includes(itemRef.name)) {
          const downloadURL = await getDownloadURL(itemRef, {
            responseDisposition: "attachment",
          });

          fetch(downloadURL)
            .then((response) => response.blob())
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", convertFileExtension(itemRef.name));
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            })
            .catch((error) => {
              setError({
                title: "Faild to Download",
                message:
                  "There was an error downloading the documents please try again later.",
              });
              dispatch(uiActions.toggleDeletingModal()); // for download :)
            });
          dispatch(uiActions.setDownloadSelected(false));
          dispatch(uiActions.setSelectedDocuments([]));
          dispatch(uiActions.setStartDeleting());
        }
      }
    } catch (error) {
      setError({
        title: "Faild to Download",
        message:
          "There was an error downloading the documents please try again later.",
      });
      dispatch(uiActions.toggleDeletingModal()); // for download :)
    }
  };

  if (downloadSelected && selectedDocuments !== 0) {
    downloadHandler();
  }

  const handleMouseEnter = (event) => {
    const element = event.target;
    const id = element.getAttribute("id");

    const hoveredItem = fetchedDocuments.filter((item) => item.id === id);

    dispatch(uiActions.setHoveredItem(...hoveredItem));
  };

  const handleMouseLeave = () => {
    dispatch(uiActions.setHoveredItem(null));
  };

  useEffect(() => {
    if (!searchedItemId) {
      return;
    }
    const targetItem = documentsRef.current.querySelector(
      `[data-id="${searchedItemId}"]`
    );
    if (targetItem) {
      targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [documentsRef, searchedItemId]);

  return (
    <>
      {deletingSelectedItems && selectedDocuments.length !== 0 && showModal && (
        <DeletingModal
          err={{
            id: "documents-deleting-modal",
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
      {fileDeleted && selectedDocuments.length === 0 && showModal && (
        <DeletingModal
          err={{
            id: "documents-deleting-modal-success",
            title: "Success",
            message: "Your selected items were successfully deleted",
          }}
        />
      )}
      <ul ref={documentsRef} className={styles.ul}>
        {!fetchedDocuments.length && loading && <BarLoader dashboard={true} />}
        {fetchedDocuments.length === 0 && !loading && (
          <NoItems type="documents" />
        )}

        {!error &&
          !showModal &&
          fetchedDocuments &&
          fetchedDocuments.map((item) => (
            <DItem
              key={item.id}
              isChecked={selectedDocuments.includes(item.id)}
              onChange={handleCheckboxChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              file={{
                id: item.id,
                name: item.name,
                uploadedDate: item.creationDate,
                info: item.info,
                "data-id": item.id,
              }}
            />
          ))}
      </ul>
    </>
  );
}

export default Documents;
