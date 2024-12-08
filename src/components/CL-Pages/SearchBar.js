import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import styles from "./SearchBar.module.css";
import Input from "../UI/Input";
import Icon from "../UI/Icon";
import IC_search from "../../assets/icons/CL/search.png";
import SearchedItem from "./SearchedItem";
import Button from "../UI/Button";

let firstLoad = true;

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchRef = useRef();

  const dItemsTosearch = useSelector((state) => state.ui.fetchedDocuments);
  const iItemsTosearch = useSelector((state) => state.ui.fetchedImages);
  const vItemsTosearch = useSelector((state) => state.ui.fetchedVideos);
  const searchedItems = useSelector((state) => state.ui.searchedItems);
  const searchedValue = useSelector((state) => state.ui.searchedValue);
  const hideSearch = useSelector((state) => state.ui.hideSearch);
  const openedSearch = useSelector((state) => state.ui.openedSearch);
  const dRoute = useSelector((state) => state.ui.dRoute);
  const iRoute = useSelector((state) => state.ui.iRoute);
  const vRoute = useSelector((state) => state.ui.vRoute);
  const onMove = useSelector((state) => state.ui.onMove);
  const [hideContainer, setHideContainer] = useState(null);

  if (onMove) {
    searchRef.current.value = "";
    dispatch(uiActions.setOnMove(false));
  }

  const startSearchHandler = () => {
    dispatch(uiActions.setOpenedSearch(styles.openedSearch));
    setHideContainer(styles.hideContainer);
    dispatch(uiActions.setHideSearch(true));
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setHideContainer(null);
    dispatch(uiActions.setSearchedValue(searchRef.current.value));
  };

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    if (dRoute && dItemsTosearch) {
      const filteredItems = dItemsTosearch.filter((item) =>
        item.name.toLowerCase().startsWith(searchedValue.toLowerCase())
      );
      dispatch(uiActions.setSearchedItems(filteredItems));
    }
    if (iRoute && iItemsTosearch) {
      const filteredItems = iItemsTosearch.filter((item) =>
        item.name.toLowerCase().startsWith(searchedValue.toLowerCase())
      );
      dispatch(uiActions.setSearchedItems(filteredItems));
    }
    if (vRoute && vItemsTosearch) {
      const filteredItems = vItemsTosearch.filter((item) =>
        item.name.toLowerCase().startsWith(searchedValue.toLowerCase())
      );
      dispatch(uiActions.setSearchedItems(filteredItems));
    }
  }, [
    dispatch,
    dItemsTosearch,
    iItemsTosearch,
    vItemsTosearch,
    searchedValue,
    dRoute,
    iRoute,
    vRoute,
  ]);

  const goToSearchedItemHandler = (event) => {
    const element = event.target;
    const id = element.getAttribute("id");
    dispatch(uiActions.setSearchedItemId(id));
    console.log(id);
    searchRef.current.value = "";
    dispatch(uiActions.setSearchedItems([]));
    dispatch(uiActions.setHideSearch(false));
    dispatch(uiActions.setOpenedSearch(null));
  };

  return (
    <form onSubmit={searchHandler}>
      <Input
        id={true}
        className={`${styles["main-search"]} ${openedSearch || ""}`}
        scaleY={1}
        input={{
          id: "search",
          name: "search",
          type: "text",
          placeholder: "Search your file",
          onChange: startSearchHandler,
        }}
        ref={searchRef}
      >
        <Icon
          className={styles["main-search-icon"]}
          src={IC_search}
          alt="search"
        />

        {hideSearch && (
          <Button
            type="submit"
            className={styles.button}
            scale={1.05}
            stiffness={100}
          >
            search
          </Button>
        )}

        {hideSearch && (
          <ul
            className={`${styles["searched-items-container"]} ${
              hideContainer || ""
            }`}
          >
            {searchedItems &&
              searchedItems.map((item) => (
                <SearchedItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  onClick={goToSearchedItemHandler}
                />
              ))}
            {searchedItems.length === 0 && (
              <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
                No results found.
              </p>
            )}
          </ul>
        )}
      </Input>
    </form>
  );
};

export default SearchBar;
