import React from "react";

import styles from "./SearchedItem.module.css";

const SearchedItem = ({ id, name, onClick }) => {
  let fileName;
  if (name?.length < 35) {
    fileName = name?.substring(0, 35);
  } else {
    fileName = name?.substring(0, 32).concat("...");
  }

  return (
    <li
      data-search={`${id}_search`}
      id={id}
      className={styles["search-item"]}
      onClick={onClick}
    >
      <abbr
        data-search={`${id}_search_name`}
        id={id}
        title={name}
        className={styles["search-item-name"]}
        onClick={onClick}
      >
        {fileName}
      </abbr>
    </li>
  );
};

export default SearchedItem;
