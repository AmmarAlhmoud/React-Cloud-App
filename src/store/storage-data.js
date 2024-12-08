import { getAuthUserId } from "../util/auth";
import { storageActions } from "./storage-slice";

const initialLimit = [
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
];

export const fetchStorageData = () => {
  // we return a function in an action creater the redux kit will ansure to give us the dispatch function.
  return async (dispatch) => {
    const userId = getAuthUserId();

    const fetchData = async () => {
      const response = await fetch(
        `https://et-cloud-dev-default-rtdb.firebaseio.com/storage/${userId}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch storage data!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      const storageData = data.storageLimit;
      // if the items doesn't exist in the fetched data we need to set the storage to the inintial storage limits.
      dispatch(
        storageActions.replaceStorageData({
          storageLimit: storageData || initialLimit,
        })
      );
    } catch (error) {
      // alert(error.message);
    }
  };
};

// an action creater function
export const sendStorageData = (userId, storageLimit) => {
  return async () => {
    const sendRequest = async () => {
      // the PUT request will overwrite the existing node in the database.
      const response = await fetch(
        `https://et-cloud-dev-default-rtdb.firebaseio.com/storage/${userId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            storageLimit,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send storage data!");
      }
    };

    try {
      // we need the await here because the sendRequest function returns a promise.
      await sendRequest();
    } catch (error) {
      // alert(error.message);
    }
  };
};
