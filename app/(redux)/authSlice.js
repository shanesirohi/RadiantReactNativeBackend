import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

const initialState = {
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload))
        .then(() => console.log("User info saved to AsyncStorage"))
        .catch((error) => console.error("Failed to save user info", error));
    },
    logoutAction: (state) => {
      state.user = null;
      state.loading = false;
      AsyncStorage.removeItem("userInfo")
        .then(() => console.log("User info removed from AsyncStorage"))
        .catch((error) => console.error("Failed to remove user info", error));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginAction, logoutAction, setUser, setLoading } =
  authSlice.actions;

export default authSlice.reducer;

// Thunk to load user from AsyncStorage when the app starts
export const loadUser = () => async (dispatch) => {
  try {
    const user = await loadUserFromStorage();
    if (user) {
      dispatch(setUser(user));
    }
  } catch (error) {
    console.error("Failed to load user from AsyncStorage", error);
  } finally {
    dispatch(setLoading(false));
  }
};
