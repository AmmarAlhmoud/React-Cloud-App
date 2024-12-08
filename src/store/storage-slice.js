import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  storageLimit: [
    {
      id: 1,
      label: "Images",
      storageLeft: 200.0,
      notAllowed: false,
    },
    {
      id: 2,
      label: "Videos",
      storageLeft: 200.0,
      notAllowed: false,
    },
    {
      id: 3,
      label: "Documents",
      storageLeft: 200.0,
      notAllowed: false,
    },
  ],
};

const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    replaceStorageData(state, action) {
      state.storageLimit = action.payload.storageLimit;
    },
    setStorageLimit(state, action) {
      const GB = 1073741824;
      const file = action.payload.file;
      const sizeInBytes = action.payload.sizeInBytes;
      const bytesToGB = sizeInBytes / GB;
      const beforeUploadStorage = state.storageLimit[file.index];
      const storageLeft = beforeUploadStorage.storageLeft;
      if (bytesToGB < storageLeft) {
        beforeUploadStorage.storageLeft -= bytesToGB;
        state.storageLimit[file.index] = beforeUploadStorage;
      } else {
        state.storageLimit[file.index].notAllowed = true;
      }
    },
  },
});

export const storageActions = storageSlice.actions;

export default storageSlice.reducer;
