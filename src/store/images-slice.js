import { storage } from "../firebase";
import { getAuthUserId } from "../util/auth";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { fileSizeConverter } from "../util/file";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  const userId = getAuthUserId();
  const imagesFolderRef = ref(storage, `users/${userId}/images`);

  const response = await listAll(imagesFolderRef);

  const fetchedImages = await Promise.all(
    response.items.map(async (item) => {
      const metadata = await getMetadata(item);
      const url = await getDownloadURL(item);

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

      return {
        id: metadata.name,
        name: imgName,
        info: fileSize,
        creationTime: fileCreationTime,
        creationDate: dateOfCreation,
        url,
      };
    })
  );

  return fetchedImages;
});

const initialState = {
  fetchedImages: [],
};

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.fetchedImages = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        console.error("Error fetching images:", action.error.message);
        // Handle the error here
      });
  },
});

export const imagesActions = imagesSlice.actions;

export default imagesSlice.reducer;
