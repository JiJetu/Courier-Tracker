import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  userId: string;
  name: string;
  email: string;
  image: string;
  role: "admin" | "agent" | "customer";
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      if (token) state.token = token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { logout, setUser } = authSlice.actions;

export const currentUserToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
