import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import imagesSlice from "./images-slice";
import storageSlice from "./storage-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice,
    img: imagesSlice,
    store: storageSlice,
  },
});

export default store;
