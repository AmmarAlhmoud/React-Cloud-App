import React from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import styles from "./DeletingModal.module.css";
import Button from "./Button";
import successful from "../../assets/images/CL/successful.png";
import confirmation from "../../assets/images/CL/confirmation.png";
import error from "../../assets/images/CL/error.png";

const DeletingModal = ({ err, onClick, marginTop, padding }) => {
  const dispatch = useDispatch();

  const dismissHandler = () => {
    dispatch(uiActions.setFileDeleted(false));
    dispatch(uiActions.toggleDeletingModal(false));
  };

  let type = {
    mType: null,
    alt: "",
  };

  if (err?.type === "confirmation") {
    type.mType = confirmation;
    type.alt = "confirmation";
    type.action = (
      <div className={styles["error-modal-actions"]}>
        <Button
          id={`${err?.id}_cancel`}
          onClick={dismissHandler}
          className={styles.cancel}
        >
          Cancel
        </Button>
        <Button id={`${err?.id}_confirm`} onClick={onClick}>
          Confirm
        </Button>
      </div>
    );
  } else if (err?.type === "error") {
    type.mType = error;
    type.alt = "error";
    type.action = (
      <Button
        onClick={dismissHandler}
        style={{ marginTop: marginTop, padding: padding }}
      >
        Try Again
      </Button>
    );
  } else {
    type.mType = successful;
    type.alt = "successful";
    type.action = (
      <Button id={`${err?.id}_continue`} onClick={dismissHandler}>
        Continue
      </Button>
    );
  }

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles["error-modal-container"]}>
        <div className={styles["error-modal"]}>
          <img src={type.mType} alt={type.alt} />
          <h2 className={styles["error-modal-h2"]}>{err?.title}</h2>
          <p className={styles["error-modal-p"]}>{err?.message}</p>
          {type.action}
        </div>
      </div>
    </>
  );
};

export default DeletingModal;
