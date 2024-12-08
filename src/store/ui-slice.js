import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleModal: false,
  toggleDeletingModal: false,
  newUpload: false,
  fetchedImages: [],
  fetchedVideos: [],
  fetchedVideo: {},
  fetchedDocuments: [],
  startDeleting: false,
  deletingSelectedItems: false,
  fileDeleted: false,
  selectedDocuments: [],
  selectedImages: [],
  selectedVideos: [],
  downloadSelected: false,
  hoveredItem: null,
  dItemsTosearch: [],
  iItemsTosearch: [],
  vItemsTosearch: [],
  searchedItems: [],
  searchedValue: "",
  searchedItemId: "",
  hideSearch: false,
  noSearchItem: false,
  openedSearch: null,
  dRoute: true,
  iRoute: false,
  vRoute: false,
  onMove: false,
  numOfSelectedItems: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleModal(state, action) {
      state.toggleModal = action.payload;
    },
    toggleDeletingModal(state, action) {
      state.toggleDeletingModal = action.payload;
    },
    setNewUpload(state, action) {
      state.newUpload = action.payload;
    },
    setFetchedImages(state, action) {
      state.fetchedImages = action.payload;
    },
    setFetchedVideos(state, action) {
      state.fetchedVideos = action.payload;
    },
    setFetchedVideo(state, action) {
      state.fetchedVideo = action.payload;
    },
    setFetchedDocuments(state, action) {
      state.fetchedDocuments = action.payload;
    },
    setStartDeleting(state, action) {
      if (action.payload !== undefined) {
        state.startDeleting = action.payload;
        return;
      }
      state.startDeleting = !state.startDeleting;
    },
    setDeletingSelectedItems(state, action) {
      state.deletingSelectedItems = action.payload;
    },
    setFileDeleted(state, action) {
      state.fileDeleted = action.payload;
    },
    setSelectedDocuments(state, action) {
      state.selectedDocuments = action.payload;
    },
    setSelectedImages(state, action) {
      state.selectedImages = action.payload;
    },
    setSelectedVideos(state, action) {
      state.selectedVideos = action.payload;
    },
    setDownloadSelected(state, action) {
      state.downloadSelected = action.payload;
    },
    setHoveredItem(state, action) {
      state.hoveredItem = action.payload;
    },
    setHideSearch(state, action) {
      state.hideSearch = action.payload;
    },
    setNoSearchItem(state, action) {
      state.noSearchItem = action.payload;
    },
    setOpenedSearch(state, action) {
      state.openedSearch = action.payload;
    },
    setSearchedItems(state, action) {
      state.searchedItems = action.payload;
    },
    setSearchedValue(state, action) {
      state.searchedValue = action.payload;
    },
    setSearchedItemId(state, action) {
      state.searchedItemId = action.payload;
    },
    setDRoute(state, action) {
      state.dRoute = action.payload;
    },
    setIRoute(state, action) {
      state.iRoute = action.payload;
    },
    setVRoute(state, action) {
      state.vRoute = action.payload;
    },
    setOnMove(state, action) {
      state.onMove = action.payload;
    },
    setNumOfSelectedItems(state, action) {
      state.numOfSelectedItems = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
